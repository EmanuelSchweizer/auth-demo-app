import { Router } from 'express';

import { RoleModel } from '../models/Role.js';
import { UserModel } from '../models/User.js';
import { resolveOrCreateUserByEmail } from '../utils/resolveOrCreateUserByEmail.js';
import { hashPassword, verifyPassword } from '../utils/hashPassword.js';

const authRouter = Router();

// POST /auth/resolve-user
authRouter.post('/auth/resolve-user', async (req, res) => {
    const { email, name } = req.body as { email?: string; name?: string };
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
        res.status(400).json({ message: 'email is required.' });
        return;
    }

    try {
        const user = await resolveOrCreateUserByEmail({
            email: normalizedEmail,
            name
        });

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ message: 'User could not be resolved.', error });
    }
});

// POST /auth/signup
authRouter.post('/auth/signup', async (req, res) => {
    const { name, email, password } = req.body as {
        name?: string;
        email?: string;
        password?: string;
    };

    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPassword = password?.trim();

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
        res.status(400).json({ message: 'name, email and password are required.' });
        return;
    }

    if (normalizedPassword.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        return;
    }

    try {
        const existingUser = await UserModel.findOne({ email: normalizedEmail });

        if (existingUser) {
            res.status(409).json({ message: 'A user with this email already exists.' });
            return;
        }

        const userRole = await RoleModel.findOneAndUpdate(
            { name: 'user' },
            { name: 'user' },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (!userRole) {
            res.status(500).json({ message: 'User role could not be initialized.' });
            return;
        }

        const passwordHash = await hashPassword(normalizedPassword);

        const createdUser = await UserModel.create({
            name: normalizedName,
            email: normalizedEmail,
            password: passwordHash,
            role: userRole._id
        });

        res.status(201).json({
            id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email
        });
    } catch (error) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            (error as { code?: number }).code === 11000
        ) {
            res.status(409).json({ message: 'A user with this email already exists.' });
            return;
        }

        res.status(500).json({ message: 'Sign up failed.', error });
    }
});

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
