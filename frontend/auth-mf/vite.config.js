import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "auth_mf",
      filename: "remoteEntry.js",
      exposes: {
        "./AuthApp": "./src/App.jsx",
      },
      shared: ["react", "react-dom", "@apollo/client", "graphql"],
    }),
  ],
  server: {
    port: 5174,
  },
  build: {
    target: "esnext",
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },
});