import { Schema, model, Document } from 'mongoose';

export interface IJob extends Document {
    job_id: string;
    employer_id: string;
    title: string;
    description?: string;
    skills_required: number[];
    industry_id?: number[];
    degree_id?: number;
    experience_years_required?: number;
    quantity?: number;
    job_type: 'full-time' | 'part-time' | 'contract' | 'intern';
    status: 'pending' | 'open' | 'closed';
    created_at: Date;
    updated_at: Date;
}

const jobSchema = new Schema<IJob>({
    job_id: { type: String, required: true, unique: true },
    employer_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills_required: [Number],
    industry_id: Number,
    degree_id: Number,
    experience_years_required: Number,
    quantity: Number,
    job_type: { type: String, enum: ['full-time', 'part-time', 'contract', 'intern'] },
    status: { type: String, enum: ['pending', 'open', 'closed'], default: 'pending' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export default model<IJob>('Job', jobSchema);