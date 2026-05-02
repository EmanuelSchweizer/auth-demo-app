"use server";

import { getUserId } from "@/actions/getUserId";
import { env } from "process";

export const deleteUser = async (targetUserId: string): Promise<void> => {
  const requestUserId = await getUserId();

  const response = await fetch(`${env.API_URL}/admin/users/${targetUserId}`, {
    method: "DELETE",
    headers: {
      "x-user-id": requestUserId,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }
};
