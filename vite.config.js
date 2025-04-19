import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173, // Specify the main port explicitly
    proxy: {
      // Keep existing API proxy
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      // Add proxy for authorized app
      '/user': {
        target: 'http://localhost:5174', // Port where authorized app runs
        changeOrigin: true,
        secure: false,
        // No rewrite needed since authorized app has base: "/user/"
      }
    }
  }
})
