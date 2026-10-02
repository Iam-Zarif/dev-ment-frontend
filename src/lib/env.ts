import { z } from "zod";

const apiUrlSchema = z
	.string()
	.trim()
	.min(1)
	.refine(
		(value) => {
			if (value.startsWith("/")) {
				return true;
			}

			try {
				new URL(value);
				return true;
			} catch {
				return false;
			}
		},
		{
			message: "NEXT_PUBLIC_API_URL must be a relative path or valid URL",
		},
	);

const envSchema = z.object({
	NEXT_PUBLIC_API_URL: apiUrlSchema,

	NEXT_PUBLIC_APP_URL: z.string().trim().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
});

const parsedEnv = envSchema.safeParse({
	NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsedEnv.success) {
	throw new Error(`Invalid frontend environment variables: ${parsedEnv.error.message}`);
}

export const env = Object.freeze(parsedEnv.data);
