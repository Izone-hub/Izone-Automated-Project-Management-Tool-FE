from pydantic import BaseModel
from datetime import datetime


class AttachmentResponse(BaseModel):
    id: str
    file_path: str
    card_id: str
    uploaded_at: datetime

    class Config:
        from_attributes = True
