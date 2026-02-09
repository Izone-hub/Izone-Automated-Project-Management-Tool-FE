from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.time_entry import TimeEntry
from .schema import TimeEntryCreate, TimeEntryUpdate
from datetime import datetime, timezone
from uuid import UUID
from typing import List, Optional

def create_time_entry(db: Session, data: TimeEntryCreate, user_id: str):
    # Check if user already has a running timer? Optional constraint.
    # For now, we allow multiple, or we can auto-stop previous ones.
    
    new_entry = TimeEntry(
        card_id=data.card_id,
        user_id=user_id,
        start_time=datetime.now(timezone.utc),
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

def stop_time_entry(db: Session, entry_id: str, user_id: str):
    print(f"[DEBUG] crud.stop_time_entry called with entry_id={entry_id}, user_id={user_id}")
    # MVP FIX: Convert string to UUID for proper comparison
    try:
        entry_uuid = UUID(entry_id)
    except ValueError:
        print(f"[DEBUG] Invalid UUID format in CRUD: {entry_id}")
        return None
        
    entry = db.query(TimeEntry).filter(TimeEntry.id == entry_uuid).first()
    if not entry:
        print(f"[DEBUG] No entry found in DB with id: {entry_uuid}")
        return None
    
    # Check ownership if needed (commented out for MVP flexibility as requested before)
    # if str(entry.user_id) != user_id:
    #     print(f"[DEBUG] User mismatch: entry.user_id={entry.user_id}, caller_user_id={user_id}")
    
    entry.end_time = datetime.now(timezone.utc)
    
    # SAFE CALCULATION: Handle potential naive/aware mismatch from old entries
    try:
        start = entry.start_time
        if start.tzinfo is None:
            start = start.replace(tzinfo=timezone.utc)
            
        end = entry.end_time
        if end.tzinfo is None:
            end = end.replace(tzinfo=timezone.utc)
            
        duration = (end - start).total_seconds() / 60
        entry.duration_minutes = int(duration)
        print(f"[DEBUG] Calculated duration: {entry.duration_minutes} minutes")
    except Exception as e:
        print(f"[DEBUG] Error calculating duration: {e}")
        # Fallback to 0 to at least let it save
        entry.duration_minutes = 0
    
    db.commit()
    db.refresh(entry)
    print(f"[DEBUG] Timer {entry_id} stopped and saved successfully")
    return entry

def get_active_time_entry(db: Session, user_id: str) -> Optional[TimeEntry]:
    return db.query(TimeEntry).filter(
        TimeEntry.user_id == user_id, 
        TimeEntry.end_time == None
    ).order_by(desc(TimeEntry.start_time)).first()

def get_active_time_entry_by_card(db: Session, card_id: str) -> Optional[TimeEntry]:
    """Get the currently running timer for a specific card (any user)."""
    try:
        card_uuid = UUID(card_id)
    except ValueError:
        print(f"[DEBUG] Invalid card UUID format: {card_id}")
        return None
    
    return db.query(TimeEntry).filter(
        TimeEntry.card_id == card_uuid, 
        TimeEntry.end_time == None
    ).order_by(desc(TimeEntry.start_time)).first()

def get_time_entries_by_card(db: Session, card_id: str) -> List[TimeEntry]:
    return db.query(TimeEntry).filter(TimeEntry.card_id == card_id).order_by(desc(TimeEntry.start_time)).all()
