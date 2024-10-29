import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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

export const authorizeRoles = (allowedRoles: string[]) => {
    return (req: CustomAuthRequest, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error: CustomError = new Error('No token provided, authorization denied');
            error.statusCode = 401;
            return next(error);
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: 'Admin' | 'Manager' | 'Employee' };
            const userId = decoded.id;  // get user id
            const userRole = decoded.role; // get user role

            if (!allowedRoles.includes(userRole)) {
                const error: CustomError = new Error('Access denied');
                error.statusCode = 403;
                return next(error);
            }

            // add user data
            req.user = {
                id: userId,
                role: userRole,
            };
            next();
        } catch (err) {
            const error: CustomError = new Error('Invalid token, authorization denied');
            error.statusCode = 401;
            next(error);
        }
    };
};
