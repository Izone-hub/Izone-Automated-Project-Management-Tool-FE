from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class TimeEntryBase(BaseModel):
    card_id: UUID

class TimeEntryCreate(TimeEntryBase):
    pass

class TimeEntryUpdate(BaseModel):
    end_time: Optional[datetime] = None

class TimeEntryOut(TimeEntryBase):
    id: UUID
    user_id: UUID
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    created_at: datetime

    class Config:
        orm_mode = True
