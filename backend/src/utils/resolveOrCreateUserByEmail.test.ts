import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { RoleModel } from '../models/Role.js';
import { UserModel } from '../models/User.js';
import { createTestUser } from '../test/factories/userFactory.js';
import { clearTestDatabase, setupTestDatabase, teardownTestDatabase } from '../test/setup/testDatabase.js';
import { resolveOrCreateUserByEmail } from './resolveOrCreateUserByEmail.js';

describe('resolveOrCreateUserByEmail', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    }, 30000);

    afterEach(async () => {
        vi.restoreAllMocks();
        await clearTestDatabase();
    });

    afterAll(async () => {
        await teardownTestDatabase();
    });

    it('returns existing user when email already exists', async () => {
        const existingUser = await createTestUser({ email: 'exists@example.com' });

        const result = await resolveOrCreateUserByEmail({ email: 'exists@example.com' });

        expect(result._id.toString()).toBe(existingUser._id.toString());
        expect(result.email).toBe('exists@example.com');
    });

    it('creates a user with normalized email and derived name when name is missing', async () => {
        const result = await resolveOrCreateUserByEmail({ email: '  NewUser@Example.com  ' });

        expect(result.email).toBe('newuser@example.com');
        expect(result.name).toBe('newuser');
        expect(result.password).toBeTypeOf('string');
        expect(result.password.length).toBeGreaterThan(0);
    });

    it('creates a user with provided trimmed name', async () => {
        const result = await resolveOrCreateUserByEmail({
            email: 'with-name@example.com',
            name: '  Jane Doe  ',
        });

        expect(result.email).toBe('with-name@example.com');
        expect(result.name).toBe('Jane Doe');
    });

    it('throws when user role could not be initialized', async () => {
        vi.spyOn(RoleModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

        await expect(
            resolveOrCreateUserByEmail({ email: 'missing-role@example.com' })
        ).rejects.toThrow('User role could not be initialized.');
    });

    it('returns user found after duplicate-key race condition', async () => {
        const existingUser = await createTestUser({ email: 'race@example.com' });

        const findOneSpy = vi.spyOn(UserModel, 'findOne');
        findOneSpy
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(existingUser);

        vi.spyOn(UserModel, 'create').mockRejectedValueOnce({ code: 11000 });

        const result = await resolveOrCreateUserByEmail({ email: 'race@example.com' });

        expect(result._id.toString()).toBe(existingUser._id.toString());
        expect(result.email).toBe('race@example.com');
    });

    it('rethrows duplicate-key error if user cannot be found after race', async () => {
        const duplicateError = { code: 11000 };

        const findOneSpy = vi.spyOn(UserModel, 'findOne');
        findOneSpy
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null);

        vi.spyOn(UserModel, 'create').mockRejectedValueOnce(duplicateError);

        await expect(
            resolveOrCreateUserByEmail({ email: 'race-not-found@example.com' })
        ).rejects.toBe(duplicateError);
    });
});
