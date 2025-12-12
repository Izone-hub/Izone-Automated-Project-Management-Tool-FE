from sqlalchemy.orm import Session
from fastapi import HTTPException

from ..models.attachment import Attachment
from ..models.task import Task
from .schema import AttachmentCreate


# ---------- Helpers ----------
def _task_exists(db: Session, task_id: str) -> Task:
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


# ---------- Create ----------
def create_attachment(db: Session, data: AttachmentCreate) -> Attachment:
    _task_exists(db, data.task_id)

    attachment = Attachment(
        file_path=data.file_path,
        task_id=data.task_id,
    )

    db.add(attachment)
    db.commit()
    db.refresh(attachment)
    return attachment


# ---------- Read ----------
def get_attachment(db: Session, attachment_id: str) -> Attachment:
    attachment = db.get(Attachment, attachment_id)
    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")
    return attachment


def list_attachments(db: Session, task_id: str):
    _task_exists(db, task_id)
    return db.query(Attachment).filter(Attachment.task_id == task_id).order_by(Attachment.uploaded_at.desc()).all()


# ---------- Delete ----------
def delete_attachment(db: Session, attachment_id: str) -> None:
    attachment = db.get(Attachment, attachment_id)
    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")

    db.delete(attachment)
    db.commit()
