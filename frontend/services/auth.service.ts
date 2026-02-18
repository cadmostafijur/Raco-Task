import { api } from "@/lib/axios";
import type { User } from "@/types";

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const authService = {
  async register(input: RegisterInput) {
    const { data } = await api.post<{ success: boolean; data: AuthResponse }>(
      "/auth/register",
      input
    );
    return data.data;
  },

  async login(input: LoginInput) {
    const { data } = await api.post<{ success: boolean; data: AuthResponse }>(
      "/auth/login",
      input
    );
    return data.data;
  },

  async refreshToken(refreshToken: string) {
    const { data } = await api.post<{ success: boolean; data: AuthResponse }>(
      "/auth/refresh",
      { refreshToken }
    );
    return data.data;
  },

  async getMe() {
    const { data } = await api.get<{ success: boolean; data: User }>(
      "/auth/me"
    );
    return data.data;
  },

  async updateProfile(payload: { name?: string }) {
    const { data } = await api.put<{ success: boolean; data: User }>(
      "/auth/profile",
      payload
    );
    return data.data;
  },
};
