"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(3, 'At least 3 characters for username are required'),
        password: zod_1.z.string().min(6, 'At least 6 characters for password are required'),
        email: zod_1.z.string().email('Invalid email address').min(1, 'Email is required'),
        role: zod_1.z.enum(['Admin', 'Manager', 'Employee'], {
            required_error: 'Role is required, it must be Admin, Manager or Employee',
        }),
    }),
});
exports.loginUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(1, 'Username is required'),
        password: zod_1.z.string().min(6, 'At least 6 characters are required for password'),
    }),
});
