"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "../api/get-user";
import type { ReactNode } from "react";

export function GuestGuard({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) return null;

  return <>{children}</>;
}
