import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-macros", "babel-plugin-styled-components"],
      },
    }),
  ],
  // FIXME DEVELOPMENT
  server: {
    proxy: {
      "/api/v1/": "http://localhost:5000/",
    },
  },
})
