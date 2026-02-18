"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Shield, Loader2, BadgeCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user.service";
import type { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.replace("/dashboard");
      return;
    }
    if (user?.role === "ADMIN") {
      userService
        .getAll()
        .then(setUsers)
        .catch((e) => setError(e.response?.data?.error || "Failed to load users"))
        .finally(() => setFetching(false));
    }
  }, [user, loading, router]);

  const handleRoleChange = async (userId: string, role: User["role"]) => {
    setUpdating(userId);
    setError("");
    try {
      const updated = await userService.updateRole(userId, role);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to update role");
    } finally {
      setUpdating(null);
    }
  };

  const handleVerifyToggle = async (userId: string, verified: boolean) => {
    setUpdating(userId);
    setError("");
    try {
      const updated = await userService.setVerified(userId, verified);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to update verification");
    } finally {
      setUpdating(null);
    }
  };

  if (loading || !user) return null;
  if (user.role !== "ADMIN") return null;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">User Management</h1>
        <p className="mt-2 text-muted-foreground">
          Assign roles to users. Buyers create projects, Problem Solvers request to work.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.role === "BUYER").length}
                </p>
                <p className="text-sm text-muted-foreground">Buyers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.role === "PROBLEM_SOLVER").length}
                </p>
                <p className="text-sm text-muted-foreground">Solvers</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {fetching ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 text-muted-foreground font-medium">
                      Name
                    </th>
                    <th className="text-left py-4 px-4 text-muted-foreground font-medium">
                      Email
                    </th>
                    <th className="text-left py-4 px-4 text-muted-foreground font-medium">
                      Role
                    </th>
                    <th className="text-left py-4 px-4 text-muted-foreground font-medium">
                      Verified
                    </th>
                    <th className="text-left py-4 px-4 text-muted-foreground font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {users.map((u, i) => (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="py-4 px-4 font-medium">{u.name}</td>
                        <td className="py-4 px-4 text-muted-foreground">{u.email}</td>
                        <td className="py-4 px-4">
                          <Badge status={u.role}>{u.role}</Badge>
                        </td>
                        <td className="py-4 px-4">
                          {u.role === "PROBLEM_SOLVER" && (
                            <Button
                              variant={u.verified ? "default" : "outline"}
                              size="sm"
                              disabled={updating === u.id}
                              onClick={() =>
                                handleVerifyToggle(u.id, !u.verified)
                              }
                              className="gap-1"
                            >
                              {u.verified ? (
                                <>
                                  <BadgeCheck className="h-4 w-4" />
                                  Verified
                                </>
                              ) : (
                                "Verify"
                              )}
                            </Button>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {u.role !== "ADMIN" && (
                            <div className="flex gap-2">
                              {(["BUYER", "PROBLEM_SOLVER"] as const).map((role) => (
                                <Button
                                  key={role}
                                  variant={u.role === role ? "default" : "outline"}
                                  size="sm"
                                  disabled={updating === u.id}
                                  onClick={() => handleRoleChange(u.id, role)}
                                >
                                  {updating === u.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    role
                                  )}
                                </Button>
                              ))}
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
