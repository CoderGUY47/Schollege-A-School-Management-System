import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "absent" | "active";
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "border-transparent bg-slate-900 text-slate-50 shadow hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900",
  secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50",
  destructive: "border-transparent bg-red-500 text-slate-50 shadow hover:bg-red-500/80",
  outline: "text-slate-950 dark:text-slate-50 border-slate-200 dark:border-slate-800",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-semibold",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-600 font-semibold",
  absent: "border-rose-500/30 bg-rose-500/10 text-rose-600 font-semibold",
  active: "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 font-semibold",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
