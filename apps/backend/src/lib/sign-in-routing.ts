import type { BetterAuthPlugin, DBAdapter } from "better-auth";
import { APIError, createAuthEndpoint, createAuthMiddleware } from "better-auth/api";
import * as z from "zod";

type SsoProvider = { providerId: string; domain: string };
function domainMatches(emailDomain: string, providerDomains: string) {
    return providerDomains
        .split(",")
        .map((entry) => entry.trim().toLowerCase())
        .filter(Boolean)
        .some((domain) => emailDomain === domain || emailDomain.endsWith(`.${domain}`));
}

export async function findVerifiedSsoProvider(adapter: DBAdapter, email: string) {
    const domain = email.trim().toLowerCase().split("@")[1];
    if (!domain) return null;
    const pageSize = 100;
    for (let offset = 0; ; offset += pageSize) {
        const page = await adapter.findMany<SsoProvider>({
            model: "ssoProvider",
            where: [{ field: "domainVerified", value: true }],
            limit: pageSize,
            offset,
            sortBy: { field: "providerId", direction: "asc" },
        });
        const match = page.find((provider) => domainMatches(domain, provider.domain));
        if (match) return match;
        if (page.length < pageSize) return null;
    }
}

export async function verifiedSsoProviderCovers(adapter: DBAdapter, providerId: string, email: string) {
    const domain = email.trim().toLowerCase().split("@")[1];
    const provider = await adapter.findOne<SsoProvider & { domainVerified: boolean }>({
        model: "ssoProvider",
        where: [{ field: "providerId", value: providerId }],
    });
    return !!domain && !!provider?.domainVerified && domainMatches(domain, provider.domain);
}

export async function hasPendingInvitation(adapter: DBAdapter, email: string) {
    const invitations = await adapter.findMany<{ expiresAt: Date }>({
        model: "invitation",
        where: [
            { field: "email", value: email.toLowerCase() },
            { field: "status", value: "pending" },
        ],
    });
    return invitations.some((invitation) => new Date(invitation.expiresAt) > new Date());
}

const ssoRequiredPaths = new Set(["/email-otp/send-verification-otp", "/sign-in/email-otp"]);
export const signInRouting = () =>
    ({
        id: "sign-in-routing",
        endpoints: {
            identify: createAuthEndpoint(
                "/sign-in/identify",
                { method: "POST", body: z.object({ email: z.email() }) },
                async (ctx) => {
                    const provider = await findVerifiedSsoProvider(ctx.context.adapter, ctx.body.email);
                    return ctx.json(
                        provider
                            ? { method: "sso" as const, providerId: provider.providerId }
                            : { method: "email-otp" as const },
                    );
                },
            ),
        },
        hooks: {
            before: [
                {
                    matcher: (ctx) => ssoRequiredPaths.has(ctx.path ?? ""),
                    handler: createAuthMiddleware(async (ctx) => {
                        const email = ctx.body?.email;
                        if (typeof email === "string" && (await findVerifiedSsoProvider(ctx.context.adapter, email))) {
                            throw new APIError("FORBIDDEN", {
                                code: "SSO_REQUIRED",
                                message: "Your organization requires signing in with SSO",
                            });
                        }
                    }),
                },
                {
                    matcher: (ctx) => ctx.path === "/sso/register",
                    handler: createAuthMiddleware(async (ctx) => {
                        if (!ctx.body?.organizationId) {
                            throw new APIError("FORBIDDEN", {
                                code: "ORGANIZATION_REQUIRED",
                                message: "SSO providers must belong to an organization",
                            });
                        }
                    }),
                },
            ],
        },
    }) satisfies BetterAuthPlugin;
