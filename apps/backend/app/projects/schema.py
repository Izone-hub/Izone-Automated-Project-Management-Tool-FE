from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    background_color: Optional[str] = "#ffffff"
    workspace_id: UUID


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    background_color: Optional[str] = None


class ProjectOut(ProjectBase):
    id: UUID
    created_by: UUID
    archived: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
