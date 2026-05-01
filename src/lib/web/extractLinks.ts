export function extractLinks(html: string, baseUrl: string): string[] {
  const links = new Set<string>()
  const hrefRegex = /<a[^>]+href=["']([^"'#]+)["'][^>]*>/gi

  for (const match of html.matchAll(hrefRegex)) {
    const href = match[1]?.trim()
    if (!href || href.startsWith('javascript:') || href.startsWith('mailto:')) continue
    try {
      links.add(new URL(href, baseUrl).toString())
    } catch {
      // Ignore malformed URLs.
    }
  }

  return [...links].slice(0, 200)
}
