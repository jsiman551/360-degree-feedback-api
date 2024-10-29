import express from 'express';
import { createEvaluation } from '../controllers/evaluationController';
import { authorizeRoles } from '../middlewares/authMiddleware';
import validateResource from '../middlewares/validateResource';
import { evaluationSchema } from '../schemas/evaluationSchema';

const router = express.Router();

router.post(
    '/evaluations',
    authorizeRoles(['Manager', 'Admin']),
    validateResource(evaluationSchema),
    createEvaluation
);

export default router;
