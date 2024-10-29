import express from 'express';
import { createEvaluation, getEvaluationById, updateEvaluation } from '../controllers/evaluationController';
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

router.get(
    '/evaluations/:id',
    authorizeRoles(['Admin', 'Manager', 'Employee']),
    getEvaluationById
);

router.put(
    '/evaluations/:id',
    authorizeRoles(['Manager', 'Admin']),
    validateResource(evaluationSchema),
    updateEvaluation
);

export default router;
