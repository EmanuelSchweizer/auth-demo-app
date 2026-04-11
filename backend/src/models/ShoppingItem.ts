import mongoose from 'mongoose';

export interface ShoppingItem {
    _id: string;
    name: string;
    bought: boolean;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
}

const ShoppingItemSchema = new mongoose.Schema<ShoppingItem>({
    name: { type: String, required: true },
    bought: { type: Boolean, default: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    createdAt: { type: Date, default: Date.now }
});

export type ShoppingItemDocument = mongoose.HydratedDocument<ShoppingItem>;

export const ShoppingItemModel = mongoose.model<ShoppingItem>('ShoppingItem', ShoppingItemSchema);