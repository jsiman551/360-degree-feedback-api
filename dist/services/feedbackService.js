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
exports.addFeedbackToEvaluation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const evaluation_1 = __importDefault(require("../models/evaluation"));
const user_1 = __importDefault(require("../models/user"));
const addFeedbackToEvaluation = (feedbackData) => __awaiter(void 0, void 0, void 0, function* () {
    const { evaluationId, feedbackText, score, userId } = feedbackData;
    // Search evaluation by id
    const evaluation = yield evaluation_1.default.findById(evaluationId);
    if (!evaluation) {
        const error = new Error('Evaluation not found');
        error.statusCode = 404;
        throw error;
    }
    const user = yield user_1.default.findById(userId).select('username');
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
    evaluation.feedbacks.push({
        feedbackText,
        score,
        date: new Date(),
        user: new mongoose_1.default.Types.ObjectId(userId),
        commentor: user.username,
    });
    yield evaluation.save();
    return evaluation;
});
exports.addFeedbackToEvaluation = addFeedbackToEvaluation;
