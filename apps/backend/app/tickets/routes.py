from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db.session import get_db
from ..auth.security import get_current_user
from ..models.user import User
from . import crud, schema

router = APIRouter(prefix="/tickets", tags=["Tickets"])

@router.post("/{workspace_id}", response_model=schema.TicketOut)
def create_ticket(
    workspace_id: str, 
    ticket: schema.TicketCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.create_ticket(db, ticket, workspace_id, str(current_user.id))

@router.get("/{workspace_id}", response_model=List[schema.TicketOut])
def get_tickets(workspace_id: str, db: Session = Depends(get_db)):
    return crud.get_tickets(db, workspace_id)

@router.get("/detail/{ticket_id}", response_model=schema.TicketOut)
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):
    ticket = crud.get_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.patch("/{ticket_id}", response_model=schema.TicketOut)
def update_ticket(ticket_id: str, ticket: schema.TicketUpdate, db: Session = Depends(get_db)):
    updated_ticket = crud.update_ticket(db, ticket_id, ticket)
    if not updated_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return updated_ticket

@router.delete("/{ticket_id}")
def delete_ticket(
    ticket_id: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    crud.delete_ticket(db, ticket_id, str(current_user.id))
    return {"message": "Ticket deleted"}
