'use client'

type Page = 'activity' | 'marketplace' | 'proof' | 'outreach' | 'swarm' | 'network' | 'contracts' | 'insights' | 'compute'

interface Props {
  activePage: Page
  onNavigate: (page: Page) => void
  onSpawnAgent: () => void
  onPostTask: () => void
}

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  {
    page: 'activity',
    label: 'ACTIVITY FEED',
    icon: (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    page: 'marketplace',
    label: 'MARKETPLACE',
    icon: (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 3h12l-1.5 6H3.5L2 3z" />
        <circle cx="5.5" cy="12.5" r="1" />
        <circle cx="11.5" cy="12.5" r="1" />
      </svg>
    ),
  },
  {
    page: 'data',
    label: 'DATA LAB',
    icon: (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="12" height="12" rx="2" />
        <path d="M5 6h6M5 8h6M5 10h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    page: 'proof',
    label: 'PROOF OF WORK',
    icon: (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3l2 1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    page: 'outreach',
    label: 'OUTREACH INBOX',
    icon: (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="12" height="10" rx="1.5" />
        <path d="M2.5 4l5.5 4 5.5-4" />
      </svg>
    ),
  },
  {
    page: 'swarm',
    label: 'SWARM COMMAND',
    icon: (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 8h2l2-4 2 8 2-4h2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    page: 'network',
    label: 'NETWORK GRAPH',
    icon: (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor">
        <circle cx="3" cy="8" r="1.5" />
        <circle cx="13" cy="4" r="1.5" />
        <circle cx="13" cy="12" r="1.5" />
        <circle cx="8" cy="8" r="1.5" />
        <line x1="4.5" y1="7.5" x2="6.5" y2="8" />
        <line x1="9.5" y1="7.5" x2="11.5" y2="4.5" />
        <line x1="9.5" y1="8.5" x2="11.5" y2="11.5" />
      </svg>
    ),
  },
  {
    page: 'contracts',
    label: 'CONTRACTS',
    icon: (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="3" width="14" height="10" rx="2" />
        <path d="M5 7h6M5 9.5h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    page: 'insights',
    label: 'INSIGHTS',
    icon: (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 13l3-5 3 3 3-7 3 9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    page: 'compute',
    label: 'COMPUTE',
    icon: (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="5" height="5" rx="1" />
        <rect x="9" y="2" width="5" height="5" rx="1" />
        <rect x="2" y="9" width="5" height="5" rx="1" />
        <rect x="9" y="9" width="5" height="5" rx="1" />
      </svg>
    ),
  },
]

export default function Sidebar({ activePage, onNavigate, onSpawnAgent, onPostTask }: Props) {
  return (
    <div className="sidebar">
      {navItems.map(item => (
        <div
          key={item.page}
          className={`nav-item${activePage === item.page ? ' active' : ''}`}
          onClick={() => onNavigate(item.page)}
        >
          {item.icon}
          {item.label}
        </div>
      ))}

      <div className="divider" />
      <div className="nav-section">SAVED VIEWS</div>
      <div className="saved-view"><span className="dot-sm" style={{ background: '#ff4444' }} />Critical Failures</div>
      <div className="saved-view"><span className="dot-sm" style={{ background: '#00ff88' }} />Top Performance</div>
      <div className="saved-view" style={{ color: '#3a4a3a' }}>&nbsp;&nbsp;Recent Syncs</div>

      <div className="sidebar-bottom">
        <button className="btn-green" onClick={onSpawnAgent}>⊕ SPAWN AGENT</button>
        <button className="btn-dim" onClick={onPostTask}>▷ POST TASK</button>
      </div>
    </div>
  )
}
