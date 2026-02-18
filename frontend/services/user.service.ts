import { api } from "@/lib/axios";
import type { User } from "@/types";

export const userService = {
  async getAll() {
    const { data } = await api.get<{ success: boolean; data: User[] }>(
      "/users"
    );
    return data.data;
  },

  async getById(id: string) {
    const { data } = await api.get<{ success: boolean; data: User }>(
      `/users/${id}`
    );
    return data.data;
  },

  async updateRole(id: string, role: User["role"]) {
    const { data } = await api.put<{ success: boolean; data: User }>(
      `/users/${id}/role`,
      { role }
    );
    return data.data;
  },

  async setVerified(id: string, verified: boolean) {
    const { data } = await api.put<{ success: boolean; data: User }>(
      `/users/${id}/verify`,
      { verified }
    );
    return data.data;
  },
};
