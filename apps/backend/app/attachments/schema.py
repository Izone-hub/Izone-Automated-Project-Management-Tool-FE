from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AttachmentBase(BaseModel):
    file_path: str
    task_id: str


class AttachmentCreate(AttachmentBase):
    pass


class AttachmentOut(AttachmentBase):
    id: str
    uploaded_at: Optional[datetime]

    class Config:
        orm_mode = True
