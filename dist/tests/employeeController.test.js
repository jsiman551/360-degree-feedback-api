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
const employeeService = __importStar(require("../services/employeeService"));
const employeeController_1 = require("../controllers/employeeController");
(0, vitest_1.describe)('Employee Controller', () => {
    let req;
    let res;
    let next;
    (0, vitest_1.beforeEach)(() => {
        req = {
            user: {
                id: 'user-id',
                role: 'Admin',
            },
        };
        res = {
            status: vitest_1.vi.fn().mockReturnThis(),
            json: vitest_1.vi.fn(),
        };
        next = vitest_1.vi.fn();
    });
    (0, vitest_1.describe)('getEmployees', () => {
        (0, vitest_1.it)('should return a list of employees for authorized users', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockEmployees = [{ id: '1', name: 'John Doe' }];
            vitest_1.vi.spyOn(employeeService, 'getAllEmployees').mockResolvedValue(mockEmployees);
            yield (0, employeeController_1.getEmployees)(req, res, next);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockEmployees,
            });
        }));
        (0, vitest_1.it)('should call next with an error if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            req.user = undefined; // there is no user simulation
            yield (0, employeeController_1.getEmployees)(req, res, next);
            (0, vitest_1.expect)(next).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                statusCode: 401,
                message: 'User information missing',
            }));
        }));
        (0, vitest_1.it)('should call next with an error if employeeService throws', () => __awaiter(void 0, void 0, void 0, function* () {
            vitest_1.vi.spyOn(employeeService, 'getAllEmployees').mockRejectedValue(new Error('Service error'));
            yield (0, employeeController_1.getEmployees)(req, res, next);
            (0, vitest_1.expect)(next).toHaveBeenCalledWith(vitest_1.expect.any(Error));
        }));
    });
    (0, vitest_1.describe)('generateEmployeeReport', () => {
        (0, vitest_1.it)('should return an employee report for authorized users', () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: 'employee-id' };
            const mockEmployee = { id: 'employee-id', name: 'Jane Doe' };
            const mockEvaluations = [{ date: new Date(), score: 5, comments: 'Great job!', evaluator: 'evaluator-id' }];
            const mockReport = {
                employeeId: 'employee-id',
                username: 'Jane Doe',
                evaluations: mockEvaluations,
                averageScore: 5,
            };
            vitest_1.vi.spyOn(employeeService, 'getEmployeeById').mockResolvedValue(mockEmployee);
            vitest_1.vi.spyOn(employeeService, 'getEmployeeEvaluations').mockResolvedValue(mockEvaluations);
            vitest_1.vi.spyOn(employeeService, 'generateEmployeeReport').mockResolvedValue(mockReport);
            yield (0, employeeController_1.generateEmployeeReport)(req, res, next);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockReport,
            });
        }));
        (0, vitest_1.it)('should call next with an error if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            req.user = undefined;
            yield (0, employeeController_1.generateEmployeeReport)(req, res, next);
            (0, vitest_1.expect)(next).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                statusCode: 401,
                message: 'User information missing',
            }));
        }));
        (0, vitest_1.it)('should call next with an error if employee is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: 'employee-id' };
            vitest_1.vi.spyOn(employeeService, 'getEmployeeById').mockResolvedValue(null);
            yield (0, employeeController_1.generateEmployeeReport)(req, res, next);
            (0, vitest_1.expect)(next).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                statusCode: 404,
                message: 'Employee not found',
            }));
        }));
        (0, vitest_1.it)('should call next with an error if employeeService throws', () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: 'employee-id' };
            vitest_1.vi.spyOn(employeeService, 'getEmployeeById').mockRejectedValue(new Error('Service error'));
            yield (0, employeeController_1.generateEmployeeReport)(req, res, next);
            (0, vitest_1.expect)(next).toHaveBeenCalledWith(vitest_1.expect.any(Error));
        }));
    });
});
