"use server";

import { getUserId } from "@/actions/getUserId";
import { env } from "process";
import type { ShoppingItem } from "@/types";

interface Params {
  id: string;
  bought: boolean;
}

const action = async ({ id, bought }: Params): Promise<ShoppingItem> => {
  const userId = await getUserId();

  if (!id.trim()) {
    throw new Error("Item-ID is required.");
  }

  const response = await fetch(`${env.API_URL}/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify({ bought }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  return (await response.json()) as ShoppingItem;
};

export const updateShoppingItem = async (params: Params) => await action(params);
