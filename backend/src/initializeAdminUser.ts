import mongoose from 'mongoose';
import { RoleModel } from './models/Role.js';
import { UserModel } from './models/User.js';
import { hashPassword } from './utils/hashPassword.js';

const DEFAULT_ADMIN_NAME = 'Admin';
const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = 'admin123';
const DEFAULT_DEMO_ADMIN_NAME = 'Admin Demo';
const DEFAULT_DEMO_ADMIN_EMAIL = 'admin-demo@example.com';
const DEFAULT_DEMO_ADMIN_PASSWORD = 'demoadmin123';

async function ensureAdminUser(params: {
    name: string;
    email: string;
    password: string;
    adminRoleId: string;
}): Promise<boolean> {
    const normalizedName = params.name.trim();
    const normalizedEmail = params.email.trim().toLowerCase();

    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
        if (existingUser.role.toString() !== params.adminRoleId) {
            existingUser.role = new mongoose.Types.ObjectId(params.adminRoleId);
            await existingUser.save();
        }
        return false;
    }

    const passwordHash = await hashPassword(params.password);

    await UserModel.create({
        name: normalizedName,
        email: normalizedEmail,
        password: passwordHash,
        role: new mongoose.Types.ObjectId(params.adminRoleId)
    });

    return true;
}

export async function initializeAdminUser(): Promise<void> {
    const [adminRole] = await Promise.all([
            RoleModel.findOneAndUpdate(
            { name: 'admin' },
            { name: 'admin' },
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        ),
        RoleModel.findOneAndUpdate(
            { name: 'user' },
            { name: 'user' },
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        )
    ]);

    if (!adminRole) {
        throw new Error('Admin role could not be initialized.');
    }

    const adminName = process.env.ADMIN_NAME ?? DEFAULT_ADMIN_NAME;
    const adminEmail = process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;
    const demoAdminName = process.env.DEMO_ADMIN_NAME ?? DEFAULT_DEMO_ADMIN_NAME;
    const demoAdminEmail = process.env.DEMO_ADMIN_EMAIL ?? DEFAULT_DEMO_ADMIN_EMAIL;
    const demoAdminPassword = process.env.DEMO_ADMIN_PASSWORD ?? DEFAULT_DEMO_ADMIN_PASSWORD;

    const createdAdmin = await ensureAdminUser({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        adminRoleId: adminRole._id
    });

    const createdDemoAdmin = await ensureAdminUser({
        name: demoAdminName,
        email: demoAdminEmail,
        password: demoAdminPassword,
        adminRoleId: adminRole._id
    });

    if (createdAdmin) {
        console.log(`Initial admin user created: ${adminEmail}`);
    }
    if (createdDemoAdmin) {
        console.log(`Initial demo admin user created: ${demoAdminEmail}`);
    }
}
