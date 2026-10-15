import { api } from "../src/lib/api";

// Compiled by check-types; never imported into the browser bundle.
export async function checkApiContract() {
  const { data } = await api.api.hello.post({ name: "Codebalt" });
  if (data) {
    const message: string = data.message;
    // @ts-expect-error Response fields stay typed across workspace boundaries.
    const numericMessage: number = data.message;
    void message;
    void numericMessage;
  }
  // @ts-expect-error TypeBox's request schema requires a string.
  await api.api.hello.post({ name: 123 });
  // @ts-expect-error Routes are inferred from the API implementation.
  await api.api.missing.get();
}
