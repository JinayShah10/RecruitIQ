import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

/**
 * Route: Submit a new job application
 * POST /applications
 * Role: Candidate only
 */
router.post(
  '/applications',
  authenticate,
  authorize('Candidate'),
  ApplicationController.createApplication
);

/**
 * Route: Retrieve a list of applications (role-filtered)
 * GET /applications
 * Role: Candidate (returns own) or Recruiter (returns for owned jobs)
 */
router.get(
  '/applications',
  authenticate,
  ApplicationController.getApplications
);

/**
 * Route: Fetch the full details of a specific application
 * GET /applications/:applicationId
 * Role: Candidate owner or Recruiter owner
 */
router.get(
  '/applications/:applicationId',
  authenticate,
  ApplicationController.getApplicationById
);

/**
 * Route: Update candidate evaluation status
 * PATCH /applications/:applicationId/status
 * Role: Recruiter only (parent job ownership checked in service)
 */
router.patch(
  '/applications/:applicationId/status',
  authenticate,
  authorize('Recruiter'),
  ApplicationController.updateApplicationStatus
);

export default router;
