import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import {
  recruiterSignupSchema,
  recruiterLoginSchema,
  candidateSignupSchema,
  candidateLoginSchema,
} from '../validators/auth';

export class AuthController {
  /**
   * Recruiter Signup Handler
   */
  public static async recruiterSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validatedBody = recruiterSignupSchema.parse(req.body);

      // Execute signup service logic
      const result = await AuthService.recruiterSignup(validatedBody);

      // Return success response envelope
      res.status(201).json({
        success: true,
        message: 'Recruiter account registered successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Recruiter Login Handler
   */
  public static async recruiterLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validatedBody = recruiterLoginSchema.parse(req.body);

      // Execute login service logic
      const result = await AuthService.recruiterLogin(validatedBody);

      // Return success response envelope
      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Candidate Signup Handler
   */
  public static async candidateSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validatedBody = candidateSignupSchema.parse(req.body);

      // Execute signup service logic
      const result = await AuthService.candidateSignup(validatedBody);

      // Return success response envelope
      res.status(201).json({
        success: true,
        message: 'Candidate account registered successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Candidate Login Handler
   */
  public static async candidateLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validatedBody = candidateLoginSchema.parse(req.body);

      // Execute login service logic
      const result = await AuthService.candidateLogin(validatedBody);

      // Return success response envelope
      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
