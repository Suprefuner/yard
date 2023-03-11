import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-macros", "babel-plugin-styled-components"],
      },
    }),
  ],
  server: {
    proxy: {
      "/api/v1/": "http://localhost:5000/",
    },
    // proxy: {
    //   "/api/v1/": {
    //     target: "http://localhost:5000/",
    //     changeOrigin: true,
    //   },
    // },
  },
})