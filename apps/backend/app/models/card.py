import uuid
import enum
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Text,
    Enum,
    Integer
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.base import Base


class Priority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"


class Card(Base):
    __tablename__ = "cards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    list_id = Column(
        UUID(as_uuid=True),
        ForeignKey("lists.id", ondelete="CASCADE"),
        nullable=False
    )

    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)

    due_date = Column(DateTime(timezone=True), nullable=True)
    priority = Column(Enum(Priority), default=Priority.medium)

    created_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True
    )

    position = Column(Integer, default=0)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    comments = relationship("Comment", back_populates="card", cascade="all, delete-orphan")
    attachments = relationship("Attachment", cascade="all, delete-orphan")
