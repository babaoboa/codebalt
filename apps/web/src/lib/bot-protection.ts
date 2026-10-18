export const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";

export function turnstileHeaders(token: string): Record<string, string> {
  return { "x-turnstile-token": token };
}
