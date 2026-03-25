"use client";

import { useCallback, useState } from "react";

export type ServerActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

type AsyncAction<TArgs extends unknown[], TData> = (...args: TArgs) => Promise<TData>;

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unknown error occurred";
};

export const useServerAction = <TArgs extends unknown[], TData>(
  serverAction: AsyncAction<TArgs, TData>
) => {
  const [isLoading, setIsLoading] = useState(false);

  const Action = useCallback(
    async (...args: TArgs): Promise<ServerActionResult<TData>> => {
      setIsLoading(true);

      try {
        const data = await serverAction(...args);
        return { success: true, data };
      } catch (error) {
        return { success: false, error: toErrorMessage(error) };
      } finally {
        setIsLoading(false);
      }
    },
    [serverAction]
  );

  return {
    Action,
    execute: Action,
    isLoading,
  };
};
