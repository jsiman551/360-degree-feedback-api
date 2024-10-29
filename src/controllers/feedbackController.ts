import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Evaluation from '../models/evaluation';
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

        // Validate required fields
        if (!evaluationId || !feedbackText || score === undefined) {
            const error: CustomError = new Error('Evaluation ID, feedback text, and score are required');
            error.statusCode = 400;
            return next(error);
        }

        // Find the evaluation
        const evaluation = await Evaluation.findById(evaluationId);

        if (!evaluation) {
            const error: CustomError = new Error('Evaluation not found');
            error.statusCode = 404;
            return next(error);
        }

        // Add feedback to the evaluation
        evaluation.feedbacks.push({
            feedbackText,
            score,
            date: new Date(),
            user: new mongoose.Types.ObjectId(req.user.id),
        });

        await evaluation.save();

        // Success response
        res.status(201).json({
            success: true,
            message: 'Feedback added successfully',
            data: evaluation,
        });
    } catch (error) {
        next(error);
    }
};
