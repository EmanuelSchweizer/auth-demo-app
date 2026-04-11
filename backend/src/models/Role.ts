import mongoose from 'mongoose';

export interface Role {
    _id: string;
    name: string;
    createdAt: Date;
}

const RoleSchema = new mongoose.Schema<Role>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    createdAt: { type: Date, default: Date.now }
});

export type RoleDocument = mongoose.HydratedDocument<Role>;

export const RoleModel = mongoose.model<Role>('Role', RoleSchema);
