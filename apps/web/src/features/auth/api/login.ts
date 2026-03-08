import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

type LoginInput = {
  email: string;
  password: string;
};

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: LoginInput) => {
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

export function useGoogleLogin() {
  return useMutation({
    mutationFn: async () => {
      await signIn("google", { redirectTo: "/dashboard" });
    },
  });
}
