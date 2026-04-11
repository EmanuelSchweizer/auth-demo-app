import { RoleModel } from './models/Role.js';
import { UserModel } from './models/User.js';
import { hashPassword } from './utils/hashPassword.js';

const DEFAULT_ADMIN_NAME = 'Admin';
const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

export async function initializeAdminUser(): Promise<void> {
    const userCount = await UserModel.countDocuments();

    if (userCount > 0) {
        return;
    }

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
    const adminPasswordHash = await hashPassword(adminPassword);

    await UserModel.create({
        name: adminName,
        email: adminEmail,
        password: adminPasswordHash,
        role: adminRole._id
    });

    console.log(`Initial admin user created: ${adminEmail}`);
}
