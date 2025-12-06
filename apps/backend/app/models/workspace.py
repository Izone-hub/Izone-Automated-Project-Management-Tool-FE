import uuid
import enum
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
from sqlalchemy.dialects.postgresql import UUID

class WorkspaceRole(str, enum.Enum):
    owner = "owner"
    admin = "admin"
    member = "member"
    guest = "guest"

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship(
        "User",
        back_populates="workspaces",
        foreign_keys=[owner_id]
    )

    creator = relationship(
        "User",
        back_populates="created_workspaces",
        foreign_keys=[created_by]
    )

    members = relationship(
        "WorkspaceMember",
        back_populates="workspace",
        cascade="all, delete-orphan"
    )

    projects = relationship(
        "Project",
        back_populates="workspace",
        cascade="all, delete-orphan"
    )


# ------------------- WorkspaceMember -------------------
class WorkspaceMember(Base):
    __tablename__ = "workspace_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role = Column(Enum(WorkspaceRole), default=WorkspaceRole.member)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    workspace = relationship(
        "Workspace",
        back_populates="members"
    )

    user = relationship(
        "User",
        back_populates="workspace_memberships"
    )