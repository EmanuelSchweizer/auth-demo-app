import NextAuth, { NextAuthOptions } from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/signIn",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            const userFromSignIn = user as { id?: string; isAdmin?: boolean } | undefined;
            const isCredentialsSignIn = account?.provider === "credentials";

            if (userFromSignIn?.id && isCredentialsSignIn) {
                token.userId = userFromSignIn.id;
                token.isAdmin = userFromSignIn.isAdmin ?? false;
                return token;
            }

            if (!token.userId && token.email) {
                const resolveUserResponse = await fetch(`${process.env.API_URL}/auth/resolve-user`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: token.email,
                        name: token.name,
                    }),
                });

                if (resolveUserResponse.ok) {
                    const dbUser = await resolveUserResponse.json() as { id?: string; roleName?: string };
                    if (dbUser?.id) {
                        token.userId = dbUser.id;
                        token.isAdmin = dbUser.roleName === 'admin';
                    }
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user && typeof token.userId === "string") {
                const user = session.user as { id?: string; isAdmin?: boolean };
                user.id = token.userId;
                user.isAdmin = token.isAdmin === true;
            }

            return session;
        },
    },
  providers: [
    CredentialsProvider({
        name: "Sign In",
        credentials: {
            email: { label: "Email", type: "email", placeholder: "example@example.com" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials: Record<"email" | "password", string> | undefined) {
            if (!credentials || !credentials.email || !credentials.password) return null

            const loginResponse = await fetch(`${process.env.API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                })
            })

            if (!loginResponse.ok) {
                return null
            }

            const dbUser = await loginResponse.json()

            if (dbUser?.id && dbUser?.email) {
                return {
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    isAdmin: dbUser.roleName === 'admin',
                }
            }

            return null
        },
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
}