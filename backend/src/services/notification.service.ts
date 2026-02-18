import { PrismaClient } from "@prisma/client";
import { ROLES } from "../constants/roles";

const prisma = new PrismaClient();

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

export const notificationService = {
  async markAsSeen(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { lastSeenNotificationsAt: new Date() },
    });
  },

  async getForUser(userId: string, role: string): Promise<{
    count: number;
    newCount: number;
    items: NotificationItem[];
  }> {
    if (role === ROLES.BUYER || role === ROLES.ADMIN) {
      const [projects, taskSubmissions, user] = await Promise.all([
        prisma.project.findMany({
          where: {
            buyerId: userId,
            status: "REQUESTED",
          },
          include: {
            _count: { select: { requests: true } },
          },
          orderBy: { updatedAt: "desc" },
        }),
        prisma.notification.findMany({
          where: {
            userId,
            type: "TASK_SUBMISSION",
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: { lastSeenNotificationsAt: true },
        }),
      ]);

      const lastSeen = user?.lastSeenNotificationsAt;
      const projectMap = new Map<string, { title: string }>();
      const projectIds = [...new Set(taskSubmissions.map((n) => n.projectId))];
      if (projectIds.length > 0) {
        const projectTitles = await prisma.project.findMany({
          where: { id: { in: projectIds } },
          select: { id: true, title: true },
        });
        projectTitles.forEach((p) => projectMap.set(p.id, { title: p.title }));
      }

      const items: NotificationItem[] = [];

      for (const p of projects) {
        const createdAt = p.updatedAt;
        const seen = lastSeen ? createdAt <= lastSeen : false;
        items.push({
          id: `req-${p.id}`,
          type: "REQUEST",
          title: `${p._count.requests} problem solver(s) requested to work`,
          projectId: p.id,
          projectTitle: p.title,
          createdAt: createdAt.toISOString(),
          seen,
          meta: { requestCount: p._count.requests },
        });
      }

      for (const n of taskSubmissions) {
        const seen = lastSeen ? n.createdAt <= lastSeen : false;
        const projectTitle = projectMap.get(n.projectId)?.title || "Project";
        items.push({
          id: `sub-${n.id}`,
          type: "SUBMISSION",
          title: n.title,
          projectId: n.projectId,
          projectTitle,
          createdAt: n.createdAt.toISOString(),
          seen,
          meta: { solverName: n.solverName },
        });
      }

      items.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const newCount = items.filter((i) => !i.seen).length;
      return { count: items.length, newCount, items };
    }

    if (role === ROLES.PROBLEM_SOLVER) {
      const [assigned, user] = await Promise.all([
        prisma.project.findMany({
          where: {
            solverId: userId,
            status: { in: ["ASSIGNED", "IN_PROGRESS"] },
          },
          orderBy: { updatedAt: "desc" },
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: { lastSeenNotificationsAt: true },
        }),
      ]);
      const lastSeen = user?.lastSeenNotificationsAt;

      const items: NotificationItem[] = assigned.map((p) => {
        const createdAt = p.updatedAt;
        const seen = lastSeen ? createdAt <= lastSeen : false;
        return {
          id: `assign-${p.id}`,
          type: "ASSIGNMENT",
          title: "You are assigned to this project",
          projectId: p.id,
          projectTitle: p.title,
          createdAt: createdAt.toISOString(),
          seen,
        };
      });

      const newCount = items.filter((i) => !i.seen).length;
      return { count: items.length, newCount, items };
    }

    return { count: 0, newCount: 0, items: [] };
  },
};
