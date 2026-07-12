import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
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

  // 2. Map structural external library/DB exceptions to AppError
  
  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Invalid value for path ${err.path}: ${err.value}`;
    error = new AppError(message, 400);
  }

  // MongoDB Duplicate Key Error (e.g. duplicate unique index)
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(', ');
    const value = Object.values(err.keyValue || {}).join(', ');
    const message = `Duplicate entry for field '${field}': '${value}'. Please use a unique value.`;
    error = new AppError(message, 409);
  }

  // Mongoose ValidationError
  else if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((val: any) => val.message);
    const message = `Validation failed: ${messages.join('. ')}`;
    error = new AppError(message, 400);
  }

  // JWT Errors
  else if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid authentication token. Please log in again.', 401);
  }

  else if (err.name === 'TokenExpiredError') {
    error = new AppError('Your session has expired. Please log in again.', 401);
  }

  // 3. Format response structure
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  const isOperational = error instanceof AppError ? error.isOperational : false;

  const responsePayload = {
    status,
    message: isOperational ? error.message : 'Internal server error',
  };

  res.status(statusCode).json(responsePayload);
};
