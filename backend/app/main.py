from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.ai_routes import router as ai_router
from app.routes.submission_routes import router as submission_routes
from app.routes.profiles_routes import router as profiles_routes
from app.db import engine, Base



app = FastAPI()

# Origins for local and production
allow_origin_regex = r"https://.*\.vercel\.app|http://localhost:5173"

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=allow_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


from fastapi.staticfiles import StaticFiles
import os

app.include_router(ai_router, prefix="/api", tags=["AI Detection"])
app.include_router(submission_routes,prefix="/api",tags=["Submission"])
app.include_router(profiles_routes,prefix="/api",tags=["Profile"])

# Serve Static Files (Frontend)
static_dir = os.path.join(os.path.dirname(__file__), "../../static")
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
