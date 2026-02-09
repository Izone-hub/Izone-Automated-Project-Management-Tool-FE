import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Workspaces where this user is the owner
    workspaces = relationship(
        "Workspace",
        back_populates="owner",
        lazy="joined",
        foreign_keys="[Workspace.owner_id]"
    )

    # Workspaces this user created
    created_workspaces = relationship(
        "Workspace",
        back_populates="creator",
        lazy="joined",
        foreign_keys="[Workspace.created_by]"
    )

    # Membership in workspaces
    workspace_memberships = relationship(
        "WorkspaceMember",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
