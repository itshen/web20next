import content from '../../docs/llms.en.txt?raw';

export function agentEntryResponse(): Response {
  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
