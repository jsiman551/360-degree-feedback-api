import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

interface CustomError extends Error {
    statusCode?: number;
}

// Middleware for Zod Validation
const validateResource =
    (schema: ZodSchema<any>) =>
        (req: Request, res: Response, next: NextFunction): void => {
            try {
                // Validate request values
                schema.parse({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });
                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    // Create a custom error for Zod validation errors
                    const customError: CustomError = new Error(error.errors[0].message);
                    customError.statusCode = 400;
                    customError.message = 'Validation error';

                    // Attach formatted Zod errors to the custom error
                    (customError as any).errors = error.errors.map((err) => ({
                        path: err.path.join('.'),
                        message: err.message,
                    }));
                    return next(customError);
                }
                next(error);
            }
        };

export default validateResource;
