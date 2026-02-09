from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class AttachmentBase(BaseModel):
    file_name: str
    file_type: Optional[str] = None

class AttachmentCreate(AttachmentBase):
    card_id: UUID
    file_path: str

class AttachmentOut(AttachmentBase):
    id: UUID
    card_id: UUID
    file_path: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True
