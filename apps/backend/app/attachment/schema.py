from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class AttachmentBase(BaseModel):
    file_path: str
    card_id: UUID | None

class AttachmentCreate(AttachmentBase):
    pass

class AttachmentOut(AttachmentBase):
    id: UUID
    uploaded_at: datetime

    class Config:
        from_attributes = True
