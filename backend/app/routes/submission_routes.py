from fastapi import APIRouter,File, UploadFile,Depends, Form
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.submission import Submission
from app.services.ai_analysis_service import save_ai_score
from app.ai_detector.ai_detector import app as ai_app
from langfuse.langchain import CallbackHandler

router = APIRouter()

@router.post("/submit")
async def submit_assignment(
    assignment_id: str = Form(...),
    student_id: str = Form(...),
    drive_link: str = Form(...),
    file:UploadFile=File(...),
    db:Session=Depends(get_db)
):
    # Read File
    pdf_bytes=await file.read()

    # create a Submission'
    submission=Submission(
        assignment_id=assignment_id,
        student_id=student_id,
        drive_link=drive_link
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    # Run Ai detection with per-user tracking
    user_handler = CallbackHandler()
    result = ai_app.invoke(
        {"pdf_bytes": pdf_bytes},
        config={
            "callbacks": [user_handler],
            "metadata": {"langfuse_user_id": student_id}
        }
    )

    # save Ai result linked to submission

    save_ai_score(
        db=db,
        submission_id=submission.id,
        student_id=student_id,
        score=result["final_score"]
    )

    return {
        "submission_id":str(submission.id),
        "ai_score":result["final_score"]
    }

    
