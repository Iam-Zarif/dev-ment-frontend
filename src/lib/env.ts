import { z } from "zod";

const envSchema = z.object({
	NEXT_PUBLIC_API_URL: z
		.string()
		.trim()
		.url("NEXT_PUBLIC_API_URL must be a valid URL"),

	NEXT_PUBLIC_APP_URL: z
		.string()
		.trim()
		.url("NEXT_PUBLIC_APP_URL must be a valid URL"),
});

const parsedEnv = envSchema.safeParse({
	NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsedEnv.success) {
	throw new Error(
		`Invalid frontend environment variables: ${parsedEnv.error.message}`,
	);
}

export const env = Object.freeze(parsedEnv.data);