import type { APIRoute } from 'astro';
import { defaultLocale } from '../i18n';
import { feedResponse } from '../data/feeds';

export const GET: APIRoute = ({ site }) => feedResponse(defaultLocale, site);
