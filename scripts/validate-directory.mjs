import { readdir, readFile } from 'node:fs/promises';
import { validateWebsiteFiles } from '../src/lib/directory.ts';

try {
  const directory = new URL('../sites/', import.meta.url);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === '.gitkeep') continue;
    if (!entry.isFile() || !entry.name.endsWith('.json')) {
      throw new Error(`sites/${entry.name}: The directory accepts only JSON files directly inside sites/`);
    }
    files.push({ filename: entry.name, data: JSON.parse(await readFile(new URL(entry.name, directory), 'utf8')) });
  }
  validateWebsiteFiles(files);
  console.log(`Directory validation passed: ${files.length} websites.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
