import express from 'express';
import authRouter from './routes/auth.js';
import shoppingItemsRouter from './routes/shoppingItems.js';
import adminRouter from './routes/admin.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use(authRouter);
app.use(shoppingItemsRouter); 
app.use(adminRouter);

export default app;