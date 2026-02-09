from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from ..db.session import get_db
from .crud import create_attachment, get_attachments_by_card, delete_attachment
from .schema import AttachmentOut, AttachmentCreate
import shutil
import os
import uuid

router = APIRouter(prefix="/attachments", tags=["Attachments"])

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload/{card_id}", response_model=AttachmentOut)
async def upload_file(card_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Generate unique filename to avoid collisions
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Standardize path for URL (web friendly)
    web_path = f"/static/uploads/{unique_filename}"
    
    # Save metadata to DB
    attachment_data = AttachmentCreate(
        card_id=card_id,
        file_name=file.filename,
        file_type=file.content_type,
        file_path=web_path
    )
    
    return create_attachment(db, attachment_data)

@router.get("/card/{card_id}", response_model=List[AttachmentOut])
def list_attachments(card_id: str, db: Session = Depends(get_db)):
    return get_attachments_by_card(db, card_id)

@router.delete("/{attachment_id}")
def delete_attachment_endpoint(attachment_id: str, db: Session = Depends(get_db)):
    attachment = delete_attachment(db, attachment_id)
    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")
    
    # Try to delete file from disk (ignoring errors if missing)
    try:
        # Convert web path back to OS path
        # web_path: /static/uploads/file.png -> OS: static/uploads/file.png
        os_path = attachment.file_path.lstrip("/")
        if os.path.exists(os_path):
            os.remove(os_path)
    except Exception as e:
        print(f"Error deleting file from disk: {e}")
        
    return {"message": "Attachment deleted"}
