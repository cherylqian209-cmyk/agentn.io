import { getRequestPlan, enforceLimit, paywallError } from '@/lib/billing/serverPaywall';
import { NextRequest, NextResponse } from 'next/server';
import { runLeadGenPipeline } from '@/lib/leadgen/runLeadGenPipeline';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const plan = getRequestPlan(req);
  const scansThisMonth = Number(req.headers.get('x-agentn-scans-this-month') ?? 0);
  if (!enforceLimit(plan, 'scansPerMonth', scansThisMonth)) return paywallError('revealLeads');
  const hasSearchKey = Boolean(process.env.SEARCH_API_KEY);
  const result = await runLeadGenPipeline(body?.icp ?? {}, hasSearchKey);
  return NextResponse.json(result);
}
