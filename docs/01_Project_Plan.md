# Project Plan

This document describes how RecruitIQ will be developed. It covers the development methodology, engineering principles, project phases, coding standards, documentation strategy, version control workflow, risk assessment, and the criteria used to determine when work is complete.

## Development Methodology

RecruitIQ follows an iterative development approach organized into sequential phases. Each phase has a defined scope, produces deliverable artifacts, and must be completed before the next phase begins. This is not a waterfall process in the traditional sense — iteration within phases is expected — but the phases themselves are sequential because each builds on the outputs of the previous one.

The reason for sequential phases rather than a purely agile sprint model is that RecruitIQ is a greenfield project with a fixed MVP scope. The product requirements, technology stack, and architecture are defined upfront. There is no ambiguity about what needs to be built. The work benefits from structured progression through documentation, architecture, implementation, and deployment rather than from discovery-oriented sprints.

Within each phase, work is broken into discrete tasks that are implemented, tested, and committed independently. Each task should represent a coherent unit of functionality that can be reviewed and validated in isolation.

## Engineering Principles

The following principles guide all technical decisions throughout the project.

**Solve one problem well.** Every feature must directly support the core workflow of posting jobs, receiving applications, and evaluating candidates with AI assistance. Features that do not serve this workflow are excluded regardless of their individual merit.

**AI assists, humans decide.** The AI layer produces structured insights and recommendations. It never makes autonomous decisions about candidates. Every status change, shortlisting action, and rejection is performed by a recruiter.

**Separation of concerns.** Frontend and backend are independent applications with no shared code. React handles the user interface. Express handles business logic, data access, and AI integration. The two communicate exclusively through a defined API.

**Type safety throughout.** Both the frontend and backend use TypeScript in strict mode. Type safety reduces runtime errors, improves developer experience through tooling support, and serves as living documentation of data structures and function contracts.

**Simplicity over cleverness.** Prefer straightforward implementations over abstractions that add complexity without proportional benefit. The codebase should be readable by a developer encountering it for the first time.

**Convention over configuration.** Follow established patterns in the React and Express ecosystems rather than inventing custom approaches. Use community-standard project structures, naming conventions, and tooling.

## Project Phases

### Phase 1 — Planning and Documentation

Define the product scope, requirements, user research, and product specification. Produce all pre-development documentation. The goal of this phase is to establish a complete understanding of what will be built and why before any code is written.

Deliverables: Project Overview, Project Plan, Requirements, User Research, Product Specification.

### Phase 2 — Architecture and Design

Design the system architecture, database schema, API contracts, AI pipeline, frontend component structure, and backend service organization. Produce architecture documentation and the UI/UX design system.

Deliverables: System Architecture, Database Design, API Design, AI Architecture, Frontend Architecture, Backend Architecture, UI/UX Design.

### Phase 3 — Environment Setup

Initialize the monorepo structure, configure both applications, set up development tooling (linting, formatting, TypeScript configuration), establish the database connection, configure cloud storage, and verify that the local development environment runs end-to-end.

Deliverables: Working development environment with both applications running locally.

### Phase 4 — Backend Implementation

Build the Express application in a bottom-up sequence: database models first, then services, then controllers, then routes. Implement authentication, file upload handling, and all API endpoints. Each endpoint should be manually testable before moving to the next.

Deliverables: Complete backend API with all endpoints functional and tested.

### Phase 5 — AI Implementation

Implement the AI pipeline: resume parsing with LangChain, structured data extraction, resume-to-job matching, candidate scoring, recommendation generation, and AI-assisted job description generation. The AI module integrates with the backend and is invoked through backend services, not directly from the frontend.

Deliverables: Working AI pipeline integrated with backend services.

### Phase 6 — Frontend Implementation

Build the React application: authentication flows, candidate-facing pages (job browsing, application submission, status tracking), recruiter-facing pages (job management, application review, AI analysis display), and shared components. Connect all pages to backend APIs.

Deliverables: Complete frontend application with all pages functional and connected to the backend.

### Phase 7 — Integration and Testing

Verify end-to-end workflows for both user roles. Test the complete candidate journey from registration through application tracking. Test the complete recruiter journey from job creation through candidate evaluation. Fix integration issues, handle edge cases, and verify responsive behavior.

Deliverables: Fully integrated application with both workflows verified.

### Phase 8 — Deployment

Deploy the frontend to Vercel, the backend to Render, the database on MongoDB Atlas, and file storage on Supabase Storage. Configure environment variables, verify production connectivity, and validate that the deployed application functions identically to the local environment.

Deliverables: Production deployment accessible via public URLs.

### Phase 9 — Documentation Completion

Complete all remaining documentation including the deployment guide, testing strategy, development roadmap, and future roadmap. Review all existing documentation for accuracy against the final implementation.

Deliverables: Complete documentation suite.

## Coding Standards

### TypeScript

