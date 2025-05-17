import { Schema, model, Document  } from 'mongoose';
import {IJob} from './job';

export interface ISocialLinks {
    website?: string;
    facebook?: string;
    youtube?: string;
}

export interface Ibranchs {
    id: number;
    name: string;
    specific_address: string;
    city: string;
}

export interface Iinterests {
    salary?: string;
    insurance?: string;
    award?: string;
}
export interface Iheadquarters {
    city_address: string;
    specific_address: string;
}
export interface IEmployer extends Document {
    employer_id: number;
    user_id: number;
    name_employer: string;
    industry_id?: number[];
    social_links?: ISocialLinks;
    description?: string;
    number_of_employees?: number;
    branches?:Ibranchs[];
    city_address?: Iheadquarters;
    interest?:Iinterests;
    status:boolean;
    updated_at: Date;
}

const socialLinksSchema = new Schema<ISocialLinks>({
    website: String,
    facebook: String,
    youtube: String
});

const branchesSchema = new Schema<Ibranchs>({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    specific_address: { type: String, required: true },
    city: { type: String, required: true },
});

const interestSchema = new Schema<Iinterests>({
    salary: String,
    insurance: String,
    award: String,
});
const headquarters = new Schema<Iheadquarters>({
    city_address: String,
    specific_address: String
});

const employerSchema = new Schema<IEmployer>({
    employer_id: { type: Number, required: true, unique: true },
    user_id: { type: Number, required: true },
    name_employer : { type: String, required: true },
    industry_id: [Number],
    social_links: socialLinksSchema,
    description: { type: String},
    number_of_employees:  Number,
    branches: [branchesSchema],
    city_address: headquarters,
    interest: interestSchema,
    status:{ type: Boolean, required: true },
    updated_at: { type: Date, default: Date.now }
});
// eslint-disable-next-line func-names
employerSchema.pre<IJob>('save', function (next) {
    this.updated_at = new Date();
    next();
});

export default model<IEmployer>('Employer', employerSchema);