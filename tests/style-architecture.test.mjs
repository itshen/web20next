import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
async function authoredFiles() {
  const result = [];
  for (const directory of ['src', 'scripts', 'public']) {
    for (const name of await readdir(path.join(root, directory), { recursive: true })) {
      if (/\.(?:astro|html|svg|[cm]?js|ts|css)$/.test(name)) result.push(`${directory}/${name}`);
    }
  }
  return result;
}

test('authored styles have one global CSS source', async () => {
  const files = await authoredFiles();
  assert.deepEqual(files.filter((file) => file.endsWith('.css')), ['src/styles/global.css']);
  for (const file of files.filter((file) => !file.endsWith('.css'))) {
    const content = await readFile(path.join(root, file), 'utf8');
    assert.doesNotMatch(content, /<style\b|\bstyle\s*=/i, file);
    assert.doesNotMatch(content, /\.style\.(?:setProperty|cssText)|\.style\[/, file);
  }
});
