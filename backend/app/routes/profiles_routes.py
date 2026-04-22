from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.db import get_db
from app.models.profiles import Profile
import uuid

router = APIRouter()

class ProfileSchema(BaseModel):
    student_id: uuid.UUID
    first_name: str
    last_name: str
    rollno: str
    branch: str
    department: str
    sem: int
    pass_year: int
    email: str
    google_drive_link: Optional[str] = None

    class Config:
        from_attributes = True

@router.get("/profile/{student_id}", response_model=ProfileSchema)
async def get_profile(student_id: uuid.UUID, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.student_id == student_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.post("/profile", response_model=ProfileSchema)
async def create_or_update_profile(profile_data: ProfileSchema, db: Session = Depends(get_db)):
    db_profile = db.query(Profile).filter(Profile.student_id == profile_data.student_id).first()
    
    if db_profile:
        # Update
        for key, value in profile_data.model_dump().items():
            setattr(db_profile, key, value)
    else:
        # Create
        db_profile = Profile(**profile_data.model_dump())
        db.add(db_profile)
    
    try:
        db.commit()
        db.refresh(db_profile)
        return db_profile
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
