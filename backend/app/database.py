import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger(__name__)

# Resolve absolute path to airfare_db.db in backend root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_SQLITE_PATH = os.path.join(BASE_DIR, "airfare_db.db")
SQLITE_FALLBACK_URL = f"sqlite:///{DEFAULT_SQLITE_PATH.replace(os.sep, '/')}"

# Try connecting to configured database; fallback to SQLite if needed
engine = None
db_url = settings.DATABASE_URL or SQLITE_FALLBACK_URL
connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}

try:
    engine = create_engine(db_url, connect_args=connect_args)
    with engine.connect() as conn:
        pass
    logger.info(f"Connected to database successfully ({db_url}).")
except Exception as e:
    logger.warning(f"Database connection failed ({e}). Falling back to SQLite ('{DEFAULT_SQLITE_PATH}').")
    engine = create_engine(
        SQLITE_FALLBACK_URL,
        connect_args={"check_same_thread": False}
    )


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """
    FastAPI dependency: opens a database session for each request,
    and guarantees it closes when the request is done.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()