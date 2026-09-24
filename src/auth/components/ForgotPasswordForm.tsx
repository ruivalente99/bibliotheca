"use client";

import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import React, { type FormEvent, useState } from "react";
import { cn } from "../../ui/utils";
import type { ForgotPasswordFormProps, ForgotPasswordStep } from "../types";
import { AuthCard } from "./AuthCard";

export function ForgotPasswordForm({
	initialStep = "request",
	title = "Reset Password",
	description = "Enter your email address to receive recovery instructions",
	logo = <KeyRound className="h-10 w-10 text-[var(--brand,#f59e0b)]" />,
	emailLabel = "Email Address",
	emailPlaceholder = "name@example.com",
	codeLabel = "Verification Code",
	codePlaceholder = "123456",
	newPasswordLabel = "New Password",
	confirmPasswordLabel = "Confirm New Password",
	requestSubmitLabel = "Send Recovery Code",
	verifySubmitLabel = "Verify Code",
	resetSubmitLabel = "Update Password",
	backToLoginHref = "/login",
	backToLoginLabel = "Back to sign in",
	onBackToLoginClick,
	onRequestReset,
	onVerifyCode,
	onResetPassword,
	className,
	classNames,
}: ForgotPasswordFormProps) {
	const [step, setStep] = useState<ForgotPasswordStep>(initialStep);
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			if (step === "request") {
				if (!onRequestReset) {
					setStep("verify");
					setSuccess("Recovery instructions sent if account exists.");
					return;
				}
				const res = await onRequestReset(email.trim().toLowerCase());
				if (typeof res === "object" && res !== null && !res.success) {
					setError(res.error || "Failed to process request.");
				} else {
					setStep("verify");
					setSuccess("Recovery instructions sent if account exists.");
				}
			} else if (step === "verify") {
				if (!onVerifyCode) {
					setStep("reset");
					return;
				}
				const res = await onVerifyCode({ email: email.trim().toLowerCase(), code: code.trim() });
				if (typeof res === "object" && res !== null && !res.success) {
					setError(res.error || "Invalid verification code.");
				} else {
					setStep("reset");
				}
			} else if (step === "reset") {
				if (newPassword !== confirmPassword) {
					setError("Passwords do not match.");
					setLoading(false);
					return;
				}
				if (newPassword.length < 8) {
					setError("Password must be at least 8 characters.");
					setLoading(false);
					return;
				}
				if (onResetPassword) {
					const res = await onResetPassword({
						email: email.trim().toLowerCase(),
						code: code.trim(),
						newPassword,
					});
					if (typeof res === "object" && res !== null && !res.success) {
						setError(res.error || "Failed to reset password.");
						return;
					}
				}
				setSuccess("Password updated successfully. You can now sign in.");
			}
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	}

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
				<form onSubmit={handleSubmit} className={cn("space-y-4", classNames?.form)}>
					{step === "request" && (
						<div className="space-y-1.5">
							<label
								htmlFor="auth-forgot-email"
								className={cn(
									"block text-xs font-semibold uppercase tracking-wider text-[var(--text,#111827)]",
									classNames?.label
								)}
							>
								{emailLabel}
							</label>
							<input
								id="auth-forgot-email"
								type="email"
								required
								disabled={loading}
								autoComplete="email"
								placeholder={emailPlaceholder}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className={cn(
									"w-full rounded-lg border border-[var(--border,rgba(0,0,0,0.15))] bg-[var(--surface,#ffffff)] px-3.5 py-2 text-sm text-[var(--text,#111827)] outline-none transition-all placeholder:text-[var(--text-muted,#9ca3af)] focus:border-[var(--brand,#f59e0b)] focus:ring-2 focus:ring-[var(--brand,#f59e0b)]/20 disabled:cursor-not-allowed disabled:opacity-60",
									classNames?.input
								)}
							/>
						</div>
					)}

					{step === "verify" && (
						<div className="space-y-1.5">
							<label
								htmlFor="auth-forgot-code"
								className={cn(
									"block text-xs font-semibold uppercase tracking-wider text-[var(--text,#111827)]",
									classNames?.label
								)}
							>
								{codeLabel}
							</label>
							<input
								id="auth-forgot-code"
								type="text"
								required
								disabled={loading}
								placeholder={codePlaceholder}
								value={code}
								onChange={(e) => setCode(e.target.value)}
								className={cn(
									"w-full rounded-lg border border-[var(--border,rgba(0,0,0,0.15))] bg-[var(--surface,#ffffff)] px-3.5 py-2 text-sm text-[var(--text,#111827)] outline-none transition-all placeholder:text-[var(--text-muted,#9ca3af)] focus:border-[var(--brand,#f59e0b)] focus:ring-2 focus:ring-[var(--brand,#f59e0b)]/20 disabled:cursor-not-allowed disabled:opacity-60 text-center tracking-widest text-lg font-mono",
									classNames?.input
								)}
							/>
						</div>
					)}

					{step === "reset" && (
						<>
							<div className="space-y-1.5">
								<label
									htmlFor="auth-forgot-newpwd"
									className={cn(
										"block text-xs font-semibold uppercase tracking-wider text-[var(--text,#111827)]",
										classNames?.label
									)}
								>
									{newPasswordLabel}
								</label>
								<input
									id="auth-forgot-newpwd"
									type="password"
									required
									disabled={loading}
									autoComplete="new-password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									className={cn(
										"w-full rounded-lg border border-[var(--border,rgba(0,0,0,0.15))] bg-[var(--surface,#ffffff)] px-3.5 py-2 text-sm text-[var(--text,#111827)] outline-none transition-all placeholder:text-[var(--text-muted,#9ca3af)] focus:border-[var(--brand,#f59e0b)] focus:ring-2 focus:ring-[var(--brand,#f59e0b)]/20 disabled:cursor-not-allowed disabled:opacity-60",
										classNames?.input
									)}
								/>
							</div>

							<div className="space-y-1.5">
								<label
									htmlFor="auth-forgot-confirmpwd"
									className={cn(
										"block text-xs font-semibold uppercase tracking-wider text-[var(--text,#111827)]",
										classNames?.label
									)}
								>
									{confirmPasswordLabel}
								</label>
								<input
									id="auth-forgot-confirmpwd"
									type="password"
									required
									disabled={loading}
									autoComplete="new-password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className={cn(
										"w-full rounded-lg border border-[var(--border,rgba(0,0,0,0.15))] bg-[var(--surface,#ffffff)] px-3.5 py-2 text-sm text-[var(--text,#111827)] outline-none transition-all placeholder:text-[var(--text-muted,#9ca3af)] focus:border-[var(--brand,#f59e0b)] focus:ring-2 focus:ring-[var(--brand,#f59e0b)]/20 disabled:cursor-not-allowed disabled:opacity-60",
										classNames?.input
									)}
								/>
							</div>
						</>
					)}

					{error && (
						<div
							role="alert"
							aria-live="polite"
							className={cn(
								"rounded-lg border border-red-200 bg-red-50 p-2.5 text-center text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300",
								classNames?.error
							)}
						>
							{error}
						</div>
					)}

					{success && (
						<div
							role="status"
							className={cn(
								"flex items-center justify-center gap-1.5 rounded-lg border border-green-200 bg-green-50 p-2.5 text-center text-xs font-medium text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300",
								classNames?.success
							)}
						>
							<CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
							<span>{success}</span>
						</div>
					)}

					<button
						type="submit"
						disabled={loading}
						className={cn(
							"w-full flex items-center justify-center gap-2 rounded-lg bg-[var(--brand,#f59e0b)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer",
							classNames?.submitButton
						)}
					>
						{loading && <Loader2 className="h-4 w-4 animate-spin" />}
						{step === "request"
							? requestSubmitLabel
							: step === "verify"
								? verifySubmitLabel
								: resetSubmitLabel}
					</button>
				</form>
			</AuthCard>
		</div>
	);
}
