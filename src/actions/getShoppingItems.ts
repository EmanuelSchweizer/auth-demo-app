"use server";

import { getUserId } from "@/actions/getUserId";
import { env } from "process";
import type { ShoppingItem } from "@/types";

const action = async (): Promise<ShoppingItem[]> => {
  const userId = await getUserId();

  const response = await fetch(`${env.API_URL}/items`, {
    method: "GET",
    headers: {
      "x-user-id": userId,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  return (await response.json()) as ShoppingItem[];
};

export const getShoppingItems = async () => await action();
