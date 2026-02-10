import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
from sqlalchemy.dialects.postgresql import UUID


class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_path = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    card_id = Column(UUID(as_uuid=True), ForeignKey("cards.id"), nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())


