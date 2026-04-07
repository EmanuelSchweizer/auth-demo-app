import mongoose from 'mongoose';

export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: mongoose.Types.ObjectId;
    createdAt: Date;
}

const UserSchema = new mongoose.Schema<User>({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { type: String, required: true },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

export type UserDocument = mongoose.HydratedDocument<User>;

export const UserModel = mongoose.model<User>('User', UserSchema);
