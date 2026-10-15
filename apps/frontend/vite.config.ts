/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "API_");
  const proxy = {
    "/api": {
      target: env.API_PROXY_TARGET || "http://localhost:3000",
      changeOrigin: true,
    },
  };

  return {
    plugins: [react({})],
    server: { port: 5173, strictPort: true, proxy },
    preview: { proxy },
  };
});
