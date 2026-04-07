import NextAuth, { NextAuthOptions } from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
        name: "Sign In",
        credentials: {
            email: { label: "Email", type: "email", placeholder: "example@example.com" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials: Record<"email" | "password", string> | undefined) {
            if (!credentials || !credentials.email || !credentials.password) return null

            const dbUser = await fetch(`${process.env.API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                })
            }).then(res => res.json())

            if (dbUser) {
                return {
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
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