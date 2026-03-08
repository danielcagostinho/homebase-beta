import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

export function useLogout(): UseMutationResult<void, Error, void> {
  return useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
    },
  });
}
