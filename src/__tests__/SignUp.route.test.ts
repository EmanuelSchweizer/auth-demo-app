/**
 * @jest-environment node
 */
import '@testing-library/jest-dom';
import { POST } from '@/app/api/auth/signUp/route';

const mockFetch = jest.fn()
global.fetch = mockFetch as unknown as typeof fetch

function createRequest(body: unknown) {
    return { json: async () => body } as Request;
}

describe("POST /api/auth/signUp", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    })

    it("return 201 when the backend response successfully", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ Id: "1", Name: "Test name", Email: "test@example.com", RoleName: "user" })
        } as Response);

        const response = await POST(createRequest({ name: "Test name", email: "test@example.com", password: "ValidPass123!" }))
        const body = await response.json();

        expect(response.status).toBe(201)
        expect(body).toEqual({ Id: "1", Name: "Test name", Email: "test@example.com", RoleName: "user" })
    })

    it("return 409 when user already exist", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 409,
            json: async () => ({ message: "User already exists" }),
        } as Response);

        const response = await POST(createRequest({ name: "Existenza", email: "existing@example.com", password: "ValidPass123!" }))
        const body = await response.json();

        expect(response.status).toBe(409)
        expect(body).toEqual({ message: "User already exists" })
    })

    it("returns 500 when nettwork error occurs", async () => {
        mockFetch.mockRejectedValue(new Error('network'));

        const response = await POST(createRequest({ name: "Test name", email: "test@example.com", password: "ValidPass123!" }))
        const body = await response.json()

        expect(response.status).toBe(500)
        expect(body).toEqual({ message: "Sign up failed." })
    })

    it("returns 500 when backend recieves invalid json", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => { throw new Error('invalid json'); },
        } as unknown as Response);

        const response = await POST(createRequest({}))
        const body = await response.json()

        expect(response.status).toBe(500)
        expect(body).toEqual({ message: "Sign up failed." })
    })
})