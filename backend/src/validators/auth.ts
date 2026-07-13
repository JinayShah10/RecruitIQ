import { z } from 'zod';

export const recruiterSignupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(1, 'Name cannot be empty').optional(), // Optional to align with API Design spec, defaulted in service
  companyName: z.string().min(1, 'Company name is required'),
  companySize: z.string().optional(),
  industry: z.string().optional(),
  companyWebsite: z.union([z.string().url('Invalid website URL'), z.string().length(0)]).optional().or(z.literal('')),
  designation: z.string().optional(),
  companyDescription: z.string().optional(),
  companyLogo: z.string().optional(),
});

export const recruiterLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const candidateSignupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  dob: z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() !== '') return new Date(val);
    return val;
  }, z.date().optional()), // Preprocess string to Date; optional to align with API Design example, defaulted in service
  gender: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().optional(),
  github: z.union([z.string().url('Invalid GitHub URL'), z.string().length(0)]).optional().or(z.literal('')),
  linkedin: z.union([z.string().url('Invalid LinkedIn URL'), z.string().length(0)]).optional().or(z.literal('')),
  portfolio: z.union([z.string().url('Invalid Portfolio URL'), z.string().length(0)]).optional().or(z.literal('')),
});

export const candidateLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});
