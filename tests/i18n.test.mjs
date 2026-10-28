import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { locales, localeCodes, defaultLocale, messages, localizedPath, localePaths } from '../src/i18n/index.ts';

test('English is the default and Chinese has its own stable prefix', () => {
  assert.equal(defaultLocale, 'en');
  assert.equal(localizedPath('en'), '/');
  assert.equal(localizedPath('en', 'join'), '/join');
  assert.equal(localizedPath('zh-Hans'), '/zh');
  assert.equal(localizedPath('zh-Hans', 'join'), '/zh/join');
  assert.deepEqual(localePaths().find((path) => path.props.locale === 'zh-Hans'), { params: { locale: 'zh' }, props: { locale: 'zh-Hans' } });
  assert.equal(localePaths().length, localeCodes.length - 1);
  assert.ok(localePaths().every((path) => path.props.locale !== defaultLocale));
});

test('each locale has the same complete dictionary and unique routes', () => {
  const keys = Object.keys(messages(defaultLocale)).sort();
  const prefixes = new Set();
  for (const locale of localeCodes) {
    assert.deepEqual(Object.keys(messages(locale)).sort(), keys, locale);
    for (const value of Object.values(messages(locale))) assert.ok(value.trim().length > 0);
    for (const key of keys) {
      const placeholders = (text) => [...text.matchAll(/\{([a-zA-Z]+)\}/g)].map((match) => match[1]).sort();
      assert.deepEqual(placeholders(messages(locale)[key]), placeholders(messages(defaultLocale)[key]), `${locale}: ${key}`);
    }
    assert.ok(!prefixes.has(locales[locale].path));
    prefixes.add(locales[locale].path);
  }
});

test('reading translations preserve section structure and reference links', async () => {
  for (const topic of ['xfn', 'rss', 'web-2-0', 'llms']) {
    const structure = async (locale) => {
      const source = await readFile(new URL(`../src/content/learn/${topic}.${locale}.md`, import.meta.url), 'utf8');
      return {
        sections: [...source.matchAll(/^(#{2,6}) /gm)].map((match) => match[1].length),
        links: [...source.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((match) => match[1]).sort(),
      };
    };
    const original = await structure(defaultLocale);
    for (const locale of localeCodes) assert.deepEqual(await structure(locale), original, `${topic}: ${locale}`);
  }
});

test('the manifesto and interface use the same approved slogan', async () => {
  const approved = { 'zh-Hans': '表达自我，连接彼此。', en: 'Express yourself. Connect with others.' };
  for (const locale of localeCodes) {
    const t = messages(locale);
    const normalize = (value) => value.replace(/\s+/g, '');
    assert.equal(t.tagline, approved[locale]);
    assert.equal(normalize(t.heroLine1 + t.heroLine2), normalize(t.tagline));
    assert.equal(normalize(t.cardTitle), normalize(t.tagline));
    assert.equal(t.dsTypeSample, t.tagline);
    const manifesto = await readFile(new URL(`..${locales[locale].resources.manifesto}`, import.meta.url), 'utf8');
    assert.equal(manifesto.match(/^\*\*(.+?)\*\*$/m)?.[1], t.tagline);
  }
});

test('every locale has local contribution resources and shares the English Agent entry', async () => {
  const root = new URL('../', import.meta.url);
  const content = await readFile(new URL('docs/llms.en.txt', root), 'utf8');
  for (const locale of localeCodes) {
    assert.equal(locales[locale].resources.llms, '/llms.txt');
    for (const [name, path] of Object.entries(locales[locale].resources)) {
      if (name !== 'llms') await access(new URL(path.slice(1), root));
    }
    assert.ok(content.startsWith('# Web 2.0 Next'));
    assert.ok(content.includes(locales[locale].resources.manifesto));
    assert.ok(content.includes(locales[locale].resources.contributing));
    assert.ok(content.includes(localizedPath(locale, 'join')));
  }
});
