"use client";

import { apiCall } from "@/lib/api";
import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
} from "react";

export interface User {
  id: string;
  email: string;
  username: string;
  userRole: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (
    username: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (storedToken) requestAnimationFrame(() => setToken(storedToken));
    if (storedUser) {
      try {
        requestAnimationFrame(() => setUser(JSON.parse(storedUser)));
      } catch {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
      }
    }
    requestAnimationFrame(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiCall("/auth/signin", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        const storage = rememberMe ? localStorage : sessionStorage;
        data;

        if (data.access_token) {
          storage.setItem("access_token", data.access_token);
          setToken(data.access_token);
        }

        if (data.user) {
          storage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred during login";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const value = useMemo(
    (): AuthContextType => ({
      user,
      token,
      isLoading,
      error,
      login,
      logout,
      isAuthenticated: !!token,
    }),
    [user, token, isLoading, error, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
