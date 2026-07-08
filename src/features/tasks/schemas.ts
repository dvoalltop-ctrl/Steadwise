import { z } from 'zod';

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional().nullable(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  dueDate: z.string().optional().nullable(),
  dueTime: z.string().optional().nullable(),
  areaId: z.string().optional().nullable(),
  recurrenceRule: z.string().optional().nullable(),
  season: z.enum(['spring', 'summer', 'fall', 'winter']).optional().nullable(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const expenseFormSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  expenseDate: z.string().min(1, 'Date is required'),
  vendor: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  enterprise: z.enum(['garden', 'chickens', 'goats', 'pantry', 'general']).default('general'),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
