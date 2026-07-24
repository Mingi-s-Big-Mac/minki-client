import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // strictPort: 포트가 점유돼 있으면 다른 포트로 넘어가지 않고 에러를 내서
    // origin 불일치로 인한 CORS 403을 조용히 유발하지 않도록 한다.
    // 백엔드 CORS_ORIGIN이 http://localhost:5173 을 허용하므로 이 포트에 고정한다.
    port: 5173,
    strictPort: true,
  },
});
