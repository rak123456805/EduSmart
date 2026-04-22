from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.ai_routes import router as ai_router
from routes.submission_routes import router as submission_routes
from routes.profiles_routes import router as profiles_routes
from db import engine, Base



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


app.include_router(ai_router, prefix="/api", tags=["AI Detection"])
app.include_router(submission_routes,prefix="/api",tags=["Submission"])
app.include_router(profiles_routes,prefix="/api",tags=["Profile"])
