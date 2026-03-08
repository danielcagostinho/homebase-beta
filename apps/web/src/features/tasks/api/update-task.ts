import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateTaskInput = {
  id: string;
  [key: string]: unknown;
};

async function updateTask({ id, ...fields }: UpdateTaskInput) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
