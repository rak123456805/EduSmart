from sqlalchemy.orm import Session
from app.models.ai_analysis import AIAnalysis

def save_ai_score(db: Session, submission_id, student_id, score):
    if score < 40:
        level = "LOW"
    elif score < 70:
        level = "MEDIUM"
    else:
        level = "HIGH"

    record = AIAnalysis(
        submission_id=submission_id,
        student_id=student_id,
        ai_score=score,
        risk_level=level
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record