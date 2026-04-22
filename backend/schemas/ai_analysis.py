from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class AIAnalysisCreate(BaseModel):
    submission_id: UUID | None = None
    student_id: UUID | None = None
    ai_score: float
    risk_level: str


class AIAnalysisResponse(BaseModel):
    id: UUID
    submission_id: UUID | None
    student_id: UUID | None
    ai_score: float
    risk_level: str
    created_at: datetime

    class Config:
        from_attributes = True