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
});
