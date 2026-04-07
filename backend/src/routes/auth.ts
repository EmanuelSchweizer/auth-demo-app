import { Router } from 'express';

import { UserModel } from '../models/User.js';
import { verifyPassword } from '../utils/hashPassword.js';

const authRouter = Router();

// POST /auth/login
authRouter.post('/auth/login', async (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };

    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPassword = password?.trim();

    if (!normalizedEmail || !normalizedPassword) {
        res.status(400).json({ message: 'email and password are required.' });
        return;
    }

    try {
        const user = await UserModel.findOne({ email: normalizedEmail });

        if (!user) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }

        const isPasswordValid = await verifyPassword(user.password, normalizedPassword);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed.', error });
    }
});

export default authRouter;
