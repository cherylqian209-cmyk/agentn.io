const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const PHONE_REGEX = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/g
const SOCIAL_REGEX = /https?:\/\/(?:www\.)?(linkedin|twitter|x|facebook|instagram)\.com\/[^\s"'<>]+/gi

export function extractContactSignals(text: string, html: string) {
  const emails = [...new Set(text.match(EMAIL_REGEX) ?? [])]
  const phones = [...new Set(text.match(PHONE_REGEX) ?? [])]
  const socialLinks = [...new Set([...html.matchAll(SOCIAL_REGEX)].map(m => m[0]))]

  return {
    emails: emails.slice(0, 50),
    phones: phones.slice(0, 50),
    socialLinks: socialLinks.slice(0, 50),
  }
}
