import { Schema, model, Document } from 'mongoose';

export interface Ibranchs {
    id: number;
    name: string;
    specific_address: string;
    city: string;
}
export interface IJob extends Document {
    job_id: string;
    employer_id: number;
    title: string;
    description : string;
    skills_required: number[];
    job_categories: number[];
    degree: number;
    experience_years_required: number;
    quantity : number;
    foreign_language? : string;
    Salary : number;
    job_type: number;
    status: number;
    branches:Ibranchs[];
    created_at: Date;
    updated_at: Date;
}
const branchesSchema = new Schema<Ibranchs>({
    id:{ type: Number, required: true },
    name: { type: String, required: true },
    specific_address: { type: String, required: true },
    city: { type: String, required: true },
});

const jobSchema = new Schema<IJob>({
    job_id: { type: String, required: true, unique: true },
    employer_id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills_required: {type : [Number],required: true },
    job_categories: {type : [Number],required: true },
    degree: { type: Number, required: true },
    experience_years_required: { type: Number, required: true },
    quantity: { type: Number, required: true },
    foreign_language : String,
    Salary : { type: Number, required: true },
    job_type: { type: Number , required: true },
    status: { type: Number , required: true  },
    branches : { type:[branchesSchema],required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});
// eslint-disable-next-line func-names
jobSchema.pre<IJob>('save', function (next) {
    this.updated_at = new Date();
    next();
});

export default model<IJob>('Job', jobSchema);