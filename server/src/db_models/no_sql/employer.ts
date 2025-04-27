import { Schema, model, Document } from 'mongoose';

export interface ISocialLinks {
    website?: string;
    facebook?: string;
    youtube?: string;
}

export interface Ibranchs {
    name: string;
    specific_address: string;
}

export interface Iinterests {
    salary?: string;
    insurance?: string;
    award?: string;
}

export interface IEmployer extends Document {
    employer_id: string;
    user_id: number;
    industry_id: number[];
    social_links?: ISocialLinks;
    description?: string;
    number_of_employees: number;
    branches:Ibranchs[];
    City_address: string;
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
    name: String,
    specific_address: String
});

const interestSchema = new Schema<Iinterests>({
    salary: String,
    insurance: String,
    award: String,
});

const employerSchema = new Schema<IEmployer>({
    employer_id: { type: String, required: true, unique: true },
    user_id: { type: Number, required: true },
    industry_id: { type: [Number], required: true },
    social_links: socialLinksSchema,
    description: { type: String},
    number_of_employees: { type: Number, required: true },
    branches: [branchesSchema],
    City_address: { type: String, required: true },
    interest: interestSchema,
    status:{ type: Boolean, required: true },
    updated_at: { type: Date, default: Date.now }
});

export default model<IEmployer>('Employer', employerSchema);