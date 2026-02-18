import { api } from "@/lib/axios";
import type { Project } from "@/types";

export interface CreateProjectInput {
  title: string;
  description?: string;
}

export const projectService = {
  async create(input: CreateProjectInput) {
    const { data } = await api.post<{ success: boolean; data: Project }>(
      "/projects",
      input
    );
    return data.data;
  },

  async getAll() {
    const { data } = await api.get<{ success: boolean; data: Project[] }>(
      "/projects"
    );
    return data.data;
  },

  async getById(id: string) {
    const { data } = await api.get<{ success: boolean; data: Project }>(
      `/projects/${id}`
    );
    return data.data;
  },

  async assignSolver(projectId: string, solverId: string) {
    const { data } = await api.put<{ success: boolean; data: Project }>(
      `/projects/${projectId}/assign`,
      { solverId }
    );
    return data.data;
  },
};
