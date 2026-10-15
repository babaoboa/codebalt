import { Type, type Static } from "@sinclair/typebox";

export const greetingNameConstraints = {
  minLength: 1,
  maxLength: 80,
} as const;

export const greetingBodySchema = Type.Object({
  name: Type.String(greetingNameConstraints),
});

export const greetingResponseSchema = Type.Object({
  message: Type.String(),
});

export const healthResponseSchema = Type.Object({
  status: Type.Literal("ok"),
});

export type GreetingBody = Static<typeof greetingBodySchema>;
export type GreetingResponse = Static<typeof greetingResponseSchema>;
export type HealthResponse = Static<typeof healthResponseSchema>;
