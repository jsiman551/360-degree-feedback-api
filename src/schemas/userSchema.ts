import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        username: z.string().min(3, 'At least 3 characters for username are required'),
        password: z.string().min(6, 'At least 6 characters for password are required'),
        role: z.enum(['Admin', 'Manager', 'Employee'], {
            required_error: 'Role is required, it must be Admin, Manager or Employee',
        }),
    }),
});