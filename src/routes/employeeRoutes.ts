import express from 'express';
import { getEmployees } from '../controllers/employeeController';
import { authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/employees', authorizeRoles(['Admin', 'Manager']), getEmployees);

export default router;
