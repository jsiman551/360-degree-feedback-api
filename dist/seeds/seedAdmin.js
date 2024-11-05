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
const user_1 = __importDefault(require("../models/user"));
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingAdmin = yield user_1.default.findOne({ username: 'admin' });
        if (!existingAdmin) {
            const adminUser = {
                username: 'admin',
                email: 'josesimancas51@gmail.com',
                password: 'Admin123',
                role: 'Admin',
                createdAt: new Date(),
            };
            yield user_1.default.create(adminUser);
            console.log('Admin user seeded successfully');
        }
        else {
            console.log('Admin user already exists');
        }
    }
    catch (error) {
        const customError = new Error('Error seeding admin user');
        customError.statusCode = 500;
        customError.errors = [{ path: 'seedAdmin', message: error.message }];
        throw customError;
    }
});
exports.default = seedAdmin;
