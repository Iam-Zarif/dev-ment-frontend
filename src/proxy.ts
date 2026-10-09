import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { UserRole } from "@/types/common.types";

type RouteSession = { userId: string; role: UserRole };

async function getSession(request: NextRequest): Promise<RouteSession | null> {
	const backendApiUrl = process.env.BACKEND_API_URL;
	const cookie = request.headers.get("cookie");
	if (!backendApiUrl || !cookie) return null;
	try {
		const response = await fetch(`${backendApiUrl.replace(/\/+$/, "")}/auth/session`, {
			headers: { Cookie: cookie },
			cache: "no-store",
			redirect: "error",
		});
		if (!response.ok) return null;
		const payload: unknown = await response.json();
		if (
			!payload ||
			typeof payload !== "object" ||
			!("success" in payload) ||
			payload.success !== true ||
			!("data" in payload)
		)
			return null;
		const data = payload.data;
		if (
			!data ||
			typeof data !== "object" ||
			!("userId" in data) ||
			typeof data.userId !== "string" ||
			!data.userId.trim() ||
			!("role" in data)
		)
			return null;
		if (data.role !== "ADMIN" && data.role !== "RECRUITER" && data.role !== "CANDIDATE")
			return null;
		return { userId: data.userId, role: data.role };
	} catch {
		return null;
	}
}

const ROLE_HOME: Record<UserRole, string> = {
	ADMIN: "/admin",
	RECRUITER: "/recruiter",
	CANDIDATE: "/candidate",
};

function getRequiredRole(pathname: string): UserRole | null {
	if (pathname === "/admin" || pathname.startsWith("/admin/")) {
		return "ADMIN";
	}

	if (pathname === "/recruiter" || pathname.startsWith("/recruiter/")) {
		return "RECRUITER";
	}

	if (
		pathname === "/candidate" ||
		pathname.startsWith("/candidate/") ||
		pathname === "/invitations"
	) {
		return "CANDIDATE";
	}

	return null;
}

export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	const requiredRole = getRequiredRole(pathname);

	if (!requiredRole) {
		return NextResponse.next();
	}

	const session = await getSession(request);

	if (!session) {
		const loginUrl = new URL("/login", request.url);

		const destination = `${pathname}${request.nextUrl.search}`;

		loginUrl.searchParams.set("next", destination);

		return NextResponse.redirect(loginUrl);
	}

	if (session.role !== requiredRole) {
		return NextResponse.redirect(new URL(ROLE_HOME[session.role], request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*", "/recruiter/:path*", "/candidate/:path*", "/invitations"],
};
