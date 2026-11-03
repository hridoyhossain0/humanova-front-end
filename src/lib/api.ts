const rawApiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    '';

/**
 * Normalized backend URL without a trailing slash.
 *
 * A trailing slash in `NEXT_PUBLIC_API_URL` produces URLs such as
 * `https://backend.example.com//events`, which Vercel answers with a redirect
 * that browsers reject (`net::ERR_INVALID_REDIRECT`) and Express answers with a
 * 404. Always build URLs with this helper instead of reading the env var
 * directly.
 */
export function getApiUrl(): string {
    const apiUrl = rawApiUrl.trim();

    if (!apiUrl) {
        throw new Error(
            'NEXT_PUBLIC_API_URL is not configured. ' +
            'Set it in Vercel → Settings → Environment Variables ' +
            '(e.g. https://humanova-backend.vercel.app) and redeploy.'
        );
    }

    return apiUrl.replace(/\/+$/, '');
}

export function hasApiUrl(): boolean {
    return Boolean(rawApiUrl.trim());
}

/** Join the backend base URL with an endpoint path. */
export function apiUrl(path: string): string {
    const base = getApiUrl();

    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function fetchApi(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    try {
        const res = await fetch(input, {
            cache: 'no-store',
            ...init,
        });

        if (!res.ok) {
            let body: { message?: string } = {};
            try {
                body = (await res.clone().json()) as { message?: string };
            } catch {
                // ignore non-JSON error bodies
            }

            throw new Error(
                body?.message ||
                `API request failed with status ${res.status}`
            );
        }

        return res;
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
            throw err;
        }

        if (err instanceof Error) {
            throw err;
        }

        throw new Error('Network error while calling the API.');
    }
}

export async function fetchApiJson<T = unknown>(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<T> {
    const res = await fetchApi(input, init);

    let data: T;
    try {
        data = (await res.json()) as T;
    } catch {
        throw new Error('Invalid JSON response from the API.');
    }

    return data;
}
