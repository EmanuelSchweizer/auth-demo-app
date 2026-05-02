"use server";

import { authOptions } from "@/auth";
import { env } from "process";
import { getServerSession } from "next-auth";

const isMongoObjectId = (value: string): boolean => /^[a-f\d]{24}$/i.test(value);

export const getUserId = async (): Promise<string> => {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; email?: string; name?: string } | undefined;
  const userId = user?.id?.trim();

  if (userId && isMongoObjectId(userId)) {
    return userId;
  }

  const email = user?.email?.trim().toLowerCase();
  if (!email) {
    throw new Error("AUTH_REQUIRED");
  }

  const resolveUserResponse = await fetch(`${env.API_URL}/auth/resolve-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      name: user?.name,
    }),
    cache: "no-store",
  });

  if (!resolveUserResponse.ok) {
    throw new Error("AUTH_REQUIRED");
  }

  const dbUser = await resolveUserResponse.json();
  const resolvedUserId = typeof dbUser?.id === "string" ? dbUser.id.trim() : "";

  if (!resolvedUserId || !isMongoObjectId(resolvedUserId)) {
    throw new Error("AUTH_REQUIRED");
  }

  return resolvedUserId;
};