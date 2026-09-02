import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  test: {
    setupFiles: ["@vitest/web-worker", "./test/vitestSetup.js"],
    environment: "happy-dom",
  },
  plugins: [react()],
});
