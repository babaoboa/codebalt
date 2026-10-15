import { describe, expect, it } from "bun:test";
import { treaty } from "@elysia/eden";
import { app } from "./app";

const client = treaty(app);

describe("API contract", () => {
  it("returns a typed greeting through Eden", async () => {
    const { data, error, status } = await client.api.hello.post({
      name: "Codebalt",
    });
    expect(status).toBe(200);
    expect(error).toBeNull();
    expect(data?.message).toBe("Hello, Codebalt!");
  });

  it("exposes health status", async () => {
    const { data } = await client.api.health.get();
    expect(data?.status).toBe("ok");
  });

  it.each([{ name: 123 }, { name: "" }, { name: "a".repeat(81) }, {}])(
    "rejects invalid input with TypeBox: %j",
    async (body) => {
      const response = await app.handle(
        new Request("http://localhost/api/hello", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }),
      );
      expect(response.status).toBe(422);
    },
  );
});
