"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Middleware for Zod Validation
const validateResource = (schema) => (req, res, next) => {
    try {
        // Validate request values
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            // Create a custom error for Zod validation errors
            const customError = new Error(error.errors[0].message);
            customError.statusCode = 400;
            customError.message = 'Validation error';
            // Attach formatted Zod errors to the custom error
            customError.errors = error.errors.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return next(customError);
        }
        next(error);
    }
};
exports.default = validateResource;
