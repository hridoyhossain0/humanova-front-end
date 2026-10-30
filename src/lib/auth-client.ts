import { createAuthClient } from "better-auth/react"
// The auth API is served from this app at /api/auth. Leaving baseURL unset
// makes the client use the current origin, which also works in the browser
// because WEB_URL is not exposed to client-side code by Next.js.
export const authClient = createAuthClient()

export const { signIn, signUp, useSession } = authClient
