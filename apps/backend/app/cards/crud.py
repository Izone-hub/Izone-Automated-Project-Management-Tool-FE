from sqlalchemy.orm import Session
from app.models.card import Card
from app.cards.schema import CardCreate, CardUpdate


from sqlalchemy import text
from app.models.comment import Comment
from app.activity import crud as activity_crud
from app.activity import schema as activity_schema
from app.models.list import List
from app.models.project import Project


def create_card(
    db: Session,
    list_id: str,
    data: CardCreate,
    user_id: str | None = None
):
    new_card = Card(
        title=data.title,
        description=data.description,
        due_date=data.due_date,
        priority=data.priority,
        position=data.position,
        list_id=list_id,
        created_by=user_id
    )

    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    
    # Log Activity
    if user_id: 
        try:
            # Lookup workspace_id from List -> Project
            # Note: Ideally this would be joined query or cached, but explicit for clarity
            list_obj = db.query(List).filter(List.id == list_id).first()
            if list_obj:
               project_obj = db.query(Project).filter(Project.id == list_obj.project_id).first()
               if project_obj:
                    activity_crud.log_activity(db, activity_schema.ActivityLogCreate(
                        workspace_id=project_obj.workspace_id,
                        user_id=user_id,
                        action="CREATED",
                        entity_type="Card",
                        entity_id=new_card.id,
                        details=f"Created card '{new_card.title}'"
                    ))
        except Exception as e:
            print(f"Failed to log activity: {e}")
            
    return new_card


def get_cards_by_list(db: Session, list_id: str):
    return (
        db.query(Card)
        .filter(Card.list_id == list_id)
        .order_by(Card.position)
        .all()
    )


def get_card(db: Session, card_id: str):
    return db.query(Card).filter(Card.id == card_id).first()


def update_card(db: Session, card_id: str, data: CardUpdate):
    card = get_card(db, card_id)
    if not card:
        return None

    old_list_id = card.list_id
    old_position = card.position

    # Move between lists (handle positions in source and target lists)
    if data.list_id is not None and str(data.list_id) != str(old_list_id):
        new_list_id = data.list_id
        print(f"📦 Moving card {card_id} from list {old_list_id} to {new_list_id}")
        # Determine new position: provided or append to end
        if data.position is not None:
            new_position = data.position
        else:
            count = db.query(Card).filter(Card.list_id == new_list_id).count()
            new_position = count

        print(f"📦 New position in target list: {new_position}")

        # Decrement positions in old list for cards after the removed card
        db.execute(text("""
            UPDATE cards
            SET position = position - 1
            WHERE list_id = :old_list AND position > :old_pos
        """), {"old_list": old_list_id, "old_pos": old_position})

        # Increment positions in new list to make room
        db.execute(text("""
            UPDATE cards
            SET position = position + 1
            WHERE list_id = :new_list AND position >= :new_pos
        """), {"new_list": new_list_id, "new_pos": new_position})

        card.list_id = new_list_id
        card.position = new_position

    # Reorder within the same list
    elif data.position is not None and data.position != old_position:
        new_position = data.position
        print(f"📦 Reordering card {card_id} in list {old_list_id} from {old_position} to {new_position}")
        if new_position > old_position:
            # Shift cards down between old_position+1..new_position
            db.execute(text("""
                UPDATE cards
                SET position = position - 1
                WHERE list_id = :list_id AND position > :old_pos AND position <= :new_pos
            """), {"list_id": old_list_id, "old_pos": old_position, "new_pos": new_position})
        else:
            # Shift cards up between new_position..old_position-1
            db.execute(text("""
                UPDATE cards
                SET position = position + 1
                WHERE list_id = :list_id AND position >= :new_pos AND position < :old_pos
            """), {"list_id": old_list_id, "old_pos": old_position, "new_pos": new_position})
        card.position = new_position

    # Other field updates
    if data.title is not None:
        print(f"📦 Updating title for card {card_id}")
        card.title = data.title
    if data.description is not None:
        card.description = data.description
    if data.due_date is not None:
        card.due_date = data.due_date
    if data.priority is not None:
        card.priority = data.priority

    print(f"📦 Committing changes for card {card_id}")
    db.commit()
    db.refresh(card)
    return card


def delete_card(db: Session, card_id: str, user_id: str | None = None):
    # Fetch card details for logging before deletion
    card = get_card(db, card_id)
    if card:
         try:
            # Lookup workspace_id
            list_obj = db.query(List).filter(List.id == card.list_id).first()
            if list_obj:
               project_obj = db.query(Project).filter(Project.id == list_obj.project_id).first()
               if project_obj:
                    if user_id:
                        activity_crud.log_activity(db, activity_schema.ActivityLogCreate(
                            workspace_id=project_obj.workspace_id,
                            user_id=user_id,
                            action="DELETED",
                            entity_type="Card",
                            entity_id=None,
                            details=f"Deleted card '{card.title}'"
                        ))
         except Exception as e:
            print(f"Failed to log activity: {e}")

    # Use raw SQL to bypass ORM schema mismatch
    db.execute(text("DELETE FROM cards WHERE id = :id"), {"id": card_id})
    db.commit()
    return True
