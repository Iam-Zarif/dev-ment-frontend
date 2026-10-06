import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyProxySession } from "@/lib/auth/proxy-session";
import type { UserRole } from "@/types/common.types";

const REFRESH_COOKIE_NAME = "devment_refresh_token";

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

export function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	const requiredRole = getRequiredRole(pathname);

	if (!requiredRole) {
		return NextResponse.next();
	}

	const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

	const session = refreshToken ? verifyProxySession(refreshToken) : null;

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
