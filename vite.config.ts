import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5100,
    strictPort: false, // Se a porta 5100 estiver ocupada, tenta automaticamente a próxima disponível
    host: true, // Permite acesso via rede local
    open: true, // Abre o navegador automaticamente
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    'import.meta.env.VITE_PERSIST_SECRET': JSON.stringify('your-secret-key-here-change-in-production'),
  },
});
