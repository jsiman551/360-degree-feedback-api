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
exports.generateEmployeeReport = exports.getEmployees = void 0;
const employeeService = __importStar(require("../services/employeeService"));
const getEmployees = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            const error = new Error('User information missing');
            error.statusCode = 401;
            return next(error);
        }
        const employees = yield employeeService.getAllEmployees(req.user.role);
        res.status(200).json({
            success: true,
            data: employees,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getEmployees = getEmployees;
const generateEmployeeReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            const error = new Error('User information missing');
            error.statusCode = 401;
            return next(error);
        }
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        // Verify if user exists
        const employee = yield employeeService.getEmployeeById(id);
        if (!employee) {
            const error = new Error('Employee not found');
            error.statusCode = 404;
            return next(error);
        }
        // get employee evaluations
        const evaluations = yield employeeService.getEmployeeEvaluations(id, userId, userRole);
        // Generate report
        const report = yield employeeService.generateEmployeeReport(employee, evaluations);
        res.status(200).json({
            success: true,
            data: report,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.generateEmployeeReport = generateEmployeeReport;
