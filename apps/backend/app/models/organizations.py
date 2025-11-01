from sqlalchemy import Column,  Integer,String, ForeignKey,Boolean, DateTime, func
from app.db.session import Base
from sqlalchemy.orm import relationship

import uuid

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="organizations")
    projects = relationship("Project", back_populates="organization", cascade="all, delete")
