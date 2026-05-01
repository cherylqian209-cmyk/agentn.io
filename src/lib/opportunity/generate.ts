import Anthropic from '@anthropic-ai/sdk';
import { OpportunityReport, OpportunityScanInput } from './types';

const SYSTEM_PROMPT = `You are AgentN, an autonomous growth strategist. Your job is to analyze a business and produce a practical revenue opportunity report. Be specific, concrete, and action-oriented. Do not invent verified private contact information. If live web scraping is unavailable, generate realistic lead sources, search queries, communities, directories, and prospect categories. The user should leave with clear opportunities they can act on today. Return only valid JSON matching the requested schema.`;
const MODEL = 'claude-haiku-4-5-20251001';

export async function generateOpportunityReport(input: OpportunityScanInput): Promise<OpportunityReport> {
  if (process.env.AI_API_KEY) {
    try {
      const client = new Anthropic({ apiKey: process.env.AI_API_KEY });
      const prompt = `Input JSON:\n${JSON.stringify(input)}\nReturn JSON fields: id, createdAt, input, businessSummary, recommendedICP, channels (3), opportunities (10), outreachDrafts (5), workflowSteps (7), revenueEstimate.`;
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      });
      const text = res.content.filter(c => c.type === 'text').map(c => (c.type === 'text' ? c.text : '')).join('');
      const parsed = JSON.parse(text) as OpportunityReport;
      return normalizeReport(parsed, input);
    } catch {
      return deterministicReport(input);
    }
  }
  return deterministicReport(input);
}

function normalizeReport(report: OpportunityReport, input: OpportunityScanInput): OpportunityReport {
  return {
    ...report,
    id: report.id || crypto.randomUUID(),
    createdAt: report.createdAt || new Date().toISOString(),
    input,
    channels: (report.channels || []).slice(0, 3),
    opportunities: (report.opportunities || []).slice(0, 10),
    outreachDrafts: (report.outreachDrafts || []).slice(0, 5),
    workflowSteps: report.workflowSteps?.length ? report.workflowSteps : defaultWorkflow,
  };
}

const defaultWorkflow = ['Find matching leads', 'Enrich company/person data', 'Score fit', 'Draft personalized outreach', 'Send or queue for approval', 'Monitor replies', 'Report results'];

function deterministicReport(input: OpportunityScanInput): OpportunityReport {
  const base = input.companyName || input.websiteUrl || 'Your business';
  const audience = input.targetCustomer || 'teams with active growth goals';
  const channels = (input.preferredChannels?.length ? input.preferredChannels : ['email', 'linkedin', 'content']).slice(0, 3);
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    input,
    businessSummary: `${base} appears to offer ${input.offerDescription}. The best-fit buyer is ${audience}. Main pain is inconsistent ${input.primaryGoal} and need for predictable pipeline.`,
    recommendedICP: {
      segmentName: audience,
      painPoint: `Low and inconsistent ${input.primaryGoal}`,
      buyingTrigger: 'Recent hiring, funding, or missed growth target',
      willingnessToPay: input.pricePoint || 'Medium willingness when ROI is clear',
      whyNow: 'Channels are noisier, so faster testing and personalized outreach matter more.'
    },
    channels: channels.map((name, i) => ({ id: `ch-${i+1}`, name, whyItFits: `${name} aligns with ${input.primaryGoal} and buyer behavior.`, difficulty: i===0?'low':'medium', expectedUpside: i===0?'high':'medium', firstAction: `Launch one tightly scoped ${name} campaign with a single offer.` })),
    opportunities: Array.from({ length: 10 }).map((_, i) => ({ id: `opp-${i+1}`, name: `${input.primaryGoal} search target ${i+1} for ${base}`, type: i % 5 === 0 ? 'directory' : i % 4 === 0 ? 'community' : i % 3 === 0 ? 'person' : i % 2 === 0 ? 'company' : 'search_query', whyRelevant: `Likely active buyers matching ${audience}.`, suggestedAngle: `Reference ${input.offerDescription} outcome and propose a fast test.`, confidenceScore: 62 + i * 3, sourceHint: 'Sample opportunity (not a verified contact). Use web search + enrichment.' })),
    outreachDrafts: Array.from({ length: 5 }).map((_, i) => ({ id: `d-${i+1}`, subject: `${base}: quick idea to improve ${input.primaryGoal}`, body: `Hi {{name}},\n\nNoticed your team is focused on ${input.primaryGoal}. We help ${audience} with ${input.offerDescription}.\n\nWould a 15-minute teardown be useful?`, personalizationAngle: `Mention their current growth motion and one channel win.`, callToAction: 'Open to a short call next week?' })),
    workflowSteps: defaultWorkflow,
    revenueEstimate: { conservative: '$1k-$3k/mo', moderate: '$4k-$12k/mo', upside: '$15k+/mo', assumptions: ['10 opportunities contacted weekly', '3-8% positive reply rate', 'Offer matches pain urgency'] }
  }
}
