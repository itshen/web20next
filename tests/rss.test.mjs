import test from 'node:test';
import assert from 'node:assert/strict';
import { XMLParser } from 'fast-xml-parser';
import { SyntaxValidator } from 'fast-xml-validator';
import { createFeed } from '../src/lib/feed.ts';
import { resolveSiteUrl } from '../src/lib/site-url.ts';

const origin = new URL('https://web.test/');
const parser = new XMLParser({ ignoreAttributes: false });
const records = [{ id: 'owner-site', website: { name: 'Alice & Bob', url: 'https://owner.test/work?x=1&y=2', description: '<img src=x onerror=alert(1)> & writing', tags: ['Art & code'] } }];

test('RSS is valid XML with one manifesto item when the directory is empty', async () => {
  const xml = await createFeed('en', origin, '<h1>Manifesto</h1><p>Open connections.</p>', []);
  assert.equal(SyntaxValidator.validate(xml), true);
  const { channel } = parser.parse(xml).rss;
  assert.equal(channel.language, 'en');
  assert.equal(channel['atom:link']['@_href'], 'https://web.test/rss.xml');
  assert.equal(channel.item.guid['#text'], 'urn:web20next:manifesto:en');
  assert.ok(channel.item['content:encoded'].includes('<p>Open connections.</p>'));
  assert.equal(channel.lastBuildDate, undefined);
  assert.equal(channel.item.pubDate, undefined);
});

test('website items preserve URLs and escape plain-text descriptions', async () => {
  const xml = await createFeed('en', origin, '<p>Manifesto</p>', records);
  assert.equal(SyntaxValidator.validate(xml), true);
  const item = parser.parse(xml).rss.channel.item[0];
  assert.equal(item.title, 'Alice & Bob');
  assert.equal(item.link, records[0].website.url);
  assert.ok(item.description.includes('&lt;img'));
  assert.ok(!item.description.includes('<img'));
  assert.equal(item.guid['#text'], 'urn:web20next:website:owner-site');
  assert.equal(String(item.guid['@_isPermaLink']), 'false');
  assert.equal(item.category, 'Art & code');
});

test('identifiers stay stable across edits and repeated builds', async () => {
  const first = await createFeed('en', origin, '<p>Manifesto</p>', records);
  assert.equal(first, await createFeed('en', origin, '<p>Manifesto</p>', records));
  const changed = await createFeed('en', origin, '<p>Updated manifesto</p>', [{ ...records[0], website: { ...records[0].website, description: 'Updated description', url: 'https://owner.test/new' } }]);
  assert.deepEqual(parser.parse(first).rss.channel.item.map((item) => item.guid), parser.parse(changed).rss.channel.item.map((item) => item.guid));
});

test('Chinese feed localizes channel and manifesto without translating owner text', async () => {
  const { channel } = parser.parse(await createFeed('zh-Hans', origin, '<p>中文宣言</p>', records)).rss;
  assert.equal(channel.language, 'zh-Hans');
  assert.equal(channel.link, 'https://web.test/zh');
  assert.equal(channel['atom:link']['@_href'], 'https://web.test/zh/rss.xml');
  assert.equal(channel.item[0].title, 'Alice & Bob');
  assert.equal(channel.item[1].link, 'https://web.test/zh/manifesto');
});

test('deployment requires a public origin while local preview remains usable', () => {
  assert.equal(resolveSiteUrl().origin, 'https://web20next.com');
  assert.equal(resolveSiteUrl('http://127.0.0.1:4322').origin, 'http://127.0.0.1:4322');
  assert.equal(resolveSiteUrl(undefined, true).href, 'https://web20next.com/');
  assert.throws(() => resolveSiteUrl('http://127.0.0.1:4322', true));
  assert.throws(() => resolveSiteUrl('https://user:secret@site.test/'));
  assert.throws(() => resolveSiteUrl('https://site.test/subpath/'));
  assert.equal(resolveSiteUrl('https://web20next.com', true).href, 'https://web20next.com/');
});
