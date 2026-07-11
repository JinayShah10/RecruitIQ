# User Research

This document describes the research that informed RecruitIQ's product decisions. It covers the recruitment landscape, recruiter workflows, candidate workflows, pain points on both sides, observations about existing tools, user personas, user journeys, and the specific ways research findings shaped the product.

The research summarized here was conducted through analysis of publicly available information about recruitment processes, ATS market dynamics, recruiter productivity studies, and candidate experience surveys. It is not based on original user interviews conducted for this project. The findings are consistent with widely reported patterns in the talent acquisition industry and are sufficient to justify the product decisions described in the Product Specification.

## The Recruitment Landscape

Recruitment at small and medium-sized organizations operates differently from enterprise hiring. Large companies invest in dedicated talent acquisition teams, established ATS platforms, and structured hiring processes. Smaller organizations rarely have these resources. Hiring is often managed by the same people who manage teams, projects, and operations. The recruiter role is frequently held by a founder, department lead, or office manager who has many responsibilities beyond hiring.

This distinction matters because it defines the target user's relationship with tooling. Enterprise recruiters learn complex systems because hiring is their full-time job. Recruiters at smaller organizations adopt tools only if they deliver immediate value with minimal setup and learning cost. A tool that requires configuration, training, or process redesign will not be adopted, regardless of how powerful it is.

The ATS market reflects this divide. Platforms like Greenhouse, Lever, and Workday serve the enterprise segment with comprehensive features, integrations, and customization. At the other end, many small organizations use no dedicated tool at all — they manage applications through email, shared drives, and spreadsheets. The middle ground — a focused, intelligent tool that is simple enough for a non-specialist to use and smart enough to meaningfully reduce screening effort — is underserved.

## Recruiter Workflow Analysis

The typical recruiter workflow at a small-to-medium organization follows a predictable pattern, and the inefficiencies concentrate at specific stages.

The process begins when a hiring need is identified. The recruiter writes a job description, often from scratch or by modifying a previous posting. This step is time-consuming because writing a clear, comprehensive job description requires articulating requirements precisely enough to attract qualified candidates without being so specific that the posting discourages strong applicants who do not match every criterion.

Once the job is posted, applications begin arriving. At small organizations, applications typically arrive through the company website, email, or job boards. They are collected in whatever system the recruiter uses — usually email or a shared folder. There is no standardized intake process, which means applications in different formats, from different channels, with different levels of completeness, all require individual handling.

The screening phase is where the recruiter opens each resume and evaluates the candidate's fit. This evaluation is almost entirely mental. The recruiter reads the resume, compares it against their internal understanding of the job requirements, and makes a decision. There is no scoring rubric, no structured comparison, and no documentation of why a candidate was advanced or rejected. The decision is made in seconds and exists only in the recruiter's judgment.

After screening, the recruiter creates a shortlist of candidates to contact for interviews. This shortlist is often informal — a set of flagged emails or a handwritten list. There is no mechanism to revisit rejected candidates, compare candidates against each other, or audit the screening process after the fact.

The key observation is that the screening phase is simultaneously the most time-intensive step and the step with the least tooling support. Every other phase of hiring has established tooling — job boards for posting, calendars for scheduling, video platforms for interviews. Screening is still done manually, resume by resume.

## Candidate Workflow Analysis

Candidates experience the hiring process from the opposite side, and their frustrations are different but equally significant.

A candidate searching for employment typically applies to multiple positions simultaneously. For each application, they must find the job listing, read the requirements, prepare or update their resume, and submit it through whatever mechanism the employer provides. This process is repeated across dozens of employers, each with different application portals, different required fields, and different submission methods.

The most common candidate frustration is the black hole effect: submitting an application and receiving no response. Many organizations lack the process or tooling to communicate application status to candidates. Candidates do not know whether their resume was received, reviewed, or rejected. This uncertainty is not merely inconvenient — it affects the candidate's job search strategy because they cannot make informed decisions about where to focus their efforts.

A secondary frustration is the complexity of application processes. Some employers require candidates to create accounts, fill out lengthy forms, re-enter information already present on their resume, and complete assessments before they can submit an application. Each additional step in the process causes candidates to abandon the application, with studies suggesting that overly complex application processes can reduce completion rates by fifty percent or more.

Candidates want three things from an application process: speed, simplicity, and transparency. They want to apply quickly, with minimal friction, and they want to know what happens to their application after they submit it.

## Recruiter Pain Points

