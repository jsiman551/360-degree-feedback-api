import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
    evaluation: mongoose.Types.ObjectId;
    feedbackText: string;
    score: number;
    date: Date;
}

const feedbackSchema = new Schema<IFeedback>({
    evaluation: { type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation', required: true },
    feedbackText: { type: String },
    score: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

export default mongoose.model<IFeedback>('Feedback', feedbackSchema);
