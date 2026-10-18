import { db } from "@codebalt/db";
import * as schema from "@codebalt/db/schema/auth";
import { env } from "@codebalt/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { organization } from "better-auth/plugins";

import { verifyTurnstile } from "./lib/bot-protection";

export const auth = betterAuth({
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-in/email" && ctx.path !== "/sign-up/email") return;
      const verified = await verifyTurnstile(ctx.headers);
      if (!verified) {
        throw new APIError("FORBIDDEN", { message: "Bot verification failed" });
      }
    }),
  },
  database: drizzleAdapter(db, {
    provider: "pg",

    schema: schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [organization()],
});
