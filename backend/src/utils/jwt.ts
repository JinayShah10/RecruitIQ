import jwt from 'jsonwebtoken';
import { AppError } from './app-error';

export interface IJwtPayload {
  id: string;
  email: string;
  role: 'Recruiter' | 'Candidate';
}

/**
 * Generates a signed JSON Web Token
 * @param payload Object containing user id, email, and role
 */
export const generateToken = (payload: IJwtPayload): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  if (!secret) {
    throw new AppError('JWT secret key is not configured in the environment variables', 500);
  }

  return jwt.sign({ ...payload }, secret, { expiresIn: expiresIn as any });
};

/**
 * Verifies a JSON Web Token
 * @param token Raw JWT string
 */
export const verifyToken = (token: string): IJwtPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError('JWT secret key is not configured in the environment variables', 500);
  }

  try {
    return jwt.verify(token, secret) as IJwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Your session has expired. Please log in again.', 401);
    }
    throw new AppError('Invalid authentication token. Please log in again.', 401);
  }
};
