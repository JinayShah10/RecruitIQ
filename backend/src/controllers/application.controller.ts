import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/application.service';
import { createApplicationSchema, updateApplicationStatusSchema } from '../validators/application';
import { UnauthorizedError } from '../utils/app-error';

export class ApplicationController {
  /**
   * Submit a new job application (POST /applications)
   */
  public static async createApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedError('Authentication required. Please log in.');
      }

      // Validate payload against schema
      const validatedBody = createApplicationSchema.parse(req.body);

      // Delegate creation logic to Service layer
      const application = await ApplicationService.createApplication(req.user.id, validatedBody);

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully. AI analysis initiated.',
        data: {
          application: {
            _id: application._id,
            candidateId: application.candidateId,
            jobId: application.jobId,
            resumeId: application.resumeId,
            status: application.status,
            createdAt: application.createdAt,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve a list of applications scoped by user role (GET /applications)
   */
  public static async getApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedError('Authentication required. Please log in.');
      }

      const queryFilters = {
        jobId: req.query.jobId as string,
        status: req.query.status as string,
      };

      // Call Service layer with current user context and parameters
      const applications = await ApplicationService.getApplications(req.user, queryFilters);

      res.status(200).json({
        success: true,
        message: 'Applications retrieved successfully.',
        data: { applications },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve detailed view of a single application (GET /applications/:applicationId)
   */
  public static async getApplicationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedError('Authentication required. Please log in.');
      }

      const applicationId = req.params.applicationId as string;

      // Delegate retrieval and authorization validation to Service layer
      const application = await ApplicationService.getApplicationById(req.user, applicationId);

      res.status(200).json({
        success: true,
        message: 'Application details retrieved successfully.',
        data: { application },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update candidate evaluation status (PATCH /applications/:applicationId/status)
   */
  public static async updateApplicationStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedError('Authentication required. Please log in.');
      }

      const applicationId = req.params.applicationId as string;

      // Validate status payload against Zod schema
      const { status } = updateApplicationStatusSchema.parse(req.body);

      // Delegate update logic to Service layer
      const application = await ApplicationService.updateApplicationStatus(
        req.user.id,
        applicationId,
        status
      );

      res.status(200).json({
        success: true,
        message: 'Application status updated successfully.',
        data: {
          application: {
            _id: application._id,
            status: application.status,
            updatedAt: application.updatedAt,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
