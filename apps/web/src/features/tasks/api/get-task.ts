import { useQuery } from "@tanstack/react-query";
import type { Task } from "@/types/task";

async function fetchTask(taskId: string): Promise<Task> {
  const res = await fetch(`/api/tasks/${taskId}`);
  if (!res.ok) throw new Error("Task not found");
  return res.json();
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => fetchTask(taskId),
  });
}
