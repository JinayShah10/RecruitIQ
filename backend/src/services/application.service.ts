import Application, { IApplication } from '../models/Application';
import Job from '../models/Job';
import Resume from '../models/Resume';
import { IJwtPayload } from '../utils/jwt';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/app-error';

export class ApplicationService {
  /**
   * Submit a new job application referencing a candidate, job, and resume.
   */
  public static async createApplication(
    candidateId: string,
    payload: { jobId: string; resumeId: string }
  ): Promise<IApplication> {
    // 1. Verify job exists
    const job = await Job.findById(payload.jobId);
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    // 2. Verify resume exists
    const resume = await Resume.findById(payload.resumeId);
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }

    // 3. Verify candidate owns the resume
    if (resume.candidateId.toString() !== candidateId) {
      throw new ForbiddenError('Resume does not belong to candidate');
    }

    // 4. Prevent duplicate applications
    const existingApplication = await Application.findOne({
      candidateId,
      jobId: payload.jobId,
    });
    if (existingApplication) {
      throw new BadRequestError('You have already applied to this job.');
    }

    // 5. Create application and save
    const application = new Application({
      candidateId,
      jobId: payload.jobId,
      resumeId: payload.resumeId,
      status: 'Received',
    });

    await application.save();

    return application;
  }

  /**
   * Retrieve a list of applications based on role-scoped filters.
   */
  public static async getApplications(
    user: IJwtPayload,
    query: { jobId?: string; status?: string }
  ): Promise<any[]> {
    const filter: any = {};

    if (user.role === 'Candidate') {
      // Candidates can only view their own submissions
      filter.candidateId = user.id;

      // Candidates can filter their own history by status
      if (query.status) {
        filter.status = query.status;
      }
    } else if (user.role === 'Recruiter') {
      // Recruiters can only see applications for jobs they own
      const recruiterJobs = await Job.find({ recruiterId: user.id }).select('_id');
      const jobIds = recruiterJobs.map((j) => j._id);

      if (query.jobId) {
        // Verify ownership of the filtered job
        if (!jobIds.map((id) => id.toString()).includes(query.jobId)) {
          throw new ForbiddenError('You do not have permission to view applications for this job');
        }
        filter.jobId = query.jobId;
      } else {
        filter.jobId = { $in: jobIds };
      }

      if (query.status) {
        filter.status = query.status;
      }
    }

    // Populate fields matching the GET /applications spec
    const list = await Application.find(filter)
      .populate('jobId', 'title')
      .populate('candidateId', 'firstName lastName')
      .sort({ createdAt: -1 });

    return list;
  }

  /**
   * Fetch the full details of a specific application with references populated.
   */
  public static async getApplicationById(
    user: IJwtPayload,
    applicationId: string
  ): Promise<any> {
    const application = await Application.findById(applicationId)
      .populate('candidateId', 'firstName lastName email phone')
      .populate('resumeId', 'resumeUrl parsedData')
      .populate('jobId', 'title description skillsRequired recruiterId');

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Enforce ownership validation
    if (user.role === 'Candidate') {
      const candId = (application.candidateId as any)._id?.toString() || application.candidateId.toString();
      if (candId !== user.id) {
        throw new ForbiddenError('You do not have permission to access this application');
      }
    } else if (user.role === 'Recruiter') {
      const recruiterId =
        (application.jobId as any).recruiterId?.toString() ||
        (await Job.findById(application.jobId))?.recruiterId?.toString();

      if (recruiterId !== user.id) {
        throw new ForbiddenError('You do not have permission to access this application');
      }
    }

    // Map Mongoose document structure to match nested keys in API Design spec
    return {
      _id: application._id,
      status: application.status,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      job: application.jobId
        ? {
            _id: (application.jobId as any)._id,
            title: (application.jobId as any).title,
            requirements: (application.jobId as any).skillsRequired || [],
            description: (application.jobId as any).description,
          }
        : null,
      candidate: application.candidateId
        ? {
            _id: (application.candidateId as any)._id,
            firstName: (application.candidateId as any).firstName,
            lastName: (application.candidateId as any).lastName,
            email: (application.candidateId as any).email,
            phone: (application.candidateId as any).phone,
          }
        : null,
      resume: application.resumeId
        ? {
            _id: (application.resumeId as any)._id,
            fileUrl: (application.resumeId as any).resumeUrl, // Compliant with API Design spec
            resumeUrl: (application.resumeId as any).resumeUrl,
            parsedData: (application.resumeId as any).parsedData || {},
          }
        : null,
    };
  }

  /**
   * Update the evaluation status of a candidate's application.
   */
  public static async updateApplicationStatus(
    recruiterId: string,
    applicationId: string,
    status: 'Received' | 'Under Review' | 'Shortlisted' | 'Rejected'
  ): Promise<IApplication> {
    const application = await Application.findById(applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Verify parent job is owned by the recruiter
    const job = await Job.findById(application.jobId);
    if (!job || job.recruiterId.toString() !== recruiterId) {
      throw new ForbiddenError('You do not have permission to update this application status');
    }

    application.status = status;
    await application.save();

    return application;
  }
}
