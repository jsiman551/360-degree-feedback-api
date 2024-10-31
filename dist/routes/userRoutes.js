"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validateResource_1 = __importDefault(require("../middlewares/validateResource"));
const userSchema_1 = require("../schemas/userSchema");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// register user route
router.post('/register', (0, authMiddleware_1.authorizeRoles)(['Admin']), (0, validateResource_1.default)(userSchema_1.createUserSchema), authController_1.registerUserController);
// login route
router.post('/login', (0, validateResource_1.default)(userSchema_1.loginUserSchema), authController_1.loginUserController);
exports.default = router;
