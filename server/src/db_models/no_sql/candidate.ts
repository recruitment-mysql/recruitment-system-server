import { Schema, model, Document } from 'mongoose';
import {IJob} from './job';

export interface IExperience {
    company: string;
    role: string;
    years: number;
    industry_id?: number;
}
export interface job_selection_criteria {
    salary?: number;
    city_address?: string;
    degree: number;
    job_categories: number[];
}

export interface ICandidate extends Document {
    candidate_id: number;
    user_id: number;
    skills?: number[];
    job_selection_criteria : job_selection_criteria ;
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
const job_selection_criteria_Schema = new Schema<job_selection_criteria>({
    salary : Number,
    city_address: String,
    degree: { type: Number, required: true },
    job_categories: {type : [Number], required: true },
});

const candidateSchema = new Schema<ICandidate>({
    candidate_id: { type: Number, required: true, unique: true },
    user_id: { type: Number, required: true },
    skills: { type: [Number]},
    job_selection_criteria : job_selection_criteria_Schema,
    experience: [experienceSchema],
    total_experience_years: { type: Number},
    status:{ type: Boolean, required: true },
    updated_at: { type: Date, default: Date.now }
});
// eslint-disable-next-line func-names
candidateSchema.pre<IJob>('save', function (next) {
    this.updated_at = new Date();
    next();
});

export default model<ICandidate>('Candidate', candidateSchema);