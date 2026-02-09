from sqlalchemy.orm import Session
from app.models.notification import Notification
from .schema import NotificationCreate
from uuid import UUID

def create_notification(db: Session, notification: NotificationCreate):
    # Convert Pydantic model to dict if it's not already
    data = notification.dict() if hasattr(notification, 'dict') else notification
    db_notification = Notification(**data)
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

def get_my_notifications(db: Session, user_id: str, limit: int = 20):
    return db.query(Notification)\
        .filter(Notification.user_id == user_id)\
        .order_by(Notification.created_at.desc())\
        .limit(limit)\
        .all()

def mark_as_read(db: Session, notification_id: str, user_id: str):
    notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user_id).first()
    if notification:
        notification.is_read = True
        db.commit()
        db.refresh(notification)
    return notification

def mark_all_read(db: Session, user_id: str):
    db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).update({"is_read": True})
    db.commit()
