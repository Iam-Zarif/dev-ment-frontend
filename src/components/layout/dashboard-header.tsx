"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/lib/constants";
import { formatError } from "@/utils/format-error";

export function DashboardHeader() {
	const router = useRouter();
	const { logout } = useAuth();

	const [isLoggingOut, setIsLoggingOut] =
		useState(false);

	const handleLogout = async () => {
		setIsLoggingOut(true);

		try {
			await logout();

			router.replace(ROUTES.LOGIN);
			router.refresh();
		} catch (error) {
			toast.error(formatError(error));
		} finally {
			setIsLoggingOut(false);
		}
	};

	return (
		<header className="flex h-14 shrink-0 items-center border-b bg-background px-4">
			<SidebarTrigger />

			<div className="ml-auto">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					disabled={isLoggingOut}
					onClick={() =>
						void handleLogout()
					}
				>
					<LogOut className="size-4" />
					<span className="hidden sm:inline">
						Logout
					</span>
				</Button>
			</div>
		</header>
	);
}