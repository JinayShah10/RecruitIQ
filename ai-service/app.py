import logging
import os
import time
from datetime import datetime
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, Request, Response, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict

# =====================================================================
# Logging Configuration
# =====================================================================
LOG_FORMAT = "%(asctime)s - %(levelname)s - %(name)s - %(message)s"
logging.basicConfig(
    level=logging.INFO,
    format=LOG_FORMAT,
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("ai_service")

# =====================================================================
# Environment Configuration & Settings Validation
# =====================================================================
class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
    
    # We use optional fields with empty defaults so the service can boot
    # successfully during dev/CI even if a .env file has not been created yet.
    GROQ_API_KEY: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    VECTOR_DB_PATH: str = "chroma_db"
    RAG_DATA_PATH: str = "data/rag_dataset"
    
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    LOG_LEVEL: str = "info"

settings = Settings()

# =====================================================================
# Pydantic Request Models
# =====================================================================
class JobDetails(BaseModel):
    title: str = Field(..., description="Target job position title")
    description: str = Field(..., description="Job role description and details")
    requiredSkills: List[str] = Field(..., description="List of required technical and soft skills")

class AnalysisRequest(BaseModel):
    applicationId: str = Field(..., description="Unique MongoDB ObjectId string of the job application")
    resumeUrl: str = Field(..., description="Supabase storage URL for the candidate resume file")
    job: JobDetails = Field(..., description="Details of the job requisition being applied to")

# =====================================================================
# Pydantic Response Models (MongoDB Compatible Schemas)
# =====================================================================
class ContactInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class WorkExperience(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None

class EducationDetails(BaseModel):
    school: Optional[str] = None
    degree: Optional[str] = None
    fieldOfStudy: Optional[str] = None
    gradYear: Optional[int] = None

class ProjectDetails(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class ParsedResume(BaseModel):
    """
    Extracted candidate profile structure.
    Aligned with Resume collection parsedData schema in 09_AI_Architecture.md.
    """
    contactInfo: ContactInfo
    skills: List[str] = Field(default_factory=list)
    experience: List[WorkExperience] = Field(default_factory=list)
    education: List[EducationDetails] = Field(default_factory=list)
    projects: List[ProjectDetails] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    technicalSkills: List[str] = Field(default_factory=list)
    softSkills: List[str] = Field(default_factory=list)

class AIAnalysisDetails(BaseModel):
    """
    Candidate evaluation parameters.
    Aligned with AIAnalysis collection schema in 09_AI_Architecture.md.
    """
    summary: str
    overallScore: float
    atsScore: float
    technicalScore: float
    experienceScore: float
    educationScore: float
    matchedSkills: List[str] = Field(default_factory=list)
    missingSkills: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    recommendation: str
    improvementSuggestions: List[str] = Field(default_factory=list)

class AnalysisResponse(BaseModel):
    """
    Consolidated response format returning both the structured profile
    and the matching evaluation details.
    """
    parsedResume: ParsedResume
    analysis: AIAnalysisDetails

# =====================================================================
# Lifespan Context Manager (Startup / Shutdown Events)
# =====================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup Handler ---
    logger.info("Initializing RecruitIQ AI Service...")
    
    # Configure custom logging level based on settings
    log_level = settings.LOG_LEVEL.upper()
    logging.getLogger().setLevel(log_level)
    logger.setLevel(log_level)
    logger.info(f"Log level configured to: {log_level}")
    
    # Environment Variables Validation
    missing_vars = []
    if not settings.GROQ_API_KEY:
        missing_vars.append("GROQ_API_KEY")
    if not settings.SUPABASE_URL:
        missing_vars.append("SUPABASE_URL")
    if not settings.SUPABASE_KEY:
        missing_vars.append("SUPABASE_KEY")
        
    if missing_vars:
        logger.warning(
            f"Missing configuration variables in environment: {', '.join(missing_vars)}. "
            "Please configure these inside your local .env file before running full pipeline tasks."
        )
    else:
        logger.info("Environment configurations validated successfully.")

    # Reserve initialization hooks for future RAG components
    logger.info("Reserving initialization hooks for future vector database and embedding engines...")
    # NOTE: We do NOT initialize ChromaDB, generate embeddings, or load guidelines during this phase.
    
    logger.info("RecruitIQ AI Service startup sequence complete.")
    yield
    
    # --- Shutdown Handler ---
    logger.info("Commencing RecruitIQ AI Service graceful shutdown...")
    # TODO: Release database clients, API connections, or model pools in future phases.
    logger.info("RecruitIQ AI Service successfully shut down.")

# =====================================================================
# FastAPI Application Instantiation
# =====================================================================
app = FastAPI(
    title="RecruitIQ AI Service",
    description="Independent Python microservice orchestrating candidate resume parsing and RAG evaluation pipelines.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware Configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================================
# Request / Response Logging Middleware
# =====================================================================
@app.middleware("http")
async def log_requests_middleware(request: Request, call_next):
    start_time = time.time()
    path = request.url.path
    method = request.method
    
    logger.info(f"Incoming Request: {method} {path}")
    
    try:
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        logger.info(
            f"Completed Request: {method} {path} - "
            f"Status {response.status_code} - Processed in {process_time:.2f}ms"
        )
        return response
    except Exception as exc:
        process_time = (time.time() - start_time) * 1000
        logger.error(
            f"Failed Request: {method} {path} - "
            f"Exception raised after {process_time:.2f}ms: {str(exc)}"
        )
        raise exc

# =====================================================================
# Global Centralized Exception Handling
# =====================================================================
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Input validation failure on route {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Unprocessable Entity",
            "message": "Input request failed schema validation constraints.",
            "details": exc.errors()
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTP exception on route {request.url.path} (Status {exc.status_code}): {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP Exception",
            "message": exc.detail
        }
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.critical(
        f"Unhandled System Error encountered on route {request.url.path}: {str(exc)}",
        exc_info=True
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred inside the AI service."
        }
    )

# =====================================================================
# API Endpoints
# =====================================================================
@app.get("/", tags=["Metadata"])
async def read_root():
    """
    Metadata root index returning basic microservice parameters.
    """
    return {
        "service": "RecruitIQ AI Service",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health", tags=["Utility"])
async def health_check():
    """
    Health check diagnostic interface.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "service": "RecruitIQ AI Service",
        "version": "1.0.0"
    }

@app.post("/analyze", status_code=status.HTTP_501_NOT_IMPLEMENTED, response_model=None, tags=["Analysis"])
async def analyze_resume(payload: AnalysisRequest):
    """
    Resume analysis trigger stub endpoint. Validates input payloads and returns 501.
    """
    logger.info(
        f"Received Analysis Trigger for Application ID: {payload.applicationId} - "
        f"Resume URL: {payload.resumeUrl}"
    )
    
    # The AI pipeline implementation is reserved for future implementation phases.
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="AI pipeline will be implemented in subsequent phases."
    )
