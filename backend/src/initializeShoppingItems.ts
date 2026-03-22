import { ShoppingItemModel } from './models/ShoppingItem.js';

const initialShoppingItems = [
    { name: 'Milch', bought: false },
    { name: 'Brot', bought: false },
    { name: 'Eier', bought: false }
];

export async function initializeShoppingItems(): Promise<void> {
    const itemCount = await ShoppingItemModel.countDocuments();

    if (itemCount > 0) {
        return;
    }

    await ShoppingItemModel.insertMany(initialShoppingItems);
    console.log('Initial shopping items created.');
}