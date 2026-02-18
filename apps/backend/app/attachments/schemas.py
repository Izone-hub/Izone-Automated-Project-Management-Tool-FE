from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class AttachmentBase(BaseModel):
    file_path: str

class AttachmentCreate(AttachmentBase):
    pass

class AttachmentResponse(AttachmentBase):
    id: UUID
    card_id: UUID
    uploaded_at: datetime
    filename: Optional[str] = None

    class Config:
        from_attributes = True
