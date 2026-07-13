import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// Recruiter Authentication endpoints
router.post('/recruiters/signup', AuthController.recruiterSignup);
router.post('/recruiters/login', AuthController.recruiterLogin);

// Candidate Authentication endpoints
router.post('/candidates/signup', AuthController.candidateSignup);
router.post('/candidates/login', AuthController.candidateLogin);

export default router;
