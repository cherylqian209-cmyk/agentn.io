'use client'

import { useCallback, useEffect, useState } from 'react'

interface SwarmAgent {
  id: string
  name: string
  type: string
  cluster: string
  status: string
  createdAt: string
  isReal?: boolean
}

const SEED_SWARMS = [
  { id: 's1', name: 'EMAIL-CLUSTER-V3', nodes: 14, progress: 78, color: 'var(--green)', status: 'ACTIVE', ops: 312, accuracy: '99.4%', cost: '$0.12/h' },
  { id: 's2', name: 'LEAD-GEN-SWARM', nodes: 8, progress: 62, color: 'var(--blue)', status: 'ACTIVE', ops: 188, accuracy: '98.7%', cost: '$0.08/h' },
  { id: 's3', name: 'SCRAPE-CLUSTER-X', nodes: 12, progress: 91, color: 'var(--amber)', status: 'OVERLOAD', ops: 441, accuracy: '97.2%', cost: '$0.05/h' },
  { id: 's4', name: 'CONTENT-FARM-α', nodes: 6, progress: 44, color: 'var(--pink)', status: 'ACTIVE', ops: 94, accuracy: '99.8%', cost: '$0.15/h' },
  { id: 's5', name: 'CRM-SYNC-BETA', nodes: 4, progress: 0, color: 'var(--text3)', status: 'IDLE', ops: 0, accuracy: '—', cost: '$0.00/h' },
  { id: 's6', name: 'INTEL-MONITOR-2', nodes: 14, progress: 55, color: 'var(--purple)', status: 'ACTIVE', ops: 221, accuracy: '99.1%', cost: '$0.22/h' },
]

export default function SwarmCommand({ onSpawnAgent }: { onSpawnAgent: () => void }) {
  const [agents, setAgents] = useState<SwarmAgent[]>([])

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/agents')
      if (res.ok) {
        const data: SwarmAgent[] = await res.json()
        setAgents(data)
      }
    } catch {
      // keep empty
    }
  }, [])

  useEffect(() => { fetchAgents() }, [fetchAgents])

  const totalNodes = 58 + agents.length
  const activeSwarms = SEED_SWARMS.filter(s => s.status === 'ACTIVE').length

  return (
    <div className="page-scroll">
      <div className="page-header">
        <div>
          <div className="page-title">SWARM COMMAND</div>
          <div className="page-sub">Manage active agent clusters & orchestration</div>
        </div>
        <button className="btn-green" style={{ padding: '6px 14px', fontSize: '10px' }} onClick={onSpawnAgent}>
          ⊕ NEW SWARM
        </button>
      </div>
      <div className="page-body">
        <div className="stat-row">
          <div className="stat-box">
            <div className="stat-lbl">ACTIVE SWARMS</div>
            <div className="stat-val" style={{ color: 'var(--green)' }}>{activeSwarms + agents.filter(a => a.status === 'ACTIVE').length}</div>
            <div className="stat-sub">{totalNodes} total nodes</div>
          </div>
          <div className="stat-box">
            <div className="stat-lbl">THROUGHPUT</div>
            <div className="stat-val" style={{ color: 'var(--text)' }}>1.4k</div>
            <div className="stat-sub">ops/min</div>
          </div>
          <div className="stat-box">
            <div className="stat-lbl">AVG ACCURACY</div>
            <div className="stat-val" style={{ color: 'var(--green)' }}>99.1%</div>
            <div className="stat-sub up">+0.3% week</div>
          </div>
          <div className="stat-box">
            <div className="stat-lbl">TOTAL SPEND</div>
            <div className="stat-val" style={{ color: 'var(--text)' }}>$42.8</div>
            <div className="stat-sub">this session</div>
          </div>
        </div>

        {agents.length > 0 && (
          <>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              YOUR AGENTS ({agents.length})
            </div>
            <div className="swarm-grid">
              {agents.map(a => (
                <div key={a.id} className="swarm-card" style={{ borderLeft: '2px solid var(--green)' }}>
                  <div className="sc-header">
                    <span className="sc-dot" style={{ background: a.status === 'ACTIVE' ? 'var(--green)' : 'var(--text3)', animation: a.status === 'ACTIVE' ? 'pulse 2s infinite' : 'none' }} />
                    <span className="sc-name">{a.name}</span>
                    <span className="sc-count">REAL</span>
                  </div>
                  <div className="sc-progress">
                    <div className="sc-progress-fill" style={{ width: '30%', background: 'var(--green)' }} />
                  </div>
                  <div className="sc-stats">
                    <div className="sc-stat">TYPE<span>{a.type}</span></div>
                    <div className="sc-stat">STATUS<span style={{ color: a.status === 'ACTIVE' ? 'var(--green)' : 'var(--text3)' }}>{a.status}</span></div>
                    <div className="sc-stat">CLUSTER<span style={{ fontSize: '9px' }}>{a.cluster.slice(0, 14)}</span></div>
                    <div className="sc-stat">CREATED<span style={{ fontSize: '9px' }}>{new Date(a.createdAt).toLocaleDateString()}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          SYSTEM CLUSTERS
        </div>
        <div className="swarm-grid">
          {SEED_SWARMS.map(s => (
            <div key={s.id} className="swarm-card">
              <div className="sc-header">
                <span className="sc-dot" style={{ background: s.color, animation: s.status === 'ACTIVE' ? 'pulse 2s infinite' : 'none' }} />
                <span className="sc-name">{s.name}</span>
                <span className="sc-count">{s.nodes} nodes</span>
              </div>
              <div className="sc-progress">
                <div className="sc-progress-fill" style={{ width: `${s.progress}%`, background: s.color }} />
              </div>
              <div className="sc-stats">
                <div className="sc-stat">STATUS<span style={{ color: s.color }}>{s.status}</span></div>
                <div className="sc-stat">OPS/MIN<span>{s.ops}</span></div>
                <div className="sc-stat">ACCURACY<span>{s.accuracy}</span></div>
                <div className="sc-stat">COST<span>{s.cost}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
