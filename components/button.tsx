"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "secondary" | "danger";
  icon?: ReactNode;
};

export function Button({
  children,
  className = "",
  variant = "primary",
  icon,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-45";
  const variants = {
    primary:
      "border-amber-400/70 bg-amber-400 text-slate-950 hover:bg-amber-300",
    secondary:
      "border-slate-700 bg-slate-900 text-slate-100 hover:border-amber-400/50 hover:text-amber-100",
    ghost:
      "border-transparent bg-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-950/50 hover:text-white",
    danger:
      "border-orange-500/60 bg-orange-500/15 text-orange-200 hover:bg-orange-500/25",
  } as const;

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {icon}
      {children}
    </button>
  );
}
