import os
from sqlalchemy.orm import Session
from app.models.attachment import Attachment


UPLOAD_DIR = "media/attachments"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def create_attachment(
    db: Session,
    card_id: str,
    file_path: str
):
    attachment = Attachment(
        file_path=file_path,
        card_id=card_id
    )

    db.add(attachment)
    db.commit()
    db.refresh(attachment)
    return attachment


def get_attachments_by_card(
    db: Session,
    card_id: str
):
    return (
        db.query(Attachment)
        .filter(Attachment.card_id == card_id)
        .order_by(Attachment.uploaded_at.desc())
        .all()
    )


def get_attachment(
    db: Session,
    attachment_id: str
):
    return (
        db.query(Attachment)
        .filter(Attachment.id == attachment_id)
        .first()
    )


def delete_attachment(
    db: Session,
    attachment_id: str
):
    attachment = get_attachment(db, attachment_id)
    if not attachment:
        return None

    # delete file from disk
    if os.path.exists(attachment.file_path):
        os.remove(attachment.file_path)

    db.delete(attachment)
    db.commit()
    return attachment
