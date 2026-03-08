import { useSession } from "next-auth/react";

export function useUser() {
  const session = useSession();

  return {
    data: session.data?.user ?? null,
    isLoading: session.status === "loading",
    status: session.status,
  };
}
