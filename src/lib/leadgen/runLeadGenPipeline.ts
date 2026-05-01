import crypto from 'crypto';
import { buildICP } from './buildICP';
import { discoverSources } from './discoverSources';
import { extractCandidates } from './extractCandidates';
import { enrichLead } from './enrichLead';
import { generateOutreach } from './generateOutreach';
import { scoreLead } from './scoreLead';
import { LeadArtifact, LeadGenICP, LeadProof, LeadRecord } from './types';

const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254'];

function safeUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    if (blockedHosts.includes(url.hostname)) return false;
    if (/^(10\.|172\.(1[6-9]|2\d|3[0-1])\.|192\.168\.)/.test(url.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

async function fetchHtml(url: string): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'follow' });
    const text = await res.text();
    return text.slice(0, 500_000);
  } finally {
    clearTimeout(timer);
  }
}

export async function runLeadGenPipeline(input: Partial<LeadGenICP>, hasSearchKey: boolean) {
  const icp = buildICP(input);
  const discovered = await discoverSources(icp, hasSearchKey);
  const validSources = discovered.filter(safeUrl).slice(0, 10);
  const sampleMode = validSources.length === 0;

  const leads: LeadRecord[] = [];
  let successfulFetchCount = 0;
  let failedFetchCount = 0;

  if (sampleMode) {
    leads.push({
      id: crypto.randomUUID(),
      companyName: 'Sample SaaS Co',
      website: 'https://example.com',
      sourceUrl: 'sample://no-source-mode',
      sourceTitle: 'Sample mode artifact',
      evidenceSnippet: 'Sample lead generated because no public sources or search key were provided.',
      buyingSignals: ['sample-mode'],
      fitScore: 58,
      scoreGrade: 'B',
      suggestedAngle: 'Sample mode - add URLs for live web-backed lead generation.',
      personalizedOpener: 'Hi team — this is sample mode output. Add public source URLs for real leads.',
      confidence: 0.4,
      extractedAt: new Date().toISOString(),
    });
  } else {
    for (const source of validSources) {
      try {
        const html = await fetchHtml(source);
        successfulFetchCount++;
        const candidates = extractCandidates(html, source, icp);
        for (const c of candidates) {
          let lead: LeadRecord = {
            id: crypto.randomUUID(),
            companyName: c.companyName,
            website: c.website,
            email: c.email,
            socialUrl: c.socialUrl,
            sourceUrl: c.sourceUrl,
            sourceTitle: c.sourceTitle,
            evidenceSnippet: c.evidenceSnippet,
            buyingSignals: [],
            fitScore: 0,
            scoreGrade: 'Reject',
            suggestedAngle: '',
            personalizedOpener: '',
            confidence: 0.3,
            extractedAt: new Date().toISOString(),
          };
          lead = await enrichLead(lead, icp);
          lead = scoreLead(lead, icp);
          lead = generateOutreach(lead, icp);
          leads.push(lead);
          if (leads.length >= icp.desiredCount) break;
        }
      } catch {
        failedFetchCount++;
      }
      if (leads.length >= icp.desiredCount) break;
    }
  }

  const qualified = leads.filter(l => l.scoreGrade !== 'Reject');
  const artifact: LeadArtifact = {
    type: 'lead_generation',
    icp,
    leads,
    summary: {
      requested: icp.desiredCount,
      found: leads.length,
      qualified: qualified.length,
      averageFitScore: leads.length ? Number((leads.reduce((a, b) => a + b.fitScore, 0) / leads.length).toFixed(1)) : 0,
      sourcesUsed: validSources.length,
    },
  };
  const proof: LeadProof = {
    sourceUrls: validSources,
    successfulFetchCount,
    failedFetchCount,
    leadsFound: leads.length,
    qualifiedLeads: qualified.length,
    validationChecks: ['safe-url-validation', 'dedupe', 'scoring-rubric', 'source-evidence-attached', sampleMode ? 'sample-mode-labeled' : 'live-mode'],
    proofHash: crypto.createHash('sha256').update(JSON.stringify(artifact)).digest('hex').slice(0, 24),
    sampleMode,
  };
  return { artifact, proof };
}
