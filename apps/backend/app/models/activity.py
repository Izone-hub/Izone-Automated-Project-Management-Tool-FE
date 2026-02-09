import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
from sqlalchemy.dialects.postgresql import UUID

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)  # CREATED, UPDATED, DELETED
    entity_type = Column(String, nullable=False) # Ticket, Card, List
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    details = Column(String, nullable=False) # e.g. "Created ticket 'Fix Bug'"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    workspace = relationship("Workspace")
