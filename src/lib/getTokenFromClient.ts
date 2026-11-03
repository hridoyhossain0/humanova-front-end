import { authClient } from "./auth-client"

/**
 * Returns the Better Auth JWT used to authenticate requests to the API.
 * Returns `undefined` when there is no session or the token endpoint fails.
 */
export const getTokenFromClient = async (): Promise<string | undefined> => {
    try {
        const { data } = await authClient.token();

        return data?.token;
    } catch (error) {
        console.error("Could not get auth token:", error);

        return undefined;
    }
}
