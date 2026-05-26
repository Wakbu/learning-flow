import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Vite 설정 파일입니다.
 * GitHub Pages에 배포할 때는 base 경로를 저장소 이름과 맞춰야 합니다.
 */
export default defineConfig({
  base: "/learning-flow/",
  plugins: [react(), tailwindcss()],
});