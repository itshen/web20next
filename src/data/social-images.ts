import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { socialImagePath, type Locale } from '../i18n';

export function socialImageUrl(locale: Locale, kind: 'site' | 'manifesto' | 'poster'): string {
  const pathname = socialImagePath(locale, kind);
  const version = createHash('sha256').update(readFileSync(`public${pathname}`)).digest('hex').slice(0, 12);
  return `${pathname}?v=${version}`;
}
