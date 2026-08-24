import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this repo at /encore/ (a project site, not a
// user/org root site) — asset URLs need that prefix in production. Local
// dev (`npm run dev`) and any other host that serves from the domain root
// are unaffected, since base only applies to `vite build`'s output.
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/encore/' : '/',
  plugins: [react()],
});
