# Requirements

This document defines what RecruitIQ must do. It covers functional requirements organized by user role and system capability, non-functional requirements, business rules, constraints, validation requirements, security requirements, and acceptance criteria for the MVP.

The requirements described here are derived from the problem statement and product objectives defined in the Project Overview. They represent the contract between the product specification and the implementation. If a behavior is not described in this document, it is not required for the MVP.

## User Roles and Permissions

RecruitIQ has two user roles: Candidate and Recruiter. These roles are completely independent. They do not share a user model, a registration flow, or an authentication context. A person cannot hold both roles with a single account.

### Candidate Permissions

A candidate can register a new account, log in, and manage their own profile. A candidate can browse all published job listings and view the full details of any job. A candidate can apply to a job by submitting an application that includes a resume upload. A candidate can view the status of their own applications. A candidate cannot view other candidates' applications, access recruiter functionality, or modify any data that does not belong to their own account.

### Recruiter Permissions

A recruiter can register a new account, log in, and complete a company profile. A recruiter can create, update, and delete job postings associated with their account. A recruiter can generate job descriptions using AI assistance. A recruiter can view all applications submitted to their job postings. A recruiter can view AI-generated analysis for each application. A recruiter can update the status of any application to their jobs, including shortlisting and rejecting candidates. A recruiter cannot view or modify jobs or applications belonging to other recruiters. A recruiter cannot access candidate account details beyond what is submitted in an application.

## Functional Requirements

### Authentication

**REQ-AUTH-01.** The system must allow candidates to register with an email address and password.

**REQ-AUTH-02.** The system must allow recruiters to register with an email address and password.

**REQ-AUTH-03.** Candidate registration and recruiter registration must be separate flows that create records in separate data stores.

**REQ-AUTH-04.** The system must authenticate users via email and password and return a JSON Web Token upon successful authentication.

**REQ-AUTH-05.** The JWT must encode the user's identity and role. All subsequent API requests must include this token for authorization.

**REQ-AUTH-06.** Protected routes must reject requests without a valid token and return an appropriate HTTP error.

**REQ-AUTH-07.** Passwords must be hashed before storage. Plaintext passwords must never be persisted or logged.

### Candidate Profile

**REQ-PROF-01.** After registration, a candidate must be able to complete their profile with personal information including name, contact details, skills, experience, and education.

**REQ-PROF-02.** The candidate profile must be editable. Candidates can update their profile information at any time.

**REQ-PROF-03.** Profile completion is separate from the application process. A candidate's profile exists independently of any job application.

### Job Management

**REQ-JOB-01.** A recruiter must be able to create a new job posting with fields including title, description, requirements, location, employment type, experience level, and salary range.

**REQ-JOB-02.** A recruiter must be able to update any job posting they own.

**REQ-JOB-03.** A recruiter must be able to delete any job posting they own. Deletion of a job should handle associated applications appropriately.

**REQ-JOB-04.** A recruiter must be able to view a list of all jobs they have created.

**REQ-JOB-05.** The system must allow recruiters to generate a job description using AI by providing basic inputs such as job title, key responsibilities, and required qualifications. The AI output should be editable by the recruiter before saving.

**REQ-JOB-06.** All published jobs must be visible to candidates in the job browsing interface.

**REQ-JOB-07.** Candidates must be able to view the full details of any published job.

### Application Process

**REQ-APP-01.** A candidate must be able to apply to a published job posting.

**REQ-APP-02.** The application process must require the candidate to upload a resume. Resume upload occurs only during the application process, not as a standalone action.

**REQ-APP-03.** The system must accept resumes in PDF and DOCX formats.

**REQ-APP-04.** The uploaded resume must be stored in cloud storage (Supabase Storage) and the storage URL must be persisted with the application record.

**REQ-APP-05.** A candidate must not be able to apply to the same job more than once.

**REQ-APP-06.** After submission, the application must have a default status indicating it has been received.

**REQ-APP-07.** A candidate must be able to view the current status of each of their applications.

**REQ-APP-08.** A recruiter must be able to view all applications submitted to any of their jobs.

**REQ-APP-09.** A recruiter must be able to update the status of an application. Supported statuses include at minimum: received, under review, shortlisted, and rejected.

### AI Analysis

**REQ-AI-01.** When a resume is uploaded as part of an application, the system must parse the resume and extract structured data including personal information, skills, work experience, education, and any other identifiable sections.

**REQ-AI-02.** The extracted structured data must be stored in the database as part of the application record.

**REQ-AI-03.** The system must compare the structured resume data against the job description and generate a matching analysis.

**REQ-AI-04.** The matching analysis must include, at minimum: an overall matching score, a list of matching skills, a list of missing skills, identified strengths, identified weaknesses, a recommendation, and a written summary.

**REQ-AI-05.** The AI analysis must be available to the recruiter when viewing an application.

**REQ-AI-06.** The AI analysis is read-only. Neither the recruiter nor the candidate can edit AI-generated output.

**REQ-AI-07.** If AI analysis fails for any reason (service unavailability, parsing error, malformed input), the application must still be created successfully. The application should exist without AI analysis rather than failing entirely.

### AI Job Description Generation

**REQ-AIJD-01.** Recruiters must be able to request an AI-generated job description by providing basic inputs.

**REQ-AIJD-02.** The generated description must be presented to the recruiter for review and editing before it is saved as part of the job posting.

**REQ-AIJD-03.** The recruiter must be able to accept, modify, or discard the AI-generated description.

