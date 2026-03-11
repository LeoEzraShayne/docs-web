"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "./api";
import type { AuthMeResponse, BillingSummary } from "./types";

type AuthState = {
  status: "loading" | "authenticated" | "unauthenticated";
  user: AuthMeResponse["user"] | null;
  billing: BillingSummary | null;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthState["status"]>("loading");
  const [user, setUser] = useState<AuthState["user"]>(null);
  const [billing, setBilling] = useState<BillingSummary | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [{ user }, summary] = await Promise.all([
        api.getAuthMe(),
        api.getBillingSummary().catch(() => null),
      ]);
      setUser(user);
      setBilling(summary);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setBilling(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      status,
      user,
      billing,
      refresh,
    }),
    [billing, refresh, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
