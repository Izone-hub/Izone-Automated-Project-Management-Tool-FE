# app/api/v1/routes/comment.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..auth.security import get_current_user
from app.comments import crud as crud_comment
from app.comments.schema import CommentCreate, CommentResponse, CommentUpdate
from app.models.user import User
import uuid

router = APIRouter(prefix="/cards/{card_id}/comments", tags=["comments"])
print("DEBUG: LOADED COMMENTS ROUTES FILE")




@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    card_id: uuid.UUID,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if comment_in.card_id != card_id:
        raise HTTPException(
            status_code=400,
            detail="Card ID in body must match the one in URL"
        )

    # Use the authenticated user's ID
    comment = crud_comment.create_comment(db, comment_in, author_id=current_user.id) 
    return comment


@router.get("/", response_model=list[CommentResponse])
def read_comments(
    card_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Read comments - public access (no auth required)"""
    comments = crud_comment.get_comments_by_card(db, card_id=card_id, skip=skip, limit=limit)
    return comments


@router.patch("/{comment_id}", response_model=CommentResponse)
def update_comment(
    card_id: uuid.UUID,
    comment_id: uuid.UUID,
    comment_in: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = crud_comment.update_comment(db, comment_id, comment_in, user_id=current_user.id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found or not authorized")
    return comment


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    card_id: uuid.UUID,
    comment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    success = crud_comment.delete_comment(db, comment_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Comment not found or not authorized")
    return None