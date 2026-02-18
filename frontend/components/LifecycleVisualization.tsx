"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ProjectStatus } from "@/types";
import { cn } from "@/lib/utils";

const STEPS: { status: ProjectStatus; label: string }[] = [
  { status: "OPEN", label: "Open" },
  { status: "REQUESTED", label: "Requested" },
  { status: "ASSIGNED", label: "Assigned" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "SUBMITTED", label: "Submitted" },
  { status: "COMPLETED", label: "Completed" },
];

const statusColors: Record<string, string> = {
  OPEN: "bg-emerald-500",
  REQUESTED: "bg-amber-500",
  ASSIGNED: "bg-blue-500",
  IN_PROGRESS: "bg-indigo-500",
  SUBMITTED: "bg-violet-500",
  COMPLETED: "bg-green-500",
  REJECTED: "bg-red-500",
};

export default function LifecycleVisualization({
  currentStatus,
}: {
  currentStatus: ProjectStatus;
}) {
  const currentIndex = STEPS.findIndex((s) => s.status === currentStatus);
  const isRejected = currentStatus === "REJECTED";

  return (
    <div className="overflow-x-auto py-4 -mx-2 scrollbar-thin">
      <div className="flex items-center gap-0 min-w-max px-2 sm:justify-center">
        {STEPS.map((step, i) => {
          const isActive = i <= currentIndex || (isRejected && i === 4);
          const isCurrent = step.status === currentStatus;

          return (
            <motion.div
              key={step.status}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isCurrent
                      ? "border-primary bg-primary text-primary-foreground shadow-glow"
                      : isActive
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-muted bg-muted/50 text-muted-foreground"
                  )}
                  animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isActive && !isCurrent ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{i + 1}</span>
                  )}
                </motion.div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium whitespace-nowrap",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <motion.div
                  className={cn(
                    "w-12 h-0.5 mx-1 rounded",
                    isActive ? "bg-primary/50" : "bg-muted"
                  )}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.05 + 0.2 }}
                  style={{ transformOrigin: "left" }}
                />
              )}
            </motion.div>
          );
        })}
        {isRejected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-4 flex flex-col items-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-500 bg-red-500/10 text-red-500">
              !
            </div>
            <span className="mt-2 text-xs font-medium text-red-500">
              Rejected
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
