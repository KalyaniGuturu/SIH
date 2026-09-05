import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger(__name__)

# Try connecting to configured database; fallback to SQLite if needed
engine = None
db_url = settings.DATABASE_URL or "sqlite:///./airfare_db.db"
connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}

try:
    engine = create_engine(db_url, connect_args=connect_args)
    with engine.connect() as conn:
        pass
    logger.info(f"Connected to database successfully ({db_url}).")
except Exception as e:
    logger.warning(f"Database connection failed ({e}). Falling back to SQLite ('airfare_db.db').")
    engine = create_engine(
        "sqlite:///./airfare_db.db",
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