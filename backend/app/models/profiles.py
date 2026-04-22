from sqlalchemy import Column, String, DateTime,Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from db import Base


class Profile(Base):
    __tablename__ = "profiles"

    student_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String)
    last_name = Column(String)
    rollno = Column(String, unique=True)
    branch= Column(String)
    department = Column(String)
    sem=Column(Integer)
    pass_year=Column(Integer)
    email = Column(String)
    google_drive_link = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    submissions = relationship("Submission", back_populates="student")