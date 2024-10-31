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
exports.generateEmployeeReport = exports.getEmployeeEvaluations = exports.getEmployeeById = exports.getAllEmployees = void 0;
const evaluation_1 = __importDefault(require("../models/evaluation"));
const user_1 = __importDefault(require("../models/user"));
const getAllEmployees = (userRole) => __awaiter(void 0, void 0, void 0, function* () {
    if (userRole === 'Admin') {
        return yield user_1.default.find({}).select('-password');
    }
    else if (userRole === 'Manager') {
        return yield user_1.default.find({ role: { $nin: ['Admin', 'Manager'] } }).select('-password');
    }
    else {
        throw new Error('Access denied');
    }
});
exports.getAllEmployees = getAllEmployees;
const getEmployeeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findById(id);
});
exports.getEmployeeById = getEmployeeById;
const getEmployeeEvaluations = (id, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    let evaluations;
    if (userRole === 'Admin') {
        evaluations = yield evaluation_1.default.find({ employee: id })
            .populate('evaluator', 'username');
    }
    else if (userRole === 'Manager') {
        const managerIds = yield user_1.default.find({ role: 'Manager' }).select('_id');
        evaluations = yield evaluation_1.default.find({ employee: id, evaluator: { $in: managerIds } })
            .populate('evaluator', 'username');
    }
    else if (userRole === 'Employee') {
        if (id !== userId) {
            throw new Error('Access denied');
        }
        const managerIds = yield user_1.default.find({ role: 'Manager' }).select('_id');
        evaluations = yield evaluation_1.default.find({ employee: id, evaluator: { $in: managerIds } })
            .populate('evaluator', 'username');
    }
    else {
        throw new Error('Access denied');
    }
    return evaluations;
});
exports.getEmployeeEvaluations = getEmployeeEvaluations;
const generateEmployeeReport = (employee, evaluations) => __awaiter(void 0, void 0, void 0, function* () {
    const averageScore = evaluations.length > 0
        ? evaluations.reduce((acc, evaluation) => acc + evaluation.score, 0) / evaluations.length
        : 0;
    const report = {
        employeeId: employee.id,
        username: employee.username,
        evaluations: evaluations.map(evaluation => ({
            date: evaluation.date,
            score: evaluation.score,
            comments: evaluation.comments,
            evaluator: evaluation.evaluator.username,
        })),
        averageScore: averageScore,
    };
    return report;
});
exports.generateEmployeeReport = generateEmployeeReport;
