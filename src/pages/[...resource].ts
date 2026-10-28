import type { APIRoute } from 'astro';
import { localeCodes, locales } from '../i18n';
const documents = import.meta.glob<string>([
  '../../LICENSE', '../../LICENSE-CONTENT', '../../docs/*.md', '../../CONTRIBUTING*.md', '../../.github/**/*.md', '../../examples/*.json', '../../schemas/*.json',
], { query: '?raw', import: 'default', eager: true, exhaustive: true });
export function getStaticPaths() {
  const paths = new Set<string>(['/schemas/site.schema.json', '/docs/i18n.md', '/docs/licensing.en.md', '/docs/licensing.md', '/LICENSE', '/LICENSE-CONTENT']);
  for (const code of localeCodes) {
    for (const [name, path] of Object.entries(locales[code].resources)) {
      if (name !== 'llms') paths.add(path);
    }
  }
  return [...paths].map((resource) => {
    const content = documents[`../..${resource}`];
    if (!content) throw new Error(`Missing localized resource: ${resource}`);
    return { params: { resource: resource.slice(1) }, props: { content } };
  });
}
export const GET: APIRoute = ({ props, params }) => new Response(props.content, { headers: { 'Content-Type': params.resource?.endsWith('.json') ? 'application/json; charset=utf-8' : params.resource?.startsWith('LICENSE') ? 'text/plain; charset=utf-8' : 'text/markdown; charset=utf-8' } });
