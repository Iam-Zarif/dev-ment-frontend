import axios from "axios";

import { env } from "@/lib/env";

export const apiClient = axios.create({
	baseURL: env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
	timeout: 15_000,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject(error),
);