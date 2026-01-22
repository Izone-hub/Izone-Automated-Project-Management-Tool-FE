from sqlalchemy.orm import Session
from app.models.card import Card
from app.cards.schema import CardCreate, CardUpdate


from sqlalchemy import text
from app.models.comment import Comment


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

    if data.title is not None:
        card.title = data.title
    if data.description is not None:
        card.description = data.description
    if data.due_date is not None:
        card.due_date = data.due_date
    if data.priority is not None:
        card.priority = data.priority
    if data.position is not None:
        card.position = data.position

    db.commit()
    db.refresh(card)
    return card


def delete_card(db: Session, card_id: str):
    # Use raw SQL to bypass ORM schema mismatch (missing comments.card_id column)
    # The database will handle cascade if configured, or fail if blocked,
    # but this avoids the Psycopg2 UndefinedColumn error in SQLAlchemy.
    db.execute(text("DELETE FROM cards WHERE id = :id"), {"id": card_id})
    db.commit()
    return True
