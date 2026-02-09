from sqlalchemy.orm import Session
from app.models.activity import ActivityLog
from .schema import ActivityLogCreate
from uuid import UUID
from app.models.user import User

def log_activity(db: Session, activity: ActivityLogCreate):
    # Convert Pydantic model to dict if it's not already
    data = activity.dict() if hasattr(activity, 'dict') else activity
    db_activity = ActivityLog(**data)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

def get_workspace_activity(db: Session, workspace_id: str, limit: int = 50):
    logs = db.query(ActivityLog)\
        .filter(ActivityLog.workspace_id == workspace_id)\
        .order_by(ActivityLog.created_at.desc())\
        .limit(limit)\
        .all()
    
    # Enrich with user info properly
    results = []
    for log in logs:
        # Check if user relationship is loaded, else query or handle gracefully
        # Assuming eager load or lazy load works, but let's be safe for connection issues
        user_name = "Unknown User"
        user_avatar = None
        if log.user:
            user_name = log.user.full_name
            user_avatar = log.user.avatar_url
            
        # Convert to schema compatible dict or object
        # We'll rely on Pydantic's from_attributes but we need to inject the extra fields
        # Ideally, we should join User model in the query for performance, but this is MVP.
        log.user_name = user_name
        log.user_avatar = user_avatar
        results.append(log)
        
    return results
