import 'dotenv/config';
import mongoose from 'mongoose';

import { initializeAdminUser } from './initializeAdminUser.js';
import { initializeShoppingItems } from './initializeShoppingItems.js';
import app from './app.js';

const dbURI = (process.env.MONGO_URI ?? process.env.MONGODB_URI) as string;
const PORT = process.env.PORT || 8080;

if (!dbURI) {
    console.error("Error: MONGO_URI is not defined in the .env file!");
    process.exit(1);
}

async function startServer(): Promise<void> {
    try {
        await mongoose.connect(dbURI);
        console.log('Database is connected successfully!');

        await initializeAdminUser();
        await initializeShoppingItems();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Cloud connection error:', error);
        process.exit(1);
    }
}

void startServer();
