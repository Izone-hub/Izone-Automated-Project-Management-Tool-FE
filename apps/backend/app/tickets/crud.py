from sqlalchemy.orm import Session
from app.models.ticket import Ticket
from .schema import TicketCreate, TicketUpdate
from uuid import UUID
from app.notifications import crud as notification_crud
from app.notifications import schema as notification_schema
from app.activity import crud as activity_crud
from app.activity import schema as activity_schema

def create_ticket(db: Session, ticket: TicketCreate, workspace_id: str, requester_id: str):
    db_ticket = Ticket(
        **ticket.dict(),
        workspace_id=workspace_id,
        requester_id=requester_id
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    
    # Log Activity
    try:
        activity_crud.log_activity(db, activity_schema.ActivityLogCreate(
            workspace_id=workspace_id,
            user_id=requester_id,
            action="CREATED",
            entity_type="Ticket",
            entity_id=db_ticket.id,
            details=f"Created ticket '{db_ticket.title}'"
        ))
    except Exception as e:
        print(f"Failed to log activity: {e}")

    return db_ticket

def get_tickets(db: Session, workspace_id: str):
    return db.query(Ticket).filter(Ticket.workspace_id == workspace_id).all()

def get_ticket(db: Session, ticket_id: str):
    return db.query(Ticket).filter(Ticket.id == ticket_id).first()

def update_ticket(db: Session, ticket_id: str, update_data: TicketUpdate):
    db_ticket = get_ticket(db, ticket_id)
    if not db_ticket:
        return None
    
    assignee_changed = False
    new_assignee_id = None
    
    for key, value in update_data.dict(exclude_unset=True).items():
        if key == "assignee_id" and value != db_ticket.assignee_id:
            assignee_changed = True
            new_assignee_id = value
        setattr(db_ticket, key, value)
    
    db.commit()
    db.refresh(db_ticket)

    if assignee_changed and new_assignee_id:
        try:
            notification = notification_schema.NotificationCreate(
                user_id=new_assignee_id,
                title="Ticket Assigned",
                message=f"You have been assigned to ticket: {db_ticket.title}",
                link=f"/workspace/{db_ticket.workspace_id}/tickets"
            )
            notification_crud.create_notification(db, notification)
        except Exception as e:
            print(f"Failed to create notification: {e}")
            
    # Optional: Log update activity (commented out to reduce noise, enable if desired)
    # try:
    #     activity_crud.log_activity(db, activity_schema.ActivityLogCreate(
    #         workspace_id=db_ticket.workspace_id,
    #         user_id="SYSTEM", # Ideally passed from context
    #         action="UPDATED",
    #         entity_type="Ticket",
    #         entity_id=db_ticket.id,
    #         details=f"Updated ticket '{db_ticket.title}'"
    #     ))
    # except: pass

    return db_ticket

def delete_ticket(db: Session, ticket_id: str, user_id: str = None): # user_id passed effectively? In routes it should be.
    db_ticket = get_ticket(db, ticket_id)
    if db_ticket:
        # Capture details before delete
        workspace_id = db_ticket.workspace_id
        title = db_ticket.title
        requester = db_ticket.requester_id 
        
        db.delete(db_ticket)
        db.commit()
        
        # Log Activity (If we have user_id context, which we'll need to update routes to pass)
        # For now, using requester_id as fallback if user_id missing is bad practice but MVP safest without refactor route
        # better to pass user_id from route.
        try:
            if user_id: 
                logger_id = user_id
            else:
                logger_id = requester # fallback
                
            activity_crud.log_activity(db, activity_schema.ActivityLogCreate(
                workspace_id=workspace_id,
                user_id=logger_id, 
                action="DELETED",
                entity_type="Ticket",
                entity_id=None, # ID is gone
                details=f"Deleted ticket '{title}'"
            ))
        except Exception as e:
            print(f"Failed to log activity: {e}")
            
    return db_ticket
