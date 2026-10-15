import { Elysia } from "elysia";
import {
  greetingBodySchema,
  greetingResponseSchema,
  healthResponseSchema,
} from "@repo/schemas";

export const app = new Elysia({ prefix: "/api" })
  .get("/health", () => ({ status: "ok" as const }), {
    response: healthResponseSchema,
  })
  .post("/hello", ({ body }) => ({ message: `Hello, ${body.name}!` }), {
    body: greetingBodySchema,
    response: greetingResponseSchema,
  });

export type App = typeof app;
