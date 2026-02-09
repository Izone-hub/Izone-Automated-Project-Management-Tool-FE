from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..db.session import get_db
from .crud import create_time_entry, stop_time_entry, get_active_time_entry, get_time_entries_by_card, get_active_time_entry_by_card
from .schema import TimeEntryCreate, TimeEntryOut
from ..auth.security import get_current_user
from ..models.user import User

router = APIRouter(prefix="/time-entries", tags=["Time Entries"])

@router.post("/", response_model=TimeEntryOut)
def start_timer(
    data: TimeEntryCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return create_time_entry(db, data, str(current_user.id))

@router.patch("/{entry_id}/stop", response_model=TimeEntryOut)
def stop_timer(
    entry_id: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print(f"[DEBUG] stop_timer route hit for entry_id: {entry_id} by user: {current_user.email}")
    try:
        entry = stop_time_entry(db, entry_id, str(current_user.id))
        if not entry:
            print(f"[DEBUG] stop_time_entry returned None for id: {entry_id}")
            raise HTTPException(status_code=404, detail="Time entry not found")
        return entry
    except Exception as e:
        print(f"[DEBUG] Error in stop_timer route: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Card-specific active route MUST come before generic /active route
@router.get("/active/card/{card_id}", response_model=Optional[TimeEntryOut])
def get_active_timer_by_card(card_id: str, db: Session = Depends(get_db)):
    """Get the active timer for a specific card, regardless of user."""
    print(f"[DEBUG] Getting active timer for card: {card_id}")
    return get_active_time_entry_by_card(db, card_id)

@router.get("/active", response_model=Optional[TimeEntryOut])
def get_active_timer(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return get_active_time_entry(db, str(current_user.id))

@router.get("/card/{card_id}", response_model=List[TimeEntryOut])
def list_card_entries(card_id: str, db: Session = Depends(get_db)):
    return get_time_entries_by_card(db, card_id)
