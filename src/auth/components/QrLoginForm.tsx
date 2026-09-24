"use client";

import { CheckCircle2, Loader2, QrCode, XCircle } from "lucide-react";
import React, { type FormEvent, useState } from "react";
import { cn } from "../../ui/utils";
import type { QrLoginFormProps } from "../types";
import { AuthCard } from "./AuthCard";

export function QrLoginForm({
	title = "QR Code Login",
	description = "Scan your personal QR code or enter your token below",
	logo = <QrCode className="h-10 w-10 text-[var(--brand,#f59e0b)]" />,
	state = "idle",
	errorMessage = "Invalid or expired QR token.",
	successMessage = "Authenticated successfully. Redirecting...",
	verifyingMessage = "Verifying QR code...",
	showManualInput = true,
	manualInputLabel = "Or enter token manually",
	manualInputPlaceholder = "Paste your authentication token",
	manualSubmitLabel = "Verify Token",
	backToLoginHref = "/login",
	backToLoginLabel = "Back to password login",
	onBackToLoginClick,
	onTokenSubmit,
	scannerSlot,
	className,
	classNames,
}: QrLoginFormProps) {
	const [token, setToken] = useState("");
	const [localLoading, setLocalLoading] = useState(false);
	const [localError, setLocalError] = useState("");

	async function handleManualSubmit(e: FormEvent) {
		e.preventDefault();
		if (!token.trim() || !onTokenSubmit) return;

		setLocalError("");
		setLocalLoading(true);

		try {
			const result = await onTokenSubmit(token.trim());
			if (typeof result === "object" && result !== null && !result.success) {
				setLocalError(result.error || errorMessage);
			} else if (result === false) {
				setLocalError(errorMessage);
			}
		} catch (err: unknown) {
			setLocalError(err instanceof Error ? err.message : errorMessage);
		} finally {
			setLocalLoading(false);
		}
	}

	const isVerifying = state === "verifying" || localLoading;
	const isError = state === "error" || Boolean(localError);
	const isSuccess = state === "success";

	return (
		<div className={cn("flex items-center justify-center p-4", classNames?.container)}>
			<AuthCard
				logo={logo}
				title={title}
				description={description}
				className={cn(className, classNames?.card)}
				classNames={{
					header: classNames?.header,
					title: classNames?.title,
					description: classNames?.description,
				}}
				footer={
					<div>
						{backToLoginHref ? (
							<a
								href={backToLoginHref}
								className={cn(
									"text-xs font-medium text-[var(--text-muted,#6b7280)] hover:text-[var(--text,#111827)] hover:underline",
									classNames?.backLink
								)}
							>
								{backToLoginLabel}
							</a>
						) : (
							<button
								type="button"
								onClick={onBackToLoginClick}
								className={cn(
									"text-xs font-medium text-[var(--text-muted,#6b7280)] hover:text-[var(--text,#111827)] hover:underline cursor-pointer",
									classNames?.backLink
								)}
							>
								{backToLoginLabel}
							</button>
						)}
					</div>
				}
			>
				{scannerSlot && (
					<div
						className={cn(
							"overflow-hidden rounded-lg border border-[var(--border,rgba(0,0,0,0.12))] bg-[var(--surface-muted,#f9fafb)] p-2",
							classNames?.scannerSlot
						)}
					>
						{scannerSlot}
					</div>
				)}

				{isVerifying && (
					<div
						className={cn(
							"flex flex-col items-center justify-center gap-2 py-4 text-center",
							classNames?.statusContainer
						)}
					>
						<Loader2
							className={cn(
								"h-8 w-8 animate-spin text-[var(--brand,#f59e0b)]",
								classNames?.spinner
							)}
						/>
						<p className="text-sm font-medium text-[var(--text,#111827)]">{verifyingMessage}</p>
					</div>
				)}

				{isSuccess && (
					<div
						role="status"
						className={cn(
							"flex flex-col items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300",
							classNames?.success
						)}
					>
						<CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
						<p>{successMessage}</p>
					</div>
				)}

				{isError && (
					<div
						role="alert"
						aria-live="polite"
						className={cn(
							"flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300",
							classNames?.error
						)}
					>
						<XCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
						<p>{localError || errorMessage}</p>
					</div>
				)}

				{showManualInput && !isSuccess && (
					<form
						onSubmit={handleManualSubmit}
						className={cn("space-y-3 pt-2", classNames?.manualTokenForm)}
					>
						<label
							htmlFor="auth-qr-token-input"
							className="block text-xs font-semibold uppercase tracking-wider text-[var(--text,#111827)]"
						>
							{manualInputLabel}
						</label>
						<input
							id="auth-qr-token-input"
							type="text"
							required
							disabled={isVerifying}
							placeholder={manualInputPlaceholder}
							value={token}
							onChange={(e) => setToken(e.target.value)}
							className={cn(
								"w-full rounded-lg border border-[var(--border,rgba(0,0,0,0.15))] bg-[var(--surface,#ffffff)] px-3.5 py-2 text-sm text-[var(--text,#111827)] outline-none transition-all placeholder:text-[var(--text-muted,#9ca3af)] focus:border-[var(--brand,#f59e0b)] focus:ring-2 focus:ring-[var(--brand,#f59e0b)]/20 disabled:cursor-not-allowed disabled:opacity-60",
								classNames?.manualInput
							)}
						/>
						<button
							type="submit"
							disabled={isVerifying || !token.trim()}
							className={cn(
								"w-full flex items-center justify-center gap-2 rounded-lg bg-[var(--brand,#f59e0b)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer",
								classNames?.submitButton
							)}
						>
							{isVerifying && <Loader2 className="h-4 w-4 animate-spin" />}
							{manualSubmitLabel}
						</button>
					</form>
				)}
			</AuthCard>
		</div>
	);
}
