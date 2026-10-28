import { locales, type Locale } from '../i18n';
import { siteRecords } from './sites';
import { createFeed } from '../lib/feed';

const documents = import.meta.glob<{ compiledContent: () => Promise<string> }>('../../docs/manifesto.*.md');

export async function feedResponse(locale: Locale, site: URL | undefined): Promise<Response> {
  if (!site) throw new Error('An Astro site URL is required to generate RSS.');
  const load = documents[`../..${locales[locale].resources.manifesto}`];
  if (!load) throw new Error(`Missing manifesto for ${locale}`);
  const document = await load();
  const body = await createFeed(locale, site, await document.compiledContent(), siteRecords);
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
