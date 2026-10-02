"use client";

import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { AuthBootstrap } from "@/modules/auth/views/auth-bootstrap";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

type AppProviderProps = {
	children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
	return (
		<ThemeProvider>
			<QueryProvider>
				<AuthBootstrap />

				{children}

				<Toaster position="top-right" closeButton />
			</QueryProvider>
		</ThemeProvider>
	);
}
