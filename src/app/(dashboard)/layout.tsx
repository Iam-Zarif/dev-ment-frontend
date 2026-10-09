"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getRoleHome } from "@/config/roles.config";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/lib/constants";

type DashboardLayoutProps = {
	children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const router = useRouter();
	const pathname = usePathname();

	const { user, status } = useAuth();

	const roleHome = user ? getRoleHome(user.role) : null;

	const roleMismatch = Boolean(
		roleHome && pathname !== roleHome && !pathname.startsWith(`${roleHome}/`),
	);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.replace(ROUTES.LOGIN);
			return;
		}

		if (status === "authenticated" && roleMismatch && roleHome) {
			router.replace(roleHome);
		}
	}, [roleHome, roleMismatch, router, status]);

	if (status === "idle" || status === "loading") {
		return (
			<div className="p-6">
				<DashboardSkeleton />
			</div>
		);
	}

	if (status !== "authenticated" || !user || roleMismatch) {
		return null;
	}

	return (
		<SidebarProvider>
			<DashboardSidebar />

			<SidebarInset>
				<DashboardHeader />

				<main className="flex-1 p-4 sm:p-6 lg:p-8">
					<div className="mx-auto w-full max-w-5xl">{children}</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
