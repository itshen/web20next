import { defineConfig } from 'astro/config';
import { defaultLocale, localeCodes, locales } from './src/i18n/index.ts';
import { resolveSiteUrl } from './src/lib/site-url.ts';

export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  build: { inlineStylesheets: 'never' },
  site: resolveSiteUrl(process.env.SITE_URL).href,
  vite: {
    plugins: [{
      name: 'redirect-trailing-slashes',
      configureServer(server) {
        return () => {
          // Redirect before Astro rejects a route with a trailing slash.
          server.middlewares.stack.unshift({
            route: '',
            handle(request, response, next) {
              const url = new URL(request.url || '/', 'http://localhost');
              if (url.pathname === '/' || !url.pathname.endsWith('/')) return next();
              response.statusCode = 308;
              response.setHeader('Location', `${url.pathname.replace(/\/+$/, '')}${url.search}`);
              response.end();
            },
          });
        };
      },
    }],
  },
  i18n: {
    defaultLocale,
    locales: localeCodes.map((code) => ({ path: locales[code].path || code, codes: [code] })),
    routing: { prefixDefaultLocale: false },
  },
});
