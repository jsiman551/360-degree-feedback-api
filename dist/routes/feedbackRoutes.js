"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedbackController_1 = require("../controllers/feedbackController");
const validateResource_1 = __importDefault(require("../middlewares/validateResource"));
const feedbackSchema_1 = require("../schemas/feedbackSchema");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/feedback', (0, authMiddleware_1.authorizeRoles)(['Manager', 'Admin']), (0, validateResource_1.default)(feedbackSchema_1.feedbackSchema), feedbackController_1.addFeedbackToEvaluation);
exports.default = router;
