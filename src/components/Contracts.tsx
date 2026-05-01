export default function Contracts() {
  const contracts = [
    { id: '#C-0041', client: 'AcmeCorp', agent: 'EMAIL-CLUSTER-V3', sla: 98, value: '$1,200/mo', expires: 'Jun 30', status: 'ACTIVE', statusCls: 'b-green' },
    { id: '#C-0040', client: 'VertexAI Ltd', agent: 'LEAD-GEN-SWARM', sla: 100, value: '$800/mo', expires: 'May 07', status: 'EXPIRING', statusCls: 'b-amber' },
    { id: '#C-0039', client: 'DataSift Inc', agent: 'SCRAPE-CLUSTER-X', sla: 87, value: '$450/mo', expires: 'Jul 15', status: 'AT RISK', statusCls: 'b-amber', slaColor: 'var(--amber)' },
    { id: '#C-0038', client: 'SkyBridge Co', agent: 'CONTENT-FARM-α', sla: 100, value: '$620/mo', expires: 'Aug 01', status: 'ACTIVE', statusCls: 'b-green' },
    { id: '#C-0037', client: 'NovaTech', agent: 'CRM-SYNC-AGENT', sla: 0, value: '$320/mo', expires: 'Expired', status: 'TERMINATED', statusCls: 'b-red' },
    { id: '#C-0036', client: 'PulseMed', agent: 'INTEL-MONITOR-2', sla: 99, value: '$2,100/mo', expires: 'Sep 30', status: 'ACTIVE', statusCls: 'b-green' },
  ]

  return (
    <div className="page-scroll">
      <div className="page-header">
        <div>
          <div className="page-title">CONTRACTS</div>
          <div className="page-sub">Agent service agreements & SLA tracking</div>
        </div>
        <button className="btn-green" style={{ padding: '6px 14px', fontSize: '10px' }}>+ NEW CONTRACT</button>
      </div>
      <div className="page-body">
        <div className="stat-row">
          <div className="stat-box"><div className="stat-lbl">ACTIVE</div><div className="stat-val" style={{ color: 'var(--green)' }}>24</div><div className="stat-sub">contracts</div></div>
          <div className="stat-box"><div className="stat-lbl">TOTAL VALUE</div><div className="stat-val" style={{ color: 'var(--text)' }}>$8.4k</div><div className="stat-sub up">+$840 week</div></div>
          <div className="stat-box"><div className="stat-lbl">SLA MET</div><div className="stat-val" style={{ color: 'var(--green)' }}>96.2%</div><div className="stat-sub">this month</div></div>
          <div className="stat-box"><div className="stat-lbl">EXPIRING</div><div className="stat-val" style={{ color: 'var(--amber)' }}>3</div><div className="stat-sub">within 7 days</div></div>
        </div>
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>CONTRACT</th><th>CLIENT</th><th>AGENT</th><th>SLA</th><th>VALUE</th><th>EXPIRES</th><th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map(c => (
                <tr key={c.id}>
                  <td style={{ color: 'var(--text)' }}>{c.id}</td>
                  <td>{c.client}</td>
                  <td>{c.agent}</td>
                  <td>
                    <div className="mini-bar-wrap">
                      <div className="mini-bar-bg">
                        <div className="mini-bar-fill" style={{ width: `${c.sla}%`, background: c.slaColor ?? 'var(--green)' }} />
                      </div>
                      {c.sla > 0 ? `${c.sla}%` : '—'}
                    </div>
                  </td>
                  <td style={{ color: c.status === 'TERMINATED' ? 'var(--text3)' : 'var(--green)' }}>{c.value}</td>
                  <td style={{ color: c.expires === 'Expired' ? 'var(--red)' : c.expires === 'May 07' ? 'var(--amber)' : 'var(--text3)' }}>{c.expires}</td>
                  <td><span className={`badge ${c.statusCls}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
