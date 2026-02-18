"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { statusColors } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  status,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & { status?: string }) {
  const statusClass = status ? statusColors[status] : undefined;
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusClass || badgeVariants({ variant }),
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
