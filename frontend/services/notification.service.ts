import { api } from "@/lib/axios";

export type NotificationItem = {
  id: string;
  type: "REQUEST" | "SUBMISSION" | "ASSIGNMENT";
  title: string;
  projectId: string;
  projectTitle: string;
  createdAt: string;
  seen: boolean;
  meta?: Record<string, unknown>;
};

export type NotificationsResponse = {
  count: number;
  newCount: number;
  items: NotificationItem[];
};

export const notificationService = {
  async getNotifications(): Promise<NotificationsResponse> {
    const { data } = await api.get<{
      success: boolean;
      data: NotificationsResponse;
    }>("/notifications");
    return data.data;
  },

  async markAsSeen(): Promise<void> {
    await api.post("/notifications/seen");
  },
};
