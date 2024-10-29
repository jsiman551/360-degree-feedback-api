import { z } from 'zod';

export const feedbackSchema = z.object({
    body: z.object({
        evaluationId: z.string().min(1, 'Evaluation ID is required'),
        feedbackText: z.string().min(1, 'Feedback is required'),
        score: z.number().min(1, 'Score must be at least 1').max(5, 'Score cannot be more than 5'),
    }),
});
