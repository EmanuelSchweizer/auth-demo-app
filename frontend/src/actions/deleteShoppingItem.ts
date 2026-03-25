"use server";

import { env } from "process";

interface Params {
  id: string;
}

const action = async ({ id }: Params): Promise<{ deletedId: string }> => {
  if (!id.trim()) {
    throw new Error("Item-ID is required.");
  }

  const response = await fetch(`${env.API_URL}/items/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  return { deletedId: id };
};

export const deleteShoppingItem = async (params: Params) => await action(params);
