export function formatEnumLabel(value: string) {
	return value
		.toLowerCase()
		.replaceAll("_", " ")
		.replace(/^\w/, (character) => character.toUpperCase());
}
