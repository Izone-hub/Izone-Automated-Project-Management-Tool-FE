from pydantic import BaseModel, Field, ConfigDict,  field_validator, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID 
from enum import Enum
from app.models import WorkspaceRole




class RoleEnum(str, Enum):
    owner  = "owner"
    member = "member"
    admin  = "admin"

RoleEnum.__pydantic_json_schema__ = lambda source, handler: handler(str)
RoleEnum.__get_pydantic_core_schema__ = lambda source, handler: handler(str)


# ---------- Base ----------
class OrgBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None

    @field_validator("name")
    def strip_name(cls, v):
        return v.strip()


# ---------- Create ----------
class WorkspaceCreate(OrgBase):
 owner_id: Optional[UUID] = None        

# ---------- Update ----------
class WorkspaceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None

    @field_validator("name")
    def strip_name(cls, v):
        return v.strip() if v else None


# ---------- Out ----------
class WorkspaceOut(OrgBase):
    id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ---------- Member ----------
class MemberAdd(BaseModel):
    email: str
    role: RoleEnum = "member"


class MemberOut(BaseModel):
    user_id: UUID
    email: Optional[str] = None
    role: RoleEnum
    created_at: datetime

    class Config:
         orm_mode = True
class WorkspaceInvitationCreate(BaseModel):
    email: EmailStr
    role: WorkspaceRole = WorkspaceRole.member

# Data for the API response
class WorkspaceInvitationResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    email: EmailStr
    role: WorkspaceRole
    token: str
    is_accepted: bool
    expires_at: datetime
    created_at: datetime
    
    # Required for Pydantic V2 (which your logs show you are using)
    model_config = ConfigDict(from_attributes=True)