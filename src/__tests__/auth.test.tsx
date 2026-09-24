import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  AuthCard,
  LoginForm,
  QrLoginForm,
  ForgotPasswordForm,
  RateLimiter,
  createRateLimiter,
  getClientIp,
  sha256Hex,
  timingSafeEqualString,
  safeCompare,
  verifyConstantTime,
  createSignedToken,
  verifySignedToken,
  createRateLimitedAuthorize,
  createStandardSessionCallbacks,
} from "../auth";

describe("Auth Subsystem - UI Components SSR", () => {
  it("renders AuthCard with logo, title, description, and footer", () => {
    const html = renderToString(
      <AuthCard
        logo={<span data-testid="test-logo">Logo</span>}
        title="Admin Portal"
        description="Please authenticate to continue"
        footer={<span>Version 1.0</span>}
      >
        <div data-testid="card-child">Child Content</div>
      </AuthCard>
    );

    expect(html).toContain("Admin Portal");
    expect(html).toContain("Please authenticate to continue");
    expect(html).toContain("test-logo");
    expect(html).toContain("card-child");
    expect(html).toContain("Version 1.0");
  });

  it("renders LoginForm in email-password mode", () => {
    const html = renderToString(
      <LoginForm
        mode="email-password"
        title="Account Login"
        emailLabel="Work Email"
        passwordLabel="Master Password"
        onSubmit={async () => ({ success: true })}
      />
    );

    expect(html).toContain("Account Login");
    expect(html).toContain("Work Email");
    expect(html).toContain("Master Password");
    expect(html).toContain('type="email"');
    expect(html).toContain('type="password"');
  });

  it("renders LoginForm in password-only mode", () => {
    const html = renderToString(
      <LoginForm
        mode="password-only"
        title="Protected Console"
        onSubmit={async () => ({ success: true })}
      />
    );

    expect(html).toContain("Protected Console");
    expect(html).not.toContain('type="email"');
    expect(html).toContain('type="password"');
  });

  it("renders LoginForm in username-password mode", () => {
    const html = renderToString(
      <LoginForm
        mode="username-password"
        usernameLabel="Account Identifier"
        onSubmit={async () => ({ success: true })}
      />
    );

    expect(html).toContain("Account Identifier");
    expect(html).toContain('autoComplete="username"');
  });

  it("renders LoginForm with forgot password and qr login links", () => {
    const html = renderToString(
      <LoginForm
        showForgotPassword
        forgotPasswordHref="/recover"
        forgotPasswordLabel="Need Help?"
        showQrLogin
        qrLoginHref="/qr-login"
        qrLoginLabel="Scan QR"
        onSubmit={async () => ({ success: true })}
      />
    );

    expect(html).toContain('href="/recover"');
    expect(html).toContain("Need Help?");
    expect(html).toContain('href="/qr-login"');
    expect(html).toContain("Scan QR");
  });

  it("renders QrLoginForm with manual input and scanner slot", () => {
    const html = renderToString(
      <QrLoginForm
        title="Passkey QR"
        showManualInput
        manualInputLabel="Token Override"
        scannerSlot={<div data-testid="camera-stream">Scanner Active</div>}
      />
    );

    expect(html).toContain("Passkey QR");
    expect(html).toContain("Token Override");
    expect(html).toContain("camera-stream");
    expect(html).toContain("Scanner Active");
  });

  it("renders QrLoginForm states", () => {
    const verifyingHtml = renderToString(
      <QrLoginForm state="verifying" verifyingMessage="Authenticating device..." />
    );
    expect(verifyingHtml).toContain("Authenticating device...");

    const successHtml = renderToString(
      <QrLoginForm state="success" successMessage="Device recognized!" />
    );
    expect(successHtml).toContain('role="status"');
    expect(successHtml).toContain("Device recognized!");

    const errorHtml = renderToString(
      <QrLoginForm state="error" errorMessage="Invalid authorization token" />
    );
    expect(errorHtml).toContain('role="alert"');
    expect(errorHtml).toContain("Invalid authorization token");
  });

  it("renders ForgotPasswordForm across all steps", () => {
    const reqHtml = renderToString(
      <ForgotPasswordForm initialStep="request" emailLabel="Account Email" />
    );
    expect(reqHtml).toContain("Account Email");
    expect(reqHtml).toContain('type="email"');

    const verifyHtml = renderToString(
      <ForgotPasswordForm initialStep="verify" codeLabel="Security Code" />
    );
    expect(verifyHtml).toContain("Security Code");
    expect(verifyHtml).toContain("tracking-widest");

    const resetHtml = renderToString(
      <ForgotPasswordForm
        initialStep="reset"
        newPasswordLabel="Fresh Secret"
        confirmPasswordLabel="Confirm Fresh Secret"
      />
    );
    expect(resetHtml).toContain("Fresh Secret");
    expect(resetHtml).toContain("Confirm Fresh Secret");
  });
});

