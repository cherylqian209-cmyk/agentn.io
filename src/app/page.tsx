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

      const mountSocialProof = () => {
        if (doc.getElementById('agentn-social-proof')) return true

        const cta = Array.from(doc.querySelectorAll('button, a')).find((node) =>
          node.textContent?.toLowerCase().includes('browse marketplace')
        )

        const anchor = cta?.closest('section, div')
        if (!anchor || !anchor.parentElement) return false

        const section = doc.createElement('section')
        section.id = 'agentn-social-proof'
        section.innerHTML = `
          <div class="agentn-social-inner">
            <p class="agentn-social-kicker">TRUSTED BY GROWTH TEAMS AT</p>
            <div class="agentn-social-logos">
              <span>STRIPE</span>
              <span>NOTION</span>
              <span>RAMP</span>
              <span>WEBFLOW</span>
              <span>HUBSPOT</span>
              <span>MERCURY</span>
            </div>
          </div>
        `

        const style = doc.createElement('style')
        style.textContent = `
          #agentn-social-proof {
            margin: 28px auto 0;
            width: min(1320px, calc(100% - 96px));
            border-top: 1px solid rgba(78, 240, 138, 0.16);
            border-bottom: 1px solid rgba(78, 240, 138, 0.16);
            background: linear-gradient(90deg, rgba(11, 17, 15, 0.92), rgba(8, 13, 12, 0.92));
          }
          .agentn-social-inner { padding: 20px 24px; }
          .agentn-social-kicker {
            margin: 0 0 14px;
            font-family: "JetBrains Mono", ui-monospace, monospace;
            letter-spacing: 0.2em;
            font-size: 11px;
            color: rgba(122, 138, 130, 0.9);
          }
          .agentn-social-logos {
            display: grid;
            gap: 12px;
            grid-template-columns: repeat(6, minmax(0, 1fr));
          }
          .agentn-social-logos span {
            border: 1px solid rgba(78, 240, 138, 0.2);
            padding: 12px 8px;
            text-align: center;
            color: rgba(216, 230, 223, 0.92);
            font-family: "JetBrains Mono", ui-monospace, monospace;
            letter-spacing: 0.14em;
            font-size: 14px;
          }
          @media (max-width: 1100px) {
            .agentn-social-logos { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          }
          @media (max-width: 760px) {
            #agentn-social-proof { width: calc(100% - 36px); }
            .agentn-social-logos { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
        `

        if (!doc.getElementById('agentn-social-proof-style')) {
          style.id = 'agentn-social-proof-style'
          doc.head?.appendChild(style)
        }

        anchor.parentElement.insertBefore(section, anchor.nextSibling)
        return true
      }

      const inserted = mountSocialProof()
      if (!inserted) {
        const observer = new MutationObserver(() => {
          if (mountSocialProof()) observer.disconnect()
        })
        observer.observe(doc.body, { childList: true, subtree: true })
        window.setTimeout(() => observer.disconnect(), 10000)
      }

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
