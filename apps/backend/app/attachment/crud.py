from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional

from app.models.attachment import Attachment
from app.attachment.schema  import AttachmentCreate


def create_attachment(db: Session, payload: AttachmentCreate) -> Attachment:
   
    attachment = Attachment(
        file_path=payload["file_path"],
        card_id=payload["card_id"],
        file_name=payload["file_name"]
    )
    db.add(attachment)
    db.commit()
    db.refresh(attachment)
    return attachment


def get_attachments_by_task(db: Session, task_id: UUID) -> List[Attachment]:
 
    return (
        db.query(Attachment)
        .filter(Attachment.card_id)
        .order_by(Attachment.uploaded_at.desc())
        .all()
    )


def get_attachment(db: Session, attachment_id: UUID) -> Optional[Attachment]:
   
    return db.query(Attachment).filter(Attachment.id == attachment_id).first()


def delete_attachment(db: Session, attachment: Attachment) -> None:
 
    db.delete(attachment)
    db.commit()
