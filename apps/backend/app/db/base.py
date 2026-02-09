
"""
This file registers all your SQLAlchemy models so that
Base.metadata.create_all() in main.py can create all tables.
"""


from app.db.session import Base


from app.models.user import User
from app.models.workspace import Workspace
from app.models.workspace_member import WorkspaceMember
from app.models.project import Project
from app.models.task import Task
from app.models.list import List
from app.models.card import Card
from app.models.comment import Comment
from app.models.attachment import Attachment
from app.models.time_entry import TimeEntry
