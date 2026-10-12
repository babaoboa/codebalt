import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, organization } from "better-auth/plugins";
import { sso } from "@better-auth/sso";
import { db } from "./database";
import { trustedProxies } from "./client-ip";
import { sendEmail } from "./email";
import { hasPendingInvitation, signInRouting, verifiedSsoProviderCovers } from "./sign-in-routing";
import * as schema from "../db/schema";

const frontendURL = process.env.FRONTEND_URL ?? "http://localhost:9785";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    trustedOrigins: [frontendURL],
    user: {
        validateUserInfo: async ({ user, source }, ctx) => {
            if (source.action !== "create-user") return;
            const email = user.email ?? "";
            const adapter = ctx.context.adapter;
            const isSso = source.method === "sso-oidc" || source.method === "sso-saml";
            if (isSso && source.sso && (await verifiedSsoProviderCovers(adapter, source.sso.providerId, email))) return;
            if (source.method === "email-otp" && (await hasPendingInvitation(adapter, email))) return;
            return { error: "ACCOUNT_NOT_PROVISIONED", errorDescription: "No account exists for this email" };
        },
    },
    plugins: [
        signInRouting(),
        emailOTP({
            disableSignUp: false,
            storeOTP: "hashed",
            async sendVerificationOTP({ email, otp }, ctx) {
                if (!ctx) return;
                const { adapter, internalAdapter, logger } = ctx.context;
                const known = (await internalAdapter.findUserByEmail(email)) || (await hasPendingInvitation(adapter, email));
                if (!known) return;
                void sendEmail({
                    to: email,
                    subject: `${otp} is your Co(de)balt sign-in code`,
                    text: `Your sign-in code is ${otp}. It expires in 5 minutes.\n\nIf you didn't try to sign in, you can ignore this email.`,
                }).catch((error) => logger.error("Failed to send sign-in code", error));
            },
        }),
        sso({
            domainVerification: { enabled: true },
        }),
        organization({
            allowUserToCreateOrganization: false,
            async sendInvitationEmail({ email, organization, inviter }) {
                void sendEmail({
                    to: email,
                    subject: `Join ${organization.name} on Co(de)balt`,
                    text: `${inviter.user.name} invited you to ${organization.name}.\n\nSign in at ${frontendURL} with ${email} to get started.`,
                }).catch((error) => console.error("Failed to send invitation", error));
            },
        }),
    ],
    rateLimit: {
        enabled: true,
        storage: "memory",
        window: 10,
        max: 100,
        customRules: {
            "/sign-in/identify": { window: 60, max: 10 },
            "/email-otp/send-verification-otp": { window: 60, max: 3 },
            "/sign-in/email-otp": { window: 60, max: 5 },
            "/sign-in/sso": { window: 60, max: 10 },
            "/sso/**": { window: 60, max: 10 },
            "/get-session": { window: 10, max: 30 },
        },
    },
    advanced: {
        ipAddress: {
            ipAddressHeaders: ["x-forwarded-for"],
            trustedProxies,
        },
    },
});
