import { describe, it, expect, vi } from 'vitest';
import { loginUserController, registerUserController } from '../controllers/authController';
import * as authService from '../services/authService';
import { Request, Response, NextFunction } from 'express';

vi.mock('../services/authService'); // Mock authService

describe('authController', () => {
    describe('loginUserController', () => {
        it('should login a user and respond with token', async () => {
            const mockResponse = {
                token: 'mockedToken',
                user: {
                    _id: '12345',
                    username: 'testUser',
                    email: 'test@example.com',
                    role: 'Admin',
                },
            };

            // Mock loginUser Function and return mockResponse
            (authService.loginUser as vi.Mock).mockResolvedValue(mockResponse);

            // Simulations for req, res, y next
            const req = { body: { username: 'testUser', password: 'password123' } } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response;
            const next = vi.fn() as NextFunction;

            await loginUserController(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Login Successful',
                token: 'mockedToken',
                user: {
                    id: '12345',
                    username: 'testUser',
                    email: 'test@example.com',
                    role: 'Admin',
                },
            });
        });
    });
});

describe('authController', () => {
    describe('registerUserController', () => {
        it('should register a user and respond with user data', async () => {
            const mockUser = {
                _id: '12345',
                username: 'newUser',
                email: 'newuser@example.com',
                role: 'Employee',
            };

            // Mock Fn registerUser and return mockUser
            (authService.registerUser as vi.Mock).mockResolvedValue(mockUser);

            // Simulations for req, res, y next
            const req = {
                body: {
                    username: 'newUser',
                    email: 'newuser@example.com',
                    password: 'password123',
                    role: 'Employee',
                },
            } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response;
            const next = vi.fn() as NextFunction;

            await registerUserController(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'User was created successfully',
                data: {
                    id: '12345',
                    username: 'newUser',
                    email: 'newuser@example.com',
                    role: 'Employee',
                },
            });
        });

        it('should call next with an error if registerUser throws an error', async () => {
            const mockError = new Error('Email already in use');

            // Mock Fn registerUser to get error
            (authService.registerUser as vi.Mock).mockRejectedValue(mockError);

            const req = {
                body: {
                    username: 'newUser',
                    email: 'newuser@example.com',
                    password: 'password123',
                    role: 'Employee',
                },
            } as Request;
            const res = {
                status: vi.fn(),
                json: vi.fn(),
            } as unknown as Response;
            const next = vi.fn() as NextFunction;

            await registerUserController(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });
});