The following pain points emerged consistently from research into recruiter experiences at small and medium organizations.

**Time spent on unqualified applications.** A significant portion of applications to any posting come from candidates who do not meet the basic requirements. Recruiters spend time opening, reading, and rejecting these applications manually, which reduces the time available to evaluate qualified candidates.

**No structured evaluation criteria.** Without a scoring system or structured rubric, evaluation is subjective. The first resume reviewed in a batch gets more attention than the fiftieth. A recruiter's mood, energy level, and personal biases all influence decisions. This inconsistency is recognized by recruiters themselves but is difficult to address without tooling support.

**Resume format variability.** Resumes come in different formats, layouts, and levels of quality. Some are well-structured with clear sections. Others are dense paragraphs of text. The cognitive effort required to extract relevant information varies significantly across resumes, which contributes to reviewer fatigue.

**Difficulty writing job descriptions.** Writing an effective job description is a skill that many non-specialist recruiters have not developed. Vague or poorly structured job descriptions attract unqualified candidates, which compounds the screening problem. Recruiters often reuse old descriptions or write them quickly, resulting in postings that do not accurately represent the role.

**No audit trail.** When a hiring decision is questioned, there is no record of why specific candidates were advanced or rejected. This is a practical problem (difficulty revisiting past decisions) and a compliance concern (inability to demonstrate fair evaluation practices).

**Fragmented tooling.** Applications arrive through multiple channels and are managed through tools not designed for recruitment. Email, spreadsheets, and shared drives do not provide the structure, filtering, or analytics that a purpose-built tool offers.

## Candidate Pain Points

**Application black holes.** The most frequently reported candidate frustration is submitting an application and never hearing back. This is not always intentional — many organizations simply lack the systems to track and communicate status updates for every application.

**Redundant data entry.** Candidates upload a resume and then are asked to manually re-enter the same information into form fields. This is a direct consequence of systems that cannot parse resume content, forcing candidates to do the work that technology should handle.

**Opaque processes.** Candidates have no visibility into where their application is in the process, what criteria are being used to evaluate them, or when they might expect a response. This lack of transparency undermines trust in the employer.

**Complex application flows.** Multi-step application processes with account creation, questionnaires, and assessments create friction that causes candidates to abandon applications, particularly when they are applying to many positions simultaneously.

## Competitor Observations

Research into existing ATS products revealed patterns that informed RecruitIQ's positioning.

Enterprise ATS platforms (Greenhouse, Lever, Workable, BambooHR Recruiting) offer comprehensive feature sets including interview scheduling, scorecards, pipeline management, analytics, integrations, and multi-user collaboration. These products are powerful but carry per-seat pricing that starts at hundreds of dollars per month, require implementation effort, and offer more functionality than a small team needs. Their complexity is a feature for enterprise customers and a barrier for smaller organizations.

Mid-market ATS products offer scaled-down versions of enterprise features. They are less expensive but still oriented toward organizations with dedicated recruitment functions. They typically lack AI-powered analysis, providing only keyword-based filtering if they offer any automation at all.

AI-focused recruitment tools are an emerging category. Products like HireVue and Pymetrics use AI for candidate assessment but focus on interview analysis and behavioral evaluation rather than resume screening. They operate later in the hiring funnel and do not address the initial screening bottleneck.

Free and open-source ATS options exist but are typically minimal in functionality, unmaintained, or require significant technical effort to deploy and customize.

The gap that RecruitIQ targets is specific: a tool that is simple enough for a non-specialist recruiter, affordable and accessible, focused on the screening phase, and intelligent enough to provide AI-driven resume analysis rather than just keyword matching. No existing product occupies this exact position.

## User Personas

### Priya — Startup Recruiter

Priya is the head of operations at a forty-person technology startup. She manages HR, office operations, and hiring. When the company needs to fill a position, Priya writes the job description, posts it on LinkedIn and the company website, collects applications via a shared email inbox, and reviews every resume herself.

Priya typically receives between fifty and one hundred applications per posting. She spends four to six hours screening resumes for a single position. She frequently misses strong candidates because she reviews them too quickly during periods of high volume. She has no structured way to compare candidates or document her evaluation rationale.

Priya needs a tool that is immediately usable without training, reduces the time she spends on initial screening, and helps her identify strong candidates that she might otherwise overlook. She is not willing to invest time in configuring a complex system.

### Rahul — Recent Graduate Candidate

