from pydantic import BaseModel
from typing import Optional

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    organization_id: int

class ProjectUpdate(ProjectBase):
    is_archived: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: int
    organization_id: int
    is_archived: bool

    class Config:
        orm_mode = True
from pydantic import BaseModel
from typing import Optional

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    organization_id: int

class ProjectUpdate(ProjectBase):
    is_archived: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: int
    organization_id: int
    is_archived: bool

    class Config:
        orm_mode = True
