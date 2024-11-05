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
const evaluationService = __importStar(require("../services/evaluationService"));
const evaluationController_1 = require("../controllers/evaluationController");
(0, vitest_1.describe)('Evaluation Controller', () => {
    const mockRequest = (user) => ({
        user,
        body: {},
        params: {},
    });
    const mockResponse = () => {
        const res = {
            status: vitest_1.vi.fn().mockReturnThis(),
            json: vitest_1.vi.fn(),
        };
        return res;
    };
    const mockNext = vitest_1.vi.fn();
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('createEvaluation', () => {
        (0, vitest_1.it)('should create a new evaluation for an authorized user', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ id: 'user-id', role: 'Employee' });
            req.body = { employeeId: 'employee-id', score: 4, comments: 'Good performance' };
            const mockNewEvaluation = Object.assign(Object.assign({ id: 'eval-id' }, req.body), { evaluatorId: req.user.id });
            vitest_1.vi.spyOn(evaluationService, 'createEvaluation').mockResolvedValue(mockNewEvaluation);
            const res = mockResponse();
            yield (0, evaluationController_1.createEvaluation)(req, res, mockNext);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(201);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Evaluation created successfully',
                data: mockNewEvaluation,
            });
        }));
        (0, vitest_1.it)('should return an error if user information is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest();
            const res = mockResponse();
            yield (0, evaluationController_1.createEvaluation)(req, res, mockNext);
            (0, vitest_1.expect)(mockNext).toHaveBeenCalledWith(new Error('Unauthorized: user information missing'));
        }));
    });
    (0, vitest_1.describe)('getEvaluationById', () => {
        (0, vitest_1.it)('should return the evaluation for an authorized user', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ id: 'user-id', role: 'Employee' });
            req.params.id = 'evaluation-id';
            const mockEvaluation = { id: 'evaluation-id', score: 4, comments: 'Good performance' };
            vitest_1.vi.spyOn(evaluationService, 'getEvaluationById').mockResolvedValue(mockEvaluation);
            const res = mockResponse();
            yield (0, evaluationController_1.getEvaluationById)(req, res, mockNext);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockEvaluation,
            });
        }));
        (0, vitest_1.it)('should return an error if user information is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest();
            const res = mockResponse();
            yield (0, evaluationController_1.getEvaluationById)(req, res, mockNext);
            (0, vitest_1.expect)(mockNext).toHaveBeenCalledWith(new Error('Unauthorized: user information missing'));
        }));
    });
    (0, vitest_1.describe)('updateEvaluation', () => {
        (0, vitest_1.it)('should update the evaluation for an authorized user', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ id: 'user-id', role: 'Manager' });
            req.params.id = 'evaluation-id';
            req.body = { score: 5, comments: 'Excellent performance' };
            const mockUpdatedEvaluation = Object.assign({ id: 'evaluation-id' }, req.body);
            vitest_1.vi.spyOn(evaluationService, 'updateEvaluation').mockResolvedValue(mockUpdatedEvaluation);
            const res = mockResponse();
            yield (0, evaluationController_1.updateEvaluation)(req, res, mockNext);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockUpdatedEvaluation,
            });
        }));
        (0, vitest_1.it)('should return an error if user information is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest();
            const res = mockResponse();
            yield (0, evaluationController_1.updateEvaluation)(req, res, mockNext);
            (0, vitest_1.expect)(mockNext).toHaveBeenCalledWith(new Error('Unauthorized: user information missing'));
        }));
    });
    (0, vitest_1.describe)('getEvaluationsByEmployeeId', () => {
        (0, vitest_1.it)('should return evaluations for an authorized user', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ id: 'user-id', role: 'Manager' });
            req.params.id = 'employee-id';
            const mockEvaluations = [{ id: 'eval-id', score: 4, comments: 'Good job' }];
            vitest_1.vi.spyOn(evaluationService, 'getEvaluationsByEmployeeId').mockResolvedValue(mockEvaluations);
            const res = mockResponse();
            yield (0, evaluationController_1.getEvaluationsByEmployeeId)(req, res, mockNext);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockEvaluations,
            });
        }));
        (0, vitest_1.it)('should return an error if user information is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest();
            const res = mockResponse();
            yield (0, evaluationController_1.getEvaluationsByEmployeeId)(req, res, mockNext);
            (0, vitest_1.expect)(mockNext).toHaveBeenCalledWith(new Error('Unauthorized: user information missing'));
        }));
    });
});
