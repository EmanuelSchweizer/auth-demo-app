import { randomUUID } from 'node:crypto';

import { RoleModel } from '../models/Role.js';
import { UserModel } from '../models/User.js';
import type { UserDocument } from '../models/User.js';
import { hashPassword } from './hashPassword.js';

interface Params {
    email: string;
    name?: string;
}

export async function resolveOrCreateUserByEmail({ email, name }: Params): Promise<UserDocument> {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name?.trim();

    const existingUser = await UserModel.findOne({ email: normalizedEmail });

    if (existingUser) {
        return existingUser;
    }

    const userRole = await RoleModel.findOneAndUpdate(
        { name: 'user' },
        { name: 'user' },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    if (!userRole) {
        throw new Error('User role could not be initialized.');
    }

    try {
        const createdUser = await UserModel.create({
            name: normalizedName || normalizedEmail.split('@')[0] || 'User',
            email: normalizedEmail,
            password: await hashPassword(randomUUID()),
            role: userRole._id
        });

        return createdUser;
    } catch (error) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            (error as { code?: number }).code === 11000
        ) {
            const userAfterRace = await UserModel.findOne({ email: normalizedEmail });
            if (userAfterRace) {
                return userAfterRace;
            }
        }

        throw error;
    }
}