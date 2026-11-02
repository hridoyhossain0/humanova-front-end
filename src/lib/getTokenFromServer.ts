import { headers } from "next/headers";
import { auth } from "./auth";

export const getTokenFromServer = async () => {
  try {
    const jwtToken = await auth.api.getToken({
      headers: await headers(),
    });

    return jwtToken?.token;
  } catch {
    // There is no active session (or the cookie is stale). Public pages can
    // still render; authenticated requests simply go out without a token.
    return undefined;
  }
};
