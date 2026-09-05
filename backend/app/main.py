import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from app.database import engine, Base
import app.models.flight  # Ensures FlightPrice model is registered
import app.models.index   # Ensures AirfareIndex model is registered
from app.routes import flights, routes, index, export

# 1. Automatically create all physical database tables if they do not exist
Base.metadata.create_all(bind=engine)

# 2. Instantiate FastAPI App
app = FastAPI(
    title="Automated Airfare Price Index System (MoSPI)",
    description="Real-Time Airfare Price Index for Domestic Flight Routes",
    version="1.0.0"
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(SQLAlchemyError)
async def database_error_handler(request: Request, exc: SQLAlchemyError):
    return JSONResponse(
        status_code=503,
        content={"detail": "Database service is unavailable. Please try again later."},
    )

# 3. Include Routers
app.include_router(flights.router)
app.include_router(routes.router)
app.include_router(index.router)
app.include_router(export.router)

@app.get("/")
def root_health_check():
    return {
        "status": "online",
        "system": "MoSPI Domestic Airfare Price Index Backend",
        "modules": ["ingestion", "index_engine", "export"]
    }
