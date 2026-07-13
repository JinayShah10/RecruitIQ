import mongoose from 'mongoose';
import Groq from 'groq-sdk';
import Job, { IJob } from '../models/Job';
import { NotFoundError, ForbiddenError, AppError } from '../utils/app-error';

export class JobService {
  /**
   * Create a new job requisition
   */
  public static async createJob(recruiterId: string, payload: any): Promise<IJob> {
    const jobData = {
      ...payload,
      recruiterId: new mongoose.Types.ObjectId(recruiterId),
      status: payload.status || 'Open',
    };

    // Map requirements from API to skillsRequired in database
    if (payload.requirements) {
      jobData.skillsRequired = payload.requirements;
    }

    const job = await Job.create(jobData);
    return job;
  }

  /**
   * Retrieve filterable, paginated list of active jobs
   */
  public static async getJobs(queries: any) {
    const page = Math.max(1, parseInt(queries.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(queries.limit) || 10));
    const skip = (page - 1) * limit;

    // Filter for open jobs by default
    const filterQuery: any = { status: 'Open' };

    // Search query on title and description
    if (queries.search) {
      filterQuery.$or = [
        { title: { $regex: queries.search, $options: 'i' } },
        { description: { $regex: queries.search, $options: 'i' } },
      ];
    }

    // Location query
    if (queries.location) {
      filterQuery.location = { $regex: queries.location, $options: 'i' };
    }

    // Employment type query
    if (queries.employmentType) {
      filterQuery.employmentType = queries.employmentType;
    }

    const total = await Job.countDocuments(filterQuery);
    const jobs = await Job.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Retrieve details of a specific job posting
   */
  public static async getJobById(jobId: string): Promise<IJob> {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw new NotFoundError('Job requisition not found.');
    }

    const job = await Job.findById(jobId);
    if (!job) {
      throw new NotFoundError('Job requisition not found.');
    }

    return job;
  }

  /**
   * Update details/status of an existing job posting
   */
  public static async updateJob(jobId: string, recruiterId: string, payload: any): Promise<IJob> {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw new NotFoundError('Job requisition not found.');
    }

    const job = await Job.findById(jobId);
    if (!job) {
      throw new NotFoundError('Job requisition not found.');
    }

    // Verify ownership
    if (job.recruiterId.toString() !== recruiterId) {
      throw new ForbiddenError('You do not have permission to modify this job requisition.');
    }

    // Map requirements from API to skillsRequired
    const updateData = { ...payload };
    if (payload.requirements) {
      updateData.skillsRequired = payload.requirements;
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      throw new NotFoundError('Job requisition not found.');
    }

    return updatedJob;
  }

  /**
   * Delete an existing job posting
   */
  public static async deleteJob(jobId: string, recruiterId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw new NotFoundError('Job requisition not found.');
    }

    const job = await Job.findById(jobId);
    if (!job) {
      throw new NotFoundError('Job requisition not found.');
    }

    // Verify ownership
    if (job.recruiterId.toString() !== recruiterId) {
      throw new ForbiddenError('You do not have permission to delete this job requisition.');
    }

    await Job.deleteOne({ _id: jobId });
  }

  /**
   * Generate a formatted job description using AI assistance (Groq SDK)
   */
  public static async generateJd(payload: any): Promise<{ description: string }> {
    const apiKey = process.env.GROQ_API_KEY;
    const { title, responsibilities, skills } = payload;

    // Standardize optional arrays or strings to bullet strings
    const formatSection = (data: any): string => {
      if (!data) return 'Not specified';
      if (Array.isArray(data)) {
        return data.map((item) => `* ${item}`).join('\n');
      }
      return data;
    };

    const responsibilitiesSection = formatSection(responsibilities);
    const skillsSection = formatSection(skills);

    // Fallback if GROQ_API_KEY is missing or set to default example
    if (!apiKey || apiKey === 'your_groq_api_key' || apiKey === '') {
      const mockDescription = `### Lead ${title}\n\n### About the Role\nWe are seeking a highly motivated and skilled Lead ${title} to join our growing organization. The ideal candidate will be responsible for leading efforts and driving innovation.\n\n### Key Responsibilities\n${responsibilitiesSection}\n\n### Requirements\n${skillsSection}`;
      return { description: mockDescription.trim() };
    }

    const groq = new Groq({ apiKey });

    const prompt = `You are an expert HR copywriter. Write a highly professional, engaging, and detailed job description for a "${title}" position.
    
    ### Key Responsibilities:
    ${responsibilitiesSection}
    
    ### Required Skills and Qualifications:
    ${skillsSection}
    
    Output the result in clean GitHub Flavored Markdown (GFM). Use headers like "### About the Role", "### Key Responsibilities", and "### Requirements". Do not include meta-text, introductions like "Here is the description...", or conversational replies. Output ONLY the markdown text.`;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an HR copywriter who produces clean markdown job descriptions based on title, skills, and responsibilities.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 1500,
      });

      const description = chatCompletion.choices[0]?.message?.content || '';
      return { description: description.trim() };
    } catch (error) {
      throw new AppError(`AI Generation failed: ${error instanceof Error ? error.message : error}`, 500);
    }
  }
}
