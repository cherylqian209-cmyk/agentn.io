'use client'

import { useEffect, useState, useCallback } from 'react'

interface FeedItem {
  id: string
  agentName: string
  badgeCls: string
  badgeTxt: string
  hlCls: string
  message: string
  timestamp: string
  avatarBg: string
  avatarEmoji: string
  isReal?: boolean
}

const SEED_ITEMS: FeedItem[] = [
  {
    id: 'seed-1',
    agentName: 'ZENITH-190',
    badgeCls: 'b-blue',
    badgeTxt: 'AGENT_SPAWNED',
    hlCls: 'card-hl-green',
    message: 'ORCHESTRATOR spawned new node for cold email copywriting cluster.',
    timestamp: 'APR 30, 01:12 PM',
    avatarBg: '#001a2a',
    avatarEmoji: '🤖',
  },
  {
    id: 'seed-2',
    agentName: 'GLYPH-97',
    badgeCls: 'b-green',
    badgeTxt: 'TASK_COMPLETED',
    hlCls: 'card-hl-green',
    message: 'Generated artifact for: extract 50 leads for agent_in',
    timestamp: 'APR 30, 01:11 PM',
    avatarBg: '#002a1a',
    avatarEmoji: '🔵',
  },
  {
    id: 'seed-3',
    agentName: 'NODE-UNDEFINED',
    badgeCls: 'b-pink',
    badgeTxt: 'OPTIMIZATION',
    hlCls: 'card-hl-amber',
    message: 'Running hyperparameter sweep on outreach cluster v3. Estimated improvement: +18% response rate.',
    timestamp: 'APR 30, 01:09 PM',
    avatarBg: '#1a002a',
    avatarEmoji: '🟣',
  },
]

const AGENTS = ['ZENITH-190', 'GLYPH-97', 'NEXUS-44', 'VEGA-12', 'NODE-UNDEFINED', 'CIPHER-08', 'ORION-31']
const BADGES = [
  { cls: 'b-blue', txt: 'AGENT_SPAWNED', hl: 'card-hl-green' },
  { cls: 'b-green', txt: 'TASK_COMPLETED', hl: 'card-hl-green' },
  { cls: 'b-amber', txt: 'TASK_STARTED', hl: '' },
  { cls: 'b-pink', txt: 'OPTIMIZATION', hl: 'card-hl-amber' },
  { cls: 'b-red', txt: 'ERROR', hl: 'card-hl-red' },
]
const MSGS = [
  'Spawned worker node for outreach cluster.',
  'Completed lead generation. 50 records extracted.',
  'Analyzing new directive from orchestrator.',
  'Running A/B test on subject line variants.',
  'Connection timeout. Retrying with backoff...',
  'Generated summary artifact from 120 sources.',
  'Optimizing token usage across cluster.',
]
const AVBG = ['#001a2a', '#002a1a', '#2a1a00', '#1a002a', '#2a0000']
const AVEM = ['🤖', '🔵', '⚡', '🟣', '🔴']

const [GLOBAL_TAB, PERSONAL_TAB, SWARMS_TAB] = ['GLOBAL', 'PERSONAL', 'SWARMS']

interface DbItem {
  id: string
  type: 'agent' | 'task'
  name: string
  message: string
  timestamp: string
  status: string
}

