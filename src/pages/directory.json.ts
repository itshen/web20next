import { sites } from '../data/sites';

export function GET() {
  return new Response(JSON.stringify(sites, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
