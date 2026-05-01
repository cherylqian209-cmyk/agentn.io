'use client'

import { useState } from 'react'

const AGENTS = [
  { color: 'green', icon: '🎯', name: 'COLD-OUTREACH-PRO', desc: 'Automated multi-channel outreach with personalized copy. Supports email, LinkedIn, and Twitter sequences.', badge1: { cls: 'b-green', txt: 'VERIFIED' }, badge2: { cls: 'b-gray', txt: 'OUTREACH' }, price: '$0.12/run', rating: '★★★★★ 4.9', category: 'OUTREACH' },
  { color: 'blue', icon: '🔍', name: 'LEAD-EXTRACTOR-V8', desc: 'Extracts and enriches leads from 40+ data sources. Returns structured JSON with email, title, company.', badge1: { cls: 'b-blue', txt: 'POPULAR' }, badge2: { cls: 'b-gray', txt: 'DATA' }, price: '$0.08/run', rating: '★★★★☆ 4.7', category: 'DATA' },
  { color: 'amber', icon: '✍️', name: 'COPYWRITER-GPT-4X', desc: 'High-converting copy for ads, landing pages, emails. A/B variant generation with performance scoring.', badge1: { cls: 'b-amber', txt: 'NEW' }, badge2: { cls: 'b-gray', txt: 'CONTENT' }, price: '$0.15/run', rating: '★★★★☆ 4.6', category: 'CONTENT' },
  { color: 'pink', icon: '📊', name: 'MARKET-INTEL-BOT', desc: 'Real-time competitor monitoring, pricing intelligence, and trend detection. Daily briefings to Slack.', badge1: { cls: 'b-pink', txt: 'BETA' }, badge2: { cls: 'b-gray', txt: 'RESEARCH' }, price: '$0.22/run', rating: '★★★★☆ 4.5', category: 'RESEARCH' },
  { color: 'green', icon: '🔗', name: 'SCRAPER-CLUSTER-X', desc: 'Distributed web scraping with proxy rotation, JS rendering, and structured output. Rate-limit aware.', badge1: { cls: 'b-green', txt: 'VERIFIED' }, badge2: { cls: 'b-gray', txt: 'DATA' }, price: '$0.05/run', rating: '★★★★★ 4.8', category: 'DATA' },
  { color: 'blue', icon: '🤝', name: 'CRM-SYNC-AGENT', desc: 'Bi-directional sync between AgentN clusters and Salesforce, HubSpot, or Pipedrive. Dedup included.', badge1: { cls: 'b-blue', txt: 'POPULAR' }, badge2: { cls: 'b-gray', txt: 'INTEGRATION' }, price: '$0.10/run', rating: '★★★★☆ 4.4', category: 'OUTREACH' },
]

const FILTERS = ['ALL', 'OUTREACH', 'DATA', 'CONTENT', 'RESEARCH']

export default function Marketplace() {
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const filtered = AGENTS.filter(a => {
    const matchFilter = filter === 'ALL' || a.category === filter
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="page-scroll">
      <div className="page-header">
        <div>
          <div className="page-title">MARKETPLACE</div>
          <div className="page-sub">Browse & deploy pre-built agent templates</div>
        </div>
        <button className="btn-green" style={{ padding: '6px 14px', fontSize: '10px' }}>⊕ LIST AGENT</button>
      </div>
      <div className="page-body">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: '200px' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="5" cy="5" r="3.5" />
              <path d="M8.5 8.5L11 11" strokeLinecap="round" />
            </svg>
            <input
              placeholder="Search agents, clusters, tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-row">
            {FILTERS.map(f => (
              <div key={f} className={`filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</div>
            ))}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          FEATURED — {filtered.length} AGENTS AVAILABLE
        </div>
        {filtered.length > 0 ? (
          <div className="agent-grid">
            {filtered.map(a => (
              <div key={a.name} className={`agent-card ${a.color}`}>
                <div className="ac-icon">{a.icon}</div>
                <div className="ac-name">{a.name}</div>
                <div className="ac-desc">{a.desc}</div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                  <span className={`badge ${a.badge1.cls}`}>{a.badge1.txt}</span>
                  <span className={`badge ${a.badge2.cls}`}>{a.badge2.txt}</span>
                </div>
                <div className="ac-footer">
                  <span className="ac-price">{a.price}</span>
                  <span className="ac-rating">{a.rating}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No agents found</div>
            <div>Try a different search or filter.</div>
          </div>
        )}
      </div>
    </div>
  )
}
