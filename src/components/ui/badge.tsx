import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  let baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ";

  if (variant === "default") {
    baseStyles += "border-transparent bg-primary text-primary-foreground ";
  } else if (variant === "secondary") {
    baseStyles += "border-transparent bg-secondary text-secondary-foreground ";
  } else if (variant === "destructive") {
    baseStyles += "border-transparent bg-destructive text-destructive-foreground ";
  } else if (variant === "outline") {
    baseStyles += "text-foreground border-border/40 ";
  }

  return <div className={`${baseStyles} ${className}`} {...props} />;
}
