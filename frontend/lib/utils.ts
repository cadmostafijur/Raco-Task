import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Returns a display-friendly name (strips titles like Md., Mr., Dr.) */
export function getDisplayName(name: string | undefined): string {
  if (!name?.trim()) return "User";
  const cleaned = name
    .replace(/^(Md\.?|Mr\.?|Mrs\.?|Ms\.?|Dr\.?|Prof\.?)\s*/i, "")
    .trim();
  return cleaned || name;
}

/** Returns first name only for greetings */
export function getFirstName(name: string | undefined): string {
  const display = getDisplayName(name);
  const first = display.split(/\s+/)[0];
  return first || display;
}

export const statusColors: Record<string, string> = {
  OPEN: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  REQUESTED: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  ASSIGNED: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  IN_PROGRESS: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  SUBMITTED: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  COMPLETED: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  PENDING: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  ACCEPTED: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  CREATED: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};
