import mongoose from 'mongoose';
import type { Request, Response } from 'express';

import { UserModel } from '../models/User.js';
import type { UserDocument } from '../models/User.js';

export async function resolveRequestUser(req: Request, res: Response): Promise<UserDocument | null> {
    const rawUserIdHeader = req.headers['x-user-id'];
    const userIdHeader = Array.isArray(rawUserIdHeader) ? rawUserIdHeader[0] : rawUserIdHeader;
    const normalizedUserId = userIdHeader?.trim();

    if (!normalizedUserId) {
        res.status(401).json({ message: 'Authenticated user id is required.' });
        return null;
    }

    if (!mongoose.Types.ObjectId.isValid(normalizedUserId)) {
        res.status(401).json({ message: 'Authenticated user id is invalid.' });
        return null;
    }

    const existingUser = await UserModel.findById(normalizedUserId);

    if (!existingUser) {
        res.status(401).json({ message: 'Authenticated user was not found.' });
        return null;
    }

    return existingUser;
}