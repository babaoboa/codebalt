import { describe, expect, it } from "bun:test";
import { isGreetingBody } from "./validation";

describe("shared greeting validation", () => {
  it.each(["a", "Codebalt", "a".repeat(80)])(
    "accepts a name within the shared limits",
    (name) => {
      expect(isGreetingBody({ name })).toBe(true);
    },
  );

  it.each([null, {}, { name: 123 }, { name: "" }, { name: "a".repeat(81) }])(
    "rejects invalid input",
    (value) => {
      expect(isGreetingBody(value)).toBe(false);
    },
  );
});
