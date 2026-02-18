"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, FolderKanban, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { projectService } from "@/services/project.service";
import type { Project } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (user) {
      projectService
        .getAll()
        .then(setProjects)
        .catch(() => setProjects([]))
        .finally(() => setFetching(false));
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Browse and manage projects
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
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <FolderKanban className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No projects</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                      <h3 className="font-semibold line-clamp-1 text-base sm:text-lg">{p.title}</h3>
                      <Badge status={p.status} className="self-start">{p.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {p.description || "No description"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Buyer: {p.buyer?.name || "—"}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Tasks: {p._count?.tasks ?? 0}</span>
                      <span>Requests: {p._count?.requests ?? 0}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-4 gap-1 w-full justify-end">
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
    </div>
  );
}