describe("Auth Subsystem - Rate Limiter", () => {
  it("allows requests below threshold and blocks upon exceeding max attempts", () => {
    const limiter = new RateLimiter({
      maxAttempts: 3,
      windowMs: 60000,
      blockDurationMs: 60000,
    });

    const ip = "192.168.1.10";
    expect(limiter.check(ip).allowed).toBe(true);
    expect(limiter.check(ip).remaining).toBe(3);

    limiter.recordFailure(ip);
    expect(limiter.check(ip).remaining).toBe(2);

    limiter.recordFailure(ip);
    expect(limiter.check(ip).remaining).toBe(1);

    const blocked = limiter.recordFailure(ip);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);

    const nextCheck = limiter.check(ip);
    expect(nextCheck.allowed).toBe(false);
    expect(nextCheck.remaining).toBe(0);

    limiter.reset(ip);
    expect(limiter.check(ip).allowed).toBe(true);
    expect(limiter.check(ip).remaining).toBe(3);
  });

  it("clears all rate limit state when clear is called", () => {
    const limiter = createRateLimiter({ maxAttempts: 1 });
    limiter.recordFailure("1.1.1.1");
    expect(limiter.check("1.1.1.1").allowed).toBe(false);

    limiter.clear();
    expect(limiter.check("1.1.1.1").allowed).toBe(true);
  });
});

describe("Auth Subsystem - getClientIp", () => {
  it("extracts first ip from x-forwarded-for header", () => {
    const req = new Request("https://example.com/api/login", {
      headers: {
        "x-forwarded-for": "203.0.113.195, 70.41.3.18, 150.172.238.178",
      },
    });
    expect(getClientIp(req)).toBe("203.0.113.195");
  });

  it("extracts ip from x-real-ip when x-forwarded-for is missing", () => {
    const req = new Request("https://example.com/api/login", {
      headers: {
        "x-real-ip": "198.51.100.42",
      },
    });
    expect(getClientIp(req)).toBe("198.51.100.42");
  });

  it("extracts ip from cf-connecting-ip", () => {
    const req = new Request("https://example.com/api/login", {
      headers: {
        "cf-connecting-ip": "104.244.42.1",
      },
    });
    expect(getClientIp(req)).toBe("104.244.42.1");
  });

  it("falls back to 127.0.0.1 when no header is present", () => {
    expect(getClientIp(undefined)).toBe("127.0.0.1");
    const emptyReq = new Request("https://example.com/api/login");
    expect(getClientIp(emptyReq)).toBe("127.0.0.1");
  });
});

