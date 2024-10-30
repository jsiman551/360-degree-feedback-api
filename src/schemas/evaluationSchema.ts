import { z } from 'zod';

export const evaluationSchema = z.object({
    body: z.object({
        employeeId: z.string().min(1, 'Employee ID is required'),
        score: z.number().min(1, 'Score must be at least 1').max(5, 'Score must be at most 5'),
        comments: z.string().optional(),
    }),
});

export const updateEvaluationSchema = z.object({
    body: z.object({
        score: z
            .number()
            .min(1, 'Score must be at least 1')
            .max(5, 'Score must be at most 5')
            .optional(),
        comments: z.string().optional(),
    }),
});
