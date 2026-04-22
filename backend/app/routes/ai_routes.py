from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from db import get_db
from ai_detector.ai_detector import app as ai_app, langfuse_handler
from services.ai_analysis_service import save_ai_score

router = APIRouter()


@router.post("/analyze-ai")
async def analyze_ai(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        
        pdf_bytes = await file.read()

       
        result = ai_app.invoke(
            {"pdf_bytes": pdf_bytes},
            config={"callbacks": [langfuse_handler]}
        )

       
        record = save_ai_score(
            db=db,
            submission_id=None,   # later connect
            student_id=None,
            score=result["final_score"]
        )

        # 🔹 4. Return response
        return {
            "message": "AI analysis completed",
            "score": record.ai_score,
            "risk_level": record.risk_level
        }

    except Exception as e:
        return {
            "error": str(e)
        }