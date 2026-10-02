import { create } from "zustand";

import type {
	AuthSessionData,
	AuthStatus,
	AuthUser,
} from "@/types/auth.types";

type AuthState = {
	user: AuthUser | null;
	accessToken: string | null;
	status: AuthStatus;

	setSession: (
		session: AuthSessionData,
	) => void;

	setUser: (
		user: AuthUser | null,
	) => void;

	setAccessToken: (
		token: string | null,
	) => void;

	setStatus: (
		status: AuthStatus,
	) => void;

	clearSession: () => void;
};

export const useAuthStore =
	create<AuthState>((set) => ({
		user: null,
		accessToken: null,
		status: "idle",

		setSession: (session) => {
			set({
				user: session.user,
				accessToken:
					session.accessToken,
				status: "authenticated",
			});
		},

		setUser: (user) => {
			set({
				user,
			});
		},

		setAccessToken: (
			accessToken,
		) => {
			set({
				accessToken,
			});
		},

		setStatus: (status) => {
			set({
				status,
			});
		},

		clearSession: () => {
			set({
				user: null,
				accessToken: null,
				status:
					"unauthenticated",
			});
		},
	}));