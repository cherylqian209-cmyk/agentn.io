'use client'

import { useEffect, useRef } from 'react'

const SOLO_STRIPE_URL = 'https://buy.stripe.com/14AcN6bli0WfayWgOy8g004'
const SWARM_STRIPE_URL = 'https://buy.stripe.com/28E4gA89634n6iG2XI8g005'

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
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 8,
          zIndex: 20,
        }}
      >
        <a
          href={SOLO_STRIPE_URL}
          target="_blank"
          rel="noreferrer"
          style={{
            background: '#4ef08a',
            color: '#0a0d0c',
            fontWeight: 700,
            padding: '8px 12px',
            textDecoration: 'none',
            borderRadius: 6,
          }}
        >
          Buy Agentn Solo
        </a>
        <a
          href={SWARM_STRIPE_URL}
          target="_blank"
          rel="noreferrer"
          style={{
            background: '#d8e6df',
            color: '#0a0d0c',
            fontWeight: 700,
            padding: '8px 12px',
            textDecoration: 'none',
            borderRadius: 6,
          }}
        >
          Buy Agentn Swarm
        </a>
      </div>
      <iframe
        ref={iframeRef}
        src="/landing.html"
        title="AGENTN.IO Landing Page"
        style={{ width: '100%', height: '100%', border: '0', display: 'block' }}
      />
    </main>
  )
}
