import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "./api";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  token: null,
  user: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      SecureStore.getItemAsync("auth_token"),
      SecureStore.getItemAsync("auth_user"),
    ]).then(([t, u]) => {
      setToken(t);
      if (u) {
        try {
          setUser(JSON.parse(u));
        } catch {}
      }
      setIsLoading(false);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    const { token: newToken, user: newUser } = await api<{
      token: string;
      user: AuthUser;
    }>("/api/auth/mobile/token", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    await SecureStore.setItemAsync("auth_token", newToken);
    await SecureStore.setItemAsync("auth_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const { token: newToken, user: newUser } = await api<{
      token: string;
      user: AuthUser;
    }>("/api/auth/mobile/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    await SecureStore.setItemAsync("auth_token", newToken);
    await SecureStore.setItemAsync("auth_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("auth_token");
    await SecureStore.deleteItemAsync("auth_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
