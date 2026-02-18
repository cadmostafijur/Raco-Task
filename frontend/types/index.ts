export type Role = "ADMIN" | "BUYER" | "PROBLEM_SOLVER";

export type ProjectStatus =
  | "OPEN"
  | "REQUESTED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "COMPLETED"
  | "REJECTED";

export type TaskStatus =
  | "CREATED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "COMPLETED";

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type SubmissionStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  verified?: boolean;
  createdAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  buyerId: string;
  solverId?: string;
  buyer?: User;
  solver?: User;
  requests?: ProjectRequest[];
  tasks?: Task[];
  _count?: { requests: number; tasks: number };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectRequest {
  id: string;
  projectId: string;
  userId: string;
  status: RequestStatus;
  message?: string;
  project?: Project;
  user?: User & { completedProjects?: number; completedTasks?: number };
  createdAt?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  orderIndex: number;
  submissions?: TaskSubmission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  status: SubmissionStatus;
  feedback?: string;
  reviewedAt?: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: Array<{ path: string; message: string }>;
}
