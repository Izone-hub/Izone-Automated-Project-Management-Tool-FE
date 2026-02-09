from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db.session import get_db
from . import crud, schema
from app.models.user import User

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/", response_model=List[schema.NotificationOut])
def get_my_notifications(db: Session = Depends(get_db)):
    # Mock current user
    user = db.query(User).first()
    if not user:
        return []
    return crud.get_my_notifications(db, str(user.id))

@router.patch("/{notification_id}/read")
def mark_read(notification_id: str, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
         raise HTTPException(status_code=401, detail="Not authenticated")
    crud.mark_as_read(db, notification_id, str(user.id))
    return {"message": "Marked read"}

@router.patch("/read-all")
def mark_all_read(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
         raise HTTPException(status_code=401, detail="Not authenticated")
    crud.mark_all_read(db, str(user.id))
    return {"message": "All marked read"}
