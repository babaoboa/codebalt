import { app } from "./app";

app.listen(Number(Bun.env.PORT || 3000));

console.log(
  `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
