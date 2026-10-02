export const siteConfig = {
	name: "Dev-ment",
	title: "Dev-ment | Developer Assessment Platform",
	description: "A modern developer assessment platform for recruiters and candidates.",
	url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;
