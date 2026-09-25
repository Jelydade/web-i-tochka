import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const homepageCriticalStyles = `
  :root{font-family:'Golos Text',Arial,sans-serif;color:#20211f;background:#f7f7f2}
  *{box-sizing:border-box}body{margin:0;background:#f7f7f2}a{color:inherit;text-decoration:none}
  .header{min-height:100px;display:flex;align-items:center;justify-content:space-between;padding:0 5%;border-bottom:1px solid #dcded6;background:#f7f7f2}
  .logo{font-size:28px;font-weight:800;letter-spacing:-1.3px;white-space:nowrap}.logo span{font-weight:500}.logo-pixel{display:inline-block;width:.28em;height:.28em;margin-left:.08em;background:#304bff}
  nav{display:flex;gap:12px;align-items:center}nav a{font-size:13px}.section{padding:100px 5%}h1,h2{margin:0;line-height:1.05;letter-spacing:-.055em}h1{font-size:clamp(56px,8vw,120px)}h2{font-size:clamp(36px,5vw,66px)}p{line-height:1.7}.blue{color:#304bff}
  @media(max-width:640px){.header{min-height:0;flex-wrap:wrap;gap:12px;padding:14px 6% 12px}.logo{font-size:20px}.header nav{order:2;flex:1 0 100%;overflow-x:auto;gap:8px}.header nav a{flex:0 0 auto;padding:9px 11px;background:#edeee7;border-radius:999px;font-size:11px}.section{padding:65px 6%}h1{font-size:58px}}
`;

export default defineConfig({
  plugins: [{
    name: 'inline-homepage-styles',
    transformIndexHtml(html, context) {
      if (!context.filename.endsWith('/index.html')) return html;
      return html.replace('<!-- homepage-styles -->', `<style>${homepageCriticalStyles}</style>`);
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
