from sqlalchemy import Column,Integer,String,DateTime,TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from db import Base

class Submission(Base):
    __tablename__ = "submissions"
    id=Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assignment_id=Column(UUID(as_uuid=True),nullable=True)
    student_id=Column(UUID(as_uuid=True), ForeignKey("profiles.student_id"), nullable=True)
    drive_link=Column(String,nullable=True)
    status=Column(String,nullable=True)
    created_at=Column(DateTime(timezone=True),server_default=func.now())
    updated_at=Column(DateTime(timezone=True),server_default=func.now())

    student = relationship("Profile", back_populates="submissions")
