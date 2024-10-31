"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const evaluationController_1 = require("../controllers/evaluationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateResource_1 = __importDefault(require("../middlewares/validateResource"));
const evaluationSchema_1 = require("../schemas/evaluationSchema");
const router = express_1.default.Router();
router.post('/evaluations', (0, authMiddleware_1.authorizeRoles)(['Manager', 'Admin']), (0, validateResource_1.default)(evaluationSchema_1.evaluationSchema), evaluationController_1.createEvaluation);
router.get('/evaluations/:id', (0, authMiddleware_1.authorizeRoles)(['Admin', 'Manager', 'Employee']), evaluationController_1.getEvaluationById);
router.put('/evaluations/:id', (0, authMiddleware_1.authorizeRoles)(['Manager', 'Admin']), (0, validateResource_1.default)(evaluationSchema_1.updateEvaluationSchema), evaluationController_1.updateEvaluation);
router.get('/evaluations/employee/:id', (0, authMiddleware_1.authorizeRoles)(['Admin', 'Manager', 'Employee']), evaluationController_1.getEvaluationsByEmployeeId);
exports.default = router;
