// vite.config.mjs
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      crypto: "node:crypto",
    },
  },
});
