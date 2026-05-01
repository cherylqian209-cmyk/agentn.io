import { NextRequest, NextResponse } from 'next/server'
import { fetchPage } from '@/lib/web/fetchPage'
import type { ExtractionMode, SearchProviderResult, WebFetchRequest } from '@/lib/web/types'

export const dynamic = 'force-dynamic'

async function searchWeb(query: string): Promise<SearchProviderResult> {
  const serpApiKey = process.env.SERPAPI_KEY
  if (!serpApiKey) {
    return { provider: 'none', query, urls: [], fallbackRequired: true }
  }

  const url = new URL('https://serpapi.com/search.json')
  url.searchParams.set('q', query)
  url.searchParams.set('api_key', serpApiKey)
  url.searchParams.set('engine', 'google')

  try {
    const response = await fetch(url.toString())
    const payload = await response.json() as { organic_results?: Array<{ link?: string }> }
    const urls = (payload.organic_results ?? []).map(r => r.link).filter((v): v is string => Boolean(v)).slice(0, 10)
    return { provider: 'serpapi', query, urls, fallbackRequired: false }
  } catch {
    return { provider: 'serpapi', query, urls: [], fallbackRequired: true }
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as WebFetchRequest & { query?: string }
  const mode = (body.extractionMode ?? 'lead_research') as ExtractionMode

  let urls = Array.isArray(body.urls) ? body.urls.filter(Boolean) : []
  let search

  if (urls.length === 0 && body.query) {
    search = await searchWeb(body.query)
    urls = search.urls
  }

  if (urls.length === 0) {
    return NextResponse.json({
      ok: false,
      error: 'No URLs available. Provide public URLs manually, or configure SERPAPI_KEY for search-assisted discovery.',
      search,
    }, { status: 400 })
  }

  const results = await Promise.all(urls.slice(0, 10).map(url => fetchPage(url, mode)))
  return NextResponse.json({
    ok: true,
    taskType: body.taskType ?? 'web_research',
    extractionMode: mode,
    search,
    sources: results.map(r => ({
      url: r.url,
      finalUrl: r.finalUrl,
      status: r.status,
      ok: r.ok,
      title: r.title,
      fetchedAt: r.fetchedAt,
    })),
    results,
  })
}
