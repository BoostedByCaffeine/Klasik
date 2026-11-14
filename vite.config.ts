import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function klasikOfflinePrecachePlugin(): Plugin {
  return {
    name: 'klasik-offline-precache-sw',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const swPath = path.join(distDir, 'sw.js');
      if (!fs.existsSync(distDir) || !fs.existsSync(swPath)) return;

      const collected: string[] = ['./', './index.html'];
      const walk = (dir: string, relPrefix = '.') => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relPath = `${relPrefix}/${entry.name}`;
          if (entry.isDirectory()) {
            walk(fullPath, relPath);
          } else if (
            entry.isFile() &&
            entry.name !== 'sw.js' &&
            /\.(html|js|css|json|svg|png|ico|woff2?)$/i.test(entry.name)
          ) {
            if (!collected.includes(relPath)) {
              collected.push(relPath);
            }
          }
        }
      };

      walk(distDir, '.');

      const swContent = fs.readFileSync(swPath, 'utf-8');
      const injected = swContent.replace(
        /const PRECACHE_URLS = \[[\s\S]*?\];/,
        `const PRECACHE_URLS = ${JSON.stringify(collected, null, 2)};`
      );
      fs.writeFileSync(swPath, injected, 'utf-8');
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), klasikOfflinePrecachePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

