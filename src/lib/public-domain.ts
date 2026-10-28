import { isIP } from 'node:net';

// Checks domain syntax and known non-public names, not DNS or ownership.
export function isPublicDomain(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, '');
  const labels = host.split('.');
  return host.length <= 253 && labels.length > 1 && isIP(host) === 0 &&
    labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)) &&
    !/\.(example|test|invalid|localhost|local|internal)$/.test(host) &&
    !/(^|\.)example\.(com|org|net)$/.test(host) &&
    !/(^|\.)home\.arpa$/.test(host);
}
