export type QueryParamValue = string | number | boolean | null | undefined;

export function updateQueryParams(currentQuery: string, updates: Record<string, QueryParamValue>) {
	const params = new URLSearchParams(currentQuery);

	for (const [key, value] of Object.entries(updates)) {
		if (value === null || value === undefined || value === "") {
			params.delete(key);
			continue;
		}

		params.set(key, String(value));
	}

	return params.toString();
}

export function parsePositiveInteger(value: string | null, fallback: number) {
	const parsed = Number(value);

	if (!Number.isInteger(parsed) || parsed < 1) {
		return fallback;
	}

	return parsed;
}
