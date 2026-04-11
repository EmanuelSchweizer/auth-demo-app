import { RoleModel } from '../../models/Role.js';
import { UserModel } from '../../models/User.js';
import { hashPassword } from '../../utils/hashPassword.js';

export async function createTestUser(params?: {
  name?: string;
  email?: string;
  password?: string;
}) {
  const name = params?.name ?? 'Test User';
  const email = params?.email ?? 'test@example.com';
  const password = params?.password ?? 'StrongPass123!';

  const role = await RoleModel.findOneAndUpdate(
    { name: 'user' },
    { name: 'user' },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  if (!role) throw new Error('Could not create/find user role.');

  const passwordHash = await hashPassword(password);

  return UserModel.create({
    name,
    email,
    password: passwordHash,
    role: role._id,
  });
}