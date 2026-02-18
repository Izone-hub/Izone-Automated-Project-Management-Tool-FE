from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import shutil
import os
from pathlib import Path

from app.db.session import get_db
from app.attachments import crud, schemas

router = APIRouter(
    prefix="/attachments",
    tags=["Attachments"]
)

UPLOAD_DIR = "uploads/attachments"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/card/{card_id}", response_model=schemas.AttachmentResponse, status_code=status.HTTP_201_CREATED)
async def upload_attachment(
    card_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Create file path
    file_extension = Path(file.filename).suffix
    file_name = f"{card_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, file_name).replace("\\", "/")
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Save to DB
    # We store the relative path or full path? Let's store relative for portability
    # But for serving, we might need to adjust.
    attachment_create = schemas.AttachmentCreate(file_path=file_path)
    return crud.create_attachment(db, attachment_create, card_id, file.filename)

@router.get("/card/{card_id}", response_model=List[schemas.AttachmentResponse])
def get_card_attachments(
    card_id: UUID,
    db: Session = Depends(get_db)
):
    return crud.get_attachments_by_card(db, card_id)

@router.delete("/{attachment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_attachment(
    attachment_id: UUID,
    db: Session = Depends(get_db)
):
    deleted = crud.delete_attachment(db, attachment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Attachment not found")
