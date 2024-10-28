import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    statusCode?: number;
}

// Middleware to handle errors
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Server Error';
    const stack = process.env.NODE_ENV === 'production' ? null : err.stack;

    res.status(status).json({
        success: false,
        status,
        message,
        stack,
    });
};

export default errorHandler;
