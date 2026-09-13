"use client";

import React from "react";
import { cn } from "./utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "outline" | "ghost";
  hoverable?: boolean;
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", variant = "default", hoverable = false, interactive = false, children, ...props }, ref) => {
    const variantClasses = {
      default:
        "bg-white dark:bg-[#161b22] border-stone-200/80 dark:border-[#30363d] shadow-2xs",
      subtle:
        "bg-stone-50 dark:bg-[#0d1117] border-stone-200/60 dark:border-[#21262d]",
      outline:
        "bg-transparent border-stone-200 dark:border-[#363d47]",
      ghost:
        "bg-transparent border-transparent",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border transition-all duration-200 text-[var(--heading)]",
          variantClasses[variant],
          hoverable && "hover:shadow-md hover:border-stone-300 dark:hover:border-[#363d47]",
          interactive && "cursor-pointer active:scale-[0.99] select-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-5 border-b border-stone-100 dark:border-[#21262d]", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = "", as: Component = "h3", children, ...props }, ref) => (
    <Component
      ref={ref as any}
      className={cn("text-base font-bold tracking-tight text-stone-900 dark:text-[#f0f3f6]", className)}
      {...props}
    >
      {children}
    </Component>
  )
);
CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className = "", children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xs text-stone-500 dark:text-[#8b949e] leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = "CardDescription";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", children, ...props }, ref) => (
    <div ref={ref} className={cn("p-5", className)} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between p-5 pt-0 border-t border-stone-100 dark:border-[#21262d] mt-2", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";
