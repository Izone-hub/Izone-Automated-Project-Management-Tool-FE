from sqlalchemy.orm import Session
from app.models.attachment import Attachment
from app.attachments.schemas import AttachmentCreate
from uuid import UUID
import os

def create_attachment(db: Session, attachment: AttachmentCreate, card_id: UUID, filename: str):
    db_attachment = Attachment(
        file_path=attachment.file_path,
        file_name=filename,
        card_id=card_id
    )
    # hack to store filename if model doesn't support it yet, strictly speaking we should add a column
    # but for now we rely on the file_path or just client knowing
    db.add(db_attachment)
    db.commit()
    db.refresh(db_attachment)
    return db_attachment

def get_attachments_by_card(db: Session, card_id: UUID):
    return db.query(Attachment).filter(Attachment.card_id == card_id).all()

def delete_attachment(db: Session, attachment_id: UUID):
    attachment = db.query(Attachment).filter(Attachment.id == attachment_id).first()
    if attachment:
        # Delete file from filesystem
        if os.path.exists(attachment.file_path):
            os.remove(attachment.file_path)
        
        db.delete(attachment)
        db.commit()
        return True
    return False
