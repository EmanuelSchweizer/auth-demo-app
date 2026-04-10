import { ShoppingItemModel } from './models/ShoppingItem.js';
import { UserModel } from './models/User.js';

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

    const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@example.com').trim().toLowerCase();
    const adminUser = await UserModel.findOne({ email: adminEmail });

    if (!adminUser) {
        return;
    }

    await ShoppingItemModel.insertMany(
        initialShoppingItems.map((item) => ({
            ...item,
            user: adminUser._id
        }))
    );
    console.log('Initial shopping items created.');
}