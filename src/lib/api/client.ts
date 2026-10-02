import axios, {
	type AxiosError,
	type InternalAxiosRequestConfig,
} from "axios";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { env } from "@/lib/env";
import { useAuthStore } from "@/store/auth.store";
import type {
	AuthSessionData,
} from "@/types/auth.types";
import type {
	ApiResponse,
} from "@/types/api.types";

type RetryableRequestConfig =
	InternalAxiosRequestConfig & {
		_retry?: boolean;
	};

const refreshClient =
	axios.create({
		baseURL:
			env.NEXT_PUBLIC_API_URL,
		withCredentials: true,
		timeout: 15_000,
		headers: {
			"Content-Type":
				"application/json",
		},
	});

export const apiClient =
	axios.create({
		baseURL:
			env.NEXT_PUBLIC_API_URL,
		withCredentials: true,
		timeout: 15_000,
		headers: {
			"Content-Type":
				"application/json",
		},
	});

apiClient.interceptors.request.use(
	(config) => {
		const accessToken =
			useAuthStore.getState()
				.accessToken;

		if (accessToken) {
			config.headers.Authorization =
				`Bearer ${accessToken}`;
		}

		return config;
	},
);

let refreshPromise:
	| Promise<AuthSessionData>
	| null = null;

const refreshSession =
	async (): Promise<AuthSessionData> => {
		if (!refreshPromise) {
			refreshPromise = refreshClient
				.post<
					ApiResponse<AuthSessionData>
				>(
					API_ENDPOINTS.auth
						.refresh,
				)
				.then(
					(response) =>
						response.data.data,
				)
				.finally(() => {
					refreshPromise = null;
				});
		}

		return refreshPromise;
	};

const shouldSkipRefresh = (
	url?: string,
) => {
	if (!url) {
		return false;
	}

	return [
		API_ENDPOINTS.auth.login,
		API_ENDPOINTS.auth.refresh,
		API_ENDPOINTS.auth
			.registerCandidate,
		API_ENDPOINTS.auth
			.registerRecruiter,
		API_ENDPOINTS.auth.verifyOtp,
		API_ENDPOINTS.auth
			.resendOtp,
		API_ENDPOINTS.auth
			.forgotPassword,
		API_ENDPOINTS.auth
			.resetPassword,
	].some((endpoint) =>
		url.includes(endpoint),
	);
};

apiClient.interceptors.response.use(
	(response) => response,

	async (
		error: AxiosError,
	) => {
		const originalRequest =
			error.config as
				| RetryableRequestConfig
				| undefined;

		if (
			error.response?.status !==
				401 ||
			!originalRequest ||
			originalRequest._retry ||
			shouldSkipRefresh(
				originalRequest.url,
			)
		) {
			return Promise.reject(
				error,
			);
		}

		originalRequest._retry =
			true;

		try {
			const session =
				await refreshSession();

			useAuthStore
				.getState()
				.setSession(session);

			originalRequest.headers.Authorization =
				`Bearer ${session.accessToken}`;

			return apiClient(
				originalRequest,
			);
		} catch (
			refreshError
		) {
			useAuthStore
				.getState()
				.clearSession();

			return Promise.reject(
				refreshError,
			);
		}
	},
);