import type { Metadata } from "next";
import {
	Inter,
	Outfit,
} from "next/font/google";

import "@/app/globals.css";
import { siteConfig } from "@/config/site.config";
import { AppProvider } from "@/providers/app-provider";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

const outfit = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit",
	display: "swap",
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
		<html
			lang="en"
			suppressHydrationWarning
			className={`${inter.variable} ${outfit.variable}`}
		>
			<body className="min-h-screen bg-background text-foreground antialiased">
				<AppProvider>
					{children}
				</AppProvider>
			</body>
		</html>
	);
}