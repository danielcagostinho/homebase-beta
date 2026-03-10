import { useMutation, useQueryClient } from "@tanstack/react-query";

async function markAllRead() {
  const res = await fetch("/api/notifications/read-all", { method: "POST" });
  if (!res.ok) throw new Error("Failed to mark all as read");
  return res.json();
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
