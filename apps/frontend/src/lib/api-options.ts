import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { greetingNameConstraints, type GreetingBody } from "@repo/schemas";
import { isGreetingBody } from "@repo/schemas/validation";
import { api } from "./api";

export const healthQueryOptions = queryOptions({
  queryKey: ["api", "health"],
  queryFn: async ({ signal }) => {
    const { data, error } = await api.api.health.get({ fetch: { signal } });
    if (error) {
      throw new Error("Could not reach the API.", { cause: error });
    }
    return data;
  },
});

export const greetingMutationOptions = mutationOptions({
  mutationKey: ["api", "hello"],
  mutationFn: async (body: GreetingBody) => {
    if (!isGreetingBody(body)) {
      throw new Error(
        `Enter a name between ${greetingNameConstraints.minLength} and ${greetingNameConstraints.maxLength} characters.`,
      );
    }

    const { data, error } = await api.api.hello.post(body);
    if (error) {
      throw new Error(
        error.status === 422
          ? "The API rejected the request."
          : "Could not reach the API. Start both apps with bun run dev.",
        { cause: error },
      );
    }
    return data;
  },
});
