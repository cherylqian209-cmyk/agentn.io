import { LeadGenICP, LeadRecord } from './types';

export function generateOutreach(lead: LeadRecord, icp: LeadGenICP): LeadRecord {
  const primarySignal = lead.buyingSignals[0] ?? 'your latest growth initiatives';
  const suggestedAngle = `Help ${lead.companyName} accelerate ${primarySignal} using ${icp.productDescription}.`;
  const personalizedOpener = `Hi ${lead.contactName ?? 'team'} — noticed ${primarySignal} at ${lead.companyName}. We help ${icp.targetCustomer} with ${icp.productDescription}. Worth a quick intro?`;
  return { ...lead, suggestedAngle, personalizedOpener };
}
