import { NextRequest, NextResponse } from 'next/server';
import { generateOpportunityReport } from '@/lib/opportunity/generate';
import { OpportunityScanInput } from '@/lib/opportunity/types';

export async function POST(req: NextRequest) {
  try {
    const input = await req.json() as OpportunityScanInput;
    if (!input.offerDescription || !input.primaryGoal || (!input.websiteUrl && !input.businessDescription)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const report = await generateOpportunityReport(input);
    return NextResponse.json(report);
  } catch {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
