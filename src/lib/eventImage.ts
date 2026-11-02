/**
 * Returns a URL that is safe to pass to `next/image`, or an empty string when
 * the value is missing / not a direct HTTP(S) image.
 *
 * Some saved events contain Google image-search pages or concatenated URLs
 * instead of a direct image. Passing those to the optimizer makes it return a
 * 400 and logs a console error, so reject them and show the placeholder.
 */
export function getSafeImageUrl(value?: string | null): string {
    if (!value) {
        return "";
    }

    const trimmed = value.trim();

    if (!trimmed) {
        return "";
    }

    try {
        const url = new URL(trimmed);

        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return "";
        }

        // Reject concatenated URLs such as "https://a...https://b...".
        if ((trimmed.match(/https?:\/\//gi) || []).length > 1) {
            return "";
        }

        // Reject Google image-search result pages.
        if (/\/imgres\b/i.test(url.pathname)) {
            return "";
        }

        return trimmed;
    } catch {
        return "";
    }
}
