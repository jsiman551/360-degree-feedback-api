import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import * as employeeService from '../services/employeeService';
import { generateEmployeeReport, getEmployees } from '../controllers/employeeController';

describe('Employee Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            user: {
                id: 'user-id',
                role: 'Admin',
            },
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        next = vi.fn();
    });

    describe('getEmployees', () => {
        it('should return a list of employees for authorized users', async () => {
            const mockEmployees = [{ id: '1', name: 'John Doe' }];
            vi.spyOn(employeeService, 'getAllEmployees').mockResolvedValue(mockEmployees);

            await getEmployees(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockEmployees,
            });
        });

        it('should call next with an error if user is not authenticated', async () => {
            req.user = undefined; // there is no user simulation
            await getEmployees(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 401,
                message: 'User information missing',
            }));
        });

        it('should call next with an error if employeeService throws', async () => {
            vi.spyOn(employeeService, 'getAllEmployees').mockRejectedValue(new Error('Service error'));

            await getEmployees(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('generateEmployeeReport', () => {
        it('should return an employee report for authorized users', async () => {
            req.params = { id: 'employee-id' };
            const mockEmployee = { id: 'employee-id', name: 'Jane Doe' };
            const mockEvaluations = [{ date: new Date(), score: 5, comments: 'Great job!', evaluator: 'evaluator-id' }];
            const mockReport = {
                employeeId: 'employee-id',
                username: 'Jane Doe',
                evaluations: mockEvaluations,
                averageScore: 5,
            };

            vi.spyOn(employeeService, 'getEmployeeById').mockResolvedValue(mockEmployee);
            vi.spyOn(employeeService, 'getEmployeeEvaluations').mockResolvedValue(mockEvaluations);
            vi.spyOn(employeeService, 'generateEmployeeReport').mockResolvedValue(mockReport);

            await generateEmployeeReport(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockReport,
            });
        });

        it('should call next with an error if user is not authenticated', async () => {
            req.user = undefined;
            await generateEmployeeReport(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 401,
                message: 'User information missing',
            }));
        });

        it('should call next with an error if employee is not found', async () => {
            req.params = { id: 'employee-id' };
            vi.spyOn(employeeService, 'getEmployeeById').mockResolvedValue(null);

            await generateEmployeeReport(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 404,
                message: 'Employee not found',
            }));
        });

        it('should call next with an error if employeeService throws', async () => {
            req.params = { id: 'employee-id' };
            vi.spyOn(employeeService, 'getEmployeeById').mockRejectedValue(new Error('Service error'));

            await generateEmployeeReport(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
