import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

/**
 * Route: Fetch Recruiter dashboard metrics and active jobs
 * GET /dashboard/recruiter
 * Role: Recruiter only
 */
router.get(
  '/dashboard/recruiter',
  authenticate,
  authorize('Recruiter'),
  DashboardController.getRecruiterDashboard
);

/**
 * Route: Fetch Candidate dashboard metrics and submission history
 * GET /dashboard/candidate
 * Role: Candidate only
 */
router.get(
  '/dashboard/candidate',
  authenticate,
  authorize('Candidate'),
  DashboardController.getCandidateDashboard
);

export default router;
