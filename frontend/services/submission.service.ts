import { api } from "@/lib/axios";
import type { TaskSubmission } from "@/types";

export const submissionService = {
  async submit(
    projectId: string,
    taskId: string,
    file: File,
    onProgress?: (p: number) => void
  ) {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<{
      success: boolean;
      data: TaskSubmission;
    }>(`/projects/${projectId}/tasks/${taskId}/submissions`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (e.total && onProgress) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
    return data.data;
  },

  async getByTask(projectId: string, taskId: string) {
    const { data } = await api.get<{
      success: boolean;
      data: TaskSubmission[];
    }>(`/projects/${projectId}/tasks/${taskId}/submissions`);
    return data.data;
  },

  async download(
    projectId: string,
    taskId: string,
    submissionId: string,
    fileName: string
  ) {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const url = `${base}/api/projects/${projectId}/tasks/${taskId}/submissions/${submissionId}/download`;
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  },

  async review(
    projectId: string,
    taskId: string,
    submissionId: string,
    status: "ACCEPTED" | "REJECTED",
    feedback?: string
  ) {
    const { data } = await api.put<{
      success: boolean;
      data: TaskSubmission;
    }>(
      `/projects/${projectId}/tasks/${taskId}/submissions/${submissionId}/review`,
      { status, feedback }
    );
    return data.data;
  },
};
