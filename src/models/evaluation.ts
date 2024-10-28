import mongoose, { Schema, Document } from 'mongoose';

export interface IEvaluation extends Document {
    employee: mongoose.Types.ObjectId;
    evaluator: mongoose.Types.ObjectId;
    feedbacks: mongoose.Types.ObjectId[];
    score: number;
    comments: string;
    date: Date;
    updatedAt: Date;
}

const evaluationSchema = new Schema<IEvaluation>({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
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
