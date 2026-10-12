import { createAuthClient } from "better-auth/react"
import { emailOTPClient, InferServerPlugin } from "better-auth/client/plugins"
import type { Auth } from "backend"

export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
    InferServerPlugin<Auth, "sso">(),
    InferServerPlugin<Auth, "sign-in-routing">(),
  ],
  fetchOptions: {
    onResponse({ response }) {
      if (response.status !== 429) return
      const retryAfter = Number(response.headers.get("X-Retry-After")) || 60
      return Response.json({ code: "RATE_LIMITED", message: "Too many requests", retryAfter }, { status: 429 })
    },
  },
})

export const { signIn, signOut, useSession, emailOtp } = authClient

export function retryAfterOf(error: { status: number } | null) {
  if (error?.status !== 429) return 0
  return Number((error as { retryAfter?: unknown }).retryAfter) || 60
}
