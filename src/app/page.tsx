import Link from 'next/link'

export default function RootPage() {
  return (
    <main className="landing-shell">
      <div className="landing-status-wrap">
        <div className="landing-container landing-status-bar">
          <div className="landing-status-left">
            <span className="landing-status-live"><span className="landing-dot" />NETWORK: LIVE</span>
            <span>AGENTS: 1,402</span>
            <span>NEURAL LOAD: 12.4%</span>
          </div>
          <div className="landing-status-right">ORCHESTRATOR v4.2</div>
        </div>
      </div>

      <header className="landing-nav-wrap">
        <div className="landing-container landing-navbar">
          <div className="landing-logo"><span className="landing-logo-mark">N</span>AGENTN.IO</div>
          <nav className="landing-nav-links">
            <span>PRODUCT</span><span>PROOF</span><span>MARKETPLACE</span><span>DOCS</span>
          </nav>
          <div className="landing-nav-actions">
            <Link href="/login" className="landing-btn">SIGN IN</Link>
            <Link href="/dashboard" className="landing-btn landing-btn-primary">SPAWN AGENT</Link>
          </div>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-container landing-hero-grid">
          <div className="landing-hero-left">
            <div className="landing-command">$ spawn --cluster growth --auto-optimize true</div>
            <div className="landing-live"><span className="landing-dot" />LIVE ORCHESTRATION ONLINE</div>
            <h1>
              Spawn an army of<br />
              <span className="landing-green">autonomous agents</span><br />
              <span className="landing-muted">that</span> earn<br />
              while you sleep<span className="landing-cursor">_</span>
            </h1>
            <p className="landing-copy">AGENTN.IO deploys, coordinates, and compounds autonomous workers across outreach, data extraction, and revenue loops. Launch swarms in minutes and monitor live proof-of-work in one terminal-native command layer.</p>
            <div className="landing-cta-row">
              <Link href="/dashboard" className="landing-btn landing-btn-primary">START BUILDING</Link>
              <Link href="/dashboard" className="landing-btn">VIEW LIVE DEMO</Link>
            </div>
          </div>

          <div className="landing-hero-right">
            <div className="landing-terminal">
              <div className="landing-term-head">ORCHESTRATOR // SESSION #A-914</div>
              <div className="landing-term-body">
                <div className="landing-term-line">&gt; Initializing swarm topology...</div>
                <div>&gt; Node pool: 58 active · 12 clusters synced</div>
                <div>&gt; Task queue throughput: 1.4k ops/min</div>
                <div>&gt; Conversion uplift prediction: +18.2%</div>
                <div className="landing-term-line">&gt; Status: COMPOUNDING_REVENUE_LOOP ✓</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
