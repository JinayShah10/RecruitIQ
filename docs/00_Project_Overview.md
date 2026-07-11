# Project Overview

RecruitIQ is an AI-powered Applicant Tracking System (ATS) designed to streamline the early stages of the recruitment lifecycle. The system provides recruiters with intelligent decision support during the resume screening phase and offers candidates an intuitive application portal. The product is intentionally designed to solve one specific problem exceptionally well: reducing the manual overhead of resume screening while enhancing evaluation consistency.

The project does not attempt to serve as a complete Human Resource Management System (HRMS). Features such as employee onboarding, payroll processing, performance management, and shift scheduling are outside the project boundary. By keeping the platform focused, RecruitIQ delivers a highly optimized tool for small and medium-sized organizations that manage hiring pipelines without the support of dedicated talent acquisition suites.

---

## Vision Statement

RecruitIQ aims to reduce the time recruiters spend manually screening resumes while improving consistency in candidate evaluation. Candidates experience a simple and intuitive application process where they can create an account, maintain their profile, apply for jobs, upload resumes, and monitor application status. The product demonstrates production-quality software engineering, AI engineering, and product design.

---

## Problem Statement

The initial stages of resume screening are inefficient and error-prone. Recruiters spend an average of six to eight seconds performing a manual review of each resume. This brevity leads to inconsistent evaluations, unconscious bias, and qualified candidates being overlooked. When a single job posting attracts hundreds of applications, the screening process becomes a major pipeline bottleneck.

Traditional Applicant Tracking Systems rely on rigid keyword matching to filter resumes. This approach fails to understand context, synonyms, or transferable skills, resulting in high rates of false negatives where strong candidates are discarded simply because their resume text does not match the exact keywords of the job description.

Furthermore, small and medium organizations often lack the budget or administrative capacity to deploy enterprise-grade ATS solutions. These organizations rely on fragmented workflows consisting of email inboxes, spreadsheets, and shared folders, creating disorganized pipelines and an opaque experience for candidates who receive no status updates on their applications.

---

## Proposed Solution

RecruitIQ introduces a structured, two-sided workflow that coordinates recruiter evaluation and candidate application through an automated processing pipeline.

For candidates, the platform offers a streamlined portal to register, build a profile, browse jobs, and submit applications. Resumes are uploaded exclusively during the application step, reducing redundant data entry.

For recruiters, the platform provides a job creation dashboard and an applicant review workspace. When a candidate submits a resume, the system automatically parses the document, extracts structured information, and evaluates it against the job description. The AI generates:
- An overall matching score.
- A comparison of matching and missing skills.
- Categorized strengths and weaknesses.
- An executive summary and recommendation.

The AI system is designed purely as an advisory tool. Recruiters review these generated insights alongside the original document to make informed decisions. The AI does not modify applicant status or make automated hiring determinations; recruiters retain full ownership of the final candidate selection.

---

## Target Users

The platform serves two independent user groups with separate login pathways and databases:
- **Recruiters:** Hiring managers and HR personnel at small-to-medium enterprises. They require a centralized system to post jobs, write job descriptions, and evaluate candidates without complex configuration.
- **Candidates:** Job seekers applying for open positions. They require a simple application process that respects their time and provides real-time visibility into their application's status.

---

## Scope of the MVP

### In-Scope Functionality
- Secure registration and authentication for candidates and recruiters using independent user models.
- Recruiter workflow: Job listing creation, updating, deletion, and AI-assisted job description generation.
- Candidate workflow: Job browsing, profile management, and resume upload during job application.
- AI pipeline: Resume parsing, structured JSON data extraction, resume-to-job matching, and candidate evaluation summaries.
- Application status tracking for candidates and recruiters.

### Out-of-Scope (Deferred to Future Roadmap)
- Admin Panel for system-wide configuration.
- System notifications and direct candidate-recruiter messaging.
- Interview scheduling, email automation, and calendar integrations.
- Saved jobs, resume builders, and analytics dashboards.
- Multi-company registration and third-party ATS integrations.

---

## Success Criteria

- **Time-to-Shortlist Reduction:** A measurable decrease in the time required for a recruiter to identify qualified candidates from a newly received batch of resumes.
- **Evaluation Consistency:** Standardized screening parameters applied uniformly across all candidates for a specific job posting.
- **User Task Completion:** Candidates successfully submitting applications and tracking status, and recruiters publishing listings and reviewing AI analyses without system intervention.
- **Reliable AI Pipeline Execution:** Seamless translation of unstructured resumes into structured, parsed JSON payloads saved directly to the database.
