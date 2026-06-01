"use client";

import { apiCall } from "@/lib/api";
import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";

export interface User {
  id: number;
  email: string;
  account_type: "admin" | "employee" | "user";
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
  logout: () => Promise<void>;
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
  const sessionVersionRef = useRef(0);

  useEffect(() => {
    const sessionVersion = ++sessionVersionRef.current;

    const syncSession = async () => {
      try {
        const response = await apiCall("/auth/me", { method: "GET" });

        if (sessionVersionRef.current !== sessionVersion) {
          return;
        }

        const sessionUser = response.user ?? response;

        if (sessionUser) {
          setUser(sessionUser);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    void syncSession();
  }, []);

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiCall("/auth/signin", {
          method: "POST",
          body: JSON.stringify({ email, password, rememberMe }),
        });

        if (data.access_token) {
          setToken(data.access_token);
        }

        if (data.user) {
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

  const logout = useCallback(async (): Promise<void> => {
    try {
      await apiCall("/auth/logout", { method: "POST" });
    } catch {
      // ignore network/logout errors
    }
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
      isAuthenticated: !!user,
    }),
    [user, token, isLoading, error, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
