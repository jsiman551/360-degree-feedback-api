import express from 'express';
import { generateEmployeeReport, getEmployees } from '../controllers/employeeController';
import { authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

router.get(
    '/employees',
    authorizeRoles(['Admin', 'Manager']),
    getEmployees
);
router.get(
    '/reports/employee/:id',
    authorizeRoles(['Admin', 'Manager', 'Employee']),
    generateEmployeeReport
);

export default router;
