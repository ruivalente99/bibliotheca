import type { ReactNode } from "react";

export type AuthMode = "password-only" | "email-password" | "username-password";

export interface LoginFormData {
	password: string;
	email?: string;
	username?: string;
	[key: string]: unknown;
}

export interface AuthSubmissionResult {
	success: boolean;
	error?: string;
	status?: number;
	retryAfterSeconds?: number;
}

export interface LoginFormClassNames {
	container?: string;
	card?: string;
	header?: string;
	logo?: string;
	title?: string;
	description?: string;
	form?: string;
	fieldGroup?: string;
	label?: string;
	input?: string;
	passwordToggle?: string;
	error?: string;
	submitButton?: string;
	footer?: string;
	linksGroup?: string;
	forgotPasswordLink?: string;
	qrLoginLink?: string;
}

export interface LoginFormProps {
	mode?: AuthMode;
	title?: ReactNode;
	description?: ReactNode;
	logo?: ReactNode;
	emailPlaceholder?: string;
	usernamePlaceholder?: string;
	passwordPlaceholder?: string;
	emailLabel?: string;
	usernameLabel?: string;
	passwordLabel?: string;
	submitLabel?: string;
	loadingLabel?: string;
	lockedLabel?: string;
	showPasswordToggle?: boolean;
	showForgotPassword?: boolean;
	forgotPasswordHref?: string;
	forgotPasswordLabel?: string;
	onForgotPasswordClick?: () => void;
	showQrLogin?: boolean;
	qrLoginHref?: string;
	qrLoginLabel?: string;
	onQrLoginClick?: () => void;
	onSubmit: (data: LoginFormData) => Promise<AuthSubmissionResult | boolean | void>;
	customFields?: ReactNode;
	footerSlot?: ReactNode;
	defaultEmail?: string;
	defaultUsername?: string;
	isInitiallyLocked?: boolean;
	initialRetryAfter?: number;
	className?: string;
	classNames?: LoginFormClassNames;
}

export type QrLoginState = "idle" | "verifying" | "success" | "error";

export interface QrLoginFormClassNames {
	container?: string;
	card?: string;
	header?: string;
	title?: string;
	description?: string;
	statusContainer?: string;
	spinner?: string;
	error?: string;
	success?: string;
	manualTokenForm?: string;
	manualInput?: string;
	submitButton?: string;
	scannerSlot?: string;
	backLink?: string;
}

export interface QrLoginFormProps {
	title?: ReactNode;
	description?: ReactNode;
	logo?: ReactNode;
	state?: QrLoginState;
	errorMessage?: string;
	successMessage?: string;
	verifyingMessage?: string;
	showManualInput?: boolean;
	manualInputLabel?: string;
	manualInputPlaceholder?: string;
	manualSubmitLabel?: string;
	backToLoginHref?: string;
	backToLoginLabel?: string;
	onBackToLoginClick?: () => void;
	onTokenSubmit?: (token: string) => Promise<AuthSubmissionResult | boolean | void>;
	scannerSlot?: ReactNode;
	className?: string;
	classNames?: QrLoginFormClassNames;
}

export type ForgotPasswordStep = "request" | "verify" | "reset";

export interface ForgotPasswordFormClassNames {
	container?: string;
	card?: string;
	header?: string;
	title?: string;
	description?: string;
	form?: string;
	label?: string;
	input?: string;
	error?: string;
	success?: string;
	submitButton?: string;
	backLink?: string;
}

export interface ForgotPasswordFormProps {
	initialStep?: ForgotPasswordStep;
	title?: ReactNode;
	description?: ReactNode;
	logo?: ReactNode;
	emailLabel?: string;
	emailPlaceholder?: string;
	codeLabel?: string;
	codePlaceholder?: string;
	newPasswordLabel?: string;
	confirmPasswordLabel?: string;
	requestSubmitLabel?: string;
	verifySubmitLabel?: string;
	resetSubmitLabel?: string;
	backToLoginHref?: string;
	backToLoginLabel?: string;
	onBackToLoginClick?: () => void;
	onRequestReset?: (email: string) => Promise<AuthSubmissionResult | boolean | void>;
	onVerifyCode?: (data: { email: string; code: string }) => Promise<AuthSubmissionResult | boolean | void>;
	onResetPassword?: (data: {
		email: string;
		code: string;
		newPassword: string;
	}) => Promise<AuthSubmissionResult | boolean | void>;
	className?: string;
	classNames?: ForgotPasswordFormClassNames;
}
