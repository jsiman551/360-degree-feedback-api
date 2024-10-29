import express from 'express';
import { addFeedbackToEvaluation } from '../controllers/feedbackController';
import validateResource from '../middlewares/validateResource';
import { feedbackSchema } from '../schemas/feedbackSchema';
import { authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

router.post(
    '/feedback',
    authorizeRoles(['Manager', 'Admin']),
    validateResource(feedbackSchema),
    addFeedbackToEvaluation
);

export default router;
