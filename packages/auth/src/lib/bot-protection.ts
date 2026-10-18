import { env } from "@codebalt/env/server";

export async function verifyTurnstile(headers: Headers): Promise<boolean> {
  const token = headers.get("x-turnstile-token");
  if (!token) return false;

  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
  });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  if (!response.ok) return false;
  const result: unknown = await response.json();
  return (
    typeof result === "object" && result !== null && "success" in result && result.success === true
  );
}
