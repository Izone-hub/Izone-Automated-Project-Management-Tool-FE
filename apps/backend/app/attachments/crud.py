from sqlalchemy.orm import Session
from app.models.attachment import Attachment
from .schema import AttachmentCreate
from typing import List

def create_attachment(db: Session, data: AttachmentCreate):
    new_attachment = Attachment(
        card_id=data.card_id,
        file_name=data.file_name,
        file_type=data.file_type,
        file_path=data.file_path
    )
    db.add(new_attachment)
    db.commit()
    db.refresh(new_attachment)
    return new_attachment

def get_attachments_by_card(db: Session, card_id: str) -> List[Attachment]:
    return db.query(Attachment).filter(Attachment.card_id == card_id).all()

def delete_attachment(db: Session, attachment_id: str):
    attachment = db.query(Attachment).filter(Attachment.id == attachment_id).first()
    if attachment:
        db.delete(attachment)
        db.commit()
    return attachment
