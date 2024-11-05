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
const vitest_1 = require("vitest");
const feedbackController_1 = require("../controllers/feedbackController");
(0, vitest_1.describe)('Feedback Controller', () => {
    const mockRequest = (user) => ({
        user,
        body: {},
    });
    const mockResponse = () => {
        const res = {
            status: vitest_1.vi.fn().mockReturnThis(),
            json: vitest_1.vi.fn(),
        };
        return res;
    };
    const mockNext = vitest_1.vi.fn();
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('addFeedbackToEvaluation', () => {
        (0, vitest_1.it)('should return an error if user information is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest();
            const res = mockResponse();
            yield (0, feedbackController_1.addFeedbackToEvaluation)(req, res, mockNext);
            (0, vitest_1.expect)(mockNext).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                message: 'Unauthorized: user information missing',
                statusCode: 401,
            }));
        }));
    });
});
