"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  FolderKanban,
  LogOut,
  ChevronDown,
  Bell,
  Zap,
  User,
  UserPlus,
  FileCheck,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, getDisplayName } from "@/lib/utils";
import { notificationService, type NotificationItem } from "@/services/notification.service";

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  BUYER: "Buyer",
  PROBLEM_SOLVER: "Solver",
};

const typeIcons: Record<string, React.ElementType> = {
  REQUEST: UserPlus,
  SUBMISSION: FileCheck,
  ASSIGNMENT: Briefcase,
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<{
    count: number;
    newCount: number;
    items: NotificationItem[];
  }>({ count: 0, newCount: 0, items: [] });
  const { user, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchNotifications = () => {
    if (!user) return;
    notificationService
      .getNotifications()
      .then((data) =>
        setNotifications({
          count: data.count,
          newCount: data.newCount,
          items: data.items,
        })
      )
      .catch(() =>
        setNotifications({ count: 0, newCount: 0, items: [] })
      );
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, pathname]);

  const openNotifDropdown = async () => {
    setNotifOpen(true);
    fetchNotifications();
    try {
      await notificationService.markAsSeen();
      fetchNotifications();
    } catch {
      /* ignore */
    }
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderKanban },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-soft"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">Workflow</span>
        </Link>

        {user ? (
          <>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => (notifOpen ? setNotifOpen(false) : openNotifDropdown())}
                >
                  <Bell className="h-5 w-5" />
                  {notifications.newCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center min-w-[1rem]">
                      {notifications.newCount > 99 ? "99+" : notifications.newCount}
                    </span>
                  )}
                </Button>
                <AnimatePresence>
                  {notifOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setNotifOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-80 max-h-[min(24rem,70vh)] rounded-xl border bg-popover shadow-xl z-50 overflow-hidden flex flex-col"
                      >
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                          <h3 className="font-semibold">Notifications</h3>
                          {notifications.newCount > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {notifications.newCount} new
                            </span>
                          )}
                        </div>
                        <div className="overflow-y-auto flex-1">
                          {notifications.items.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                              No notifications
                            </div>
                          ) : (
                            notifications.items.map((n) => {
                              const Icon = typeIcons[n.type] || Bell;
                              return (
                                <Link
                                  key={n.id}
                                  href={`/projects/${n.projectId}`}
                                  onClick={() => setNotifOpen(false)}
                                >
                                  <div
                                    className={cn(
                                      "px-4 py-3 hover:bg-muted/50 flex gap-3 border-b last:border-b-0",
                                      !n.seen && "bg-primary/5"
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "h-9 w-9 shrink-0 rounded-lg flex items-center justify-center",
                                        n.seen
                                          ? "bg-muted"
                                          : "bg-primary/20"
                                      )}
                                    >
                                      <Icon
                                        className={cn(
                                          "h-4 w-4",
                                          n.seen
                                            ? "text-muted-foreground"
                                            : "text-primary"
                                        )}
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p
                                        className={cn(
                                          "text-sm line-clamp-1",
                                          n.seen
                                            ? "font-normal text-muted-foreground"
                                            : "font-medium"
                                        )}
                                      >
                                        {n.projectTitle}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {n.title}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              );
                            })
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <Button
                  variant="ghost"
                  className="gap-2 pl-2 pr-3"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {getDisplayName(user.name)?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{getDisplayName(user.name)}</p>
                    <p className="text-xs text-muted-foreground">
                      {roleLabels[user.role] || user.role}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", profileOpen && "rotate-180")}
                  />
                </Button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl border bg-popover p-2 shadow-xl z-50"
                      >
                        <div className="px-3 py-2 border-b mb-2">
                          <p className="font-medium">{getDisplayName(user.name)}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <Badge variant="secondary" className="mt-2">
                            {roleLabels[user.role]}
                          </Badge>
                        </div>
                        <Link href="/dashboard" onClick={() => setProfileOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Button>
                        </Link>
                        <Link href="/dashboard/profile" onClick={() => setProfileOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <User className="h-4 w-4" />
                            Profile
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                          onClick={() => {
                            logout();
                            setProfileOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </Button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button>Get started</Button>
            </Link>
          </div>
        )}
      </div>

      <AnimatePresence>
        {mobileOpen && user && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t bg-background"
          >
            <nav className="container mx-auto flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
