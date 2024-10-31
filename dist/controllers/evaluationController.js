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
exports.getEvaluationsByEmployeeId = exports.updateEvaluation = exports.getEvaluationById = exports.createEvaluation = void 0;
const evaluationService = __importStar(require("../services/evaluationService"));
const createEvaluation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            const error = new Error('Unauthorized: user information missing');
            return next(error);
        }
        const { employeeId, score, comments } = req.body;
        const newEvaluation = yield evaluationService.createEvaluation({
            employeeId,
            evaluatorId: req.user.id,
            score,
            comments,
        });
        res.status(201).json({
            success: true,
            message: 'Evaluation created successfully',
            data: newEvaluation,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createEvaluation = createEvaluation;
const getEvaluationById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new Error('Unauthorized: user information missing'));
        }
        const { id } = req.params;
        const evaluation = yield evaluationService.getEvaluationById(id, req.user.id, req.user.role);
        res.status(200).json({
            success: true,
            data: evaluation,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getEvaluationById = getEvaluationById;
const updateEvaluation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            const error = new Error('Unauthorized: user information missing');
            return next(error);
        }
        const { id } = req.params;
        const { score, comments } = req.body;
        const updatedEvaluation = yield evaluationService.updateEvaluation(id, { score, comments }, req.user.id);
        res.status(200).json({
            success: true,
            data: updatedEvaluation,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateEvaluation = updateEvaluation;
const getEvaluationsByEmployeeId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!req.user) {
            const error = new Error('Unauthorized: user information missing');
            return next(error);
        }
        const { id: employeeId } = req.params;
        const evaluations = yield evaluationService.getEvaluationsByEmployeeId(employeeId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.role, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        res.status(200).json({
            success: true,
            data: evaluations,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getEvaluationsByEmployeeId = getEvaluationsByEmployeeId;
