import { LeadGenICP, LeadRecord } from './types';

export async function enrichLead(base: LeadRecord, icp: LeadGenICP): Promise<LeadRecord> {
  const signal = icp.buyingSignals.find(s => base.evidenceSnippet.toLowerCase().includes(s.toLowerCase()));
  const role = icp.targetCustomer.toLowerCase().includes('founder') ? 'Founder' : 'Decision maker';
  return {
    ...base,
    role,
    buyingSignals: signal ? [signal] : [],
    confidence: Math.min(0.95, 0.5 + (signal ? 0.2 : 0) + (base.email ? 0.2 : 0)),
  };
}
