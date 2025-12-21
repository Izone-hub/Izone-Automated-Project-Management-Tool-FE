from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ListBase(BaseModel):
    title: str
    position: Optional[int] = 0


class ListCreate(ListBase):
    pass


class ListUpdate(BaseModel):
    title: Optional[str] = None
    position: Optional[int] = None


class ListResponse(ListBase):
    id: str
    project_id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
     