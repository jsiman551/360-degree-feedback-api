import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface CustomError extends Error {
    statusCode?: number;
    errors?: { path: string; message: string }[];
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    const status = err.statusCode || 500;
    const message = err.message || 'Server Error';

    // Verify if it is about a zod validation
    if (err instanceof ZodError) {
        const formattedErrors = err.errors.map((error) => ({
            path: error.path,
            message: error.message,
        }));
        res.status(400).json({
            success: false,
            status: 400,
            message: 'Validation error',
            errors: formattedErrors,
        });
        return;
    }

    // General Error
    res.status(status).json({
        success: false,
        status,
        message,
        errors: err.errors ?? null,
    });
};

export default errorHandler;
