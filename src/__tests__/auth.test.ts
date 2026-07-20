/**
 * @jest-environment node
 */
import { authOptions } from "@/auth";
import { Account, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch

const credentialsProvider = authOptions.providers.find(
    (p) => p.id === 'credentials'
) as any;

const jwt = authOptions.callbacks!.jwt!
const session = authOptions.callbacks!.session!

console.log("authOptions.providers", authOptions.providers)

describe('authorize', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    })

    it('returns null when credentials are missing', async () => {
        const result = await credentialsProvider.options.authorize({ email: "", password: "" })

        expect(result).toBeNull()
    })

    it('returns a user object when the backend confirms the login', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ id: 1, name: "Test User", email: "text@example.com", roleName: "user" }),
            status: 201
        } as unknown as Response)

        const result = await credentialsProvider.options.authorize({ email: "text@example.com", password: "123456" })

        expect(result).toEqual({
            id: 1,
            name: "Test User",
            email: "text@example.com",
            isAdmin: false,
        })
    })

    it('returns null when the backend rejects the login', async () => {
        mockFetch.mockResolvedValue({ ok: false, status: 500, message: "Internal server error" } as unknown as Response)

        const result = await credentialsProvider.options.authorize({ email: "text@example.com", password: "123456" })

        expect(result).toBe(null)
    })

    it('returns null when the backend responds with invalid user data', async () => {
        mockFetch.mockResolvedValue({ ok: true, status: 201, json: async () => ({ name: "Test User", email: "text@example.com", roleName: "user" }), } as unknown as Response)

        const result = await credentialsProvider.options.authorize({ email: "text@example.com", password: "123456" })

        expect(result).toBe(null)
    })

    it('returns an admin user object when roleName is admin', async () => {
        mockFetch.mockResolvedValue({ ok: true, status: 201, json: async () => ({ id: 1, name: "Test User", email: "text@example.com", roleName: "admin" }), } as unknown as Response)

        const result = await credentialsProvider.options.authorize({ email: "text@example.com", password: "123456" })

        expect(result.isAdmin).toEqual(true)
    })
})

describe("jwt callback", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    })

    it("sets token.userId/token.isAdmin directly from user without calling fetch", async () => {
        const token = { name: "Test User", email: "test@example.com" } as JWT
        const user = { id: "1", name: "Test User", isAdmin: true, password: "123456ABCdef." }
        const account = { providerAccountId: "123", provider: "credentials", type: "credentials" } as Account

        const result = await jwt({ token, user, account })

        expect(mockFetch).not.toHaveBeenCalled()
        expect(result).toEqual({ userId: "1", name: "Test User", email: "test@example.com", isAdmin: true })
    })

    it("sets token token.userId/token.isAdmin from the backend resolved user", async () => {
        mockFetch.mockResolvedValue({
            ok: true, status: 201, json: async () => ({
                id: "2",
                name: "Test User",
                email: "test@defaultuser.com",
                roleName: "user"
            })
        })
        const token = { name: "Test User", email: "test@defaultuser.com" } as JWT
        const user = { id: "", name: "Test User", email: "test@defaultuser.com", password: "123456ABCdef." }
        const account = { providerAccountId: "123", provider: "credentials", type: "credentials" } as Account

        const result = await jwt({ token, user, account })

        expect(result).toEqual({ userId: "2", isAdmin: false, name: "Test User", email: "test@defaultuser.com" })
    })

    it("do not set token token.userId/token.isAdmin when the backend returns 500", async () => {
        mockFetch.mockResolvedValue({
            ok: false, status: 500, json: async () => ({})
        })
        const token = { name: "Test User", email: "test@defaultuser.com" } as JWT
        const user = { id: "", name: "Test User", email: "test@defaultuser.com", password: "123456ABCdef." }
        const account = { providerAccountId: "123", provider: "credentials", type: "credentials" } as Account

        const result = await jwt({ token, user, account })

        expect(result).toEqual({ name: "Test User", email: "test@defaultuser.com" })
    })
})

describe("session callback", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    })

    it("returns session user id when token contains id", async () => {
        const sessionObject = {
            user: {

            },
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        } as Session
        const token = { userId: "3", name: "Admin User", email: "admin@example.com", isAdmin: true } as JWT

        const result = await session({ 
            session: sessionObject, 
            token, 
            user: {} as any, 
            newSession: undefined, 
            trigger: "update"
        })

        expect(result.user).toEqual({ 
            id: "3",
            isAdmin: true
        })
    })

    it("returns session user without id when token doesn't contain id", async () => {
        const sessionObject = {
            user: {

            },
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        } as Session
        const token = { userId: "" } as JWT

        const result = await session({ 
            session: sessionObject, 
            token, 
            user: {} as any, 
            newSession: undefined, 
            trigger: "update"
        })

        expect(result.user).toEqual({
            id: "",
            isAdmin: false
        })
    })
})