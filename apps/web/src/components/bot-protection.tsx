"use client";

import { Turnstile } from "@marsidev/react-turnstile";

import { turnstileSiteKey } from "@/lib/bot-protection";

export function BotProtection({ onToken }: { onToken: (token: string) => void }) {
  return <Turnstile siteKey={turnstileSiteKey} onSuccess={onToken} onExpire={() => onToken("")} />;
}
