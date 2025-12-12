from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..db.session import get_db
from .crud import create_attachment, get_attachment, list_attachments, delete_attachment
from .schema import AttachmentCreate, AttachmentOut

router = APIRouter(prefix="/attachments", tags=["Attachments"]) 


# ---------- Create ----------
@router.post("/", response_model=AttachmentOut)
def create_attachment_endpoint(data: AttachmentCreate, db: Session = Depends(get_db)):
    return create_attachment(db, data)


# ---------- Read ----------
@router.get("/{attachment_id}", response_model=AttachmentOut)
def get_attachment_endpoint(attachment_id: str, db: Session = Depends(get_db)):
    return get_attachment(db, attachment_id)


@router.get("/", response_model=List[AttachmentOut])
def list_attachments_endpoint(task_id: str, db: Session = Depends(get_db)):
    return list_attachments(db, task_id)


# ---------- Delete ----------
@router.delete("/{attachment_id}", status_code=204)
def delete_attachment_endpoint(attachment_id: str, db: Session = Depends(get_db)):
    delete_attachment(db, attachment_id)
    return {"detail": "Attachment deleted"}
