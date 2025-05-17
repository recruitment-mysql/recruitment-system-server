import { Schema, model, Document } from 'mongoose';

export interface ICvFile extends Document {
    candidate_id: number;
    filename: string;
    contentType: string;
    uploadDate: Date;
    size: number;
    data: Buffer;
}

const cvFileSchema = new Schema<ICvFile>({
    candidate_id: { type: Number, required: true, index: true },
    filename: { type: String },
    contentType: { type: String },
    uploadDate: { type: Date, default: Date.now },
    size: { type: Number },
    data: { type: Buffer, required: true },
});

export default model<ICvFile>('CvFile', cvFileSchema);