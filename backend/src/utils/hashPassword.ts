import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(hash: string, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hash);
}
