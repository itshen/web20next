import type { APIRoute } from 'astro';
import { localePaths } from '../../i18n';
import { feedResponse } from '../../data/feeds';

export const getStaticPaths = localePaths;
export const GET: APIRoute = ({ site, props }) => feedResponse(props.locale, site);
