import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss() as PluginOption[]],
  // server: {
  //   open: true,
  // },

  //! tsconfig.app.json
  // {
  //   "compilerOptions": {
  //     "paths": {
  //       "@/*": ["./src/*"]
  //     }
  //   }
  // }
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '^/api/v1': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => {
          console.log("[vite.config] path:", path);
          return path.replace(/^\/api\/v/, '/api');
        },
      },
    },
  },
});
