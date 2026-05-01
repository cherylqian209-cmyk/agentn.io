import { LeadGenICP } from './types';

export async function discoverSources(icp: LeadGenICP, hasSearchKey: boolean): Promise<string[]> {
  if (icp.sourceUrls.length > 0) return icp.sourceUrls;
  if (!hasSearchKey) return [];
  return [
    `https://www.google.com/search?q=${encodeURIComponent(`${icp.targetCustomer} ${icp.industry ?? ''} directory`)}`,
    `https://www.google.com/search?q=${encodeURIComponent(`${icp.targetCustomer} ${icp.geography ?? ''} startups`)}`,
  ];
}
