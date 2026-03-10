import { useQuery } from "@tanstack/react-query";

export type Notification = {
  id: string;
  userId: string;
  type:
    | "overdue"
    | "due_today"
    | "due_soon"
    | "task_completed"
    | "household_invite"
    | "general";
  title: string;
  message: string;
  read: boolean;
  taskId: string | null;
  createdAt: string;
};

async function fetchNotifications(): Promise<Notification[]> {
  const res = await fetch("/api/notifications");
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 5 * 60 * 1000, // Poll every 5 minutes
  });
}
