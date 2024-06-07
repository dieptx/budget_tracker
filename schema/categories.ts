import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.string().max(20),
  type: z.enum(['income', 'expense']),
  planAmount: z.number().min(0),
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(3).max(20),
  icon: z.string().max(20),
  planAmount: z.number().min(0),
});

export type UpdateCategorySchemaType = z.infer<typeof UpdateCategorySchema>;

export const DeleteCategorySchema = z.object({
  name: z.string().min(3).max(20),
  type: z.enum(['income', 'expense']),
});

export type DeleteCategorySchemaType = z.infer<typeof DeleteCategorySchema>;
