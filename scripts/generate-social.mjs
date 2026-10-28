import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { publicSite } from '../src/lib/site-url.ts';
import { localeCodes, locales, messages, socialImagePath } from '../src/i18n/index.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const brand = '<div class="sc-brand">web 2.0<span>Next</span></div>';

export async function renderSocialCards(page) {
  await mkdir(path.join(root, 'public/social'), { recursive: true });
  const stylesheet = await readFile(path.join(root, 'src/styles/global.css'), 'utf8');
  await page.route('https://social-card.invalid/global.css', (route) => route.fulfill({ contentType: 'text/css; charset=utf-8', body: stylesheet }));
  const outputs = [];
  for (const locale of localeCodes) {
    const t = messages(locale);
    const markdown = await readFile(path.join(root, locales[locale].resources.manifesto), 'utf8');
    const principles = [...markdown.matchAll(/^\*\*(.+?)\*\* {2}$/gm)].map((m) => m[1]);
    if (principles.length !== 5) throw new Error(`Expected five manifesto principles in ${locale}`);
    for (const kind of ['poster', 'site', 'manifesto']) {
      const poster = kind === 'poster';
      const width = poster ? 1080 : 1200, height = poster ? 1350 : 630;
      const headline = kind === 'site' ? `${t.heroLine1}\n${t.heroLine2}` : t.cardTitle;
      const main = poster
        ? `<h1>${escape(headline)}</h1><p class="sc-subtitle">${escape(t.cardSubtitle)}</p><ul class="sc-principles">${principles.map((p) => `<li>${escape(p)}</li>`).join('')}</ul>`
        : kind === 'site'
          ? `<div class="sc-main"><h1 class="sc-site-headline">${escape(headline)}</h1><p class="sc-subtitle">${escape(t.heroIntro1)}<br>${escape(t.heroIntro2)}</p><div class="sc-mini-browser"><div class="sc-browser-bar">● ● ●</div><div class="sc-browser-body"><b>${escape(t.artGreeting)}</b><p>${escape(t.artText1)}</p><div class="sc-browser-links">${escape(t.artBlog)} &nbsp; RSS &nbsp; ${escape(t.artFriends)}</div></div></div><div class="sc-agent-note">${escape(t.artAgent)}</div></div>`
          : `<h1>${escape(headline)}</h1><p class="sc-subtitle">${escape(t.cardSubtitle)}<br>${escape(t.tagline)}</p>`;
      const html = `<!doctype html><html lang="${locale}" class="social-card-document"><head><meta charset="utf-8"><link rel="stylesheet" href="https://social-card.invalid/global.css"></head><body><main class="sc-card ${poster ? 'sc-poster' : 'sc-wide'} sc-${kind}"><div class="sc-top">${brand}<span class="sc-top-note">${escape(t.tagline)}</span></div>${main}<div class="sc-bottom"><div><p class="sc-invitation-title">${escape(t.cardAction)}</p><p class="sc-invitation-note">${escape(t.cardInstruction)}</p></div><p class="sc-invitation-url">${escape(new URL(publicSite).hostname)}</p></div></main></body></html>`;
      await page.setViewportSize({ width, height });
      await page.setContent(html);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => {
        const card = document.querySelector('.sc-card');
        const clipped = [...card.querySelectorAll('h1, .sc-principles, .sc-bottom, .sc-bottom p, .sc-subtitle')].some((el) => {
          const r = el.getBoundingClientRect(); return r.bottom > innerHeight - 20 || r.right > innerWidth - 20;
        });
        const footerTop = card.querySelector('.sc-bottom').getBoundingClientRect().top;
        const overlaps = [...card.querySelectorAll('h1, .sc-principles, .sc-subtitle')].some((el) => el.getBoundingClientRect().bottom > footerTop);
        return clipped || overlaps;
      });
      if (overflow) throw new Error(`Card overflow: ${kind}/${locale}`);
      const output = path.join(root, 'public', socialImagePath(locale, kind));
      await page.screenshot({ path: output, type: 'png', scale: 'css', animations: 'disabled' });
      outputs.push(output);
    }
  }
  await page.unroute('https://social-card.invalid/global.css');
  return outputs;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch(process.env.CHROME_CHANNEL ? { channel: process.env.CHROME_CHANNEL } : {});
  try { console.log((await renderSocialCards(await browser.newPage({ deviceScaleFactor: 1 }))).join('\n')); }
  finally { await browser.close(); }
}
