import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# 🔹 Load .env file
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path, override=True)

# 🔹 Get DB URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")
# 🔹 Create engine
engine = create_engine(DATABASE_URL)

# 🔹 Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 🔹 Base model
Base = declarative_base()


# 🔹 Dependency (FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()