import { LeadGenICP } from './types';

export function buildICP(input: Partial<LeadGenICP>): LeadGenICP {
  const sourceUrls = (input.sourceUrls ?? []).slice(0, 10);
  return {
    productDescription: input.productDescription?.trim() ?? '',
    targetCustomer: input.targetCustomer?.trim() ?? '',
    industry: input.industry?.trim(),
    geography: input.geography?.trim(),
    companySize: input.companySize?.trim(),
    buyingSignals: (input.buyingSignals ?? []).map(v => v.trim()).filter(Boolean),
    exclusions: (input.exclusions ?? []).map(v => v.trim()).filter(Boolean),
    desiredCount: Math.max(1, Math.min(100, input.desiredCount ?? 25)),
    sourceUrls,
    recurrence: input.recurrence ?? 'one-time',
  };
}
