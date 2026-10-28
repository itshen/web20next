import stylesheet from '../styles/global.css?raw';

// Labels on the reference page are read from the same tokens that style the site.
export function tokenValue(name: string): string {
  const value = stylesheet.match(new RegExp(`${name}\\s*:\\s*([^;]+);`))?.[1]?.trim();
  if (!value) throw new Error(`Missing design token: ${name}`);
  return value;
}

export const palette = [
  { name: 'paper', label: 'dsPaper', token: '--paper' },
  { name: 'blue', label: 'dsBlue', token: '--blue' },
  { name: 'ink', label: 'dsInk', token: '--ink' },
  { name: 'sky', label: 'dsSky', token: '--sky' },
  { name: 'green', label: 'dsGreen', token: '--green' },
  { name: 'muted', label: 'dsMuted', token: '--muted' },
  { name: 'line', label: 'dsLine', token: '--line' },
  { name: 'white', label: 'dsWhite', token: '--white' },
  { name: 'rss', label: 'dsRss', token: '--rss' },
] as const;
export const spaces = [1, 2, 3, 4, 6, 8, 12, 16] as const;
export const typeScale = [
  { name: 'display', label: 'dsDisplay', token: '--text-display' },
  { name: 'heading', label: 'dsHeading', token: '--text-heading' },
  { name: 'lead', label: 'dsLead', token: '--text-lead' },
  { name: 'body', label: 'dsBody', token: '--text-body' },
  { name: 'small', label: 'dsSmall', token: '--text-small' },
  { name: 'caption', label: 'dsCaption', token: '--text-caption' },
] as const;
export const radii = ['small', 'input', 'button', 'panel', 'pill'] as const;
