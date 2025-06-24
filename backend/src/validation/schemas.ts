import { z } from 'zod';

export const createCampaignSchema = z.object({
  name: z.string()
    .min(1, 'Campaign name is required')
    .max(200, 'Campaign name cannot exceed 200 characters')
    .trim(),
  description: z.string()
    .min(1, 'Campaign description is required')
    .max(1000, 'Campaign description cannot exceed 1000 characters')
    .trim(),
  leads: z.array(
    z.string()
      .regex(/^https?:\/\/(?:www\.)?linkedin\.com\/in\/[\w-]+\/?$/, 'Invalid LinkedIn profile URL format')
  ).default([]),
  accountIDs: z.array(z.string().trim()).default([])
});

export const updateCampaignSchema = z.object({
  name: z.string()
    .max(200, 'Campaign name cannot exceed 200 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(1000, 'Campaign description cannot exceed 1000 characters')
    .trim()
    .optional(),
  status: z.enum(['ACTIVE', 'INACTIVE'], {
    errorMap: () => ({ message: 'Status must be either ACTIVE or INACTIVE' })
  }).optional(),
  leads: z.array(
    z.string()
      .regex(/^https?:\/\/(?:www\.)?linkedin\.com\/in\/[\w-]+\/?$/, 'Invalid LinkedIn profile URL format')
  ).optional(),
  accountIDs: z.array(z.string().trim()).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});

export const linkedInMessageSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  job_title: z.string()
    .min(1, 'Job title is required')
    .max(150, 'Job title cannot exceed 150 characters')
    .trim(),
  company: z.string()
    .min(1, 'Company is required')
    .max(100, 'Company cannot exceed 100 characters')
    .trim(),
  location: z.string()
    .min(1, 'Location is required')
    .max(100, 'Location cannot exceed 100 characters')
    .trim(),
  summary: z.string()
    .min(1, 'Summary is required')
    .max(1000, 'Summary cannot exceed 1000 characters')
    .trim()
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type LinkedInMessageInput = z.infer<typeof linkedInMessageSchema>;
