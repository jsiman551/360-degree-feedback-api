import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomAuthRequest extends Request {
    userRole?: string;
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
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            const userRole = (decoded as { role: string }).role;

            if (!allowedRoles.includes(userRole)) {
                const error: CustomError = new Error('Access denied');
                error.statusCode = 403;
                return next(error);
            }

            req.userRole = userRole;
            next();
        } catch (err) {
            const error: CustomError = new Error('Invalid token, authorization denied');
            error.statusCode = 401;
            next(error);
        }
    };
};
