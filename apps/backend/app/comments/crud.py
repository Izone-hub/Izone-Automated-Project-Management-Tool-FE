# app/crud/comment.py
from sqlalchemy.orm import Session, joinedload
from app.models.comment import Comment
from app.comments.schema import CommentCreate, CommentUpdate, CommentResponse
from typing import List
import uuid

def _comment_to_response(comment: Comment) -> dict:
    """Convert a Comment model to a dict with author info populated."""
    return {
        "id": comment.id,
        "content": comment.content,
        "card_id": comment.card_id,
        "author_id": comment.author_id,
        "author_name": comment.author.full_name if comment.author else None,
        "author_email": comment.author.email if comment.author else None,
        "created_at": comment.created_at,
    }

def create_comment(db: Session, comment_in: CommentCreate, author_id: uuid.UUID) -> dict:
    """Create a comment with the authenticated user as author."""
    db_comment = Comment(
        content=comment_in.content,
        card_id=comment_in.card_id, 
        author_id=author_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    
    # Eagerly load the author relationship
    db_comment = db.query(Comment).options(joinedload(Comment.author)).filter(Comment.id == db_comment.id).first()
    
    return _comment_to_response(db_comment)


def get_comment(db: Session, comment_id: uuid.UUID) -> Comment | None:
    return db.query(Comment).options(joinedload(Comment.author)).filter(Comment.id == comment_id).first()


def get_comments_by_card(db: Session, card_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[dict]:
    comments = (
        db.query(Comment)
        .options(joinedload(Comment.author))
        .filter(Comment.card_id == card_id)
        .order_by(Comment.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [_comment_to_response(c) for c in comments]


def update_comment(db: Session, comment_id: uuid.UUID, comment_in: CommentUpdate, user_id: uuid.UUID) -> dict | None:
    """Update a comment - only the original author can update."""
    db_comment = get_comment(db, comment_id)
    if not db_comment or db_comment.author_id != user_id:
        return None

    update_data = comment_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_comment, key, value)

    db.commit()
    db.refresh(db_comment)
    return _comment_to_response(db_comment)


def delete_comment(db: Session, comment_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    """Delete a comment - only the original author can delete."""
    db_comment = get_comment(db, comment_id)
    if not db_comment or db_comment.author_id != user_id:
        return False

    db.delete(db_comment)
    db.commit()
    return True