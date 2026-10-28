import { validateWebsiteFiles } from '../lib/directory';

const files = import.meta.glob('/sites/*.json', { eager: true, import: 'default' });
const entries = Object.entries(files).sort(([a], [b]) => a.localeCompare(b)).map(([path, data]) => ({
    filename: path.split('/').pop()!, data,
  }));
export const sites = validateWebsiteFiles(entries);
export const siteRecords = sites.map((website, index) => ({
  id: entries[index]!.filename.replace(/\.json$/, ''), website,
}));

// Homepage selection is independent of the full directory and RSS order.
const homepageSiteIds = ['qiaomu', 'guizang', 'orangesai', 'yangpan', 'xiaohu', 'laoyao'];
export const homepageSites = homepageSiteIds.flatMap((id) => {
  const record = siteRecords.find((record) => record.id === id);
  return record ? [record.website] : [];
});
