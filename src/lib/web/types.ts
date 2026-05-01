export type ExtractionMode =
  | 'readable_text'
  | 'links'
  | 'contacts'
  | 'company_signals'
  | 'pricing'
  | 'competitors'
  | 'lead_research'

export type WebFetchRequest = {
  urls: string[]
  taskType?: string
  extractionMode?: ExtractionMode
  maxPages?: number
}

export type CompanySignals = {
  companyName?: string
  tagline?: string
  description?: string
  pricingMentions?: string[]
  productMentions?: string[]
  audienceMentions?: string[]
  locationMentions?: string[]
}

export type WebSourceResult = {
  url: string
  finalUrl?: string
  ok: boolean
  status?: number
  title?: string
  description?: string
  text?: string
  links?: string[]
  emails?: string[]
  phones?: string[]
  socialLinks?: string[]
  companySignals?: CompanySignals
  error?: string
  fetchedAt: string
  attribution?: {
    publisher?: string
    fetchedBy: 'agentn-web-layer'
    robotsAware: boolean
  }
}

export type SearchProviderResult = {
  provider: 'serpapi' | 'none'
  query: string
  urls: string[]
  fallbackRequired: boolean
}
