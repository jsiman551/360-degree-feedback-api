import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

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
