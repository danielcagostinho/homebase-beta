import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

type RegisterInput = {
  displayName: string;
  email: string;
  password: string;
};

export function useRegister() {
  return useMutation({
    mutationFn: async ({ displayName, email, password }: RegisterInput) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Registration failed");
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
  });
}
