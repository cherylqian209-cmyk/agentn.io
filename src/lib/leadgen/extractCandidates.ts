import { LeadGenICP } from './types';

type Candidate = {
  companyName: string;
  website?: string;
  email?: string;
  socialUrl?: string;
  sourceUrl: string;
  sourceTitle?: string;
  evidenceSnippet: string;
};

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const DOMAIN_RE = /https?:\/\/([a-z0-9-]+\.)+[a-z]{2,}/gi;

export function extractCandidates(html: string, sourceUrl: string, icp: LeadGenICP): Candidate[] {
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const emails = [...new Set(text.match(EMAIL_RE) ?? [])].slice(0, 10);
  const domains = [...new Set((text.match(DOMAIN_RE) ?? []).map(v => v.toLowerCase()))].slice(0, 30);
  const snippets = text.split('.').filter(s => s.toLowerCase().includes(icp.targetCustomer.toLowerCase().split(' ')[0] ?? '')).slice(0, 10);

  return domains.map((domain, idx) => {
    const clean = new URL(domain).hostname.replace('www.', '').split('.')[0];
    return {
      companyName: clean.charAt(0).toUpperCase() + clean.slice(1),
      website: domain,
      email: emails[idx],
      sourceUrl,
      evidenceSnippet: snippets[idx] ?? text.slice(0, 180),
    };
  });
}
