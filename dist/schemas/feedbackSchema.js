"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackSchema = void 0;
const zod_1 = require("zod");
exports.feedbackSchema = zod_1.z.object({
    body: zod_1.z.object({
        evaluationId: zod_1.z.string().min(1, 'Evaluation ID is required'),
        feedbackText: zod_1.z.string().min(1, 'Feedback is required'),
        score: zod_1.z.number().min(1, 'Score must be at least 1').max(5, 'Score cannot be more than 5'),
    }),
});
