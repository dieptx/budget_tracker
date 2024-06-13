import { z } from 'zod';

export const CreateIncomeSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string().optional(),
  date: z.coerce.date(),
  year: z.coerce.number().positive(),
  month: z.coerce.number().positive(),
});

export type CreateIncomeSchemaType = z.infer<typeof CreateIncomeSchema>;

export const DistributeIncomeSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  fund: z.object({
    id: z.coerce.number().positive(),
    name: z.coerce.string(),
  }),
});

export type DistributeIncomeSchemaType = z.infer<typeof DistributeIncomeSchema>;
