import { isPublicDomain } from './public-domain.ts';

export const publicSite = 'https://web20next.com';

export function publicUrl(path: string): string {
  const url = new URL(path, publicSite);
  return `${url.origin}${url.pathname.replace(/\/+$/, '')}${url.search}${url.hash}`;
}

export function resolveSiteUrl(value?: string, requirePublic = false): URL {
  const url = new URL(value || publicSite);
  const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(hostname);
  if (
    url.username || url.password || url.search || url.hash || url.pathname !== '/' ||
    (url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) ||
    (requirePublic && !isPublicDomain(url.hostname))
  ) throw new Error('SITE_URL must be a public HTTPS domain origin without credentials, a path, query, or fragment. Local HTTP is allowed for previews only.');
  return url;
}
