"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('No token provided, authorization denied');
            error.statusCode = 401;
            return next(error);
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id; // get user id
            const userRole = decoded.role; // get user role
            if (!allowedRoles.includes(userRole)) {
                const error = new Error('Access denied');
                error.statusCode = 403;
                return next(error);
            }
            // add user data
            req.user = {
                id: userId,
                role: userRole,
            };
            next();
        }
        catch (err) {
            const error = new Error('Invalid token, authorization denied');
            error.statusCode = 401;
            next(error);
        }
    };
};
exports.authorizeRoles = authorizeRoles;
