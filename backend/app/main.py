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




from fastapi.staticfiles import StaticFiles
import os

app.include_router(ai_router, prefix="/api", tags=["AI Detection"])
app.include_router(submission_routes,prefix="/api",tags=["Submission"])
app.include_router(profiles_routes,prefix="/api",tags=["Profile"])

from fastapi.responses import FileResponse

# Serve Static Files (Frontend)
static_dir = os.path.join(os.path.dirname(__file__), "../../static")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # Skip API routes
    if full_path.startswith("api"):
        # This shouldn't happen if routers are included correctly, 
        # but as a safeguard:
        return None 
    
    # Check if the file exists in static directory
    file_path = os.path.join(static_dir, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Fallback to index.html for SPA routing
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    return {"detail": "Not Found"}
