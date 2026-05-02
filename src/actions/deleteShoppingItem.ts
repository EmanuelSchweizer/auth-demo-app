"use server";

import { getUserId } from "@/actions/getUserId";
import { env } from "process";

interface Params {
  id: string;
}

const action = async ({ id }: Params): Promise<{ deletedId: string }> => {
  const userId = await getUserId();

  if (!id.trim()) {
    throw new Error("Item-ID is required.");
  }

  const response = await fetch(`${env.API_URL}/items/${id}`, {
    method: "DELETE",
    headers: {
      "x-user-id": userId,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  return { deletedId: id };
};

export const deleteShoppingItem = async (params: Params) => await action(params);
