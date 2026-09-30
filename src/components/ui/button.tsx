import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    let baseStyles = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer ";

    if (variant === "default") {
      baseStyles += "bg-primary text-primary-foreground hover:bg-primary/90 ";
    } else if (variant === "outline") {
      baseStyles += "border border-border/50 bg-background hover:bg-accent hover:text-accent-foreground ";
    } else if (variant === "ghost") {
      baseStyles += "hover:bg-accent hover:text-accent-foreground ";
    } else if (variant === "link") {
      baseStyles += "text-primary underline-offset-4 hover:underline ";
    }

    if (size === "sm") {
      baseStyles += "h-9 px-3 text-xs ";
    } else if (size === "lg") {
      baseStyles += "h-11 px-8 text-base ";
    } else if (size === "icon") {
      baseStyles += "h-10 w-10 ";
    } else {
      baseStyles += "h-10 px-4 py-2 ";
    }

    return (
      <button ref={ref} className={`${baseStyles} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
