import mongoose from 'mongoose';

export interface ShoppingItem {
    _id: string;
    name: string;
    bought: boolean;
    createdAt: Date;
}

const ShoppingItemSchema = new mongoose.Schema<ShoppingItem>({
    name: { type: String, required: true },
    bought: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export type ShoppingItemDocument = mongoose.HydratedDocument<ShoppingItem>;

export const ShoppingItemModel = mongoose.model<ShoppingItem>('ShoppingItem', ShoppingItemSchema);