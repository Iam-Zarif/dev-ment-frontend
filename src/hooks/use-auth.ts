"use client";

import { useCallback } from "react";

import { getRoleHome } from "@/config/roles.config";
import { authService } from "@/modules/auth/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type {
	LoginInput,
	VerifyOtpInput,
} from "@/types/auth.types";

export function useAuth() {
	const user = useAuthStore(
		(state) => state.user,
	);

	const accessToken = useAuthStore(
		(state) => state.accessToken,
	);

	const status = useAuthStore(
		(state) => state.status,
	);

	const setSession = useAuthStore(
		(state) => state.setSession,
	);

	const setStatus = useAuthStore(
		(state) => state.setStatus,
	);

	const clearSession = useAuthStore(
		(state) => state.clearSession,
	);

	const initialize =
		useCallback(async () => {
			const currentStatus =
				useAuthStore.getState()
					.status;

			if (
				currentStatus ===
				"loading"
			) {
				return;
			}

			setStatus("loading");

			try {
				const response =
					await authService.refresh();

				setSession(
					response.data,
				);
			} catch {
				clearSession();
			}
		}, [
			clearSession,
			setSession,
			setStatus,
		]);

	const login = useCallback(
		async (
			input: LoginInput,
		) => {
			const response =
				await authService.login(
					input,
				);

			setSession(response.data);

			return {
				...response,

				redirectTo:
					getRoleHome(
						response.data.user
							.role,
					),
			};
		},
		[setSession],
	);

	const verifyOtp = useCallback(
		async (
			input: VerifyOtpInput,
		) => {
			const response =
				await authService.verifyOtp(
					input,
				);

			setSession(response.data);

			return {
				...response,

				redirectTo:
					getRoleHome(
						response.data.user
							.role,
					),
			};
		},
		[setSession],
	);

	const logout =
		useCallback(async () => {
			try {
				await authService.logout();
			} finally {
				clearSession();
			}
		}, [clearSession]);

	return {
		user,
		accessToken,
		status,

		isAuthenticated:
			status === "authenticated",

		isLoading:
			status === "loading" ||
			status === "idle",

		initialize,
		login,
		verifyOtp,
		logout,
	};
}