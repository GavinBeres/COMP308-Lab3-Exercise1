import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      remotes: {
        auth_mf: "http://localhost:4174/assets/remoteEntry.js",
        community_mf: "http://localhost:4175/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom", "@apollo/client", "graphql"],
    }),
  ],
  server: {
    port: 5173,
  },
  build: {
    target: "esnext",
  },
});