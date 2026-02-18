"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await login(data.email, data.password);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.2),transparent_50%)]" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-2 mb-12">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Workflow</span>
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-md">
              Sign in to access your dashboard, manage projects, and collaborate with your team.
            </p>
            <div className="mt-12 flex gap-6">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary">500+</span>
                <span className="text-sm text-muted-foreground">Active projects</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary">98%</span>
                <span className="text-sm text-muted-foreground">Completion rate</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md px-2 sm:px-0"
        >
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Workflow</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
          <p className="mt-2 text-muted-foreground">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gap-2"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
