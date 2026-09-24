export interface RateLimitEntry {
	count: number;
	firstAttempt: number;
	blockedUntil: number;
}

export interface RateLimiterOptions {
	maxAttempts?: number;
	windowMs?: number;
	blockDurationMs?: number;
}

export interface RateLimitCheckResult {
	allowed: boolean;
	remaining: number;
	retryAfterSeconds: number;
}

export class RateLimiter {
	private readonly store = new Map<string, RateLimitEntry>();
	private readonly maxAttempts: number;
	private readonly windowMs: number;
	private readonly blockDurationMs: number;

	constructor(options?: RateLimiterOptions) {
		this.maxAttempts = options?.maxAttempts ?? 5;
		this.windowMs = options?.windowMs ?? 15 * 60 * 1000;
		this.blockDurationMs = options?.blockDurationMs ?? 15 * 60 * 1000;
	}

	check(key: string): RateLimitCheckResult {
		const now = Date.now();
		const entry = this.store.get(key);

		if (!entry) {
			return {
				allowed: true,
				remaining: this.maxAttempts,
				retryAfterSeconds: 0,
			};
		}

		if (entry.blockedUntil > now) {
			const retryAfterSeconds = Math.ceil((entry.blockedUntil - now) / 1000);
			return {
				allowed: false,
				remaining: 0,
				retryAfterSeconds,
			};
		}

		if (now - entry.firstAttempt > this.windowMs) {
			this.store.delete(key);
			return {
				allowed: true,
				remaining: this.maxAttempts,
				retryAfterSeconds: 0,
			};
		}

		const remaining = Math.max(0, this.maxAttempts - entry.count);
		return {
			allowed: entry.count < this.maxAttempts,
			remaining,
			retryAfterSeconds: 0,
		};
	}

	recordFailure(key: string): RateLimitCheckResult {
		const now = Date.now();
		const entry = this.store.get(key);

		if (!entry || now - entry.firstAttempt > this.windowMs) {
			this.store.set(key, {
				count: 1,
				firstAttempt: now,
				blockedUntil: 0,
			});
			return {
				allowed: true,
				remaining: this.maxAttempts - 1,
				retryAfterSeconds: 0,
			};
		}

		entry.count += 1;

		if (entry.count >= this.maxAttempts) {
			entry.blockedUntil = now + this.blockDurationMs;
			const retryAfterSeconds = Math.ceil(this.blockDurationMs / 1000);
			return {
				allowed: false,
				remaining: 0,
				retryAfterSeconds,
			};
		}

		return {
			allowed: true,
			remaining: this.maxAttempts - entry.count,
			retryAfterSeconds: 0,
		};
	}

	reset(key: string): void {
		this.store.delete(key);
	}

	clear(): void {
		this.store.clear();
	}
}

export function createRateLimiter(options?: RateLimiterOptions): RateLimiter {
	return new RateLimiter(options);
}

export function getClientIp(req?: Request): string {
	if (!req) return "127.0.0.1";
	const forwarded = req.headers.get("x-forwarded-for");
	if (forwarded) {
		const client = forwarded.split(",")[0]?.trim();
		if (client) {
			return client;
		}
	}
	const realIp = req.headers.get("x-real-ip");
	if (realIp?.trim()) {
		return realIp.trim();
	}
	const cfIp = req.headers.get("cf-connecting-ip");
	if (cfIp?.trim()) {
		return cfIp.trim();
	}
	return "127.0.0.1";
}
