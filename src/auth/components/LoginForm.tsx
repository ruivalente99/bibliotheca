"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import React, { type FormEvent, useState } from "react";
import { cn } from "../../ui/utils";
import type { LoginFormProps } from "../types";
import { AuthCard } from "./AuthCard";

export function LoginForm({
	mode = "email-password",
	title = "Sign In",
	description,
	logo,
	emailPlaceholder = "name@example.com",
	usernamePlaceholder = "username",
	passwordPlaceholder = "••••••••",
	emailLabel = "Email",
	usernameLabel = "Username",
	passwordLabel = "Password",
	submitLabel = "Sign In",
	loadingLabel = "Signing in...",
	lockedLabel = "Locked",
	showPasswordToggle = true,
	showForgotPassword = false,
	forgotPasswordHref,
	forgotPasswordLabel = "Forgot password?",
	onForgotPasswordClick,
	showQrLogin = false,
	qrLoginHref,
	qrLoginLabel = "Sign in with QR Code",
	onQrLoginClick,
	onSubmit,
	customFields,
	footerSlot,
	defaultEmail = "",
	defaultUsername = "",
	isInitiallyLocked = false,
	initialRetryAfter = 0,
	className,
	classNames,
}: LoginFormProps) {
	const [email, setEmail] = useState(defaultEmail);
	const [username, setUsername] = useState(defaultUsername);
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isLocked, setIsLocked] = useState(isInitiallyLocked);
	const [retryAfter, setRetryAfter] = useState<number | null>(
		initialRetryAfter > 0 ? initialRetryAfter : null
	);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const result = await onSubmit({
				password,
				...(mode === "email-password" ? { email: email.trim().toLowerCase() } : {}),
				...(mode === "username-password" ? { username: username.trim() } : {}),
			});

			if (typeof result === "object" && result !== null) {
				if (!result.success) {
					if (result.status === 429 || result.error?.toLowerCase().includes("too many")) {
						setIsLocked(true);
						if (result.retryAfterSeconds) {
							setRetryAfter(result.retryAfterSeconds);
						}
					}
					setError(result.error || "Invalid credentials.");
				}
			} else if (result === false) {
				setError("Invalid credentials.");
			}
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Authentication failed.";
			if (message.includes("RATE_LIMITED")) {
				setIsLocked(true);
				setError("Too many failed attempts. Access temporarily locked.");
			} else {
				setError(message);
			}
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
				footer={footerSlot}
				className={cn(className, classNames?.card)}
				classNames={{
					header: classNames?.header,
					logo: classNames?.logo,
					title: classNames?.title,
					description: classNames?.description,
					footer: classNames?.footer,
				}}
			>
				<form onSubmit={handleSubmit} className={cn("space-y-4", classNames?.form)}>
					{mode === "email-password" && (
						<div className={cn("space-y-1.5", classNames?.fieldGroup)}>
							<label
								htmlFor="auth-email-input"
								className={cn(
									"block text-xs font-semibold uppercase tracking-wider text-[var(--text,#111827)]",
									classNames?.label
								)}
							>
								{emailLabel}
							</label>
							<input
								id="auth-email-input"
								type="email"
								required
								disabled={loading || isLocked}
								autoComplete="email"
								autoCapitalize="none"
								autoCorrect="off"
								spellCheck="false"
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

					{mode === "username-password" && (
						<div className={cn("space-y-1.5", classNames?.fieldGroup)}>
							<label
								htmlFor="auth-username-input"
								className={cn(
									"block text-xs font-semibold uppercase tracking-wider text-[var(--text,#111827)]",
									classNames?.label
								)}
							>
								{usernameLabel}
							</label>
							<input
								id="auth-username-input"
								type="text"
								required
								disabled={loading || isLocked}
								autoComplete="username"
								autoCapitalize="none"
								autoCorrect="off"
								spellCheck="false"
								placeholder={usernamePlaceholder}
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className={cn(
									"w-full rounded-lg border border-[var(--border,rgba(0,0,0,0.15))] bg-[var(--surface,#ffffff)] px-3.5 py-2 text-sm text-[var(--text,#111827)] outline-none transition-all placeholder:text-[var(--text-muted,#9ca3af)] focus:border-[var(--brand,#f59e0b)] focus:ring-2 focus:ring-[var(--brand,#f59e0b)]/20 disabled:cursor-not-allowed disabled:opacity-60",
									classNames?.input
								)}
							/>
						</div>
					)}

					<div className={cn("space-y-1.5", classNames?.fieldGroup)}>
						<div className="flex items-center justify-between">
							<label
								htmlFor="auth-password-input"
								className={cn(
									"block text-xs font-semibold uppercase tracking-wider text-[var(--text,#111827)]",
									classNames?.label
								)}
							>
								{passwordLabel}
							</label>
							{showForgotPassword && (
								<div>
									{forgotPasswordHref ? (
										<a
											href={forgotPasswordHref}
											className={cn(
												"text-xs font-medium text-[var(--brand,#f59e0b)] hover:underline",
												classNames?.forgotPasswordLink
											)}
										>
											{forgotPasswordLabel}
										</a>
									) : (
										<button
											type="button"
											onClick={onForgotPasswordClick}
											className={cn(
												"text-xs font-medium text-[var(--brand,#f59e0b)] hover:underline cursor-pointer",
												classNames?.forgotPasswordLink
											)}
										>
											{forgotPasswordLabel}
										</button>
									)}
								</div>
							)}
						</div>
						<div className="relative flex items-center">
							<input
								id="auth-password-input"
								type={showPassword ? "text" : "password"}
								required
								disabled={loading || isLocked}
								autoComplete="current-password"
								autoCapitalize="none"
								autoCorrect="off"
								spellCheck="false"
								placeholder={passwordPlaceholder}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className={cn(
									"w-full rounded-lg border border-[var(--border,rgba(0,0,0,0.15))] bg-[var(--surface,#ffffff)] px-3.5 py-2 text-sm text-[var(--text,#111827)] outline-none transition-all placeholder:text-[var(--text-muted,#9ca3af)] focus:border-[var(--brand,#f59e0b)] focus:ring-2 focus:ring-[var(--brand,#f59e0b)]/20 disabled:cursor-not-allowed disabled:opacity-60",
									showPasswordToggle && "pr-10",
									classNames?.input
								)}
							/>
							{showPasswordToggle && (
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className={cn(
										"absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted,#9ca3af)] hover:text-[var(--text,#111827)] transition-colors cursor-pointer",
										classNames?.passwordToggle
									)}
									aria-label={showPassword ? "Hide password" : "Show password"}
									tabIndex={-1}
									disabled={loading || isLocked}
								>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							)}
						</div>
					</div>

					{customFields}

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
							{Boolean(retryAfter && retryAfter > 0) && (
								<span className="block mt-1 text-[11px] opacity-80">
									Retry after {retryAfter}s
								</span>
							)}
						</div>
					)}

					<button
						type="submit"
						disabled={loading || isLocked}
						className={cn(
							"w-full flex items-center justify-center gap-2 rounded-lg bg-[var(--brand,#f59e0b)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer",
							classNames?.submitButton
						)}
					>
						{loading && <Loader2 className="h-4 w-4 animate-spin" />}
						{loading ? loadingLabel : isLocked ? lockedLabel : submitLabel}
					</button>

					{showQrLogin && (
						<div className={cn("text-center pt-2", classNames?.linksGroup)}>
							{qrLoginHref ? (
								<a
									href={qrLoginHref}
									className={cn(
										"text-xs font-medium text-[var(--text-muted,#6b7280)] hover:text-[var(--text,#111827)] hover:underline",
										classNames?.qrLoginLink
									)}
								>
									{qrLoginLabel}
								</a>
							) : (
								<button
									type="button"
									onClick={onQrLoginClick}
									className={cn(
										"text-xs font-medium text-[var(--text-muted,#6b7280)] hover:text-[var(--text,#111827)] hover:underline cursor-pointer",
										classNames?.qrLoginLink
									)}
								>
									{qrLoginLabel}
								</button>
							)}
						</div>
					)}
				</form>
			</AuthCard>
		</div>
	);
}
