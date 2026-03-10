import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteNotification(notificationId: string) {
  const res = await fetch(`/api/notifications/${notificationId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete notification");
  return res.json();
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
