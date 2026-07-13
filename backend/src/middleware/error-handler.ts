import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error';

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  let error = err;

  // 1. Log the error to console
  /* eslint-disable no-console */
  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR] Caught error:', err);
  } else {
    console.error(`[ERROR] [${new Date().toISOString()}] ${error.name || 'Error'}: ${error.message}`);
  }
  /* eslint-enable no-console */

  // 2. Map structural external library/DB exceptions to AppError or custom codes
  let code = 'INTERNAL_SERVER_ERROR';
  let details: any = error.message;

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Invalid value for path ${err.path}: ${err.value}`;
    error = new AppError(message, 400);
    code = 'BAD_REQUEST';
    details = message;
  }

  // MongoDB Duplicate Key Error (e.g. duplicate unique index)
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(', ');
    const value = Object.values(err.keyValue || {}).join(', ');
    const message = `Duplicate entry for field '${field}': '${value}'. Please use a unique value.`;
    error = new AppError(message, 400);
    code = 'VALIDATION_ERROR';
    details = { [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is already registered.` };
  }

  // Mongoose ValidationError
  else if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((val: any) => val.message);
    const message = `Validation failed: ${messages.join('. ')}`;
    error = new AppError(message, 400);
    code = 'VALIDATION_ERROR';
    
    const mongooseDetails: Record<string, string> = {};
    Object.keys(err.errors || {}).forEach((key) => {
      mongooseDetails[key] = err.errors[key].message;
    });
    details = mongooseDetails;
  }

  // Zod ValidationError
  else if (err instanceof ZodError) {
    const message = 'Validation failed';
    error = new AppError(message, 400);
    code = 'VALIDATION_ERROR';

    const zodDetails: Record<string, string> = {};
    err.issues.forEach((e: any) => {
      const path = e.path.join('.');
      zodDetails[path] = e.message;
    });
    details = zodDetails;
  }

  // JWT Errors
  else if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid authentication token. Please log in again.', 401);
    code = 'UNAUTHORIZED';
    details = error.message;
  }

  else if (err.name === 'TokenExpiredError') {
    error = new AppError('Your session has expired. Please log in again.', 401);
    code = 'UNAUTHORIZED';
    details = error.message;
  }

  // Handle generic AppError
  else if (error instanceof AppError) {
    const statusCode = error.statusCode;
    if (statusCode === 400) code = 'BAD_REQUEST';
    else if (statusCode === 401) code = 'UNAUTHORIZED';
    else if (statusCode === 403) code = 'FORBIDDEN';
    else if (statusCode === 404) code = 'NOT_FOUND';
    else if (statusCode === 409) code = 'CONFLICT';
  }

  // 3. Format response structure
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const isOperational = error instanceof AppError ? error.isOperational : false;

  const responsePayload = {
    success: false,
    message: isOperational || code === 'VALIDATION_ERROR' ? error.message : 'Internal server error',
    error: {
      code,
      details,
    },
  };

  res.status(statusCode).json(responsePayload);
};
