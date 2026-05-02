"use server";

import { getUserId } from "@/actions/getUserId";
import type { ShoppingItem } from "@/types";
import { env } from "process";

interface Params {
  name: string;
}

const action = async ({ name }: Params): Promise<ShoppingItem> => {
  const trimmedName = name.trim();
  const userId = await getUserId();

  if (!trimmedName) {
    throw new Error("Name is required.");
  }

  const response = await fetch(`${env.API_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify({ name: trimmedName }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  return (await response.json()) as ShoppingItem;
};

export const addShoppingItem = async (params: Params) => await action(params);
