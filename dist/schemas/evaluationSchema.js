"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEvaluationSchema = exports.evaluationSchema = void 0;
const zod_1 = require("zod");
exports.evaluationSchema = zod_1.z.object({
    body: zod_1.z.object({
        employeeId: zod_1.z.string().min(1, 'Employee ID is required'),
        score: zod_1.z.number().min(1, 'Score must be at least 1').max(5, 'Score must be at most 5'),
        comments: zod_1.z.string().optional(),
    }),
});
exports.updateEvaluationSchema = zod_1.z.object({
    body: zod_1.z.object({
        score: zod_1.z
            .number()
            .min(1, 'Score must be at least 1')
            .max(5, 'Score must be at most 5')
            .optional(),
        comments: zod_1.z.string().optional(),
    }),
});
