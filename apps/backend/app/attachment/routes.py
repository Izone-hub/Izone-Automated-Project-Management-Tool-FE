import os
import uuid
from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
    status
)
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.attachment import crud
from app.attachment.schema import AttachmentResponse


router = APIRouter(
    prefix="/cards/{card_id}/attachments",
    tags=["Attachments"]
)


@router.post(
    "/",
    response_model=AttachmentResponse,
    status_code=status.HTTP_201_CREATED
)
def upload_attachment(
    card_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = f"media/attachments/{filename}"

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    return crud.create_attachment(db, card_id, file_path)


@router.get(
    "/",
    response_model=list[AttachmentResponse]
)
def get_attachments(
    card_id: str,
    db: Session = Depends(get_db)
):
    return crud.get_attachments_by_card(db, card_id)


@router.delete(
    "/{attachment_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_attachment(
    attachment_id: str,
    db: Session = Depends(get_db)
):
    deleted = crud.delete_attachment(db, attachment_id)
    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Attachment not found"
        )
