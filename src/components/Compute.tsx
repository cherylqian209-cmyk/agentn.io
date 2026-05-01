export default function Compute() {
  const clusters = [
    { name: 'EMAIL-CLUSTER-V3', sub: 'US-WEST-GRID-02 · 14 NODES · 140 VCPU', pct: 78, color: 'var(--green)', vcpu: 109, offset: 30.4 },
    { name: 'SCRAPE-CLUSTER-X', sub: 'EU-CENTRAL-01 · 12 NODES · 120 VCPU', pct: 91, color: 'var(--amber)', vcpu: 109, offset: 12.4 },
    { name: 'LEAD-GEN-SWARM', sub: 'US-EAST-GRID-01 · 8 NODES · 80 VCPU', pct: 60, color: 'var(--blue)', vcpu: 48, offset: 55.3 },
    { name: 'CRM-SYNC-BETA', sub: 'AP-SOUTH-01 · 4 NODES · 40 VCPU', pct: 10, color: 'var(--text3)', vcpu: 4, offset: 124.4 },
  ]

  return (
    <div className="page-scroll">
      <div className="page-header">
        <div>
          <div className="page-title">COMPUTE</div>
          <div className="page-sub">Infrastructure resources & allocation</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-dim" style={{ padding: '6px 12px', fontSize: '10px' }}>↓ SCALE DOWN</button>
          <button className="btn-green" style={{ padding: '6px 12px', fontSize: '10px' }}>↑ SCALE UP</button>
        </div>
      </div>
      <div className="page-body">
        <div className="stat-row">
          <div className="stat-box"><div className="stat-lbl">TOTAL NODES</div><div className="stat-val" style={{ color: 'var(--text)' }}>58</div><div className="stat-sub">across 4 regions</div></div>
          <div className="stat-box"><div className="stat-lbl">CPU USAGE</div><div className="stat-val" style={{ color: 'var(--green)' }}>14.1%</div><div className="stat-sub">of 580 vCPU</div></div>
          <div className="stat-box"><div className="stat-lbl">MEMORY</div><div className="stat-val" style={{ color: 'var(--amber)' }}>67.3%</div><div className="stat-sub">of 1.16 TB</div></div>
          <div className="stat-box"><div className="stat-lbl">HOURLY COST</div><div className="stat-val" style={{ color: 'var(--text)' }}>$3.20</div><div className="stat-sub up">optimized</div></div>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          RESOURCE ALLOCATION BY CLUSTER
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {clusters.map(c => (
            <div key={c.name} className="resource-card">
              <div style={{ width: '56px', height: '56px', flexShrink: 0, position: 'relative' }}>
                <svg width="56" height="56" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="var(--border)" strokeWidth="4" />
                  <circle cx="28" cy="28" r="22" fill="none" stroke={c.color} strokeWidth="4" strokeDasharray="138.2" strokeDashoffset={c.offset} transform="rotate(-90 28 28)" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700, color: c.color }}>
                  {c.pct}%
                </div>
              </div>
              <div className="rc-info">
                <div className="rc-name">{c.name}</div>
                <div className="rc-sub">{c.sub}</div>
                <div className="rc-bar">
                  <div className="rc-bar-fill" style={{ width: `${c.pct}%`, background: c.color }} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '18px', fontWeight: 700, color: c.color }}>{c.vcpu}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)' }}>vCPU active</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
