import { getRssString, type RSSFeedItem } from '@astrojs/rss';
import { messages, localizedPath, feedPath, type Locale } from '../i18n/index.ts';
import type { Website } from './directory.ts';

export interface FeedRecord { id: string; website: Website }

function xml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function createFeed(locale: Locale, site: URL, manifestoHtml: string, records: FeedRecord[]): Promise<string> {
  const t = messages(locale);
  const items: RSSFeedItem[] = records.map(({ id, website }) => ({
    title: website.name,
    description: xml(website.description),
    link: website.url,
    categories: website.tags,
    customData: `<guid isPermaLink="false">urn:web20next:website:${xml(id)}</guid>`,
  }));
  items.push({
    title: `Web 2.0 Next — ${t.manifesto}`,
    description: t.tagline,
    link: new URL(localizedPath(locale, 'manifesto'), site).href,
    content: manifestoHtml,
    customData: `<guid isPermaLink="false">urn:web20next:manifesto:${xml(locale)}</guid>`,
  });
  // RSS publication dates are optional. Do not substitute a build date for a publication date.
  return getRssString({
    title: t.rssTitle,
    description: t.rssDescription,
    site: new URL(localizedPath(locale), site),
    items,
    trailingSlash: false,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>${xml(locale)}</language><atom:link href="${xml(new URL(feedPath(locale), site).href)}" rel="self" type="application/rss+xml" />`,
  });
}
