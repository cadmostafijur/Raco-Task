"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, FolderKanban, ArrowRight, UserPlus, FileCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { projectService } from "@/services/project.service";
import type { Project } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function BuyerDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || (user.role !== "BUYER" && user.role !== "ADMIN"))) {
      router.replace("/dashboard");
      return;
    }
    if (user?.role === "BUYER" || user?.role === "ADMIN") {
      projectService
        .getAll()
        .then(setProjects)
        .catch(() => setProjects([]))
        .finally(() => setFetching(false));
    }
  }, [user, loading, router]);

  if (loading || !user) return null;
  if (user.role !== "BUYER" && user.role !== "ADMIN") return null;

  const needsAssign = projects.filter((p) => p.status === "REQUESTED");
  const needsReview = projects.filter((p) => p.status === "SUBMITTED");
  const myProjects = projects.filter(
    (p) => !["REQUESTED", "SUBMITTED"].includes(p.status) || true
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Create projects, view incoming requests, assign solvers, and review submissions
          </p>
        </div>
        {(user.role === "BUYER" || user.role === "ADMIN") && (
          <Link href="/projects/new">
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        )}
      </div>

      {fetching ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Needs Attention */}
          {(needsAssign.length > 0 || needsReview.length > 0) && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Needs Your Attention
              </h2>
              <div className="space-y-4">
                {needsAssign.map((p) => (
                  <Link key={p.id} href={`/projects/${p.id}`}>
                    <Card className="border-amber-500/30 hover:border-amber-500/50 transition-colors">
                      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600">
                            <UserPlus className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{p.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {p._count?.requests ?? 0} problem solver(s) requested to work — Assign one
                            </p>
                          </div>
                        </div>
                        <Button size="sm" className="gap-1 w-full sm:w-auto">
                          View & Assign
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                {needsReview.map((p) => (
                  <Link key={p.id} href={`/projects/${p.id}`}>
                    <Card className="border-primary/30 hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                            <FileCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{p.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Task submissions pending — Accept or reject
                            </p>
                          </div>
                        </div>
                        <Button size="sm" className="gap-1 w-full sm:w-auto">
                          Review Submissions
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* All Projects */}
          <section>
            <h2 className="text-lg font-semibold mb-4">All Projects</h2>
            {projects.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                    <FolderKanban className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No projects yet</h3>
                  <p className="mt-2 text-muted-foreground text-center max-w-sm">
                    Create your first project. Problem solvers will request to work on it.
                  </p>
                  {(user.role === "BUYER" || user.role === "ADMIN") && (
                    <Link href="/projects/new" className="mt-6">
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create project
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/projects/${p.id}`}>
                      <Card hover>
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3 sm:mb-4">
                            <h3 className="font-semibold line-clamp-1 text-base sm:text-lg">
                              {p.title}
                            </h3>
                            <Badge status={p.status} className="self-start">
                              {p.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {p.description || "No description"}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Tasks: {p._count?.tasks ?? 0}</span>
                            <span>Requests: {p._count?.requests ?? 0}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-4 gap-1 w-full justify-end"
                          >
                            View
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
