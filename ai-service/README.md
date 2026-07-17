# RecruitIQ AI Service

This is the independent Python FastAPI microservice that serves as the AI and semantic parsing engine for RecruitIQ.

## Purpose

The AI Service handles document parsing, text extraction, Retrieval-Augmented Generation (RAG) context matching, and resume matching evaluations. It operates completely decoupled from the Node.js/Express.js backend, communicating solely via REST APIs and remaining stateless with respect to the MongoDB database.

*Note: In the current phase, the service provides health checking and validation stubs. The complete AI pipeline, RAG similarity search, and Groq reasoning capabilities will be implemented in subsequent phases.*

## Tech Stack

- **Python 3.11**
- **FastAPI** (Application Framework)
- **Pydantic v2** (Data Validation and Settings)
- **Uvicorn** (ASGI Web Server)
- **python-dotenv** (Environment Configuration)

## Project Structure

```
ai-service/
├── app.py            # Complete application entrypoint, models, configuration, and API routes
├── requirements.txt  # Pinned python dependency versions
├── .env.example      # Local configuration variables template
└── README.md         # Setup and user documentation
```

## Setup & Installation

### 1. Prerequisites
- Python 3.11 installed locally.

### 2. Create Virtual Environment
Create and activate a python virtual environment within the `ai-service/` directory:

```bash
# Navigate to directory
cd ai-service

# Create virtual environment
python3 -m venv venv

# Activate on macOS/Linux
source venv/bin/activate

# Activate on Windows
venv\Scripts\activate
```

### 3. Install Dependencies
Install all pinned dependencies inside the activated environment:

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Ensure the following variables are configured correctly for local testing:
- `GROQ_API_KEY`: API key for Groq Cloud.
- `SUPABASE_URL` / `SUPABASE_KEY`: Supabase project configuration to download resume files.
- `PORT`: Port the Uvicorn server will listen on (default: `8001`).

## Running the Server

Start the server using `uvicorn` with auto-reload enabled:

```bash
uvicorn app:app --reload --port 8001
```

By default, the server will be available at `http://localhost:8001`.

## API Documentation

FastAPI automatically generates interactive Swagger API documentation. You can access it at:

- **Swagger UI:** [http://localhost:8001/docs](http://localhost:8001/docs)
- **ReDoc:** [http://localhost:8001/redoc](http://localhost:8001/redoc)
