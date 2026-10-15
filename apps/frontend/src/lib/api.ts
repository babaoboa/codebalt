import { treaty } from "@elysia/eden";
import type { App } from "api";

export const api = treaty<App>(
  import.meta.env.VITE_API_URL || window.location.origin,
);
