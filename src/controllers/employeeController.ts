import { Request, Response, NextFunction } from 'express';
import * as employeeService from '../services/employeeService';
import { IUser } from '../models/user';

interface User {
    id: string;
    role: 'Admin' | 'Manager' | 'Employee';
}

interface CustomAuthRequest extends Request {
    user?: User;
}

interface CustomError extends Error {
    statusCode?: number;
}

export interface IEmployeeReport {
    employeeId: string;
    username: string;
    evaluations: {
        date: Date;
        score: number;
        comments: string;
        evaluator: string;
    }[];
    averageScore: number;
}

export const getEmployees = async (req: CustomAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            const error: CustomError = new Error('User information missing');
            error.statusCode = 401;
            return next(error);
        }

        const employees = await employeeService.getAllEmployees(req.user.role);

        res.status(200).json({
            success: true,
            data: employees,
        });
    } catch (error) {
        next(error);
    }
};

export const generateEmployeeReport = async (req: CustomAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            const error: CustomError = new Error('User information missing');
            error.statusCode = 401;
            return next(error);
        }

        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Verify if user exists
        const employee: IUser | null = await employeeService.getEmployeeById(id);
        if (!employee) {
            const error: CustomError = new Error('Employee not found');
            error.statusCode = 404;
            return next(error);
        }

        // get employee evaluations
        const evaluations = await employeeService.getEmployeeEvaluations(id, userId, userRole);

        // Generate report
        const report: IEmployeeReport = await employeeService.generateEmployeeReport(employee, evaluations);

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        next(error);
    }
};
