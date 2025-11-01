
"""
This file registers all your SQLAlchemy models so that
Base.metadata.create_all() in main.py can create all tables.
"""


from app.db.session import Base


from app.models.user import User
