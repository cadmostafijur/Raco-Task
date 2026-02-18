"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16 lg:border-r">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    (item.href === "/dashboard"
                      ? pathname.startsWith("/dashboard") && pathname !== "/dashboard/profile"
                      : pathname === item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 lg:pl-64">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
