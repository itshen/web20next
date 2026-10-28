import { localePaths } from '../../i18n';
import type { APIRoute } from 'astro';
import { agentEntryResponse } from '../../data/agent-entries';

export const getStaticPaths = localePaths;
export const GET: APIRoute = () => agentEntryResponse();
