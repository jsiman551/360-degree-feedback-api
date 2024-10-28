import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

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
                    // Make Zod errors readable
                    const formattedErrors = error.errors.map((err) => ({
                        path: err.path.join('.'),
                        message: err.message,
                    }));
                    res.status(400).json({
                        success: false,
                        message: formattedErrors[0].message, //give message
                        errors: formattedErrors,
                    });
                    return;
                }
                next(error);
            }
        };

export default validateResource;