describe("Auth Subsystem - Crypto Utilities", () => {
  it("generates consistent sha256 hex digests", async () => {
    const hash1 = await sha256Hex("secret123");
    const hash2 = await sha256Hex("secret123");
    const hash3 = await sha256Hex("other");

    expect(hash1).toHaveLength(64);
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
  });

  it("performs timing-safe string comparison", () => {
    expect(timingSafeEqualString("hello", "hello")).toBe(true);
    expect(timingSafeEqualString("hello", "world")).toBe(false);
    expect(timingSafeEqualString("hello", "hell")).toBe(false);
  });

  it("performs constant time safeCompare", async () => {
    expect(await safeCompare("password", "password")).toBe(true);
    expect(await safeCompare("password", "different")).toBe(false);
    expect(await safeCompare(undefined, "different")).toBe(false);
    expect(await safeCompare("password", null)).toBe(false);
  });

  it("verifies credentials in constant time with options", async () => {
    expect(await verifyConstantTime("  passWord  ", "password")).toBe(true);
    expect(
      await verifyConstantTime("  passWord  ", "password", {
        caseInsensitive: false,
      })
    ).toBe(false);
    expect(
      await verifyConstantTime("  password  ", "password", { trim: false })
    ).toBe(false);
    expect(await verifyConstantTime("", "password")).toBe(false);
    expect(await verifyConstantTime("password", "")).toBe(false);
    expect(await verifyConstantTime(12345, "password")).toBe(false);
  });

  it("creates and verifies signed tokens", async () => {
    const secret = "super-secret-key-123456789";
    const token = await createSignedToken("user-id-42", secret);

    expect(token).toContain("user-id-42");

    const result = await verifySignedToken(token, secret, 3600);
    expect(result.valid).toBe(true);
    expect(result.payload).toBe("user-id-42");

    const invalidSecretResult = await verifySignedToken(token, "wrong-key", 3600);
    expect(invalidSecretResult.valid).toBe(false);

    const tampered = token.replace("user-id-42", "user-id-99");
    const tamperedResult = await verifySignedToken(tampered, secret, 3600);
    expect(tamperedResult.valid).toBe(false);

    const malformedResult = await verifySignedToken("invalid.token", secret, 3600);
    expect(malformedResult.valid).toBe(false);
  });
});

describe("Auth Subsystem - NextAuth Integration Helpers", () => {
  it("enforces rate limits on authorize handler", async () => {
    const limiter = new RateLimiter({ maxAttempts: 2, blockDurationMs: 60000 });
    const verifyMock = vi.fn().mockImplementation(async (creds) => {
      if (creds?.pass === "correct") {
        return { id: "user-1", name: "Rui" };
      }
      return null;
    });

    const authorize = createRateLimitedAuthorize({
      rateLimiter: limiter,
      verify: verifyMock,
      rateLimitErrorMessage: "BLOCKED_BY_POLICY",
    });

    const req = new Request("https://example.com/api/auth", {
      headers: { "x-forwarded-for": "10.0.0.5" },
    });

    const fail1 = await authorize({ pass: "wrong" }, req);
    expect(fail1).toBeNull();

    const fail2 = await authorize({ pass: "wrong" }, req);
    expect(fail2).toBeNull();

    await expect(authorize({ pass: "correct" }, req)).rejects.toThrow("BLOCKED_BY_POLICY");
  });

  it("resets limiter on successful login", async () => {
    const limiter = new RateLimiter({ maxAttempts: 2 });
    const verifyMock = vi.fn().mockResolvedValue({ id: "user-100" });

    const authorize = createRateLimitedAuthorize({
      rateLimiter: limiter,
      verify: verifyMock,
    });

    const req = new Request("https://example.com", {
      headers: { "x-forwarded-for": "10.0.0.9" },
    });

    const user = await authorize({}, req);
    expect(user).toEqual({ id: "user-100" });
    expect(limiter.check("10.0.0.9").remaining).toBe(2);
  });

  it("provides standard session callbacks propagating user id and roles", async () => {
    const callbacks = createStandardSessionCallbacks();

    const initialToken = {};
    const jwtResult = await callbacks.jwt({
      token: initialToken,
      user: { id: "usr_1", role: "admin", globalRole: "superadmin" },
    });

    expect(jwtResult.id).toBe("usr_1");
    expect(jwtResult.role).toBe("admin");
    expect(jwtResult.globalRole).toBe("superadmin");

    const sessionResult = await callbacks.session({
      session: { user: {} },
      token: jwtResult,
    });

    expect(sessionResult.user.id).toBe("usr_1");
    expect(sessionResult.user.role).toBe("admin");
    expect(sessionResult.user.globalRole).toBe("superadmin");
  });
});
