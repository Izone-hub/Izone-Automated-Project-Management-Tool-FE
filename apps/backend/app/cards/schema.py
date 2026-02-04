from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.card import Priority


class CardBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Priority = Priority.medium
    position: Optional[int] = 0


class CardCreate(CardBase):
    pass


class CardUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[Priority] = None
    position: Optional[int] = None
    list_id: Optional[UUID] = None


class CardResponse(CardBase):
    id: UUID
    list_id: UUID
    created_by: Optional[UUID]
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
