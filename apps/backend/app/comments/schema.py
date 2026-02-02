# app/schemas/comment.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, UUID4, computed_field
import uuid

# Base schema with common fields
class CommentBase(BaseModel):
    content: str
    card_id: UUID4

# Schema for creating a comment
class CommentCreate(CommentBase):
    pass

# Schema for updating a comment (content can be optional)
class CommentUpdate(BaseModel):
    content: Optional[str] = None

# Full response schema (returned to client)
class CommentResponse(CommentBase):
    id: UUID4
    author_id: Optional[UUID4] = None  # Optional to support legacy comments without author
    author_name: Optional[str] = None  # Will be populated from the author relationship
    author_email: Optional[str] = None  # Will be populated from the author relationship
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)  # replaces orm_mode = True in Pydantic v2

# Optional: Include related task/user if you want to return them
class CommentWithRelations(CommentResponse):
    card: "CardResponse"  # Forward reference or import if in same project
    author: "UserResponse"

    model_config = ConfigDict(from_attributes=True)