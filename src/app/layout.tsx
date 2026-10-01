import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@/app/globals.css";
import { siteConfig } from "@/config/site.config";
import { AppProvider } from "@/providers/app-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: siteConfig.title,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	applicationName: siteConfig.name,
};

type RootLayoutProps = Readonly<{
	children: React.ReactNode;
}>;

export default function RootLayout({
	children,
}: RootLayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
			>
				<AppProvider>{children}</AppProvider>
			</body>
		</html>
	);
}