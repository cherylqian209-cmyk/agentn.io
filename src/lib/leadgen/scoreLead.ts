import { LeadGenICP, LeadRecord } from './types';

export function scoreLead(lead: LeadRecord, icp: LeadGenICP): LeadRecord {
  const evidence = lead.evidenceSnippet.toLowerCase();
  const icpTokens = [icp.targetCustomer, icp.industry, icp.companySize, icp.geography].filter(Boolean).join(' ').toLowerCase().split(/\s+/).filter(Boolean);
  const icpHits = icpTokens.filter(t => evidence.includes(t)).length;
  const icpScore = Math.min(40, icpHits * 8);
  const signalHits = icp.buyingSignals.filter(s => evidence.includes(s.toLowerCase()) || lead.buyingSignals.includes(s)).length;
  const signalScore = Math.min(25, signalHits * 8 + (signalHits > 0 ? 5 : 0));
  const contactScore = lead.email || evidence.includes('contact') ? 20 : 0;
  const recentScore = /202[4-6]|recent|launch|hiring/.test(evidence) ? 10 : 4;
  const cleanScore = lead.sourceUrl.startsWith('http') && lead.evidenceSnippet.length > 24 ? 5 : 0;
  const fitScore = Math.min(100, icpScore + signalScore + contactScore + recentScore + cleanScore);
  const scoreGrade = fitScore >= 85 ? 'A+' : fitScore >= 70 ? 'A' : fitScore >= 50 ? 'B' : 'Reject';
  return { ...lead, fitScore, scoreGrade };
}
