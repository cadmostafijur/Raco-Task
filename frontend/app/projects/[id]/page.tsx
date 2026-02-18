"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, UserCheck, FileArchive, Check, X, Calendar, BadgeCheck, Briefcase, FolderCheck, Download, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { projectService } from "@/services/project.service";
import { requestService } from "@/services/request.service";
import { taskService } from "@/services/task.service";
import { submissionService } from "@/services/submission.service";
import type { Project, Task } from "@/types";
import LifecycleVisualization from "@/components/LifecycleVisualization";
import FileUpload from "@/components/FileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function ProjectDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [requesting, setRequesting] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState("");

  const loadProject = () => {
    projectService
      .getById(id)
      .then(setProject)
      .catch((e) => setError(e.response?.data?.error || "Failed to load"))
      .finally(() => setFetching(false));
  };

  const loadTasks = () => {
    taskService.getByProject(id).then(setTasks).catch(() => setTasks([]));
  };

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (user && id) {
      loadProject();
      loadTasks();
    }
  }, [user, loading, id]);

  useEffect(() => {
    if (project?.tasks) setTasks(project.tasks as Task[]);
  }, [project]);

  const handleRequest = async () => {
    setRequesting(true);
    setError("");
    try {
      await requestService.create(id);
      loadProject();
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to request");
    } finally {
      setRequesting(false);
    }
  };

  const handleAssign = async (solverId: string) => {
    setAssigning(true);
    setError("");
    try {
      await projectService.assignSolver(id, solverId);
      loadProject();
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to assign");
    } finally {
      setAssigning(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setAddingTask(true);
    setError("");
    try {
      await taskService.create(id, {
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim() || undefined,
        dueDate: newTaskDueDate || undefined,
      });
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskDueDate("");
      loadProject();
      loadTasks();
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to add task");
    } finally {
      setAddingTask(false);
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    updates: { title?: string; description?: string; dueDate?: string; status?: "CREATED" | "IN_PROGRESS" | "SUBMITTED" }
  ) => {
    setError("");
    try {
      await taskService.update(id, taskId, updates);
      loadProject();
      loadTasks();
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to update task");
    }
  };

  const handleUpload = async (taskId: string, file: File) => {
    setError("");
    try {
      await submissionService.submit(id, taskId, file);
      loadProject();
      loadTasks();
    } catch (e: any) {
      throw e;
    }
  };

  const handleReview = async (
    taskId: string,
    submissionId: string,
    status: "ACCEPTED" | "REJECTED",
    feedback?: string
  ) => {
    setReviewingId(submissionId);
    setError("");
    try {
      await submissionService.review(id, taskId, submissionId, status, feedback);
      setReviewFeedback("");
      loadProject();
      loadTasks();
    } catch (e: any) {
      setError(e.response?.data?.error || "Review failed");
    } finally {
      setReviewingId(null);
    }
  };

  const handleDownload = async (taskId: string, submissionId: string, fileName: string) => {
    setError("");
    try {
      await submissionService.download(id, taskId, submissionId, fileName);
    } catch (e: any) {
      setError(e.message || "Download failed");
    }
  };

  if (loading || !user) return null;
  if (fetching && !project) {
    return (
      <div className="flex justify-center py-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent"
        />
      </div>
    );
  }
  if (!project) {
    return (
      <div className="text-center py-24">
        <p className="text-destructive">Project not found</p>
        <Link href="/projects" className="text-primary mt-4 inline-block hover:underline">
          Back to projects
        </Link>
      </div>
    );
  }

  const isBuyer = user.role === "BUYER" || user.role === "ADMIN";
  const isSolver = project.solverId === user.id;
  const canRequest =
    user.role === "PROBLEM_SOLVER" &&
    project.status === "OPEN" &&
    !project.requests?.some((r) => r.userId === user.id && r.status === "PENDING");
  const hasRequested = project.requests?.some(
    (r) => r.userId === user.id && r.status === "PENDING"
  );
  const pendingRequests = project.requests?.filter((r) => r.status === "PENDING") || [];
  const canAddTasks =
    isSolver &&
    ["ASSIGNED", "IN_PROGRESS", "SUBMITTED", "REJECTED"].includes(project.status);

  return (
    <div className="space-y-6 sm:space-y-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{project.title}</h1>
            <Badge status={project.status}>{project.status}</Badge>
          </div>
          <p className="text-muted-foreground">{project.description || "No description"}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Buyer: {project.buyer?.name} • {project.solver && `Solver: ${project.solver.name}`}
          </p>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive"
        >
          {error}
        </motion.div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Lifecycle</CardTitle>
        </CardHeader>
        <CardContent>
          <LifecycleVisualization currentStatus={project.status} />
        </CardContent>
      </Card>

      {canRequest && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Button onClick={handleRequest} disabled={requesting} className="gap-2">
            <UserCheck className="h-4 w-4" />
            {requesting ? "Requesting..." : "Request to Work"}
          </Button>
        </motion.div>
      )}

      {hasRequested && project.status === "OPEN" && (
        <p className="text-amber-600 dark:text-amber-400">Your request is pending</p>
      )}

      {isBuyer && pendingRequests.length > 0 && project.status === "REQUESTED" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Assign a Solver</CardTitle>
            <p className="text-sm text-muted-foreground">
              View each requester&apos;s profile, verification status, and work history before assigning
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 p-4 rounded-lg border bg-muted/30"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{r.user?.name}</p>
                      {r.user?.verified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{r.user?.email}</p>
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <FolderCheck className="h-4 w-4" />
                        {r.user && "completedProjects" in r.user ? r.user.completedProjects ?? 0 : 0} projects completed
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {r.user && "completedTasks" in r.user ? r.user.completedTasks ?? 0 : 0} tasks completed
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAssign(r.userId)}
                    disabled={assigning}
                    className="w-full sm:w-auto shrink-0"
                  >
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {canAddTasks && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAddTask}
          className="space-y-4 p-4 rounded-xl border bg-muted/30"
        >
          <h3 className="font-semibold">Create Task / Sub-module</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Input
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Task description (optional)"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Deadline</label>
              <Input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={addingTask || !newTaskTitle.trim()} className="gap-2">
            <Plus className="h-4 w-4" />
            {addingTask ? "Adding..." : "Add Task"}
          </Button>
        </motion.form>
      )}

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold">Tasks</h2>
          {canAddTasks && tasks.length > 0 && (
            <p className="text-sm text-muted-foreground">
              You can add more tasks and upload a ZIP for each task below
            </p>
          )}
        </div>
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileArchive className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No tasks yet</p>
              {canAddTasks && (
                <p className="text-sm text-muted-foreground mt-2">
                  Use the form above to create your first task
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasks.map((task, i) => {
              const latestSubmission =
                task.submissions?.[0] || task.submissions?.[task.submissions?.length - 1];
              const canUpload =
                isSolver &&
                ["CREATED", "IN_PROGRESS"].includes(task.status) &&
                !["SUBMITTED", "COMPLETED"].includes(task.status);

              const canChangeStatus =
                isSolver &&
                ["CREATED", "IN_PROGRESS"].includes(task.status) &&
                !["COMPLETED"].includes(task.status);

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold">{task.title}</h3>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                          {task.dueDate && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge status={task.status}>{task.status}</Badge>
                          {canChangeStatus && (
                            <select
                              value={task.status}
                              onChange={(e) =>
                                handleUpdateTask(task.id, {
                                  status: e.target.value as "CREATED" | "IN_PROGRESS" | "SUBMITTED",
                                })
                              }
                              className="text-sm rounded-md border bg-background px-2 py-1"
                            >
                              <option value="CREATED">CREATED</option>
                              <option value="IN_PROGRESS">IN_PROGRESS</option>
                              <option value="SUBMITTED">SUBMITTED</option>
                            </select>
                          )}
                        </div>
                      </div>

                      {canUpload && (
                        <div className="mt-4 p-4 rounded-lg border bg-muted/30">
                          <p className="text-sm font-medium mb-2">
                            {task.status === "IN_PROGRESS" && task.submissions?.length
                              ? "Re-upload (submit revised work)"
                              : "Submit completed work (ZIP file)"}
                          </p>
                          <FileUpload
                            onUpload={(file) => handleUpload(task.id, file)}
                            accept=".zip"
                          />
                        </div>
                      )}

                      {task.submissions && task.submissions.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <p className="text-sm font-medium">Submissions</p>
                          {task.submissions.map((sub) => {
                            const isPending = sub.status === "PENDING";
                            const canDownload = isBuyer || isSolver;
                            return (
                              <div
                                key={sub.id}
                                className="p-4 rounded-lg border bg-muted/30 space-y-3"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <FileArchive className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <span className="text-sm font-medium truncate">
                                      {sub.fileName}
                                    </span>
                                    <Badge status={sub.status} className="shrink-0">
                                      {sub.status}
                                    </Badge>
                                  </div>
                                  {canDownload && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="gap-1 shrink-0"
                                      onClick={() =>
                                        handleDownload(task.id, sub.id, sub.fileName)
                                      }
                                    >
                                      <Download className="h-4 w-4" />
                                      Download
                                    </Button>
                                  )}
                                </div>
                                {sub.feedback && (
                                  <div className="flex gap-2 text-sm">
                                    <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                                    <p className="text-muted-foreground">
                                      <span className="font-medium">Comment: </span>
                                      {sub.feedback}
                                    </p>
                                  </div>
                                )}
                                {isPending && isBuyer && (
                                  <div className="pt-2 space-y-2">
                                    <Input
                                      placeholder="Add comment for solver (optional)"
                                      value={reviewFeedback}
                                      onChange={(e) => setReviewFeedback(e.target.value)}
                                      className="text-sm"
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          handleReview(task.id, sub.id, "ACCEPTED", reviewFeedback)
                                        }
                                        disabled={!!reviewingId}
                                        className="gap-1 bg-green-600 hover:bg-green-700"
                                      >
                                        <Check className="h-4 w-4" />
                                        Accept
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                          handleReview(task.id, sub.id, "REJECTED", reviewFeedback)
                                        }
                                        disabled={!!reviewingId}
                                        className="gap-1"
                                      >
                                        <X className="h-4 w-4" />
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {canAddTasks && (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleAddTask}
                className="p-4 rounded-xl border border-dashed bg-muted/20"
              >
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add another task / sub-module
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task title"
                    required
                    className="flex-1"
                  />
                  <Input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full sm:w-auto"
                  />
                  <Button
                    type="submit"
                    disabled={addingTask || !newTaskTitle.trim()}
                    className="gap-2 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    {addingTask ? "Adding..." : "Add"}
                  </Button>
                </div>
                <Input
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Description (optional)"
                  className="mt-2"
                />
              </motion.form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
