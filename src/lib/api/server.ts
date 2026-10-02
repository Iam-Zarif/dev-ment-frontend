import type {
	ApiErrorResponse,
	ApiResponse,
} from "@/types/api.types";

type ServerApiOptions =
	Omit<RequestInit, "body"> & {
		body?: unknown;
	};

export class ServerApiError extends Error {
	status: number;
	errors?:
		ApiErrorResponse["errors"];

	constructor(
		status: number,
		message: string,
		errors?:
			ApiErrorResponse["errors"],
	) {
		super(message);

		this.name =
			"ServerApiError";

		this.status = status;
		this.errors = errors;
	}
}

function getServerApiUrl() {
	const value =
		process.env
			.BACKEND_API_URL;

	if (!value) {
		throw new Error(
			"BACKEND_API_URL is not configured",
		);
	}

	return value.replace(
		/\/$/,
		"",
	);
}

export async function serverApi<T>(
	endpoint: string,
	options: ServerApiOptions = {},
): Promise<ApiResponse<T>> {
	const headers =
		new Headers(
			options.headers,
		);

	if (
		options.body !==
		undefined
	) {
		headers.set(
			"Content-Type",
			"application/json",
		);
	}

	const response =
		await fetch(
			`${getServerApiUrl()}${endpoint}`,
			{
				...options,
				headers,

				body:
					options.body ===
					undefined
						? undefined
						: JSON.stringify(
								options.body,
							),
			},
		);

	const payload =
		(await response.json()) as
			| ApiResponse<T>
			| ApiErrorResponse;

	if (
		!response.ok ||
		!payload.success
	) {
		const errorPayload =
			payload as ApiErrorResponse;

		throw new ServerApiError(
			response.status,
			errorPayload.message ||
				"API request failed",
			errorPayload.errors,
		);
	}

	return payload as ApiResponse<T>;
}