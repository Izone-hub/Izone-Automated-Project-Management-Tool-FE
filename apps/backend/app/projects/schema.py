from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    background_color: Optional[str] = "#ffffff"
    workspace_id: str


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    background_color: Optional[str] = None


class ProjectOut(ProjectBase):
    id: str
    created_by: str
    archived: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
