from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.db import Base


class AIAnalysis(Base):
    __tablename__ = "ai_analysis"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("profiles.student_id"), nullable=True)
    ai_score = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)
    submission_id = Column(UUID(as_uuid=True), ForeignKey("submissions.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())