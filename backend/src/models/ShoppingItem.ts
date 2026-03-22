import mongoose from 'mongoose';

export interface ShoppingItem {
    name: string;
    bought: boolean;
    createdAt: Date;
}

const ShoppingItemSchema = new mongoose.Schema<ShoppingItem>({
    name: { type: String, required: true },
    bought: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export const ShoppingItemModel = mongoose.model<ShoppingItem>('ShoppingItem', ShoppingItemSchema);