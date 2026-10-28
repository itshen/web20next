import test from 'node:test';
import assert from 'node:assert/strict';
import { validateWebsiteFiles } from '../src/lib/directory.ts';

const website = { name: '测试网站', url: 'https://author.github.io/', description: '用于校验的测试资料，不是真实收录。' };
const entry = (data = website, filename = 'author.json') => ({ filename, data });

test('accepts empty directories, minimal entries and optional fields', () => {
  assert.deepEqual(validateWebsiteFiles([]), []);
  assert.deepEqual(validateWebsiteFiles([entry()]), [website]);
  assert.equal(validateWebsiteFiles([entry({ ...website, url: 'https://10.author.github.io' })]).length, 1);
  assert.equal(validateWebsiteFiles([entry({ ...website, author: '作者', tags: ['写作'], rss: 'https://author.github.io/feed.xml', works: [{ title: '作品', url: 'https://author.github.io/work' }] })]).length, 1);
});
test('rejects missing, unknown and empty fields', () => {
  for (const data of [{ name: '无网址' }, { ...website, email: 'private' }, { ...website, name: ' ' }]) {
    assert.throws(() => validateWebsiteFiles([entry(data)]));
  }
});
test('rejects executable, credentialed, example and local URLs', () => {
  for (const url of ['javascript:alert(1)', 'https://user:secret@author.github.io', 'https://your-site.example', 'https://example.com', 'https://example.com.', 'https://your-site.example.', 'http://localhost.', 'https://device.local.', 'https://router.home.arpa', 'https://service.internal', 'https://author..com', 'https://author.github.io..', 'https://author.github.io...', 'https://-author.com', 'http://localhost', 'http://127.0.0.1', 'http://192.168.1.3']) {
    assert.throws(() => validateWebsiteFiles([entry({ ...website, url })]));
  }
});
test('validates RSS and work URLs as well', () => {
  assert.throws(() => validateWebsiteFiles([entry({ ...website, rss: 'javascript:alert(1)' })]));
  assert.throws(() => validateWebsiteFiles([entry({ ...website, works: [{ title: '作品', url: 'https://your-site.example' }] })]));
});
test('detects duplicates across host case, protocol, DNS root dot and final slash', () => {
  assert.throws(() => validateWebsiteFiles([entry(), entry({ ...website, url: 'http://AUTHOR.github.io' }, 'another.json')]), /already exists/);
  assert.throws(() => validateWebsiteFiles([entry(), entry({ ...website, url: 'https://author.github.io/#about' }, 'another.json')]), /already exists/);
  assert.throws(() => validateWebsiteFiles([entry(), entry({ ...website, url: 'https://author.github.io.' }, 'another.json')]), /already exists/);
});
test('rejects invalid filenames and duplicate tags', () => {
  assert.throws(() => validateWebsiteFiles([entry(website, '../author.json')]));
  assert.throws(() => validateWebsiteFiles([entry({ ...website, tags: ['写作', '写作'] })]));
});

test('rejects text that cannot be represented in XML across all entry text fields', () => {
  for (const char of ['\u0000', '\u0001', '\u0008', '\u000B', '\u000C', '\u001F', '\uD800', '\uDFFF', '\uFFFE', '\uFFFF']) {
    const text = `Before${char}after`;
    for (const change of [{ name: text }, { description: text }, { author: text }, { tags: [text] }, { works: [{ title: text, url: website.url }] }]) {
      assert.throws(() => validateWebsiteFiles([entry({ ...website, ...change })]));
    }
  }
});

test('preserves multilingual text, emoji, accents and ordinary whitespace', () => {
  const text = '中文 🌐 café e\u0301\t日本語\nالعربية\r\n𠮷';
  const data = { ...website, name: '中文 🌐', description: text, author: '𠮷', tags: ['🌱'], works: [{ title: '日本語', url: website.url }] };
  assert.deepEqual(validateWebsiteFiles([entry(data)]), [data]);
});
