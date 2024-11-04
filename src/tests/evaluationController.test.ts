import { describe, it, expect, vi, afterEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import * as evaluationService from '../services/evaluationService';
import {
    createEvaluation,
    getEvaluationById,
    updateEvaluation,
    getEvaluationsByEmployeeId,
} from '../controllers/evaluationController';

describe('Evaluation Controller', () => {
    const mockRequest = (user?: { id: string; role: 'Admin' | 'Manager' | 'Employee' }) => ({
        user,
        body: {},
        params: {},
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

    describe('createEvaluation', () => {
        it('should create a new evaluation for an authorized user', async () => {
            const req = mockRequest({ id: 'user-id', role: 'Employee' });
            req.body = { employeeId: 'employee-id', score: 4, comments: 'Good performance' };

            const mockNewEvaluation = { id: 'eval-id', ...req.body, evaluatorId: req.user.id };
            vi.spyOn(evaluationService, 'createEvaluation').mockResolvedValue(mockNewEvaluation);

            const res = mockResponse();

            await createEvaluation(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Evaluation created successfully',
                data: mockNewEvaluation,
            });
        });

        it('should return an error if user information is missing', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await createEvaluation(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new Error('Unauthorized: user information missing'));
        });
    });

    describe('getEvaluationById', () => {
        it('should return the evaluation for an authorized user', async () => {
            const req = mockRequest({ id: 'user-id', role: 'Employee' });
            req.params.id = 'evaluation-id';

            const mockEvaluation = { id: 'evaluation-id', score: 4, comments: 'Good performance' };
            vi.spyOn(evaluationService, 'getEvaluationById').mockResolvedValue(mockEvaluation);

            const res = mockResponse();

            await getEvaluationById(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockEvaluation,
            });
        });

        it('should return an error if user information is missing', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await getEvaluationById(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new Error('Unauthorized: user information missing'));
        });
    });

    describe('updateEvaluation', () => {
        it('should update the evaluation for an authorized user', async () => {
            const req = mockRequest({ id: 'user-id', role: 'Manager' });
            req.params.id = 'evaluation-id';
            req.body = { score: 5, comments: 'Excellent performance' };

            const mockUpdatedEvaluation = { id: 'evaluation-id', ...req.body };
            vi.spyOn(evaluationService, 'updateEvaluation').mockResolvedValue(mockUpdatedEvaluation);

            const res = mockResponse();

            await updateEvaluation(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockUpdatedEvaluation,
            });
        });

        it('should return an error if user information is missing', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await updateEvaluation(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new Error('Unauthorized: user information missing'));
        });
    });

    describe('getEvaluationsByEmployeeId', () => {
        it('should return evaluations for an authorized user', async () => {
            const req = mockRequest({ id: 'user-id', role: 'Manager' });
            req.params.id = 'employee-id';

            const mockEvaluations = [{ id: 'eval-id', score: 4, comments: 'Good job' }];
            vi.spyOn(evaluationService, 'getEvaluationsByEmployeeId').mockResolvedValue(mockEvaluations);

            const res = mockResponse();

            await getEvaluationsByEmployeeId(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockEvaluations,
            });
        });

        it('should return an error if user information is missing', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await getEvaluationsByEmployeeId(req, res, mockNext);

            expect(mockNext).toHaveBeenCalledWith(new Error('Unauthorized: user information missing'));
        });
    });
});
