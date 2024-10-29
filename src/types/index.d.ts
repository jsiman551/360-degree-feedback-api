import express from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id: string;
            role: 'Admin' | 'Manager' | 'Employee';
        };
    }
}
