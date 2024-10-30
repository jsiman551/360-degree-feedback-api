import { Request, Response, NextFunction } from 'express';
import { addFeedbackToEvaluation as addFeedbackToEvaluationService } from '../services/feedbackService';
import { CustomError } from '../middlewares/errorHandler';

interface CustomRequest extends Request {
    user?: {
        id: string;
        role: 'Admin' | 'Manager' | 'Employee';
    };
}

export const addFeedbackToEvaluation = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            const error: CustomError = new Error('Unauthorized: user information missing');
            error.statusCode = 401;
            return next(error);
        }

        const { evaluationId, feedbackText, score } = req.body;

        const updatedEvaluation = await addFeedbackToEvaluationService({
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
    } catch (error) {
        next(error);
    }
};
