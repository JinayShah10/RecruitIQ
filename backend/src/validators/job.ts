import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  department: z.string().optional(),
  employmentType: z.union([
    z.literal('Full-time'),
    z.literal('Part-time'),
    z.literal('Contract'),
    z.literal('Internship'),
    z.literal('Temporary')
  ]).optional(),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  experienceRequired: z.string().optional(),
  requirements: z.array(z.string()).optional(), // Maps to skillsRequired in database
  description: z.string().optional(),
  status: z.union([z.literal('Open'), z.literal('Closed')]).optional(),
});

export const updateJobSchema = z.object({
  title: z.string().min(1, 'Job title cannot be empty').optional(),
  department: z.string().optional(),
  employmentType: z.union([
    z.literal('Full-time'),
    z.literal('Part-time'),
    z.literal('Contract'),
    z.literal('Internship'),
    z.literal('Temporary')
  ]).optional(),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  experienceRequired: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  description: z.string().optional(),
  status: z.union([z.literal('Open'), z.literal('Closed')]).optional(),
});

export const generateJdSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  responsibilities: z.array(z.string()).optional().or(z.string().optional()),
  skills: z.array(z.string()).optional().or(z.string().optional()),
});
