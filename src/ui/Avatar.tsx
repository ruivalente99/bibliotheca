"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import { cn } from "./utils";

export interface AvatarClassNames {
  root?: string;
  image?: string;
  fallback?: string;
  status?: string;
}

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URI */
  src?: string;
  /** Image alt description */
  alt?: string;
  /** Name used to generate initials fallback */
  name?: string;
  /** Custom fallback element */
  fallback?: React.ReactNode;
  /** Size scale. Default: "md" */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Shape variant. Default: "circle" */
  shape?: "circle" | "rounded" | "square";
  /** Optional status indicator */
  status?: "online" | "offline" | "busy" | "away";
  /** Adds a high-contrast border ring */
  bordered?: boolean;
  classNames?: AvatarClassNames;
}

function getInitials(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      fallback,
      size = "md",
      shape = "circle",
      status,
      bordered = false,
      className = "",
      classNames = {},
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
      xs: "w-6 h-6 text-[10px]",
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
      xl: "w-16 h-16 text-lg",
    };

    const shapeClasses = {
      circle: "rounded-full",
      rounded: "rounded-xl",
      square: "rounded-lg",
    };

    const statusSizeClasses = {
      xs: "w-1.5 h-1.5 ring-1",
      sm: "w-2 h-2 ring-1.5",
      md: "w-2.5 h-2.5 ring-2",
      lg: "w-3 h-3 ring-2",
      xl: "w-4 h-4 ring-2",
    };

    const statusColorClasses = {
      online: "bg-emerald-500",
      offline: "bg-stone-400",
      busy: "bg-rose-500",
      away: "bg-amber-500",
    };

    const initials = name ? getInitials(name) : "";

    return (
      <div
        ref={ref}
        role="img"
        aria-label={alt || name || "Avatar"}
        className={cn(
          "relative inline-flex items-center justify-center shrink-0 overflow-hidden font-semibold select-none bg-stone-100 dark:bg-[#21262d] text-stone-700 dark:text-[#c9d1d9]",
          sizeClasses[size],
          shapeClasses[shape],
          bordered && "ring-2 ring-stone-200 dark:ring-[#30363d]",
          className,
          classNames.root
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            onError={() => setImageError(true)}
            className={cn("w-full h-full object-cover", classNames.image)}
          />
        ) : fallback ? (
          <span className={cn("flex items-center justify-center", classNames.fallback)}>
            {fallback}
          </span>
        ) : initials ? (
          <span className={cn("font-medium tracking-tight", classNames.fallback)}>
            {initials}
          </span>
        ) : (
          <User className={cn("w-1/2 h-1/2 opacity-60", classNames.fallback)} aria-hidden="true" />
        )}

        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full ring-white dark:ring-[#161b22]",
              statusSizeClasses[size],
              statusColorClasses[status],
              classNames.status
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum number of avatars visible before excess badge */
  max?: number;
  /** Size scale inherited by child avatars */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function AvatarGroup({
  children,
  max,
  size = "md",
  className = "",
  ...props
}: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children);
  const total = childrenArray.length;
  const visibleAvatars = max ? childrenArray.slice(0, max) : childrenArray;
  const excess = max && total > max ? total - max : 0;

  const excessSizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-xs",
    lg: "w-12 h-12 text-sm",
    xl: "w-16 h-16 text-base",
  };

  return (
    <div
      className={cn("inline-flex items-center -space-x-2 overflow-hidden", className)}
      {...props}
    >
      {visibleAvatars.map((child, index) => (
        <div key={index} className="ring-2 ring-white dark:ring-[#161b22] rounded-full">
          {child}
        </div>
      ))}
      {excess > 0 && (
        <div
          className={cn(
            "relative inline-flex items-center justify-center rounded-full font-semibold select-none bg-stone-200 dark:bg-[#30363d] text-stone-700 dark:text-[#c9d1d9] ring-2 ring-white dark:ring-[#161b22]",
            excessSizeClasses[size]
          )}
          aria-label={`${excess} additional users`}
        >
          {`+${excess}`}
        </div>
      )}
    </div>
  );
}
