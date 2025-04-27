import { Schema, model, Document } from 'mongoose';

export interface IFollow extends Document {
    candidate_id: string;
    employer_id: string;
    followed_at: Date;
}

const followSchema = new Schema<IFollow>({
    candidate_id: { type: String, required: true },
    employer_id: { type: String, required: true },
    followed_at: { type: Date, default: Date.now }
});

export default model<IFollow>('Follow', followSchema);
