# app/crud/comment.py
from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.comments.schema import CommentCreate, CommentUpdate
from typing import List
import uuid

def create_comment(db: Session, comment_in: CommentCreate, author_id: uuid.UUID) -> Comment:
    db_comment = Comment(
        content=comment_in.content,
        card_id=comment_in.card_id, 
        author_id=author_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


def get_comment(db: Session, comment_id: uuid.UUID) -> Comment | None:
    return db.query(Comment).filter(Comment.id == comment_id).first()


def get_comments_by_card(db: Session, card_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Comment]:
    return (
        db.query(Comment)
        .filter(Comment.card_id == card_id)
        .order_by(Comment.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_comment(db: Session, comment_id: uuid.UUID, comment_in: CommentUpdate, user_id: uuid.UUID) -> Comment | None:
    db_comment = get_comment(db, comment_id)
    if not db_comment:
        return None

    update_data = comment_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_comment, key, value)

    db.commit()
    db.refresh(db_comment)
    return db_comment


def delete_comment(db: Session, comment_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    db_comment = get_comment(db, comment_id)
    if not db_comment:
        return False

    db.delete(db_comment)
    db.commit()
    return True