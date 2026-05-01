import { extractContactSignals } from './extractContactSignals'
import { extractCompanySignals } from './extractCompanySignals'
import { extractLinks } from './extractLinks'
import { extractReadableText } from './extractReadableText'
import type { ExtractionMode, WebSourceResult } from './types'

const MIN_REQUEST_INTERVAL_MS = 1000
const lastRequestByHost = new Map<string, number>()
const robotsCache = new Map<string, { disallow: string[]; fetchedAt: number }>()

async function sleep(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

async function enforceRateLimit(url: URL) {
  const key = url.host
  const last = lastRequestByHost.get(key) ?? 0
  const waitMs = Math.max(0, MIN_REQUEST_INTERVAL_MS - (Date.now() - last))
  if (waitMs > 0) await sleep(waitMs)
  lastRequestByHost.set(key, Date.now())
}

async function isAllowedByRobots(url: URL): Promise<boolean> {
  const robotsUrl = `${url.protocol}//${url.host}/robots.txt`
  const cached = robotsCache.get(robotsUrl)
  if (cached && Date.now() - cached.fetchedAt < 30 * 60_000) {
    return !cached.disallow.some(rule => url.pathname.startsWith(rule))
  }

  try {
    const res = await fetch(robotsUrl, { headers: { 'User-Agent': 'AgentNBot/1.0 (+https://agentn.io)' } })
    const txt = res.ok ? await res.text() : ''
    const disallow = txt
      .split('\n')
      .map(line => line.trim())
      .filter(line => /^disallow:/i.test(line))
      .map(line => line.split(':')[1]?.trim() || '')
      .filter(Boolean)
    robotsCache.set(robotsUrl, { disallow, fetchedAt: Date.now() })
    return !disallow.some(rule => url.pathname.startsWith(rule))
  } catch {
    return true
  }
}

export async function fetchPage(inputUrl: string, extractionMode: ExtractionMode = 'readable_text'): Promise<WebSourceResult> {
  const fetchedAt = new Date().toISOString()

  try {
    const parsed = new URL(inputUrl)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { url: inputUrl, ok: false, error: 'Only http/https URLs are supported', fetchedAt }
    }

    const allowed = await isAllowedByRobots(parsed)
    if (!allowed) {
      return { url: inputUrl, ok: false, error: 'Blocked by robots policy', fetchedAt }
    }

    await enforceRateLimit(parsed)

    const res = await fetch(parsed.toString(), {
      redirect: 'follow',
      headers: { 'User-Agent': 'AgentNBot/1.0 (+https://agentn.io)' },
    })

    const html = await res.text()
    const text = extractReadableText(html)
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim()
    const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i)?.[1]?.trim()

    const result: WebSourceResult = {
      url: inputUrl,
      finalUrl: res.url,
      ok: res.ok,
      status: res.status,
      title,
      description,
      fetchedAt,
      attribution: { fetchedBy: 'agentn-web-layer', robotsAware: true },
    }

    if (!res.ok) {
      result.error = `HTTP ${res.status}`
      return result
    }

    if (extractionMode === 'readable_text' || extractionMode === 'pricing' || extractionMode === 'competitors' || extractionMode === 'lead_research') {
      result.text = text.slice(0, 40_000)
    }
    if (extractionMode === 'links') {
      result.links = extractLinks(html, res.url)
    }
    if (extractionMode === 'contacts' || extractionMode === 'lead_research') {
      const contacts = extractContactSignals(text, html)
      result.emails = contacts.emails
      result.phones = contacts.phones
      result.socialLinks = contacts.socialLinks
    }
    if (extractionMode === 'company_signals' || extractionMode === 'pricing' || extractionMode === 'competitors' || extractionMode === 'lead_research') {
      result.companySignals = extractCompanySignals(html, text)
    }

    return result
  } catch (error) {
    return {
      url: inputUrl,
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown fetch error',
      fetchedAt,
    }
  }
}
