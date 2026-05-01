'use client'

import { useEffect, useRef } from 'react'

const SOLO_STRIPE_URL = 'https://buy.stripe.com/14AcN6bli0WfayWgOy8g004'
const SWARM_STRIPE_URL = 'https://buy.stripe.com/28E4gA89634n6iG2XI8g005'
const ENTERPRISE_CONTACT_URL = 'mailto:sales@agentn.io?subject=Agentn%20Enterprise%20Inquiry'

export default function RootPage() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const bindLandingActions = () => {
      const doc = iframe.contentDocument
      if (!doc) return

      const handler = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null
        const clickable = target?.closest('button, a, [role="button"], [onclick]') as HTMLElement | null
        if (!clickable) return

        const label = (clickable.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase()

        if (label.includes('start growth') || label.includes('buy agentn solo') || label.includes('growth')) {
          event.preventDefault()
          event.stopPropagation()
          window.open(SOLO_STRIPE_URL, '_blank', 'noopener,noreferrer')
          return
        }

        if (label.includes('start operator') || label.includes('buy agentn swarm') || label.includes('operator')) {
          event.preventDefault()
          event.stopPropagation()
          window.open(SWARM_STRIPE_URL, '_blank', 'noopener,noreferrer')
          return
        }

        if (label.includes('book call') || label.includes('enterprise')) {
          event.preventDefault()
          event.stopPropagation()
          window.open(ENTERPRISE_CONTACT_URL, '_blank', 'noopener,noreferrer')
          return
        }

        if (label.includes('sign in') || label.includes('spawn') || label.includes('run free scan') || label.includes('run free revenue scan')) {
          event.preventDefault()
          event.stopPropagation()
          window.location.href = '/login'
        }
      }

      doc.addEventListener('click', handler, true)
      iframe.dataset.actionsBound = 'true'
    }

    iframe.addEventListener('load', bindLandingActions)

    if (iframe.contentDocument?.readyState === 'complete' && iframe.dataset.actionsBound !== 'true') {
      bindLandingActions()
    }

    return () => {
      iframe.removeEventListener('load', bindLandingActions)
    }
  }, [])

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <iframe
        ref={iframeRef}
        src="/landing.html"
        title="AGENTN.IO Landing Page"
        style={{ width: '100%', height: '100%', border: '0', display: 'block' }}
      />
    </main>
  )
}
