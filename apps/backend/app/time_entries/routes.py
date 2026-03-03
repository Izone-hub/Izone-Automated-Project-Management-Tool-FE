from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.time_entries import crud
from app.time_entries.schema import TimeEntryCreate, TimeEntryResponse, TimeEntriesListResponse
from math import ceil

router = APIRouter(
    prefix="/cards/{card_id}/time-entries",
    tags=["Time Tracking"]
)


def _entry_to_response(entry) -> TimeEntryResponse:
    duration = entry.duration_minutes
    if duration is None and entry.start_time and entry.end_time:
        delta = entry.end_time - entry.start_time
        duration = max(1, ceil(delta.total_seconds() / 60))
    return TimeEntryResponse(
        id=entry.id,
        card_id=entry.card_id,
        user_id=entry.user_id,
        description=entry.description,
        start_time=entry.start_time,
        end_time=entry.end_time,
        duration_minutes=duration or 0,
        created_at=entry.created_at,
    )


@router.post("/", response_model=TimeEntryResponse, status_code=status.HTTP_201_CREATED)
def log_time_entry(
    card_id: str,
    data: TimeEntryCreate,
    db: Session = Depends(get_db),
):
    entry = crud.create_time_entry(db, card_id, data)
    return _entry_to_response(entry)


@router.get("/", response_model=TimeEntriesListResponse)
def get_time_entries(
    card_id: str,
    db: Session = Depends(get_db),
):
    entries = crud.get_time_entries_for_card(db, card_id)
    responses = [_entry_to_response(e) for e in entries]
    total = sum(r.duration_minutes for r in responses)
    return TimeEntriesListResponse(entries=responses, total_minutes=total)


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_time_entry(
    card_id: str,
    entry_id: str,
    db: Session = Depends(get_db),
):
    deleted = crud.delete_time_entry(db, entry_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Time entry not found")
