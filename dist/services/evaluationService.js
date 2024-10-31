"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvaluationsByEmployeeId = exports.updateEvaluation = exports.getEvaluationById = exports.createEvaluation = void 0;
const evaluation_1 = __importDefault(require("../models/evaluation"));
const user_1 = __importDefault(require("../models/user"));
const createEvaluation = (_a) => __awaiter(void 0, [_a], void 0, function* ({ employeeId, evaluatorId, score, comments, }) {
    // Check if employee exists
    const employeeExists = yield user_1.default.findById(employeeId);
    if (!employeeExists) {
        throw new Error('Employee not found');
    }
    // Check for existing evaluation
    const existingEvaluation = yield evaluation_1.default.findOne({
        employee: employeeId,
        evaluator: evaluatorId,
    });
    if (existingEvaluation) {
        throw new Error('Evaluation already exists for this employee by the current evaluator');
    }
    const newEvaluation = new evaluation_1.default({
        employee: employeeId,
        evaluator: evaluatorId,
        score,
        comments,
    });
    yield newEvaluation.save();
    return newEvaluation;
});
exports.createEvaluation = createEvaluation;
const getEvaluationById = (id, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const evaluation = yield evaluation_1.default.findById(id).populate('employee evaluator');
    if (!evaluation) {
        throw new Error('Evaluation not found');
    }
    // Logic by role
    if (userRole === 'Admin') {
        return evaluation;
    }
    if (userRole === 'Manager') {
        const evaluator = yield user_1.default.findById(evaluation.evaluator);
        if (evaluator && evaluator.role === 'Admin') {
            throw new Error('Access denied: you cannot view this evaluation');
        }
        return evaluation;
    }
    if (userRole === 'Employee') {
        if (evaluation.employee._id.toString() !== userId) {
            throw new Error('Access denied: you cannot view this evaluation');
        }
        return evaluation;
    }
    throw new Error('Access denied: invalid role');
});
exports.getEvaluationById = getEvaluationById;
const updateEvaluation = (id_1, _a, userId_1) => __awaiter(void 0, [id_1, _a, userId_1], void 0, function* (id, { score, comments }, userId) {
    const evaluation = yield evaluation_1.default.findById(id).populate('evaluator');
    if (!evaluation) {
        throw new Error('Evaluation not found');
    }
    if (evaluation.evaluator._id.toString() !== userId) {
        throw new Error('Access denied: you are not authorized to update this evaluation');
    }
    if (score !== undefined)
        evaluation.score = score;
    if (comments)
        evaluation.comments = comments;
    yield evaluation.save();
    return evaluation;
});
exports.updateEvaluation = updateEvaluation;
const getEvaluationsByEmployeeId = (employeeId, role, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify if employee exists
    const employeeExists = yield user_1.default.findById(employeeId);
    if (!employeeExists) {
        throw new Error('Employee not found');
    }
    let evaluations;
    if (role === 'Admin') {
        evaluations = yield evaluation_1.default.find({ employee: employeeId }).populate('evaluator employee');
    }
    else if (role === 'Manager') {
        const admins = yield user_1.default.find({ role: 'Admin' }, '_id');
        const adminIds = admins.map(admin => admin._id);
        evaluations = yield evaluation_1.default.find({
            employee: employeeId,
            evaluator: { $nin: adminIds },
        }).populate('evaluator employee');
    }
    else if (role === 'Employee') {
        if (userId !== employeeId) {
            throw new Error('Access denied');
        }
        evaluations = yield evaluation_1.default.find({
            employee: employeeId,
            evaluator: { $nin: yield user_1.default.find({ role: 'Admin' }, '_id') }
        }).populate('evaluator employee');
    }
    else {
        throw new Error('Access denied: invalid role');
    }
    return evaluations;
});
exports.getEvaluationsByEmployeeId = getEvaluationsByEmployeeId;
