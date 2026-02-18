"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { authService } = await import("@/services/auth.service");
    const data = await authService.login({ email, password });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const { authService } = await import("@/services/auth.service");
    const data = await authService.register({ email, password, name });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      const { authService } = await import("@/services/auth.service");
      const freshUser = await authService.getMe();
      localStorage.setItem("user", JSON.stringify(freshUser));
      setUser(freshUser);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setUser, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
