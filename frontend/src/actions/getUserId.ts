"use server";

import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

export const getUserId = async (): Promise<string> => {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id?.trim();

  if (!userId) {
    throw new Error("AUTH_REQUIRED");
  }

  return userId;
};