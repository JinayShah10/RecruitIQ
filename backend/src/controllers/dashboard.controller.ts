import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { UnauthorizedError } from '../utils/app-error';

export class DashboardController {
  /**
   * Fetch recruiter metrics and listings (GET /dashboard/recruiter)
   */
  public static async getRecruiterDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedError('Authentication required. Please log in.');
      }

      // Delegate data aggregation to Service layer
      const dashboardData = await DashboardService.getRecruiterDashboard(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Recruiter dashboard retrieved successfully.',
        data: dashboardData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch candidate metrics and submission history (GET /dashboard/candidate)
   */
  public static async getCandidateDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedError('Authentication required. Please log in.');
      }

      // Delegate data aggregation to Service layer
      const dashboardData = await DashboardService.getCandidateDashboard(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Candidate dashboard retrieved successfully.',
        data: dashboardData,
      });
    } catch (error) {
      next(error);
    }
  }
}