Both applications use TypeScript with strict mode enabled. This means `strict: true` in `tsconfig.json`, which activates `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, and related flags. The rationale for strict mode is that it catches a class of bugs at compile time that would otherwise surface as runtime errors, and it forces explicit handling of nullable values throughout the codebase.

Avoid using `any` as an escape hatch. If a type cannot be determined, use `unknown` and narrow it explicitly. The exception is third-party library interop where type definitions are incomplete, but these cases should be isolated and documented.

### Naming Conventions

Files and directories use kebab-case. React components use PascalCase for both the component name and the filename. TypeScript interfaces and types use PascalCase. Variables and functions use camelCase. Constants use UPPER_SNAKE_CASE. Database collection names use lowercase plural nouns.

### Code Organization

Each file should have a single responsibility. A component file contains one component. A service file contains functions related to one domain. A controller file handles routes for one resource. Utility functions are grouped by domain rather than dumped into a single utilities file.

### Comments

Write comments to explain why something is done, not what is being done. The code itself should communicate what it does through clear naming and structure. Comments are appropriate for non-obvious business logic, workarounds for known issues, and explanations of architectural decisions that would not be apparent from the code alone.

### Error Handling

The backend uses a centralized error handling middleware. Controllers do not handle errors inline — they throw typed errors that the middleware catches and translates into appropriate HTTP responses. The frontend uses consistent error handling through its API service layer and displays user-friendly error messages.

## Documentation Strategy

Documentation is organized into separate files by engineering phase rather than by feature. This structure exists because the documents serve different audiences and are relevant at different stages of the project lifecycle. The Project Overview is read before development begins. The API Design is referenced during implementation. The Deployment Guide is used during and after release.

Each document has one clearly defined responsibility. Content is not duplicated across documents. When one document refers to a concept defined in another, it references the other document rather than repeating the definition.

Documentation is written progressively. Each document is completed when the corresponding phase of work is done, not before. Placeholder documents exist in the repository to establish the planned structure, but they are populated with real content only when that content is known and validated.

## Version Control Workflow

The repository uses Git with a branching strategy based on a stable main branch.

**main** is the primary branch. It always contains working, deployable code. Direct commits to main are acceptable during solo development but should represent complete, tested units of work.

**Feature branches** are used for work that spans multiple commits or requires iteration before it is ready to merge. Feature branches are named using the pattern `feature/description`, `fix/description`, or `docs/description`.

**Commits** follow the Conventional Commits specification: `type(scope): description`. Types include `feat`, `fix`, `docs`, `refactor`, `style`, `test`, and `chore`. The scope identifies the affected area (e.g., `auth`, `jobs`, `ai`). The description is written in imperative mood and explains what the commit does, not what the developer did.

Examples of well-formed commit messages:

- `feat(auth): implement candidate registration endpoint`
- `fix(ai): handle empty skills array in resume parsing`
- `docs(architecture): add system architecture documentation`
- `refactor(jobs): extract job validation into dedicated module`

## Risk Assessment

### Technical Risks

**AI output quality.** The usefulness of the product depends on the AI producing analysis that recruiters find genuinely helpful. If matching scores are inconsistent or summaries are generic, the core value proposition fails. This risk is mitigated by using well-structured prompts, validating AI output against manual assessment during development, and designing the prompt engineering to produce specific, actionable insights rather than vague summaries.

**Resume parsing variability.** Resumes vary enormously in format, structure, and content quality. The parsing pipeline needs to handle this variability gracefully. Resumes that cannot be parsed should fail cleanly with informative feedback rather than producing garbage output. This risk is mitigated by testing against a diverse set of resume formats during AI implementation.

**Third-party service dependency.** The AI pipeline depends on Groq for inference and Supabase for file storage. If either service experiences downtime or changes its API, the affected functionality becomes unavailable. This risk is mitigated by designing the application so that core functionality (job posting, application submission, manual review) continues to work even when AI services are degraded.

### Product Risks

**Scope creep.** The MVP has a defined feature set. The temptation to add features during implementation — notifications, messaging, analytics — is significant. Every addition delays delivery and increases complexity. This risk is mitigated by treating the out-of-scope list as a hard boundary and deferring enhancement discussions to the future roadmap.

**Overengineering.** Building abstractions, configurability, or flexibility that the MVP does not require wastes development time and adds maintenance burden. This risk is mitigated by applying the engineering principle of simplicity over cleverness and building only what is needed for the current phase.

## Timeline

The project does not operate under a fixed deadline. Phases are completed sequentially, and each phase takes the time it requires to produce quality output. Rushing a phase to meet an arbitrary date produces technical debt that costs more to resolve later than the time saved by rushing.

That said, reasonable expectations for phase duration are:

- Planning and Documentation: completed before any code is written
- Architecture and Design: completed before environment setup
- Environment Setup: should be a short, focused task
- Backend Implementation: the largest single phase of development work
- AI Implementation: dependent on iteration and prompt engineering
- Frontend Implementation: comparable in scope to backend implementation
- Integration and Testing: proportional to the number of integration points
- Deployment: should be a short, focused task once the application is ready
- Documentation Completion: done alongside and after implementation

## Definition of Done

A task is considered done when it meets all of the following criteria.

The code compiles without TypeScript errors. The implementation handles expected edge cases. Error states are handled gracefully with appropriate user feedback. The feature works correctly in the browser for its intended user role. The code follows the established coding standards and naming conventions. Related documentation is updated if the task affects documented behavior or architecture. The commit message follows the Conventional Commits format and accurately describes the change.

For AI-related tasks, an additional criterion applies: the AI output has been manually reviewed against at least a small set of test inputs to verify that it produces structured, relevant, and non-generic results.

A phase is considered done when all tasks in the phase meet the task-level definition of done, the phase deliverables are complete, and the output has been verified against the phase objectives.
