import zh from './locales/zh-CN.ts';
import en from './locales/en.ts';

export const defaultLocale = 'en';
export const locales = {
  'zh-CN': {
    label: '中文', socialLocale: 'zh_CN', path: 'zh', messages: zh,
    resources: {
      manifesto: '/docs/manifesto.zh-CN.md', contributing: '/CONTRIBUTING.zh-CN.md',
      agent: '/docs/agent-guide.md', template: '/.github/PULL_REQUEST_TEMPLATE/site.zh-CN.md',
      example: '/examples/site.example.json', llms: '/llms.txt',
    },
  },
  en: {
    label: 'English', socialLocale: 'en_US', path: '', messages: en,
    resources: {
      manifesto: '/docs/manifesto.en.md', contributing: '/CONTRIBUTING.md',
      agent: '/docs/agent-guide.en.md', template: '/.github/pull_request_template.md',
      example: '/examples/site.en.example.json', llms: '/llms.txt',
    },
  },
} as const;

export type Locale = keyof typeof locales;
export type Page = 'home' | 'join' | 'subscribe' | 'manifesto' | 'design-system' | 'websites' | 'how-it-works' | 'xfn' | 'rss' | 'web-2-0' | 'llms';
export type Messages = Record<keyof typeof zh, string>;
export const localeCodes = Object.keys(locales) as Locale[];

export function messages(locale: Locale): Messages { return locales[locale].messages; }

export function localizedPath(locale: Locale, page: Page = 'home'): string {
  const prefix = locales[locale].path ? `/${locales[locale].path}` : '';
  return page === 'home' ? prefix || '/' : `${prefix}/${page}`;
}

export function feedPath(locale: Locale): string {
  return `${locales[locale].path ? `/${locales[locale].path}` : ''}/rss.xml`;
}

export function localePaths() {
  return localeCodes.filter((locale) => locale !== defaultLocale).map((locale) => ({
    params: { locale: locales[locale].path }, props: { locale },
  }));
}

export function socialImagePath(locale: Locale, kind: 'site' | 'manifesto' | 'poster'): string {
  return `/social/${kind}-${locale}.png`;
}
