from math import ceil
from sqlalchemy.orm import Session
from app.models.time_entry import CardTimeEntry
from app.time_entries.schema import TimeEntryCreate


def _compute_duration(entry: CardTimeEntry) -> int:
    """Return duration in minutes. Prefer stored value, else compute from start/end."""
    if entry.duration_minutes is not None:
        return entry.duration_minutes
    if entry.start_time and entry.end_time:
        delta = entry.end_time - entry.start_time
        return max(1, ceil(delta.total_seconds() / 60))
    return 0


def create_time_entry(db: Session, card_id: str, data: TimeEntryCreate) -> CardTimeEntry:
    duration = data.duration_minutes
    if duration is None and data.start_time and data.end_time:
        delta = data.end_time - data.start_time
        duration = max(1, ceil(delta.total_seconds() / 60))

    entry = CardTimeEntry(
        card_id=card_id,
        description=data.description,
        start_time=data.start_time,
        end_time=data.end_time,
        duration_minutes=duration,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def get_time_entries_for_card(db: Session, card_id: str) -> list[CardTimeEntry]:
    return (
        db.query(CardTimeEntry)
        .filter(CardTimeEntry.card_id == card_id)
        .order_by(CardTimeEntry.created_at.desc())
        .all()
    )


def delete_time_entry(db: Session, entry_id: str) -> bool:
    entry = db.query(CardTimeEntry).filter(CardTimeEntry.id == entry_id).first()
    if not entry:
        return False
    db.delete(entry)
    db.commit()
    return True
