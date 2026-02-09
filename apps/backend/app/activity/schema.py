from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class ActivityLogBase(BaseModel):
    action: str
    entity_type: str
    entity_id: Optional[UUID] = None
    details: str

class ActivityLogCreate(ActivityLogBase):
    workspace_id: UUID
    user_id: UUID

class ActivityLogOut(ActivityLogBase):
    id: UUID
    workspace_id: UUID
    user_id: UUID
    created_at: datetime
    user_name: Optional[str] = None # Helper for frontend display
    user_avatar: Optional[str] = None # Helper for frontend display

    class Config:
        from_attributes = True
