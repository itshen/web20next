import test from 'node:test';
import assert from 'node:assert/strict';
import { publicSite, publicUrl, resolveSiteUrl } from '../src/lib/site-url.ts';

test('public links omit trailing slashes, including the homepage', () => {
  assert.equal(publicSite, 'https://web20next.com');
  for (const path of ['', '/', '/manifesto/', '/zh/', '/zh/manifesto///']) {
    assert.ok(!publicUrl(path).endsWith('/'), path);
  }
  assert.equal(publicUrl('/'), publicSite);
  assert.equal(publicUrl('/zh/'), `${publicSite}/zh`);
});

test('URL formatting preserves queries, anchors, and asset versions', () => {
  assert.equal(publicUrl('/manifesto/?source=link#share'), `${publicSite}/manifesto?source=link#share`);
  assert.equal(publicUrl('/?next=/join/#directory'), `${publicSite}?next=/join/#directory`);
  assert.equal(publicUrl('/social/site-en.png?v=abc123'), `${publicSite}/social/site-en.png?v=abc123`);
});

test('deployment rejects local, private, reserved and malformed hostnames', () => {
  for (const host of ['localhost.', '127.0.0.2', '192.168.1.5', '[::1]', '[fd00::1]', 'web.test', 'example.com.', 'device.local', 'router.home.arpa', 'service.internal', 'web..com', 'author.github.io..', 'author.github.io...', '-web.com']) {
    assert.throws(() => resolveSiteUrl(`https://${host}`, true), host);
  }
  assert.equal(resolveSiteUrl('http://localhost.:4322').port, '4322');
  assert.equal(resolveSiteUrl('https://author.github.io', true).hostname, 'author.github.io');
});
