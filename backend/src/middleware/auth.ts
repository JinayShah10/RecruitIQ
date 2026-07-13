import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/app-error';

/**
 * Middleware to authenticate requests by validating the Bearer JWT token in headers
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is missing or invalid. Please log in.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to restrict route execution to specific roles
 * @param roles Array of authorized roles
 */
export const authorize = (...roles: Array<'Recruiter' | 'Candidate'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required. Please log in.');
      }

      if (!roles.includes(req.user.role)) {
        throw new ForbiddenError('You do not have permission to access this resource.');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
