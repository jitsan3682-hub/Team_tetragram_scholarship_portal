import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? undefined : {
        ignored: [
          '**/dist/**',
          '**/dist - Copy/**',
          '**/*.zip',
          '**/*.rar',
          '**/*.7z',
          '**/*.tar*',
          '**/ref_*/**',
          '**/node_modules/**',
          '**/scholarship-backend/**',
          '**/ScholarBridge_TEZHACK2026/**',
          '**/EduCamino_TEZHACK2026/**',
        ],
      },
    },
  };
});
