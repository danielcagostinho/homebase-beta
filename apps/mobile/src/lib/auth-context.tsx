import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "./api";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  token: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync("auth_token").then((t) => {
      setToken(t);
      setIsLoading(false);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    const { token: newToken } = await api<{ token: string }>(
      "/api/auth/mobile/token",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );
    await SecureStore.setItemAsync("auth_token", newToken);
    setToken(newToken);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const { token: newToken } = await api<{ token: string }>(
      "/api/auth/mobile/register",
      {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      },
    );
    await SecureStore.setItemAsync("auth_token", newToken);
    setToken(newToken);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("auth_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
