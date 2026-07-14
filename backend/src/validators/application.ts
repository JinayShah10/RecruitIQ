import { z } from 'zod';

// Schema for POST /applications
export const createApplicationSchema = z.object({
  jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Job ID format'),
  resumeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Resume ID format'),
});

export const updateApplicationStatusSchema = z.object({
  status: z.union([
    z.literal('Received'),
    z.literal('Under Review'),
    z.literal('Shortlisted'),
    z.literal('Rejected')
  ]),
});


