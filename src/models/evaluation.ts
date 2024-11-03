import mongoose, { Schema, Document } from 'mongoose';

interface IFeedback {
    feedbackText: string;
    score: number;
    date: Date;
    user: mongoose.Types.ObjectId;
    commentor: string;
}

export interface IEvaluation extends Document {
    employee: mongoose.Types.ObjectId;
    evaluator: mongoose.Types.ObjectId;
    feedbacks: IFeedback[];
    score: number;
    comments: string;
    date: Date;
    updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>({
    feedbackText: { type: String, required: true },
    score: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    commentor: { type: String, required: true },
});

const evaluationSchema = new Schema<IEvaluation>({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    feedbacks: [feedbackSchema],
    score: { type: Number, required: true },
    comments: { type: String },
    date: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

// Middleware to update UpdateAt field, before updating
evaluationSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() });
    next();
});

export default mongoose.model<IEvaluation>('Evaluation', evaluationSchema);
