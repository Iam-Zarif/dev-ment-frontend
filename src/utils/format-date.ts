import {
	format,
	formatDistanceToNow,
	isValid,
} from "date-fns";

export type DateValue =
	| Date
	| string
	| number
	| null
	| undefined;

function parseDate(value: DateValue) {
	if (value === null || value === undefined) {
		return null;
	}

	const date =
		value instanceof Date
			? value
			: new Date(value);

	return isValid(date) ? date : null;
}

export function formatDate(
	value: DateValue,
	pattern = "MMM d, yyyy",
) {
	const date = parseDate(value);

	if (!date) {
		return "—";
	}

	return format(date, pattern);
}

export function formatDateTime(
	value: DateValue,
) {
	return formatDate(
		value,
		"MMM d, yyyy • h:mm a",
	);
}

export function formatRelativeTime(
	value: DateValue,
) {
	const date = parseDate(value);

	if (!date) {
		return "—";
	}

	return formatDistanceToNow(date, {
		addSuffix: true,
	});
}