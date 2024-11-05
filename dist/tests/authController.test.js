"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const authController_1 = require("../controllers/authController");
const authService = __importStar(require("../services/authService"));
vitest_1.vi.mock('../services/authService'); // Mock authService
(0, vitest_1.describe)('authController', () => {
    (0, vitest_1.describe)('loginUserController', () => {
        (0, vitest_1.it)('should login a user and respond with token', () => __awaiter(void 0, void 0, void 0, function* () {
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
            authService.loginUser.mockResolvedValue(mockResponse);
            // Simulations for req, res, y next
            const req = { body: { username: 'testUser', password: 'password123' } };
            const res = {
                status: vitest_1.vi.fn().mockReturnThis(),
                json: vitest_1.vi.fn(),
            };
            const next = vitest_1.vi.fn();
            yield (0, authController_1.loginUserController)(req, res, next);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
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
        }));
    });
});
(0, vitest_1.describe)('authController', () => {
    (0, vitest_1.describe)('registerUserController', () => {
        (0, vitest_1.it)('should register a user and respond with user data', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                _id: '12345',
                username: 'newUser',
                email: 'newuser@example.com',
                role: 'Employee',
            };
            // Mock Fn registerUser and return mockUser
            authService.registerUser.mockResolvedValue(mockUser);
            // Simulations for req, res, y next
            const req = {
                body: {
                    username: 'newUser',
                    email: 'newuser@example.com',
                    password: 'password123',
                    role: 'Employee',
                },
            };
            const res = {
                status: vitest_1.vi.fn().mockReturnThis(),
                json: vitest_1.vi.fn(),
            };
            const next = vitest_1.vi.fn();
            yield (0, authController_1.registerUserController)(req, res, next);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(201);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'User was created successfully',
                data: {
                    id: '12345',
                    username: 'newUser',
                    email: 'newuser@example.com',
                    role: 'Employee',
                },
            });
        }));
        (0, vitest_1.it)('should call next with an error if registerUser throws an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error('Email already in use');
            // Mock Fn registerUser to get error
            authService.registerUser.mockRejectedValue(mockError);
            const req = {
                body: {
                    username: 'newUser',
                    email: 'newuser@example.com',
                    password: 'password123',
                    role: 'Employee',
                },
            };
            const res = {
                status: vitest_1.vi.fn(),
                json: vitest_1.vi.fn(),
            };
            const next = vitest_1.vi.fn();
            yield (0, authController_1.registerUserController)(req, res, next);
            (0, vitest_1.expect)(next).toHaveBeenCalledWith(mockError);
        }));
    });
});
