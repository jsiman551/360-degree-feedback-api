"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const errorHandler = (err, _req, res, _next) => {
    var _a;
    const status = err.statusCode || 500;
    const message = err.message || 'Server Error';
    // Verify if it is about a zod validation
    if (err instanceof zod_1.ZodError) {
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
        errors: (_a = err.errors) !== null && _a !== void 0 ? _a : null,
    });
};
exports.default = errorHandler;
