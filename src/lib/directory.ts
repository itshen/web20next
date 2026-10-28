import { Ajv2020 } from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { isPublicDomain } from './public-domain.ts';
import schema from '../../schemas/site.schema.json' with { type: 'json' };

export interface Website {
  $schema?: string;
  name: string;
  url: string;
  description: string;
  author?: string;
  tags?: string[];
  rss?: string;
  works?: { title: string; url: string }[];
}

export interface WebsiteFile { filename: string; data: unknown }

const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile<Website>(schema);

function normalizeUrl(value: string): string {
  const url = new URL(value);
  const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
  if (url.username || url.password) throw new Error('URLs must not contain a username or password');
  if (!isPublicDomain(url.hostname)) throw new Error('Use a public website domain; example, private, and local addresses are not allowed');
  // Protocol, a final slash, and page anchors do not create a new website.
  url.hostname = hostname;
  return `${url.host}${url.pathname.replace(/\/$/, '')}${url.search}`;
}

export function validateWebsiteFiles(files: WebsiteFile[]): Website[] {
  const urls = new Map<string, string>();
  const names = new Set<string>();
  return files.map(({ filename, data }) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.json$/.test(filename) || names.has(filename)) {
      throw new Error(`${filename}: Filenames must be unique and use lowercase letters, digits, and hyphens, with a .json extension`);
    }
    names.add(filename);
    if (!validate(data)) throw new Error(`${filename}: ${ajv.errorsText(validate.errors)}`);
    try {
      const normalized = normalizeUrl(data.url);
      if (urls.has(normalized)) throw new Error(`Website already exists in ${urls.get(normalized)}`);
      urls.set(normalized, filename);
      if (data.rss) normalizeUrl(data.rss);
      for (const work of data.works ?? []) normalizeUrl(work.url);
    } catch (error) {
      throw new Error(`${filename}: ${error instanceof Error ? error.message : String(error)}`);
    }
    return data;
  });
}
