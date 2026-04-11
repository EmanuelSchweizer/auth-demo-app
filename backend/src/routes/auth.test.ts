import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import app from '../app.js';
import { UserModel } from '../models/User.js';
import { createTestUser } from '../test/factories/userFactory.js';
import { clearTestDatabase, setupTestDatabase, teardownTestDatabase } from '../test/setup/testDatabase.js';

const TEST_USER = {
	name: 'Test User',
	email: 'test@example.com',
	password: 'StrongPass123!',
};

describe('Auth Routes', () => {
	beforeAll(async () => {
		await setupTestDatabase();
	}, 30000);

	afterEach(async () => {
		await clearTestDatabase();
	});

	afterAll(async () => {
		await teardownTestDatabase();
	});

	it('POST /auth/signup should create a new user', async () => {
		const response = await request(app).post('/auth/signup').send({
			name: TEST_USER.name,
			email: TEST_USER.email,
			password: TEST_USER.password,
		});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty('id');
		expect(response.body.email).toBe(TEST_USER.email.toLowerCase());

		const userInDb = await UserModel.findOne({ email: TEST_USER.email.toLowerCase() });
		expect(userInDb).not.toBeNull();
	});

	it('POST /auth/signup should return 409 for duplicate email', async () => {
		await createTestUser({ email: 'duplicate@example.com', password: 'StrongPass123!' });

		const response = await request(app).post('/auth/signup').send({
			name: 'Another User',
			email: 'duplicate@example.com',
			password: 'StrongPass123!',
		});

		expect(response.status).toBe(409);
	});

	it('POST /auth/signup should return 400 for weak password', async () => {
		const response = await request(app).post('/auth/signup').send({
			name: 'Weak Password User',
			email: 'weak-password@example.com',
			password: 'weak',
		});

		expect(response.status).toBe(400);
	});

	it('POST /auth/signup should return 400 for missing fields', async () => {
		const response = await request(app).post('/auth/signup').send({
			email: 'missing-fields@example.com',
		});

		expect(response.status).toBe(400);
	});

	it('POST /auth/login should return 200 for valid credentials', async () => {
		await createTestUser({ email: 'login-ok@example.com', password: 'StrongPass123!' });

		const response = await request(app).post('/auth/login').send({
			email: 'login-ok@example.com',
			password: 'StrongPass123!',
		});

		expect(response.status).toBe(200);
		expect(response.body.email).toBe('login-ok@example.com');
		expect(response.body).toHaveProperty('id');
	});

	it('POST /auth/login should return 401 for wrong password', async () => {
		await createTestUser({ email: 'wrong-pass@example.com', password: 'StrongPass123!' });

		const response = await request(app).post('/auth/login').send({
			email: 'wrong-pass@example.com',
			password: 'WrongPassword123!',
		});

		expect(response.status).toBe(401);
	});

	it('POST /auth/login should return 401 for non-existent email', async () => {
		const response = await request(app).post('/auth/login').send({
			email: 'non-existent@example.com',
			password: 'SomePassword123!',
		});

		expect(response.status).toBe(401);
		expect(response.body.message).toBe('Invalid email or password.');
	});

	it('POST /auth/login should return 400 for missing fields', async () => {
		const response = await request(app).post('/auth/login').send({
			email: 'missing-fields@example.com',
		});

		expect(response.status).toBe(400);
	});

	it('POST /auth/resolve-user should resolve existing user', async () => {
		await createTestUser({ email: 'resolve-user@example.com', password: 'StrongPass123!' });
		const response = await request(app).post('/auth/resolve-user').send({
			email: 'resolve-user@example.com',
		});

		expect(response.status).toBe(200);
		expect(response.body.email).toBe('resolve-user@example.com');
		expect(response.body).toHaveProperty('id');
	});

	it('POST /auth/resolve-user should create user when not existing', async () => {
		const response = await request(app).post('/auth/resolve-user').send({
			email: 'non-existent@example.com',
			name: 'Created By Resolve',
		});

		expect(response.status).toBe(200);
		expect(response.body.email).toBe('non-existent@example.com');
		expect(response.body).toHaveProperty('id');
		expect(response.body.roleName).toBe('user');

		const createdUser = await UserModel.findOne({ email: 'non-existent@example.com' });
		expect(createdUser).not.toBeNull();
	});

	it('POST /auth/login should eventually return 429 when rate limit is exceeded', async () => {
		await createTestUser({ email: 'rate-limit@example.com', password: 'StrongPass123!' });
		let saw429 = false;

		for (let i = 0; i < 12; i += 1) {
			const response = await request(app).post('/auth/login').send({
				email: 'rate-limit@example.com',
				password: 'StrongPass123!',
			});

			if (response.status === 429) {
				saw429 = true;
				break;
			}
		}

		expect(saw429).toBe(true);
	});

	it('POST /auth/signup should eventually return 429 when rate limit is exceeded', async () => {
		let saw429 = false;

		for (let i = 0; i < 12; i += 1) {
			const response = await request(app).post('/auth/signup').send({
				name: `Rate Limit User ${i}`,
				email: `rate-limit-${i}@example.com`,
				password: 'StrongPass123!',
			});

			if (response.status === 429) {
				saw429 = true;
				break;
			}
		}

		expect(saw429).toBe(true);
	});
});
