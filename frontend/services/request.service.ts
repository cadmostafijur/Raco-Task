import { api } from "@/lib/axios";
import type { ProjectRequest } from "@/types";

export const requestService = {
  async create(projectId: string, message?: string) {
    const { data } = await api.post<{
      success: boolean;
      data: ProjectRequest;
    }>(`/projects/${projectId}/requests`, { message });
    return data.data;
  },

  async getByProject(projectId: string) {
    const { data } = await api.get<{
      success: boolean;
      data: ProjectRequest[];
    }>(`/projects/${projectId}/requests`);
    return data.data;
  },

  async getMyRequests() {
    const { data } = await api.get<{
      success: boolean;
      data: ProjectRequest[];
    }>("/requests/my");
    return data.data;
  },
};
