export const trustedProxies = (process.env.TRUSTED_PROXIES ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
    
export function withClientIP(request: Request, socketIP: string | undefined) {
    const { headers } = request;
    const chain = trustedProxies.length > 0 ? headers.get("x-forwarded-for") : null;
    if (socketIP) {
        headers.set("x-forwarded-for", chain ? `${chain}, ${socketIP}` : socketIP);
    } else {
        headers.delete("x-forwarded-for");
    }
    return request;
}
