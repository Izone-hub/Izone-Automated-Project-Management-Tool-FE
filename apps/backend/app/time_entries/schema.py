from pydantic import BaseModel, ConfigDict, model_validator
from typing import Optional
from datetime import datetime
from uuid import UUID
from math import ceil


class TimeEntryCreate(BaseModel):
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

    @model_validator(mode="after")
    def check_duration_or_times(self):
        has_manual = self.duration_minutes is not None
        has_timer = self.start_time is not None and self.end_time is not None
        if not has_manual and not has_timer:
            raise ValueError(
                "Provide either duration_minutes or both start_time and end_time"
            )
        return self


class TimeEntryResponse(BaseModel):
    id: UUID
    card_id: UUID
    user_id: Optional[UUID]
    description: Optional[str]
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    duration_minutes: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TimeEntriesListResponse(BaseModel):
    entries: list[TimeEntryResponse]
    total_minutes: int
