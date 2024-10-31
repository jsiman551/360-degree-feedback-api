"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../controllers/employeeController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get('/employees', (0, authMiddleware_1.authorizeRoles)(['Admin', 'Manager']), employeeController_1.getEmployees);
router.get('/reports/employee/:id', (0, authMiddleware_1.authorizeRoles)(['Admin', 'Manager', 'Employee']), employeeController_1.generateEmployeeReport);
exports.default = router;
