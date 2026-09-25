import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const homepageStyles = ['style.css', 'sections.css', 'teaser-redesign.css', 'form.css']
  .map((file) => readFileSync(resolve(projectRoot, 'src', file), 'utf8'))
  .join('\n');

export default defineConfig({
  plugins: [{
    name: 'inline-homepage-styles',
    transformIndexHtml(html, context) {
      if (!context.filename.endsWith('/index.html')) return html;
      return html.replace('<!-- homepage-styles -->', `<style>${homepageStyles}</style>`);
    },
  }],
  build: {
    rollupOptions: {
      input: {
        main: resolve(projectRoot, 'index.html'),
        works: resolve(projectRoot, 'works.html'),
        diagnostic: resolve(projectRoot, 'diagnostic.html'),
        diagnosticCss: resolve(projectRoot, 'diagnostic-css.html'),
      },
    },
  },
});
