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
exports.loginUser = exports.registerUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, role } = data;
    // Verify if email exists
    const existingUserByEmail = yield user_1.default.findOne({ email });
    if (existingUserByEmail) {
        throw new Error('Email already in use');
    }
    try {
        // Create and save user
        const newUser = new user_1.default({ username, email, password, role });
        yield newUser.save();
        return newUser;
    }
    catch (error) {
        // Check if is duplicated username
        if (error instanceof mongodb_1.MongoError && error.code === 11000) {
            throw new Error('Username already in use');
        }
        throw error; // other errors
    }
});
exports.registerUser = registerUser;
const loginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = data;
    // Search user by username
    const user = yield user_1.default.findOne({ username });
    if (!user) {
        throw new Error('Invalid Credentials');
    }
    // Compare passwords
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid Credentials');
    }
    // Generate JWT
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user };
});
exports.loginUser = loginUser;