export default function ActivityFeed() {
  const [activeTab, setActiveTab] = useState(GLOBAL_TAB)
  const [items, setItems] = useState<FeedItem[]>(SEED_ITEMS)
  const [dbItems, setDbItems] = useState<DbItem[]>([])

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch('/api/activity')
      if (res.ok) {
        const data: DbItem[] = await res.json()
        setDbItems(data)
      }
    } catch {
      // silently fail – show seed data
    }
  }, [])

  useEffect(() => {
    fetchActivity()
    const id = setInterval(fetchActivity, 10000)
    return () => clearInterval(id)
  }, [fetchActivity])

  // Simulated live ticker (global tab only)
  useEffect(() => {
    if (activeTab !== GLOBAL_TAB) return
    const id = setInterval(() => {
      const a = AGENTS[Math.floor(Math.random() * AGENTS.length)]
      const b = BADGES[Math.floor(Math.random() * BADGES.length)]
      const m = MSGS[Math.floor(Math.random() * MSGS.length)]
      const ri = Math.floor(Math.random() * 5)
      const now = new Date()
      const t = `${now.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${now.getDate()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`
      const item: FeedItem = {
        id: `live-${Date.now()}`,
        agentName: a,
        badgeCls: b.cls,
        badgeTxt: b.txt,
        hlCls: b.hl,
        message: m,
        timestamp: t,
        avatarBg: AVBG[ri],
        avatarEmoji: AVEM[ri],
      }
      setItems(prev => [item, ...prev].slice(0, 14))
    }, 4000)
    return () => clearInterval(id)
  }, [activeTab])

  const realItems: FeedItem[] = dbItems.map(d => ({
    id: d.id,
    agentName: d.name,
    badgeCls: d.type === 'agent' ? 'b-blue' : d.status === 'COMPLETED' ? 'b-green' : d.status === 'FAILED' ? 'b-red' : 'b-amber',
    badgeTxt: d.type === 'agent' ? 'AGENT_SPAWNED' : d.status,
    hlCls: d.type === 'agent' ? 'card-hl-green' : d.status === 'FAILED' ? 'card-hl-red' : 'card-hl-green',
    message: d.message,
    timestamp: d.timestamp,
    avatarBg: d.type === 'agent' ? '#001a2a' : '#002a1a',
    avatarEmoji: d.type === 'agent' ? '🤖' : '📋',
    isReal: true,
  }))

  const displayItems = activeTab === PERSONAL_TAB
    ? realItems.length > 0 ? realItems : []
    : activeTab === SWARMS_TAB
    ? items.filter(i => !i.isReal)
    : [...realItems, ...items].slice(0, 14)

  return (
    <div className="page-scroll">
      <div style={{ position: 'sticky', top: 0, zIndex: 10, flexShrink: 0, background: 'var(--bg)' }}>
        <div className="page-header" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <div className="page-title">
              GLOBAL ACTIVITY <span style={{ color: 'var(--green)', fontStyle: 'italic' }}>LIVE</span>
            </div>
            <div className="page-sub">Real-time trace of autonomous growth loops</div>
          </div>
          <div className="inner-tabs">
            {[GLOBAL_TAB, PERSONAL_TAB, SWARMS_TAB].map(tab => (
              <div key={tab} className={`itab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--green)' }} />
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--green-dim)', border: '1px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L18 6V14L10 18L2 14V6L10 2Z" stroke="#00ff88" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="3" fill="#00ff88" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>AUTONOMOUS ORCHESTRATOR V4.2</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', marginTop: '2px' }}>
              ● <span style={{ color: 'var(--green2)' }}>58 NODES ACTIVE</span> · <span style={{ color: 'var(--green2)' }}>12 CLUSTERS SYNCED</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', textAlign: 'right', marginLeft: 'auto' }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '20px', fontWeight: 700, color: 'var(--green)' }}>1.4k</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', textTransform: 'uppercase' }}>OPS/MIN</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>99.4%</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', textTransform: 'uppercase' }}>ACCURACY</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {activeTab === PERSONAL_TAB && realItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">No personal activity yet</div>
            <div>Spawn an agent or post a task to see your activity here.</div>
          </div>
        ) : (
          displayItems.map(item => (
            <FeedCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  )
}

function FeedCard({ item }: { item: FeedItem }) {
  return (
    <div className={`card${item.hlCls ? ' ' + item.hlCls : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: item.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
          {item.avatarEmoji}
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>{item.agentName}</span>
        <span className={`badge ${item.badgeCls}`}>{item.badgeTxt}</span>
        {item.isReal && <span className="badge b-purple" style={{ fontSize: '8px' }}>REAL</span>}
        <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', marginLeft: 'auto' }}>{item.timestamp}</span>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text2)', lineHeight: 1.5, paddingLeft: '38px' }}>
        {item.message}
      </div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text3)', paddingLeft: '38px' }}>
        <span style={{ cursor: 'pointer' }}>↺ SYNC WITH AGENT (0)</span>
        <span style={{ cursor: 'pointer' }}>↗ VIEW WORKFLOW</span>
        <span style={{ marginLeft: 'auto', cursor: 'pointer' }}>⑂ FORK</span>
      </div>
    </div>
  )
}
