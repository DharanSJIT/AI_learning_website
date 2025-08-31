import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // your existing port
    proxy: {
      // Forward all /api requests to your backend
      "/api": {
        target: "https://ai-learning-website-r80k.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
