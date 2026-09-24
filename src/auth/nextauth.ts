import { type RateLimiter, createRateLimiter, getClientIp } from "./rate-limit";

export interface RateLimitedAuthorizeOptions<TUser = Record<string, unknown>> {
	rateLimiter?: RateLimiter;
	verify: (credentials: Record<string, string> | undefined, req?: Request) => Promise<TUser | null>;
	rateLimitErrorMessage?: string;
}

export function createRateLimitedAuthorize<TUser = Record<string, unknown>>(
	options: RateLimitedAuthorizeOptions<TUser>
) {
	const limiter = options.rateLimiter ?? createRateLimiter();
	const errorMessage = options.rateLimitErrorMessage ?? "RATE_LIMITED";

	return async (credentials: Record<string, string> | undefined, req?: Request): Promise<TUser | null> => {
		const clientIp = getClientIp(req);
		const check = limiter.check(clientIp);

		if (!check.allowed) {
			throw new Error(errorMessage);
		}

		try {
			const user = await options.verify(credentials, req);
			if (!user) {
				limiter.recordFailure(clientIp);
				return null;
			}
			limiter.reset(clientIp);
			return user;
		} catch (error) {
			limiter.recordFailure(clientIp);
			throw error;
		}
	};
}

export interface NextAuthCallbackUser {
	id: string;
	role?: string;
	globalRole?: string;
	email?: string;
	name?: string;
	[key: string]: unknown;
}

export interface NextAuthCallbackToken {
	id?: string;
	role?: string;
	globalRole?: string;
	[key: string]: unknown;
}

export function createStandardSessionCallbacks<
	TToken extends NextAuthCallbackToken = NextAuthCallbackToken,
	TSession extends { user?: Record<string, any> } = { user: Record<string, any> },
>() {
	return {
		async jwt({ token, user }: { token: TToken; user?: NextAuthCallbackUser }) {
			if (user) {
				token.id = user.id;
				if (user.role) {
					token.role = user.role;
				}
				if (user.globalRole) {
					token.globalRole = user.globalRole;
				}
			}
			return token;
		},
		async session({ session, token }: { session: TSession; token: TToken }) {
			if (token && session.user) {
				session.user.id = token.id;
				if (token.role) {
					session.user.role = token.role;
				}
				if (token.globalRole) {
					session.user.globalRole = token.globalRole;
				}
			}
			return session;
		},
	};
}
