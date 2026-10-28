import type { APIRoute } from 'astro';
import { agentEntryResponse } from '../data/agent-entries';

export const GET: APIRoute = () => agentEntryResponse();
