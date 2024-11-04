import { describe, it, expect, vi, afterEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { addFeedbackToEvaluation } from '../controllers/feedbackController';

describe('Feedback Controller', () => {
    const mockRequest = (user?: { id: string; role: 'Admin' | 'Manager' | 'Employee' }) => ({
        user,
        body: {},
    }) as Request;

    const mockResponse = () => {
        const res: Partial<Response> = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        return res as Response;
    };

    const mockNext = vi.fn() as NextFunction;

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('addFeedbackToEvaluation', () => {
        it('should return an error if user information is missing', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await addFeedbackToEvaluation(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Unauthorized: user information missing',
                statusCode: 401,
            }));
        });
    });
});
