"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { UIProvider } from "@/contexts/ui-context";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

type AppProviderProps = {
	children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
	return (
		<ThemeProvider>
			<QueryProvider>
				<UIProvider>
					{children}

					<Toaster
						position="top-right"
						richColors
						closeButton
					/>
				</UIProvider>
			</QueryProvider>
		</ThemeProvider>
	);
}