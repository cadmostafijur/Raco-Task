"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [error, setError] = useState("");
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await registerUser(data.email, data.password, data.name);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8 order-2 lg:order-1">
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

          <h2 className="text-2xl font-bold tracking-tight">Create account</h2>
          <p className="mt-2 text-muted-foreground">
            Get started with your free account
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
              <label className="text-sm font-medium">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("name")}
                  placeholder="John Doe"
                  className="pl-10"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

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
              {isSubmitting ? "Creating account..." : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-bl from-primary/10 via-primary/5 to-background overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.2),transparent_50%)]" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight">
              Start collaborating today
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-md">
              Join buyers and problem solvers who are already streamlining their project workflows.
            </p>
            <ul className="mt-8 space-y-4">
              {["Role-based dashboards", "Full lifecycle tracking", "Secure file uploads"].map(
                (item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                      ✓
                    </div>
                    <span>{item}</span>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
