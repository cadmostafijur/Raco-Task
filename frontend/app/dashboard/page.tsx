"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, FolderKanban, Wrench, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFirstName } from "@/lib/utils";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "PROBLEM_SOLVER") {
        router.replace("/dashboard/solver");
        return;
      }
      if (user.role === "BUYER") {
        router.replace("/dashboard/buyer");
        return;
      }
    }
  }, [user, loading, router]);

  if (loading || !user) return null;
  if (user.role === "PROBLEM_SOLVER" || user.role === "BUYER") {
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

  const roleCards = {
    ADMIN: {
      title: "Admin Dashboard",
      description: "Manage users and assign roles",
      href: "/dashboard/admin",
      icon: Users,
      gradient: "from-violet-500 to-purple-600",
    },
    BUYER: {
      title: "Buyer Dashboard",
      description: "Create projects and manage submissions",
      href: "/dashboard/buyer",
      icon: FolderKanban,
      gradient: "from-primary to-primary-600",
    },
    PROBLEM_SOLVER: {
      title: "Solver Dashboard",
      description: "Request projects and submit work",
      href: "/dashboard/solver",
      icon: Wrench,
      gradient: "from-emerald-500 to-teal-600",
    },
  };

  const cards = [roleCards[user.role]];
  if (user.role === "ADMIN") {
    cards.push(roleCards.BUYER, roleCards.PROBLEM_SOLVER);
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome back, {getFirstName(user.name)}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Select your dashboard to get started
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={card.href}>
              <Card hover className="group h-full">
                <CardContent className="p-6">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white mb-4`}
                  >
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-semibold">{card.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {card.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 gap-1 group-hover:gap-2 transition-all"
                  >
                    Open
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
