import { api } from "@/lib/axios";
import type { Task } from "@/types";

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  status?: "CREATED" | "IN_PROGRESS" | "SUBMITTED";
}

export const taskService = {
  async create(projectId: string, input: CreateTaskInput) {
    const { data } = await api.post<{ success: boolean; data: Task }>(
      `/projects/${projectId}/tasks`,
      input
    );
    return data.data;
  },

  async update(projectId: string, taskId: string, input: UpdateTaskInput) {
    const { data } = await api.patch<{ success: boolean; data: Task }>(
      `/projects/${projectId}/tasks/${taskId}`,
      input
    );
    return data.data;
  },

  async getByProject(projectId: string) {
    const { data } = await api.get<{ success: boolean; data: Task[] }>(
      `/projects/${projectId}/tasks`
    );
    return data.data;
  },
};
