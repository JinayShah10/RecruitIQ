import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public Routes (browse and details accessible by candidates / public clients)
router.get('/jobs', JobController.getJobs);
router.get('/jobs/:jobId', JobController.getJobById);

// Recruiter Protected Routes
router.post('/jobs', authenticate, authorize('Recruiter'), JobController.createJob);
router.patch('/jobs/:jobId', authenticate, authorize('Recruiter'), JobController.updateJob);
router.delete('/jobs/:jobId', authenticate, authorize('Recruiter'), JobController.deleteJob);
router.post('/jobs/generate-jd', authenticate, authorize('Recruiter'), JobController.generateJd);

export default router;
