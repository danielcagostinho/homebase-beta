import { useMutation, useQueryClient } from "@tanstack/react-query";

async function joinHousehold(input: { code: string }) {
  const res = await fetch("/api/households/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Failed to join household");
  }
  return res.json();
}

export function useJoinHousehold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinHousehold,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household"] });
      queryClient.invalidateQueries({ queryKey: ["household-members"] });
    },
  });
}
