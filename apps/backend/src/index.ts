import { Elysia } from "elysia";
import { auth } from "./lib/auth";
import { withClientIP } from "./lib/client-ip";

const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]

const betterAuth = new Elysia({ name: "better-auth" })
    .all("/api/auth/*", ({ request, server, status }) => {
        if (!BETTER_AUTH_ACCEPT_METHODS.includes(request.method)) return status(405);
        return auth.handler(withClientIP(request, server?.requestIP(request)?.address));
    })
    .macro({
        auth: {
            async resolve({ status, request: { headers } }) {
                const session = await auth.api.getSession({ headers });
                if (!session) return status(401);
                return { user: session.user, session: session.session };
            },
        },
    });

const app = new Elysia()
    .use(betterAuth)
    .get(
        "/api/me",
        async ({ user, request: { headers } }) => {
            const organizations = await auth.api.listOrganizations({ headers });
            return {
                name: user.name,
                email: user.email,
                organizations: organizations.map(({ id, name, slug }) => ({ id, name, slug })),
            };
        },
        { auth: true },
    )
    .listen(9786);

export type App = typeof app;
export type Auth = typeof auth;

console.log(
`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
