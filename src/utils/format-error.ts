import axios from "axios";

import type { ApiErrorResponse } from "@/types/api.types";

export function formatError(error: unknown): string {
	if (axios.isAxiosError<ApiErrorResponse>(error)) {
		return error.response?.data?.message ?? error.message ?? "Something went wrong";
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "Something went wrong";
}
