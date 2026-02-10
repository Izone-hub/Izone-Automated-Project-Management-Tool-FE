import shutil
from pathlib import Path
from uuid import uuid4, UUID

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.attachment.schema import AttachmentCreate, AttachmentOut
from app.attachment.crud import (
    create_attachment as crud_create,
    get_attachments_by_task,
    get_attachment,
    delete_attachment as crud_delete
)

router = APIRouter(tags=["Attachments"], prefix="/attachments")

UPLOAD_DIR = Path("uploads/attachments")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/", response_model=AttachmentOut)
async def create_attachment(
    file: UploadFile = File(...),             
    task_id: UUID = Form(...), 
    card_id: UUID = Form(...),                
    db: Session = Depends(get_db)
):
 
    safe_filename = f"{uuid4().hex}_{file.filename}"
    file_path = UPLOAD_DIR / safe_filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    payload_for_crud = {
        "file_path": str(file_path),
        "task_id": str(task_id),
        "file_name": file.filename,
        "card_id": str(card_id)

      
    }

    created_attachment = crud_create(db, payload_for_crud)
    return created_attachment


@router.get("/task/{task_id}", response_model=list[AttachmentOut])
def get_task_attachments(task_id: UUID, db: Session = Depends(get_db)):
    return get_attachments_by_task(db, task_id)


@router.delete("/{attachment_id}")
def delete_attachment(attachment_id: UUID, db: Session = Depends(get_db)):
    attachment = get_attachment(db, attachment_id)
    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")

    crud_delete(db, attachment)
    return {"detail": "Attachment deleted successfully"}
