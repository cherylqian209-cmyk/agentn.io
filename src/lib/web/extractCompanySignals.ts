import type { CompanySignals } from './types'

const sentenceSplit = /(?<=[.!?])\s+/g

function collectMentions(text: string, keywords: string[], limit = 8) {
  const out = new Set<string>()
  const sentences = text.split(sentenceSplit)
  for (const sentence of sentences) {
    if (keywords.some(keyword => sentence.toLowerCase().includes(keyword)) && sentence.length < 280) {
      out.add(sentence.trim())
    }
    if (out.size >= limit) break
  }
  return [...out]
}

export function extractCompanySignals(html: string, text: string): CompanySignals {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim()
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i)?.[1]?.trim()
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim()

  return {
    companyName: title?.split('|')[0]?.split('-')[0]?.trim(),
    tagline: h1,
    description,
    pricingMentions: collectMentions(text, ['price', 'pricing', '$', 'plan', 'monthly', 'annual']),
    productMentions: collectMentions(text, ['platform', 'product', 'feature', 'solution', 'tool']),
    audienceMentions: collectMentions(text, ['for ', 'customer', 'team', 'business', 'agency', 'developer']),
    locationMentions: collectMentions(text, ['based in', 'headquartered', 'office', 'remote', 'located']),
  }
}
