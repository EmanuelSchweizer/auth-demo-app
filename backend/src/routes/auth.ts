import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';

import { RoleModel } from '../models/Role.js';
import { UserModel } from '../models/User.js';
import { resolveOrCreateUserByEmail } from '../utils/resolveOrCreateUserByEmail.js';
import { hashPassword, verifyPassword } from '../utils/hashPassword.js';

const authRouter = Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many login attempts. Please try again later.' }
});

const signUpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many sign up attempts. Please try again later.' }
});

function isStrongPassword(password: string): boolean {
    const hasMinLength = password.length >= 10;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

    return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter;
}

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

        const populated = await UserModel.findById(user._id).populate<{ role: { name: string } }>('role');

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            roleName: populated?.role.name ?? 'user',
        });
    } catch (error) {
        res.status(500).json({ message: 'User could not be resolved.', error });
    }
});

// POST /auth/signup
authRouter.post('/auth/signup', signUpLimiter, async (req, res) => {
    const { name, email, password } = req.body as {
        name?: string;
        email?: string;
        password?: string;
    };

    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPassword = password;

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
        res.status(400).json({ message: 'name, email and password are required.' });
        return;
    }

    if (!isStrongPassword(normalizedPassword)) {
        res.status(400).json({ message: 'Password must be at least 10 characters and include uppercase, lowercase, number, and special character.' });
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
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
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
authRouter.post('/auth/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };

    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPassword = password;

    if (!normalizedEmail || !normalizedPassword) {
        res.status(400).json({ message: 'email and password are required.' });
        return;
    }

    try {
        const user = await UserModel.findOne({ email: normalizedEmail }).populate<{ role: { name: string } }>('role');

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
            roleName: user.role.name,
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed.', error });
    }
});

export default authRouter;
