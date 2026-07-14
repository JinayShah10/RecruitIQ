import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { BadRequestError } from '../utils/app-error';

// Setup memory storage
const storage = multer.memoryStorage();

// File filter to restrict uploads to PDF and DOCX only
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const allowedExtensions = /\.(pdf|docx)$/i;

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only PDF and DOCX files are allowed. Maximum size limit is 10MB.'));
  }
};

// Config limits (10MB)
const limits = {
  fileSize: 10 * 1024 * 1024,
};

// Initialize multer single file upload middleware
const multerUpload = multer({
  storage,
  fileFilter,
  limits,
}).single('resume');

/**
 * Middleware to intercept resume uploads, check file constraints,
 * and attach the file object to req.file
 */
export const uploadResumeMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  multerUpload(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new BadRequestError('Only PDF and DOCX files are allowed. Maximum size limit is 10MB.'));
        }
        return next(new BadRequestError(`File upload error: ${err.message}`));
      }
      return next(err);
    }
    next();
  });
};
