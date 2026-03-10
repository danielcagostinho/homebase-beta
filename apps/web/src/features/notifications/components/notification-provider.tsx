"use client";

import { useEffect, type ReactNode } from "react";
import { NotificationToast } from "./notification-toast";

export function NotificationProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Generate notifications on mount
    fetch("/api/notifications/generate", { method: "POST" }).catch(() => {
      // Silently fail — generation is best-effort
    });
  }, []);

  return (
    <>
      {children}
      <NotificationToast />
    </>
  );
}
