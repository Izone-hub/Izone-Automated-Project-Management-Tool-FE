import uuid
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base

class List(Base):
    __tablename__ = "lists"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False
    )

    title = Column(String, nullable=False)
    position = Column(Integer, nullable=False)
    
    from sqlalchemy.orm import relationship
    cards = relationship("Card", back_populates="list", cascade="all, delete-orphan")
