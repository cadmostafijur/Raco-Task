"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User, Mail, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? "" },
  });

  useEffect(() => {
    if (user) reset({ name: user.name });
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    setMessage(null);
    setSaving(true);
    try {
      const { authService } = await import("@/services/auth.service");
      await authService.updateProfile({ name: data.name });
      await refreshUser();
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  const roleLabels: Record<string, string> = {
    ADMIN: "Admin",
    BUYER: "Buyer",
    PROBLEM_SOLVER: "Problem Solver",
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Update your profile information. Email cannot be changed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {message && (
              <div
                className={`rounded-lg border p-4 text-sm ${
                  message.type === "success"
                    ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
                    : "border-destructive/50 bg-destructive/10 text-destructive"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Contact support to change your email.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Your name"
                  className="pl-10"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary">{roleLabels[user.role] || user.role}</Badge>
              <Button type="submit" disabled={saving || !isDirty}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
