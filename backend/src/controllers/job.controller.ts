import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/job.service';
import { createJobSchema, updateJobSchema, generateJdSchema } from '../validators/job';
import { UnauthorizedError } from '../utils/app-error';

export class JobController {
  /**
   * Create a new job requisition posting
   */
  public static async createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedError('Authentication required. Please log in.');
      }

      // Validate schema
      const validatedBody = createJobSchema.parse(req.body);

      // Execute create operation
      const job = await JobService.createJob(req.user.id, validatedBody);

      res.status(201).json({
        success: true,
        message: 'Job posting published successfully.',
        data: { job },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve list of open job listings
   */
  public static async getJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await JobService.getJobs(req.query);

      res.status(200).json({
        success: true,
        message: 'Jobs retrieved successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve full details of a specific job listing
   */
  public static async getJobById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobId = req.params.jobId as string;
      const job = await JobService.getJobById(jobId);

      res.status(200).json({
        success: true,
        message: 'Job details retrieved successfully.',
        data: { job },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update details/status of a job listing
   */
  public static async updateJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedError('Authentication required. Please log in.');
      }

      const jobId = req.params.jobId as string;

      // Validate schema
      const validatedBody = updateJobSchema.parse(req.body);

      // Execute update operation with ownership check
      const job = await JobService.updateJob(jobId, req.user.id, validatedBody);

      res.status(200).json({
        success: true,
        message: 'Job updated successfully.',
        data: { job },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an existing job listing posting
   */
  public static async deleteJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedError('Authentication required. Please log in.');
      }

      const jobId = req.params.jobId as string;

      // Execute delete operation with ownership check
      await JobService.deleteJob(jobId, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Job posting deleted successfully. Historical applications are preserved.',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate markdown job description via Groq LLM
   */
  public static async generateJd(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate schema
      const validatedBody = generateJdSchema.parse(req.body);

      // Execute generation
      const result = await JobService.generateJd(validatedBody);

      res.status(200).json({
        success: true,
        message: 'Job description generated successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
