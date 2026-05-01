import { NextRequest, NextResponse } from 'next/server'
import { fetchPage } from '@/lib/web/fetchPage'
import type { ExtractionMode, WebFetchRequest } from '@/lib/web/types'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as WebFetchRequest
  const { urls, extractionMode = 'readable_text' } = body

  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: 'urls[] is required' }, { status: 400 })
  }

  const sanitizedUrls = [...new Set(urls.map(u => u.trim()).filter(Boolean))].slice(0, 20)
  const mode = extractionMode as ExtractionMode
  const results = await Promise.all(sanitizedUrls.map(url => fetchPage(url, mode)))

  return NextResponse.json({
    ok: true,
    mode,
    total: sanitizedUrls.length,
    successCount: results.filter(r => r.ok).length,
    results,
  })
}
