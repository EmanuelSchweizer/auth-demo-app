"use server";

import { env } from "process";
import type { ShoppingItem } from "@/types";

interface Params {
  id: string;
  bought: boolean;
  name: string;
}

const action = async ({ id, bought, name }: Params): Promise<ShoppingItem> => {
  if (!id.trim()) {
    throw new Error("Item-ID is required.");
  }

  const response = await fetch(`${env.API_URL}/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bought, name: name.trim() }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  return (await response.json()) as ShoppingItem;
};

export const updateShoppingItem = async (params: Params) => await action(params);
