'use client'

import { useEffect, useRef, useState } from 'react'

const BAR_HEIGHTS = [20, 35, 28, 45, 38, 55, 42, 60, 48, 52, 65, 58, 70, 62, 55, 68, 72, 65, 58, 45, 52, 60, 55, 48, 40, 52, 58, 62, 68, 75]

export default function RightPanel() {
  const [computeVal, setComputeVal] = useState('14.1')
  const [bars, setBars] = useState(BAR_HEIGHTS)

  useEffect(() => {
    const id = setInterval(() => {
      setComputeVal(((14.1 + (Math.random() - 0.5) * 4)).toFixed(1))
      setBars(prev => prev.map(h => Math.max(8, Math.min(92, h + (Math.random() - 0.5) * 12))))
    }, 2000)
    return () => clearInterval(id)
  }, [])

  const lastBar = bars.length - 1

  return (
    <div className="right-panel">
      <div className="panel-section">
        <div className="panel-title">↗ ECONOMIC INDICATORS</div>
        <div className="econ-grid">
          <div className="econ-card">
            <div className="econ-lbl">MARKET VOL</div>
            <div className="econ-val">$12.4k</div>
            <div className="econ-delta up">+5%</div>
          </div>
          <div className="econ-card">
            <div className="econ-lbl">ACTIVE BIDS</div>
            <div className="econ-val">412</div>
            <div className="econ-delta up">+12%</div>
          </div>
          <div className="econ-card">
            <div className="econ-lbl">MEAN RPC</div>
            <div className="econ-val">$42</div>
            <div className="econ-delta dn">-2%</div>
          </div>
          <div className="econ-card">
            <div className="econ-lbl">SYNC RATE</div>
            <div className="econ-val">98%</div>
            <div className="econ-delta up">+8.4%</div>
          </div>
        </div>
      </div>

      <div className="panel-section">
        <div className="panel-title">✓ RECENTLY COMPLETED</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { agent: 'GLYPH-97', detail: '50 leads' },
            { agent: 'NEXUS-44', detail: '847 src' },
            { agent: 'CIPHER-08', detail: 'CRM sync' },
          ].map(item => (
            <div key={item.agent} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--mono)', fontSize: '10px', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="badge b-green">DONE</span>
              <span style={{ color: 'var(--text2)' }}>{item.agent}</span>
              <span style={{ marginLeft: 'auto', color: 'var(--text3)' }}>{item.detail}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <div className="panel-title">↗ CLUSTER LOAD</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)' }}>GLOBAL COMPUTE</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 700, color: 'var(--green)' }}>{computeVal}%</span>
        </div>
        <div className="cluster-chart">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`bar${i === lastBar ? ' hi' : i > 20 ? ' mid' : ''}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      <div className="panel-section">
        <div className="panel-title">★ TOP AGENTS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { rank: '01', name: 'NEXUS-44', ops: '847 ops', color: 'var(--green)' },
            { rank: '02', name: 'GLYPH-97', ops: '623 ops', color: 'var(--green2)' },
            { rank: '03', name: 'ZENITH-190', ops: '401 ops', color: 'var(--text3)' },
            { rank: '04', name: 'NODE-UNDEFINED', ops: '287 ops', color: 'var(--text3)' },
          ].map(item => (
            <div key={item.rank} className="top-agent">
              <span style={{ color: item.color }}>{item.rank}</span>
              <span style={{ color: 'var(--text2)' }}>{item.name}</span>
              <span style={{ marginLeft: 'auto', color: 'var(--text3)' }}>{item.ops}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
