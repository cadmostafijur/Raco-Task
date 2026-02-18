"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderKanban, Wrench, ArrowRight, Search, FileArchive } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { projectService } from "@/services/project.service";
import { requestService } from "@/services/request.service";
import type { Project, ProjectRequest } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function SolverDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || (user.role !== "PROBLEM_SOLVER" && user.role !== "ADMIN"))) {
      router.replace("/dashboard");
      return;
    }
    if (user?.role === "PROBLEM_SOLVER" || user?.role === "ADMIN") {
      Promise.all([projectService.getAll(), requestService.getMyRequests()])
        .then(([projs, reqs]) => {
          setProjects(projs);
          setRequests(reqs);
        })
        .catch(() => {})
        .finally(() => setFetching(false));
    }
  }, [user, loading, router]);

  if (loading || !user) return null;
  if (user.role !== "PROBLEM_SOLVER" && user.role !== "ADMIN") return null;

  const myProjects = projects.filter((p) => p.solverId === user.id);
  const openProjects = projects.filter((p) => p.status === "OPEN");
  const requestedProjectIds = new Set(
    requests.filter((r) => r.status === "PENDING").map((r) => r.projectId)
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Solver Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse projects, request to work, create tasks, and submit ZIP files
        </p>
      </div>

      {/* My Assigned Projects */}
      {myProjects.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            My Assigned Projects
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Create tasks, upload ZIP per task, and track progress
          </p>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {myProjects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`}>
                <Card hover>
                  <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{p.title}</h3>
                      <Badge status={p.status} className="mt-2">
                        {p.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        {p._count?.tasks ?? 0} tasks
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Browse Open Projects */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Browse Available Projects
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Request to work on open projects. Once assigned, you can create tasks and submit ZIP files.
        </p>
        {fetching ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : openProjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <FolderKanban className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No open projects right now</p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back later or browse all projects
              </p>
              <Link href="/projects" className="mt-6">
                <Button variant="outline">View All Projects</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {openProjects.map((p, i) => {
              const hasRequested = requestedProjectIds.has(p.id);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold">{p.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {p.description || "No description"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Buyer: {p.buyer?.name || "—"}
                          </p>
                        </div>
                        <Link
                          href={`/projects/${p.id}`}
                          className="self-start sm:self-center shrink-0"
                        >
                          <Button
                            variant={hasRequested ? "secondary" : "default"}
                            size="sm"
                            disabled={hasRequested}
                            className="w-full sm:w-auto gap-1"
                          >
                            {hasRequested ? "Requested" : "View & Request"}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
        {!fetching && openProjects.length > 0 && (
          <Link href="/projects" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              View all projects
            </Button>
          </Link>
        )}
      </section>

      {/* Quick tip */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 sm:p-6 flex items-start gap-4">
          <FileArchive className="h-10 w-10 text-primary shrink-0" />
          <div>
            <h3 className="font-semibold">How it works</h3>
            <ol className="mt-2 text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Browse open projects and click &quot;View & Request&quot;</li>
              <li>Once the buyer assigns you, create tasks (sub-modules)</li>
              <li>Upload a ZIP file for each task when complete</li>
              <li>The buyer will accept or reject your submissions</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
