import { Router } from 'express';
import { ResumeController } from '../controllers/resume.controller';
import { authenticate, authorize } from '../middleware/auth';
import { uploadResumeMiddleware } from '../middleware/upload.middleware';

const router = Router();

/**
 * Route candidate resume uploads
 * POST /resumes
 */
router.post(
  '/resumes',
  authenticate,
  authorize('Candidate'),
  uploadResumeMiddleware,
  ResumeController.uploadResume
);

export default router;
