import { Schema, model, Document } from 'mongoose';

export interface IFollow_employer extends Document {
    candidate_id: number;
    employer_id: number;
    followed_at: Date;
}

const follow_employerSchema = new Schema<IFollow_employer>({
    candidate_id: { type: Number, required: true },
    employer_id: { type: Number, required: true },
    followed_at: { type: Date, default: Date.now }
});

export default model<IFollow_employer>('Follow_employer', follow_employerSchema);
