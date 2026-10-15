import { Check } from "@sinclair/typebox/value";
import { greetingBodySchema, type GreetingBody } from "./index";

export function isGreetingBody(value: unknown): value is GreetingBody {
  return Check(greetingBodySchema, value);
}
