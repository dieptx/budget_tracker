import { z } from 'zod';

export const UpdateFundSchema = z.object({
  id: z.number(),
  name: z.string().min(3).max(20),
  description: z.string().min(3).max(20).optional(),
  targetAmount: z.coerce.number().positive().multipleOf(0.01),
  currentAmount: z.coerce.number().positive().multipleOf(0.01),
});

export type UpdateFundSchemaType = z.infer<typeof UpdateFundSchema>;
