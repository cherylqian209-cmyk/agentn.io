import { NextRequest, NextResponse } from 'next/server';
import { runLeadGenPipeline } from '@/lib/leadgen/runLeadGenPipeline';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const hasSearchKey = Boolean(process.env.SEARCH_API_KEY);
  const result = await runLeadGenPipeline(body?.icp ?? {}, hasSearchKey);
  return NextResponse.json(result);
}
