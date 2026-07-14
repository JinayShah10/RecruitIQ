import Recruiter from '../models/Recruiter';
import Candidate from '../models/Candidate';
import Job from '../models/Job';
import Application from '../models/Application';
import Resume from '../models/Resume';
import { NotFoundError } from '../utils/app-error';

export class DashboardService {
  /**
   * Aggregate dashboard metrics and active jobs for recruiters
   */
  public static async getRecruiterDashboard(recruiterId: string): Promise<any> {
    // 1. Verify recruiter exists
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      throw new NotFoundError('Recruiter not found');
    }

    // 2. Retrieve recruiter's jobs
    const recruiterJobs = await Job.find({ recruiterId }).sort({ createdAt: -1 });
    const jobIds = recruiterJobs.map((j) => j._id);

    // 3. Aggregate application counts for each job via pipeline
    const appCounts = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$jobId', count: { $sum: 1 } } },
    ]);

    const countsMap = new Map<string, number>();
    appCounts.forEach((item) => {
      countsMap.set(item._id.toString(), item.count);
    });

    // 4. Compute metrics
    const activeJobsCount = recruiterJobs.filter((j) => j.status === 'Open').length;
    const totalApplicantsCount = appCounts.reduce((sum, item) => sum + item.count, 0);
    const pendingApplicationsCount = await Application.countDocuments({
      jobId: { $in: jobIds },
      status: 'Received',
    });

    // 5. Construct and format active jobs list
    const activeJobs = recruiterJobs.map((job) => ({
      _id: job._id,
      title: job.title,
      location: job.location,
      status: job.status,
      applicantsCount: countsMap.get(job._id.toString()) || 0,
      createdAt: job.createdAt,
    }));

    return {
      metrics: {
        activeJobsCount,
        totalApplicantsCount,
        pendingApplicationsCount,
      },
      activeJobs,
    };
  }

  /**
   * Aggregate dashboard metrics and application history for candidates
   */
  public static async getCandidateDashboard(candidateId: string): Promise<any> {
    // 1. Verify candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    // 2. Retrieve candidate applications with populated job & recruiter details
    const applications = await Application.find({ candidateId })
      .populate({
        path: 'jobId',
        select: 'title location employmentType recruiterId',
        populate: {
          path: 'recruiterId',
          select: 'companyName',
        },
      })
      .sort({ createdAt: -1 });

    // 3. Compute metrics
    const totalApplications = applications.length;
    const received = applications.filter((a) => a.status === 'Received').length;
    const underReview = applications.filter((a) => a.status === 'Under Review').length;
    const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
    const rejected = applications.filter((a) => a.status === 'Rejected').length;

    // 4. Check profile completeness: has basic info AND at least 1 uploaded resume
    const resumeCount = await Resume.countDocuments({ candidateId });
    const profileComplete = !!(
      candidate.firstName &&
      candidate.lastName &&
      candidate.phone &&
      candidate.dob &&
      resumeCount > 0
    );

    // 5. Format applications list
    const formattedApplications = applications.map((app) => {
      const job = app.jobId as any;
      const recruiter = job?.recruiterId as any;
      return {
        _id: app._id,
        jobId: job?._id || null,
        jobTitle: job?.title || 'Unknown Position',
        companyName: recruiter?.companyName || 'Unknown Company',
        location: job?.location || 'Remote',
        employmentType: job?.employmentType || 'Full-time',
        status: app.status,
        appliedAt: app.appliedAt || app.createdAt,
      };
    });

    return {
      metrics: {
        totalApplications,
        received,
        underReview,
        shortlisted,
        rejected,
      },
      profileComplete,
      applications: formattedApplications,
    };
  }
}
