import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../utils/app-error';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(new NotFoundError(`Requested resource not found: ${req.method} ${req.originalUrl}`));
};