## Non-Functional Requirements

### Performance

**REQ-PERF-01.** Standard API responses (non-AI operations) must return within two seconds under normal load.

**REQ-PERF-02.** AI analysis operations (resume parsing, matching, scoring) must complete within a reasonable time window. The exact duration depends on the AI provider's response time, but the system should provide feedback to the user that processing is in progress.

**REQ-PERF-03.** The frontend must load its initial bundle and render the first meaningful content within three seconds on a standard broadband connection.

### Scalability

**REQ-SCALE-01.** The system is designed for small-to-medium scale usage. It must handle concurrent usage by multiple recruiters and candidates without degradation, but it is not required to support enterprise-scale traffic in the MVP.

### Reliability

**REQ-REL-01.** Core functionality (authentication, job management, application submission, manual application review) must function independently of AI service availability. If the AI provider is down, the platform continues to work for all non-AI features.

**REQ-REL-02.** File uploads must be handled reliably. If a storage operation fails, the user must receive clear feedback and the application must not be left in an inconsistent state.

### Usability

**REQ-USE-01.** The application must be responsive and usable on desktop and mobile browsers without a separate mobile application.

**REQ-USE-02.** The interface must be navigable without training or documentation for both user roles. Core workflows (apply to a job, review an application) should be self-evident.

**REQ-USE-03.** Error messages displayed to users must be specific and actionable. Generic messages like "something went wrong" are not acceptable for validation errors or known failure modes.

## Business Rules

**BIZ-01.** A candidate can apply to a job only once. Duplicate applications to the same job are rejected.

**BIZ-02.** Resume upload is mandatory during the application process. An application cannot be submitted without a resume.

**BIZ-03.** Only the recruiter who created a job can view applications to that job and modify application statuses.

**BIZ-04.** AI-generated analysis is informational only. It does not automatically change application status or trigger any automated actions.

**BIZ-05.** Job deletion by a recruiter must not orphan application records in a way that causes errors for candidates checking their application status.

**BIZ-06.** AI-generated job descriptions are suggestions. They must be reviewed and explicitly saved by the recruiter to become part of a job posting.

## Constraints

**CON-01.** The frontend is built with React 19, Vite, and TypeScript. No alternative frontend frameworks.

**CON-02.** The backend is built with Node.js, Express.js, and TypeScript. No alternative backend frameworks.

**CON-03.** The database is MongoDB Atlas accessed through Mongoose. No alternative databases or ORMs.

**CON-04.** AI functionality uses LangChain with Groq as the inference provider. No alternative AI frameworks or providers.

**CON-05.** File storage uses Supabase Storage. No alternative storage providers.

**CON-06.** Authentication uses JWT with bcrypt for password hashing. No alternative authentication mechanisms (OAuth, SSO, etc.) in the MVP.

**CON-07.** The frontend is deployed to Vercel. The backend is deployed to Render. These deployment targets are fixed.

**CON-08.** The frontend uses Tailwind CSS with shadcn/ui for the component library. No alternative CSS frameworks or component libraries.

## Validation Requirements

**VAL-01.** Email addresses must be validated for format on both the client and server. The server must reject malformed email addresses regardless of client-side validation.

**VAL-02.** Passwords must meet a minimum length requirement enforced on both the client and server.

**VAL-03.** Required fields on job postings (title, description) must be validated before creation. The server must reject incomplete job postings.

**VAL-04.** Resume file uploads must be validated for file type (PDF, DOCX) and file size. The server must reject files that do not meet the accepted criteria.

**VAL-05.** All user input that is stored or processed must be validated on the server side. Client-side validation improves user experience but is never a substitute for server-side validation.

**VAL-06.** Frontend form validation uses React Hook Form with Zod schemas. Backend validation uses a consistent validation approach applied at the controller or middleware layer.

## Security Requirements

**SEC-01.** All passwords must be hashed using bcrypt before storage. Raw passwords must never exist in the database, application logs, or API responses.

**SEC-02.** Authentication tokens (JWT) must be signed with a secret key stored as an environment variable, never hardcoded in the source.

**SEC-03.** API endpoints that access or modify user-specific data must verify that the authenticated user has permission to perform the requested operation. A candidate must not be able to access another candidate's data. A recruiter must not be able to access another recruiter's jobs or applications.

**SEC-04.** File uploads must be validated on the server side for type and size to prevent malicious file uploads.

**SEC-05.** Environment variables containing secrets (database connection strings, API keys, JWT secrets, storage credentials) must not be committed to version control. The repository must include a `.env.example` file with placeholder values.

**SEC-06.** CORS must be configured to allow requests only from the expected frontend origin in production.

## Acceptance Criteria for MVP

The MVP is considered complete when all of the following are true.

A candidate can register, log in, complete their profile, browse published jobs, view job details, apply to a job with a resume upload, and view their application status.

A recruiter can register, log in, complete their company profile, create a job posting, update a job posting, delete a job posting, view their jobs, generate an AI-assisted job description, view applications to their jobs, view AI-generated analysis for each application, shortlist a candidate, and reject a candidate.

The AI pipeline successfully parses uploaded resumes, extracts structured data, compares the resume against the job description, and produces a matching score, skill analysis, strengths, weaknesses, a recommendation, and a summary.

The application is deployed and accessible via public URLs with the frontend on Vercel and the backend on Render.

Both user workflows function end-to-end without errors under normal usage conditions.
