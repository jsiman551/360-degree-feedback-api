import { Request, Response, NextFunction } from 'express';
import Evaluation from '../models/evaluation';
import User, { IUser } from '../models/user';

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

interface IEmployeeReport {
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

        const userRole = req.user.role;

        let employees;
        if (userRole === 'Admin') {
            employees = await User.find({});
        } else if (userRole === 'Manager') {
            employees = await User.find({ role: { $nin: ['Admin', 'Manager'] } });
        } else {
            const error: CustomError = new Error('Access denied');
            error.statusCode = 403;
            return next(error);
        }

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

        // Look for employee info
        const employee: IUser | null = await User.findById(id);
        if (!employee) {
            const error: CustomError = new Error('Employee not found');
            error.statusCode = 404;
            return next(error);
        }

        // Get user evaluations based on the user's role
        let evaluations;
        if (req.user.role === 'Admin') {
            // Admins can see all evaluations of any employee
            evaluations = await Evaluation.find({ employee: id })
                .populate<{ evaluator: { username: string } }>('evaluator', 'username');
        } else if (req.user.role === 'Manager') {
            // Managers can see evaluations from all managers (including themselves)
            evaluations = await Evaluation.find({ employee: id, evaluator: { $in: await User.find({ role: 'Manager' }).select('_id') } })
                .populate<{ evaluator: { username: string } }>('evaluator', 'username');
        } else if (req.user.role === 'Employee') {
            // Employees can see evaluations made to them by managers only
            evaluations = await Evaluation.find({ employee: id, evaluator: { $in: await User.find({ role: 'Manager' }).select('_id') } })
                .populate<{ evaluator: { username: string } }>('evaluator', 'username');
        } else {
            const error: CustomError = new Error('Access denied');
            error.statusCode = 403;
            return next(error);
        }

        // Resume
        const averageScore = evaluations.length > 0
            ? evaluations.reduce((acc, evaluation) => acc + evaluation.score, 0) / evaluations.length
            : 0;

        // Generate report
        const report: IEmployeeReport = {
            employeeId: employee.id,
            username: employee.username,
            evaluations: evaluations.map(evaluation => ({
                date: evaluation.date,
                score: evaluation.score,
                comments: evaluation.comments,
                evaluator: evaluation.evaluator.username,
            })),
            averageScore: averageScore,
        };

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        next(error);
    }
};
