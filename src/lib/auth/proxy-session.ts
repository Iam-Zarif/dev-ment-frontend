import { createHmac, timingSafeEqual } from "node:crypto";

import type { UserRole } from "@/types/common.types";

const USER_ROLES = ["ADMIN", "RECRUITER", "CANDIDATE"] as const;

type ProxySession = {
	userId: string;
	role: UserRole;
	exp: number;
};

type JwtHeader = {
	alg?: unknown;
};

type JwtPayload = {
	userId?: unknown;
	role?: unknown;
	exp?: unknown;
};

const REFRESH_SECRET = (() => {
	const secret = process.env.JWT_REFRESH_SECRET;

	if (!secret) {
		throw new Error("JWT_REFRESH_SECRET is required for proxy route protection");
	}

	return secret;
})();

function isUserRole(value: unknown): value is UserRole {
	return USER_ROLES.some((role) => role === value);
}

function decodeJson<T>(value: string): T | null {
	try {
		return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
	} catch {
		return null;
	}
}

export function verifyProxySession(token: string): ProxySession | null {
	const parts = token.split(".");

	if (parts.length !== 3) {
		return null;
	}

	const [headerPart, payloadPart, signaturePart] = parts;

	if (!headerPart || !payloadPart || !signaturePart) {
		return null;
	}

	const header = decodeJson<JwtHeader>(headerPart);

	if (header?.alg !== "HS256") {
		return null;
	}

	const expectedSignature = createHmac("sha256", REFRESH_SECRET)
		.update(`${headerPart}.${payloadPart}`)
		.digest();

	let receivedSignature: Buffer;

	try {
		receivedSignature = Buffer.from(signaturePart, "base64url");
	} catch {
		return null;
	}

	if (expectedSignature.length !== receivedSignature.length) {
		return null;
	}

	if (!timingSafeEqual(expectedSignature, receivedSignature)) {
		return null;
	}

	const payload = decodeJson<JwtPayload>(payloadPart);

	if (
		!payload ||
		typeof payload.userId !== "string" ||
		!isUserRole(payload.role) ||
		typeof payload.exp !== "number"
	) {
		return null;
	}

	if (payload.exp <= Math.floor(Date.now() / 1000)) {
		return null;
	}

	return {
		userId: payload.userId,
		role: payload.role,
		exp: payload.exp,
	};
}
