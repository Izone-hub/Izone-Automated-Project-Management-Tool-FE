import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
from sqlalchemy.dialects.postgresql import UUID


class Comment(Base):
    __tablename__ = "comments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Now using the real card_id column added via fix_db_schema.py
    card_id = Column(UUID(as_uuid=True), ForeignKey("cards.id", ondelete="CASCADE"), nullable=True) # Exists now.
    task_id = Column(UUID(as_uuid=True), ForeignKey("tasks.id"), nullable=True) # Exists from before, now nullable.
    content = Column(Text, nullable=False)
    # Allow mapping to exist even if we don't have a user ID (for public comments)
    # Note: DB might still enforce NOT NULL, in which case we need a dummy ID.
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    card = relationship("Card", back_populates="comments")
    author = relationship("User", foreign_keys=[author_id])
