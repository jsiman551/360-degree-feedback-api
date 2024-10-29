import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

interface CustomAuthRequest extends Request {
    userRole?: string;
}

interface CustomError extends Error {
    statusCode?: number;
}

export const getEmployees = async (req: CustomAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userRole = req.userRole;

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
