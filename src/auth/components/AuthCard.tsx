import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../ui/utils";

export interface AuthCardClassNames {
	root?: string;
	header?: string;
	logo?: string;
	title?: string;
	description?: string;
	content?: string;
	footer?: string;
}

export interface AuthCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
	logo?: ReactNode;
	title?: ReactNode;
	description?: ReactNode;
	footer?: ReactNode;
	classNames?: AuthCardClassNames;
}

export function AuthCard({
	logo,
	title,
	description,
	footer,
	children,
	className,
	classNames,
	...props
}: AuthCardProps) {
	return (
		<div
			className={cn(
				"w-full max-w-sm rounded-xl border border-[var(--border,rgba(0,0,0,0.12))] bg-[var(--surface,#ffffff)] p-6 md:p-8 shadow-sm transition-all",
				className,
				classNames?.root
			)}
			{...props}
		>
			{(logo || title || description) && (
				<div
					className={cn("flex flex-col items-center text-center gap-2 mb-6", classNames?.header)}
				>
					{logo && <div className={cn("mb-2 flex items-center justify-center", classNames?.logo)}>{logo}</div>}
					{title && (
						<h1
							className={cn(
								"text-xl font-bold tracking-tight text-[var(--text,#111827)]",
								classNames?.title
							)}
						>
							{title}
						</h1>
					)}
					{description && (
						<p
							className={cn(
								"text-sm text-[var(--text-muted,#6b7280)]",
								classNames?.description
							)}
						>
							{description}
						</p>
					)}
				</div>
			)}

			<div className={cn("space-y-4", classNames?.content)}>{children}</div>

			{footer && (
				<div
					className={cn(
						"mt-6 pt-4 border-t border-[var(--border,rgba(0,0,0,0.08))] text-center text-xs text-[var(--text-muted,#6b7280)]",
						classNames?.footer
					)}
				>
					{footer}
				</div>
			)}
		</div>
	);
}
