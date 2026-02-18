"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { projectService } from "@/services/project.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  title: z.string().min(1, "Title required").max(200),
  description: z.string().max(2000).optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewProjectPage() {
  const [error, setError] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const project = await projectService.create(data);
      router.push(`/projects/${project.id}`);
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to create project");
    }
  };

  if (loading || !user) return null;
  if (user.role !== "BUYER" && user.role !== "ADMIN") {
    router.replace("/dashboard");
    return null;
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-2xl w-full">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create Project</h1>
        <p className="mt-2 text-muted-foreground">
          Add a new project for problem solvers
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Project details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  {...register("title")}
                  placeholder="Project title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Project description"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? "Creating..." : "Create Project"}
                </Button>
                <Link href="/projects" className="w-full sm:w-auto">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
