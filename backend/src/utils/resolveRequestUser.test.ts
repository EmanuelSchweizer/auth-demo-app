import mongoose from 'mongoose';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import { setupTestDatabase, clearTestDatabase, teardownTestDatabase } from '../test/setup/testDatabase.js';
import { resolveRequestUser } from './resolveRequestUser.js';
import { createTestUser } from '../test/factories/userFactory.js';

function createMockResponse(): Response {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
}

describe('resolveRequestUser', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    }, 30000);

    afterEach(async () => {
        await clearTestDatabase();
        vi.clearAllMocks();
    });

    afterAll(async () => {
        await teardownTestDatabase();
    });

    it('returns 401 when x-user-id header is missing', async () => {
        const req = { headers: {} } as Request;
        const res = createMockResponse();

        const result = await resolveRequestUser(req, res);

        expect(result).toBeNull();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Authenticated user id is required.' });
    });

    it('returns 401 when x-user-id is invalid', async () => {
        const req = { headers: { 'x-user-id': 'not-an-object-id' } } as unknown as Request;
        const res = createMockResponse();

        const result = await resolveRequestUser(req, res);

        expect(result).toBeNull();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Authenticated user id is invalid.' });
    });

    it('returns 401 when x-user-id is valid format but user does not exist', async () => {
        const nonExistingId = new mongoose.Types.ObjectId().toString();
        const req = { headers: { 'x-user-id': nonExistingId } } as unknown as Request;
        const res = createMockResponse();

        const result = await resolveRequestUser(req, res);

        expect(result).toBeNull();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Authenticated user was not found.' });
    });

    it('returns user when x-user-id exists and user is found', async () => {
        const created = await createTestUser({ email: 'exists@example.com' });
        const createdId = created._id.toString();
        const req = { headers: { 'x-user-id': createdId } } as unknown as Request;
        const res = createMockResponse();

        const result = await resolveRequestUser(req, res);

        expect(result).not.toBeNull();
        expect(result?._id.toString()).toBe(createdId);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('accepts x-user-id header as array and uses first value', async () => {
        const created = await createTestUser({ email: 'array-header@example.com' });
        const createdId = created._id.toString();
        const req = {
            headers: { 'x-user-id': [createdId, new mongoose.Types.ObjectId().toString()] },
        } as unknown as Request;
        const res = createMockResponse();

        const result = await resolveRequestUser(req, res);

        expect(result).not.toBeNull();
        expect(result?._id.toString()).toBe(createdId);
        expect(res.status).not.toHaveBeenCalled();
    });
});