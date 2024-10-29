import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    statusCode?: number;
}

// Middleware to handle errors
const errorHandler = (err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Server Error';

    res.status(status).json({
        success: false,
        status,
        message
    });
};

export default errorHandler;
