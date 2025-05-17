import { Schema, model, Document } from 'mongoose';

export interface IFollow_job extends Document {
    candidate_id: number;
    job_id: string;
    followed_at: Date;
}

const follow_jobSchema = new Schema<IFollow_job>({
    candidate_id: { type: Number, required: true },
    job_id: { type: String, required: true },
    followed_at: { type: Date, default: Date.now }
});

export default model<IFollow_job>('Follow_job', follow_jobSchema);
