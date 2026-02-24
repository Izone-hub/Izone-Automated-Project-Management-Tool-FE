from pydantic import BaseModel, EmailStr, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models.workspace import WorkspaceRole 

class WorkspaceInvitationCreate(BaseModel):
 
    email: EmailStr
    role: WorkspaceRole = WorkspaceRole.member
    model_config = ConfigDict(from_attributes=True)

class WorkspaceInvitationResponse(BaseModel):
   
    id: UUID
    workspace_id: UUID
    invited_user_id: UUID  
    invited_by_id: UUID 
    role: WorkspaceRole
    token: str
    is_accepted: bool
    expires_at: datetime
    created_at: datetime
    email: EmailStr 
    
    model_config = ConfigDict(from_attributes=True)

class WorkspaceInvitationAccept(BaseModel):
 
    token: str