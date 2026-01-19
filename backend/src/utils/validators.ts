import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createStorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  genre: z.enum(['fantasy', 'scifi', 'mystery', 'romance', 'thriller', 'horror']).optional(),
  pov: z.enum(['first', 'second', 'third']).optional(),
  mode: z.enum(['ai-assisted', 'user', 'choice-based']).optional(),
  creativityLevel: z.number().min(1).max(10).optional(),
});

export const generateStorySchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  genre: z.enum(['fantasy', 'scifi', 'mystery', 'romance', 'thriller', 'horror']),
  pov: z.enum(['first', 'second', 'third']),
  creativity: z.number().min(1).max(10).optional(),
  maxTokens: z.number().optional(),
});

export function validate<T>(schema: z.ZodSchema<T>, data: any): T {
  return schema.parse(data);
}