Rahul is a computer science graduate actively searching for his first full-time role. He applies to fifteen to twenty positions per week across different companies. He has a well-structured resume in PDF format that he tailors slightly for each application.

Rahul's primary frustration is the inconsistency of application processes. Some companies have simple one-click apply options. Others require him to fill out extensive forms that duplicate information already on his resume. He rarely hears back from employers and has no way to know whether his applications were received, reviewed, or rejected.

Rahul wants to find relevant jobs quickly, apply with minimal friction, and see whether his application is progressing. He has no patience for account creation flows that take longer than the application itself.

### Meera — Agency Recruiter

Meera works at a small recruitment agency that serves multiple client companies. She manages five to ten open positions at any given time, each for a different client. She receives applications from the agency's website and through email.

Meera's challenge is volume combined with variety. She is screening candidates for roles with very different requirements simultaneously, which makes it difficult to maintain consistent evaluation criteria across positions. She also needs to justify her recommendations to clients, which requires more structured evaluation than her current process of mental assessment provides.

Meera needs a tool that organizes applications by job, provides objective evaluation criteria, and gives her structured insights she can reference when presenting candidates to clients.

## User Journeys

### Candidate Journey

The candidate journey begins with job discovery. The candidate visits the platform and browses available job listings. They can view job details including the full description, requirements, location, and employment type. When they find a position that interests them, they choose to apply.

If the candidate is not registered, they create an account with an email and password. Registration is minimal — the candidate provides only what is needed to create the account. After registration, they are prompted to complete their profile with additional information, but this step is encouraged rather than enforced as a gate to applying.

The application process asks the candidate to upload their resume. This is the only required input during application. The resume is uploaded to cloud storage and the system begins processing it. The candidate receives confirmation that their application has been submitted.

After applying, the candidate can return to the platform at any time to check the status of their applications. Status values are clear and meaningful — the candidate understands whether their application has been received, is under review, has been shortlisted, or has been rejected.

### Recruiter Journey

The recruiter journey begins with account creation and company profile setup. After registering, the recruiter provides company information that will be displayed alongside their job postings. This step happens once and applies to all subsequent job postings.

When the recruiter is ready to hire, they create a job posting. They can write the job description manually or use AI to generate one from basic inputs. If they use AI generation, the output is presented for review and editing before it is published. The recruiter retains full control over the final job description.

Once the job is published, candidates begin applying. The recruiter can view all applications to each of their jobs. For each application, they can see the candidate's submitted resume and the AI-generated analysis. The analysis includes a matching score, skill breakdown, and written summary that highlights how the candidate's qualifications align with the job requirements.

The recruiter reviews the AI analysis alongside the resume and makes a decision. They can shortlist the candidate for further consideration or reject the application. This decision is recorded in the system and reflected in the candidate's application status.

## How Research Influenced Product Decisions

The research findings directly shaped several product decisions.

**Separate user models for candidates and recruiters.** The two roles have fundamentally different data needs, workflows, and permission structures. Research confirmed that they should be treated as independent entities rather than variations of a generic user type.

**Resume upload only during application.** Research into candidate workflows showed that candidates tailor resumes per application. A single stored resume that is reused across applications does not reflect actual candidate behavior. Uploading a resume as part of each application matches the real-world workflow.

**AI analysis as decision support, not automation.** Research into recruiter attitudes toward AI consistently shows that recruiters want assistance, not replacement. They want AI to surface information they might miss, not to make decisions on their behalf. RecruitIQ's AI layer is designed as an advisory system that produces structured insights for human review.

**AI-generated job descriptions.** Research identified job description quality as a root cause of poor screening outcomes. Bad descriptions attract unqualified candidates, which increases screening volume. By helping recruiters write better descriptions, the AI improves screening quality before the first resume is even submitted.

**Minimal application friction.** Research into candidate drop-off rates showed that complex application processes lose candidates. RecruitIQ's application flow requires only a resume upload, matching the expectations of candidates who apply to many positions in a short period.

**Status transparency for candidates.** The black hole effect was the most frequently cited candidate pain point. Providing application status tracking addresses this directly and requires minimal additional engineering effort since application status is already tracked internally for the recruiter's benefit.

**Focused MVP scope.** Research into failed product launches consistently points to scope overreach as a primary cause. Products that try to do everything at launch often do nothing well. The decision to exclude notifications, messaging, scheduling, and analytics from the MVP is a direct response to this pattern. Each excluded feature has value, but none is essential to the core screening workflow.
