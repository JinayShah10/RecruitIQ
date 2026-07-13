import bcrypt from 'bcrypt';
import Recruiter, { IRecruiter } from '../models/Recruiter';
import Candidate, { ICandidate } from '../models/Candidate';
import { generateToken } from '../utils/jwt';
import { AppError, UnauthorizedError, BadRequestError } from '../utils/app-error';

// Helper to generate a default name from email
const getDefaultName = (email: string): string => {
  try {
    const prefix = email.split('@')[0];
    return prefix
      .split(/[._-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Hiring Manager';
  } catch {
    return 'Hiring Manager';
  }
};

export class AuthService {
  /**
   * Register a new Recruiter
   */
  public static async recruiterSignup(payload: any) {
    const email = payload.email.toLowerCase();
    
    // Check if recruiter already exists
    const existingRecruiter = await Recruiter.findOne({ email });
    if (existingRecruiter) {
      throw new BadRequestError('Email is already registered.');
    }

    // Default name if missing to satisfy database validation
    const name = payload.name || getDefaultName(email);

    // Hash password
    const hashedPassword = await bcrypt.hash(payload.password, 12);

    // Create Recruiter record
    const recruiterData = {
      ...payload,
      email,
      name,
      password: hashedPassword,
    };
    
    const recruiter = await Recruiter.create(recruiterData);

    // Generate token
    const token = generateToken({
      id: recruiter._id.toString(),
      email: recruiter.email,
      role: 'Recruiter',
    });

    // Strip password from returned document
    const { password, ...recruiterWithoutPassword } = recruiter.toObject();

    return { recruiter: recruiterWithoutPassword, token };
  }

  /**
   * Authenticate a Recruiter
   */
  public static async recruiterLogin(payload: any) {
    const email = payload.email.toLowerCase();

    // Find recruiter and explicitly select password
    const recruiter = await Recruiter.findOne({ email }).select('+password');
    if (!recruiter) {
      throw new UnauthorizedError('Credentials do not match any recruiter profile.');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(payload.password, recruiter.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Credentials do not match any recruiter profile.');
    }

    // Generate token
    const token = generateToken({
      id: recruiter._id.toString(),
      email: recruiter.email,
      role: 'Recruiter',
    });

    // Strip password
    const { password, ...recruiterWithoutPassword } = recruiter.toObject();

    return { recruiter: recruiterWithoutPassword, token };
  }

  /**
   * Register a new Candidate
   */
  public static async candidateSignup(payload: any) {
    const email = payload.email.toLowerCase();

    // Check if candidate already exists
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      throw new BadRequestError('Email is already registered.');
    }

    // Default dob if missing to satisfy database validation
    const dob = payload.dob || new Date('1990-01-01');

    // Hash password
    const hashedPassword = await bcrypt.hash(payload.password, 12);

    // Create Candidate record
    const candidateData = {
      ...payload,
      email,
      dob,
      password: hashedPassword,
    };

    const candidate = await Candidate.create(candidateData);

    // Generate token
    const token = generateToken({
      id: candidate._id.toString(),
      email: candidate.email,
      role: 'Candidate',
    });

    // Strip password
    const { password, ...candidateWithoutPassword } = candidate.toObject();

    return { candidate: candidateWithoutPassword, token };
  }

  /**
   * Authenticate a Candidate
   */
  public static async candidateLogin(payload: any) {
    const email = payload.email.toLowerCase();

    // Find candidate and explicitly select password
    const candidate = await Candidate.findOne({ email }).select('+password');
    if (!candidate) {
      throw new UnauthorizedError('Credentials do not match any candidate profile.');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(payload.password, candidate.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Credentials do not match any candidate profile.');
    }

    // Generate token
    const token = generateToken({
      id: candidate._id.toString(),
      email: candidate.email,
      role: 'Candidate',
    });

    // Strip password
    const { password, ...candidateWithoutPassword } = candidate.toObject();

    return { candidate: candidateWithoutPassword, token };
  }
}
