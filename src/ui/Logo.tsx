"use client";

import React from "react";
import { cn } from "./utils";

export interface LogoClassNames {
  root?: string;
  content?: string;
  icon?: string;
  image?: string;
}

export interface LogoProps {
  /** Logo box dimension variant */
  size?: "sm" | "md" | "lg" | "xl";
  /** Optional icon component or SVG element */
  icon?: React.ReactNode;
  /** Optional image URL (PNG, SVG, WebP, etc.) */
  src?: string;
  /** Image alternative text */
  alt?: string;
  /** Ambient accent shadow glow effect */
  glow?: boolean;
  /** Accessible label */
  ariaLabel?: string;
  /** Optional custom emblem or content to render inside the container */
  children?: React.ReactNode;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional custom CSS classes for the root container */
  className?: string;
  /** Granular class overrides for internal sub-elements */
  classNames?: LogoClassNames;
}

export function Logo({
  size = "md",
  icon,
  src,
  alt,
  glow = false,
  ariaLabel = "Logo",
  children,
  onClick,
  className = "",
  classNames = {},
}: LogoProps) {
  const sizeMap = {
    sm: { box: "w-7 h-7 rounded-xl", iconSize: 16, img: "w-4 h-4" },
    md: { box: "w-9 h-9 rounded-2xl", iconSize: 20, img: "w-5 h-5" },
    lg: { box: "w-12 h-12 rounded-2xl", iconSize: 26, img: "w-7 h-7" },
    xl: { box: "w-16 h-16 rounded-3xl", iconSize: 36, img: "w-10 h-10" },
  };

  const current = sizeMap[size] || sizeMap.md;

  const handleKeyDown = onClick
    ? (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }
    : undefined;

  return (
    <div
      role={onClick ? "button" : "img"}
      aria-label={ariaLabel}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative inline-flex items-center justify-center transition-all duration-300",
        "select-none",
        onClick ? "cursor-pointer group-hover:scale-105 group-active:scale-95" : "cursor-default",
        current.box,
        "bg-[var(--brand-soft)] dark:bg-[#161b22] border border-[var(--brand-border)] dark:border-[#363d47] text-[var(--brand)]",
        glow ? "shadow-sm shadow-[var(--brand-ring)]" : "shadow-2xs",
        className,
        classNames.root
      )}
    >
      {children ? (
        <span className={cn("pointer-events-none select-none shrink-0 flex items-center justify-center", classNames.content)}>
          {children}
        </span>
      ) : src ? (
        <img
          src={src}
          alt={alt || ariaLabel}
          className={cn("object-contain pointer-events-none select-none", current.img, classNames.image)}
        />
      ) : icon ? (
        <span className={cn("pointer-events-none select-none shrink-0 flex items-center justify-center", classNames.icon)}>
          {icon}
        </span>
      ) : (
        <svg
          width={current.iconSize}
          height={current.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("pointer-events-none select-none transition-transform duration-300 group-hover:scale-105", classNames.icon)}
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      )}
    </div>
  );
}
