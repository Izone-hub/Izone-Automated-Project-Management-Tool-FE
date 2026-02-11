from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class AuditLogRead(BaseModel):
    user_id: UUID
class AuditLogOutput(AuditLogRead):
    action: str
    timestamp: datetime 
    object_type: str
    object_id: UUID | None
class AuditLog(BaseModel):
    id: str
    action: str
    user_id: str


    class Config:
        from_attributes = True