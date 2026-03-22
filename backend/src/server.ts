import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import { initializeShoppingItems } from './initializeShoppingItems.js';
import shoppingItemsRouter from './routes/shoppingItems.js';

const app = express();
app.use(express.json());
app.use(shoppingItemsRouter);

const dbURI = process.env.MONGO_URI as string;
const PORT = process.env.PORT || 5001;

if (!dbURI) {
    console.error("Error: MONGO_URI is not defined in the .env file!");
    process.exit(1);
}

async function startServer(): Promise<void> {
    try {
        await mongoose.connect(dbURI);
        console.log('Database is connected successfully!');

        await initializeShoppingItems();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Cloud connection error:', error);
        process.exit(1);
    }
}

void startServer();
