import { Schema, model, Document } from 'mongoose';

export interface IExperience {
    company: string;
    role: string;
    years: number;
    industry_id?: number;
}

export interface ICandidate extends Document {
    candidate_id: string;
    user_id: number;
    cv_url?: string;
    skills?: number[];
    degree_id?: number;
    experience?: IExperience[];
    total_experience_years?: number;
    status:boolean;
    updated_at: Date;
}

const experienceSchema = new Schema<IExperience>({
    company: { type: String, required: true },
    role: { type: String, required: true },
    years: { type: Number, required: true },
    industry_id: Number
});

const candidateSchema = new Schema<ICandidate>({
    candidate_id: { type: String, required: true, unique: true },
    user_id: { type: Number, required: true },
    cv_url: { type: String},
    skills: { type: [Number]},
    degree_id: Number,
    experience: [experienceSchema],
    total_experience_years: { type: Number},
    status:{ type: Boolean, required: true },
    updated_at: { type: Date, default: Date.now }
});

export default model<ICandidate>('Candidate', candidateSchema);