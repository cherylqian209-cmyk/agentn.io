'use client'

import { useEffect, useRef } from 'react'

export default function RootPage() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const bindLandingLoginActions = () => {
      const doc = iframe.contentDocument
      if (!doc) return

      const handler = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null
        const clickable = target?.closest('button, a, [role="button"], [onclick]') as HTMLElement | null
        if (!clickable) return

        const label = (clickable.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase()
        if (label.includes('sign in') || label.includes('spawn')) {
          event.preventDefault()
          event.stopPropagation()
          window.location.href = '/login'
        }
      }

      doc.addEventListener('click', handler, true)
      iframe.dataset.loginBound = 'true'
    }

    iframe.addEventListener('load', bindLandingLoginActions)

    if (iframe.contentDocument?.readyState === 'complete' && iframe.dataset.loginBound !== 'true') {
      bindLandingLoginActions()
    }

    return () => {
      iframe.removeEventListener('load', bindLandingLoginActions)
    }
  }, [])

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <iframe
        ref={iframeRef}
        src="/landing.html"
        title="AGENTN.IO Landing Page"
        style={{ width: '100%', height: '100%', border: '0', display: 'block' }}
      />
    </main>
  )
}
