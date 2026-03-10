"use client";

import { X, Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  useNotificationStore,
  type Toast,
} from "../stores/notification-store";

const toastStyles: Record<Toast["type"], { bg: string; icon: typeof Info }> = {
  info: { bg: "border-primary/30 bg-primary/5", icon: Info },
  success: { bg: "border-green-500/30 bg-green-500/5", icon: CheckCircle2 },
  warning: {
    bg: "border-priority-medium/30 bg-priority-medium/5",
    icon: AlertTriangle,
  },
  error: { bg: "border-destructive/30 bg-destructive/5", icon: XCircle },
};

const toastIconColors: Record<Toast["type"], string> = {
  info: "text-primary",
  success: "text-green-600",
  warning: "text-priority-medium",
  error: "text-destructive",
};

export function NotificationToast() {
  const { toasts, removeToast } = useNotificationStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type];
        const Icon = style.icon;
        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-4 shadow-lg animate-in slide-in-from-right-5 fade-in duration-300",
              style.bg,
            )}
          >
            <Icon
              className={cn("mt-0.5 h-4 w-4 shrink-0", toastIconColors[toast.type])}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {toast.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
