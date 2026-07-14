import { Request, Response, NextFunction } from 'express';
import { ResumeService } from '../services/resume.service';
import { BadRequestError, UnauthorizedError } from '../utils/app-error';

export class ResumeController {
  /**
   * Handle candidate resume upload requests
   */
  public static async uploadResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Enforce user authentication
      if (!req.user || !req.user.id) {
        throw new UnauthorizedError('Authentication required. Please log in.');
      }

      // 2. Enforce file presence
      if (!req.file) {
        throw new BadRequestError('Resume file is required.');
      }

      // 3. Delegate file upload and DB registration to ResumeService
      const savedResume = await ResumeService.uploadResume(req.user.id, req.file);

      // 4. Send standardized success response conforming to the API Design document
      res.status(201).json({
        success: true,
        message: 'Resume uploaded successfully.',
        data: {
          resume: {
            _id: savedResume._id,
            candidateId: savedResume.candidateId,
            resumeUrl: savedResume.resumeUrl,
            fileUrl: savedResume.resumeUrl, // Provided for compliance with API Design doc
            isPrimary: savedResume.isPrimary,
            parsedData: savedResume.parsedData || {},
            uploadedAt: savedResume.uploadedAt,
            createdAt: savedResume.uploadedAt, // Provided for compliance with API Design doc
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
