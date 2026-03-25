"use server";

import { env } from "process";
import type { ShoppingItem } from "@/types";

const action = async (): Promise<ShoppingItem[]> => {
  const response = await fetch(`${env.API_URL}/items`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  return (await response.json()) as ShoppingItem[];
};

export const getShoppingItems = async () => await action();
