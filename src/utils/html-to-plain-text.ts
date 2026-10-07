export function htmlToPlainText(html?: string | null) {
	if (!html) {
		return "";
	}

	return html
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<li[^>]*>/gi, "• ")
		.replace(/<\/(p|div|li|h[1-6]|pre)>/gi, "\n")
		.replace(/<[^>]+>/g, "")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">")
		.replace(/&quot;/gi, '"')
		.replace(/&#39;|&apos;/gi, "'")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}
