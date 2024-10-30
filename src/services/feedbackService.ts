import mongoose from 'mongoose';
import Evaluation from '../models/evaluation';
import { CustomError } from '../middlewares/errorHandler';

interface FeedbackData {
    evaluationId: string;
    feedbackText: string;
    score: number;
    userId: string;
}

export const addFeedbackToEvaluation = async (feedbackData: FeedbackData) => {
    const { evaluationId, feedbackText, score, userId } = feedbackData;

    // Search evaluation by id
    const evaluation = await Evaluation.findById(evaluationId);
    if (!evaluation) {
        const error: CustomError = new Error('Evaluation not found');
        error.statusCode = 404;
        throw error;
    }

    // add feedback to evaluation
    evaluation.feedbacks.push({
        feedbackText,
        score,
        date: new Date(),
        user: new mongoose.Types.ObjectId(userId),
    });

    // save feedback
    await evaluation.save();

    return evaluation;
};
