"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@repo/ui/spinner";
import { useUser } from "../api/get-user";
import type { ReactNode } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
