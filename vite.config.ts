import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  envDir: "configurations",
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Same-origin `/api` in dev avoids browser CORS on streaming POST to FastAPI.
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
