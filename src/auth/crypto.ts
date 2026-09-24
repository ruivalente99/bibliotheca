function bytesToHex(bytes: Uint8Array): string {
	let hex = "";
	for (let i = 0; i < bytes.length; i++) {
		hex += bytes[i].toString(16).padStart(2, "0");
	}
	return hex;
}

export function timingSafeEqualString(a: string, b: string): boolean {
	if (a.length !== b.length) {
		return false;
	}
	let mismatch = 0;
	for (let i = 0; i < a.length; i++) {
		mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return mismatch === 0;
}

export async function sha256Hex(message: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(message);
	const buffer = await crypto.subtle.digest("SHA-256", data);
	return bytesToHex(new Uint8Array(buffer));
}

export async function safeCompare(
	a: string | undefined | null,
	b: string | undefined | null
): Promise<boolean> {
	if (typeof a !== "string" || typeof b !== "string") {
		return false;
	}
	const [hashA, hashB] = await Promise.all([sha256Hex(a), sha256Hex(b)]);
	return timingSafeEqualString(hashA, hashB);
}

export interface VerifyConstantTimeOptions {
	trim?: boolean;
	caseInsensitive?: boolean;
}

export async function verifyConstantTime(
	candidate: unknown,
	secret: string | undefined | null,
	options?: VerifyConstantTimeOptions
): Promise<boolean> {
	if (typeof candidate !== "string") {
		return false;
	}

	const trim = options?.trim ?? true;
	const caseInsensitive = options?.caseInsensitive ?? true;

	const cleanCandidate = trim ? candidate.trim() : candidate;
	const cleanSecret = secret ? (trim ? secret.trim() : secret) : "";

	if (!cleanCandidate || !cleanSecret) {
		await safeCompare("dummy_candidate_val", "dummy_secret_val");
		return false;
	}

	const exactMatch = await safeCompare(cleanCandidate, cleanSecret);
	if (caseInsensitive) {
		const lowerMatch = await safeCompare(
			cleanCandidate.toLowerCase(),
			cleanSecret.toLowerCase()
		);
		return exactMatch || lowerMatch;
	}

	return exactMatch;
}

export async function hmacSha256Hex(secret: string, message: string): Promise<string> {
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);
	const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
	return bytesToHex(new Uint8Array(signature));
}

export async function createSignedToken(payload: string, secretKey: string): Promise<string> {
	if (!secretKey) {
		throw new Error("Secret key is required to sign token");
	}
	const now = Math.floor(Date.now() / 1000);
	const randomBytes = new Uint8Array(16);
	crypto.getRandomValues(randomBytes);
	const salt = bytesToHex(randomBytes);
	const fullPayload = `${now}.${salt}.${payload}`;
	const signature = await hmacSha256Hex(secretKey, fullPayload);
	return `${fullPayload}.${signature}`;
}

export async function verifySignedToken(
	token: unknown,
	secretKey: string,
	maxAgeSeconds = 28800
): Promise<{ valid: boolean; payload?: string }> {
	if (typeof token !== "string" || !token || !secretKey) {
		return { valid: false };
	}

	const parts = token.split(".");
	if (parts.length < 4) {
		return { valid: false };
	}

	const [timeStr, salt, ...rest] = parts;
	const signature = rest.pop() as string;
	const payload = rest.join(".");

	const timestamp = Number.parseInt(timeStr, 10);
	if (Number.isNaN(timestamp) || !salt || !signature) {
		return { valid: false };
	}

	const now = Math.floor(Date.now() / 1000);
	if (timestamp > now + 60) {
		return { valid: false };
	}
	if (now - timestamp > maxAgeSeconds) {
		return { valid: false };
	}

	const expectedFullPayload = `${timeStr}.${salt}.${payload}`;
	const expectedSignature = await hmacSha256Hex(secretKey, expectedFullPayload);
	const isValid = timingSafeEqualString(signature, expectedSignature);

	return { valid: isValid, payload: isValid ? payload : undefined };
}
