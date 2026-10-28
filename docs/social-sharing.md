# Social sharing / 社交分享

## Routes and images

English: `/manifesto`. Chinese: `/zh/manifesto`. Both pages use the original manifesto Markdown, provide a downloadable PNG and a copyable page link, and preserve the language when switching. The homepage still shows the full manifesto.

`public/social/` contains three PNGs per locale:

- `poster-<locale>.png`: 1080 × 1350, the five manifesto principles for saving and sharing.
- `site-<locale>.png`: 1200 × 630, the website’s Open Graph card.
- `manifesto-<locale>.png`: 1200 × 630, the manifesto page’s Open Graph card.

Cards load `src/styles/global.css` through a stylesheet link. Their `sc-` classes share the global design tokens and are isolated from page components. Cards use the project’s blue, paper-white and green palette, homepage typography, and Web 2.0 badges. The five principles come directly from `docs/manifesto.<locale>.md`; other text comes from the locale dictionary. Images display the confirmed website domain, `web20next.com`, from `publicSite` in `src/lib/site-url.ts`.

## Regeneration

Every card ends with a green call-to-action panel asking readers to send Web 2.0 Next and their own website to their agent. The domain is prominent: 60px on portrait cards and 40px on landscape cards, without a language path or trailing slash. The invitation uses localized dictionary copy.

Install dependencies with `npm ci`. The renderer uses Playwright and Chromium. Install its browser with `npx playwright install chromium`, then run `npm run generate:social`. Alternatively, use an installed Chrome with `CHROME_CHANNEL=chrome npm run generate:social`.

The rendering machine needs Chinese fonts (PingFang SC, Microsoft YaHei, or Noto Sans CJK SC). The font stack also uses Trebuchet MS where available. Inspect all six images for missing glyphs, wrapping, and clipping after rendering. Commit the PNGs together with changes to manifesto principles or card text. Rendering is explicit; regular Astro and Cloudflare builds use the checked-in PNGs and require no browser or font installation.

## Metadata

Page previews, image download links, and social metadata append a content hash to image URLs. Regenerated images receive a new URL version so updated copy can bypass cached image bytes.

`SiteLayout.astro` emits canonical URLs, Open Graph title, description, type, locale, image URL, dimensions and alt text, and Twitter `summary_large_image` tags. Manifesto pages use the manifesto image; other indexable pages use the website image. No social metadata is emitted for the noindex 404 page.

Manifesto share links, canonical URLs, and social metadata use `publicSite` (`https://web20next.com`) even during local previews. Share actions always use `https://web20next.com/manifesto`, without a locale prefix. The subscription action uses `https://web20next.com/rss.xml`. `SITE_URL` only overrides URLs inside generated feeds; it does not override public sharing or subscription addresses. Localhost preview URLs cannot be fetched by public social crawlers. Links and image bytes can be checked locally; platform-specific previews require a public deployment, and platforms may cache older images.
