import { useMutation, useQueryClient } from "@tanstack/react-query";

async function leaveHousehold() {
  const res = await fetch("/api/households/leave", {
    method: "POST",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Failed to leave household");
  }
  return res.json();
}

export function useLeaveHousehold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveHousehold,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household"] });
      queryClient.invalidateQueries({ queryKey: ["household-members"] });
    },
  });
}
