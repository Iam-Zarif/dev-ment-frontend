"use client";

import { useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";

export function AuthBootstrap() {
	const {
		status,
		initialize,
	} = useAuth();

	useEffect(() => {
		if (status === "idle") {
			void initialize();
		}
	}, [
		initialize,
		status,
	]);

	return null;
}