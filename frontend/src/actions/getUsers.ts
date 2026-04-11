"use server";

import { getUserId } from "@/actions/getUserId";
import { env } from "process";
import type { AdminUser } from "@/types";

export const getUsers = async (): Promise<AdminUser[]> => {
  const userId = await getUserId();

  const response = await fetch(`${env.API_URL}/admin/users`, {
    method: "GET",
    headers: {
      "x-user-id": userId,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  return (await response.json()) as AdminUser[];
};
