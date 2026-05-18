import { z } from 'zod';

export const participantSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  employeeId: z.string().optional(),
  department: z.string().optional(),
});

export type ParticipantInput = z.infer<typeof participantSchema>;

export const prizeTierSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Prize name is required'),
  maxWinners: z.number().int().positive('Must have at least 1 winner'),
  displayColor: z.string().optional(),
});

export type PrizeTierInput = z.infer<typeof prizeTierSchema>;

export const prizeTierFormSchema = prizeTierSchema.omit({ id: true });

export type PrizeTierFormInput = z.infer<typeof prizeTierFormSchema>;
