"use client";

import { SessionProvider } from "next-auth/react";
import { Toast } from "@heroui/react";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
      <Toast.Provider />
    </>
  );
};
