"use client";

import {
  AlertTriangle,
  Clock,
  CalendarClock,
  CheckCircle2,
  Users,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useMarkNotificationRead } from "../api/mark-read";
import { useDeleteNotification } from "../api/delete-notification";
import type { Notification } from "../api/get-notifications";
import { useRouter } from "next/navigation";

const typeIcons: Record<Notification["type"], typeof AlertTriangle> = {
  overdue: AlertTriangle,
  due_today: Clock,
  due_soon: CalendarClock,
  task_completed: CheckCircle2,
  household_invite: Users,
  general: Info,
};

const typeColors: Record<Notification["type"], string> = {
  overdue: "text-destructive",
  due_today: "text-priority-medium",
  due_soon: "text-primary",
  task_completed: "text-green-600",
  household_invite: "text-primary",
  general: "text-muted-foreground",
};

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

type NotificationItemProps = {
  notification: Notification;
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const markRead = useMarkNotificationRead();
  const deleteNotification = useDeleteNotification();
  const router = useRouter();
  const Icon = typeIcons[notification.type];

  function handleClick() {
    if (!notification.read) {
      markRead.mutate(notification.id);
    }
    if (notification.taskId) {
      router.push(`/tasks?taskId=${notification.taskId}`);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      className={cn(
        "flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-muted cursor-pointer",
        !notification.read && "bg-primary/5",
      )}
    >
      <Icon
        className={cn("mt-0.5 h-4 w-4 shrink-0", typeColors[notification.type])}
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm leading-tight",
            !notification.read ? "font-medium text-foreground" : "text-foreground",
          )}
        >
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {!notification.read && (
          <span className="h-2 w-2 rounded-full bg-primary" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteNotification.mutate(notification.id);
          }}
          className="p-1 rounded hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Delete notification"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
