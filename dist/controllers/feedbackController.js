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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFeedbackToEvaluation = void 0;
const feedbackService_1 = require("../services/feedbackService");
const addFeedbackToEvaluation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            const error = new Error('Unauthorized: user information missing');
            error.statusCode = 401;
            return next(error);
        }
        const { evaluationId, feedbackText, score } = req.body;
        const updatedEvaluation = yield (0, feedbackService_1.addFeedbackToEvaluation)({
            evaluationId,
            feedbackText,
            score,
            userId: req.user.id,
        });
        res.status(201).json({
            success: true,
            message: 'Feedback added successfully',
            data: updatedEvaluation,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.addFeedbackToEvaluation = addFeedbackToEvaluation;
