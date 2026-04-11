import { Router } from 'express';
import mongoose from 'mongoose';

import { UserModel } from '../models/User.js';
import { ShoppingItemModel } from '../models/ShoppingItem.js';
import { resolveRequestUser } from '../utils/resolveRequestUser.js';

const adminRouter = Router();
const DEFAULT_DEMO_ADMIN_EMAIL = 'admin-demo@example.com';
const DEMO_ADMIN_EMAIL = (process.env.DEMO_ADMIN_EMAIL ?? DEFAULT_DEMO_ADMIN_EMAIL).trim().toLowerCase();

// Require admin role for all routes in this router
adminRouter.use(async (req, res, next) => {
    const user = await resolveRequestUser(req, res);
    if (!user) return; // resolveRequestUser already sent 401

    const populated = await UserModel.findById(user._id).populate<{ role: { name: string } }>('role');
    if (!populated || populated.role.name !== 'admin') {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
        return;
    }

    res.locals.requestAdminEmail = populated.email.trim().toLowerCase();

    next();
});

// GET /admin/users
adminRouter.get('/admin/users', async (_req, res) => {
    const users = await UserModel.find()
        .populate<{ role: { name: string } }>('role')
        .select('-password')
        .sort({ createdAt: -1 });

    res.status(200).json(
        users.map((u) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            roleName: u.role.name,
            createdAt: u.createdAt,
        }))
    );
});

// DELETE /admin/users/:id
adminRouter.delete('/admin/users/:id', async (req, res) => {
    const requestAdminEmail = (res.locals.requestAdminEmail as string | undefined)?.trim().toLowerCase();
    if (requestAdminEmail === DEMO_ADMIN_EMAIL) {
        res.status(403).json({ message: 'Demo admin is read-only and cannot delete users.' });
        return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid user id.' });
        return;
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
        res.status(404).json({ message: 'User not found.' });
        return;
    }

    await ShoppingItemModel.deleteMany({ user: id });

    res.status(200).json({ message: 'User deleted.' });
});

export default adminRouter;
