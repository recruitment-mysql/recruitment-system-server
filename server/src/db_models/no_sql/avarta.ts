import { Schema, model, Document } from 'mongoose';

export interface IAvatar extends Document {
    user_id: number;
    filename: string;
    contentType: string;
    uploadDate: Date;
    size: number;
    data: Buffer;
}

const avatarSchema = new Schema<IAvatar>({
    user_id: { type: Number, required: true, index: true },
    filename: { type: String },
    contentType: { type: String },
    uploadDate: { type: Date, default: Date.now },
    size: { type: Number },
    data: { type: Buffer, required: true },
});

export default model<IAvatar>('Avatar', avatarSchema);