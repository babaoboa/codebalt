import { Elysia, Context } from "elysia";
import { auth } from "./lib/auth";

const betterAuthView = (context: Context) => {
    const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
    // validate request method
    if(BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
        return auth.handler(context.request);
    } else {
        status: (405)
    }
}

const app = new Elysia().all("/api/auth/*", betterAuthView).listen(3245);

console.log(
`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);