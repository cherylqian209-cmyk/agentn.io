'use client'

import { useCallback, useEffect, useState } from 'react'

interface ProofRow {
  id: string
  taskId: string
  agentName: string
  type: string
  durationMs: number | null
  estimatedCost: number
  status: string
  inputHash: string
  outputHash: string
  createdAt: string
  isReal?: boolean
}

const SEED_ROWS: ProofRow[] = [
  { id: 'seed-1', taskId: '#TK-9921', agentName: 'NEXUS-44', type: 'Lead Extraction', durationMs: 134000, estimatedCost: 0.041, status: 'VERIFIED', inputHash: '0x3f2a…c891', outputHash: '0x3f2a…c891', createdAt: '' },
  { id: 'seed-2', taskId: '#TK-9920', agentName: 'GLYPH-97', type: 'Copy Generation', durationMs: 63000, estimatedCost: 0.022, status: 'VERIFIED', inputHash: '0x8b1c…4f70', outputHash: '0x8b1c…4f70', createdAt: '' },
  { id: 'seed-3', taskId: '#TK-9919', agentName: 'ZENITH-190', type: 'Node Spawn', durationMs: 12000, estimatedCost: 0.004, status: 'PENDING', inputHash: '0x2d9e…aa12', outputHash: '0x2d9e…aa12', createdAt: '' },
  { id: 'seed-4', taskId: '#TK-9918', agentName: 'VEGA-12', type: 'Data Scrape', durationMs: null, estimatedCost: 0, status: 'FAILED', inputHash: '0x7c4b…1122', outputHash: '0x7c4b…1122', createdAt: '' },
  { id: 'seed-5', taskId: '#TK-9917', agentName: 'CIPHER-08', type: 'CRM Sync', durationMs: 272000, estimatedCost: 0.088, status: 'VERIFIED', inputHash: '0xf190…9b43', outputHash: '0xf190…9b43', createdAt: '' },
  { id: 'seed-6', taskId: '#TK-9916', agentName: 'NODE-UNDEFINED', type: 'Optimization', durationMs: 481000, estimatedCost: 0.014, status: 'VERIFIED', inputHash: '0xa3de…c227', outputHash: '0xa3de…c227', createdAt: '' },
  { id: 'seed-7', taskId: '#TK-9915', agentName: 'ORION-31', type: 'Market Intel', durationMs: 764000, estimatedCost: 0.22, status: 'DISPUTED', inputHash: '0x51bc…7f09', outputHash: '0x51bc…7f09', createdAt: '' },
]

const TABS = ['ALL', 'PENDING', 'VERIFIED', 'DISPUTED']

function fmtDuration(ms: number | null): string {
  if (ms == null) return '—'
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return `${m}m ${s % 60}s`
}

function statusBadge(s: string) {
  const map: Record<string, string> = { VERIFIED: 'b-green', PENDING: 'b-amber', FAILED: 'b-red', DISPUTED: 'b-pink' }
  return <span className={`badge ${map[s] ?? 'b-gray'}`}>{s}</span>
}

export default function ProofOfWorkTable() {
  const [tab, setTab] = useState('ALL')
  const [rows, setRows] = useState<ProofRow[]>(SEED_ROWS)

  const fetchProof = useCallback(async () => {
    try {
      const res = await fetch('/api/proof')
      if (res.ok) {
        const data: ProofRow[] = await res.json()
        if (data.length > 0) {
          setRows([...data, ...SEED_ROWS])
        }
      }
    } catch {
      // keep seed data
    }
  }, [])

  useEffect(() => { fetchProof() }, [fetchProof])

  const filtered = tab === 'ALL' ? rows : rows.filter(r => r.status === tab)

  const total = rows.length
  const verified = rows.filter(r => r.status === 'VERIFIED').length
  const pending = rows.filter(r => r.status === 'PENDING').length
  const disputed = rows.filter(r => r.status === 'DISPUTED').length

  return (
    <div className="page-scroll">
      <div className="page-header">
        <div>
          <div className="page-title">PROOF OF WORK</div>
          <div className="page-sub">Verified task completions & audit trail</div>
        </div>
        <div className="inner-tabs">
          {TABS.map(t => (
            <div key={t} className={`itab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</div>
          ))}
        </div>
      </div>
      <div className="page-body">
        <div className="stat-row">
          <div className="stat-box">
            <div className="stat-lbl">TOTAL TASKS</div>
            <div className="stat-val" style={{ color: 'var(--text)' }}>{total.toLocaleString()}</div>
            <div className="stat-sub up">+342 today</div>
          </div>
          <div className="stat-box">
            <div className="stat-lbl">VERIFIED</div>
            <div className="stat-val" style={{ color: 'var(--green)' }}>{verified.toLocaleString()}</div>
            <div className="stat-sub">{total > 0 ? ((verified / total) * 100).toFixed(1) : '0'}% rate</div>
          </div>
          <div className="stat-box">
            <div className="stat-lbl">PENDING</div>
            <div className="stat-val" style={{ color: 'var(--amber)' }}>{pending}</div>
            <div className="stat-sub">avg 4m wait</div>
          </div>
          <div className="stat-box">
            <div className="stat-lbl">DISPUTED</div>
            <div className="stat-val" style={{ color: 'var(--red)' }}>{disputed}</div>
            <div className="stat-sub dn">+18 flagged</div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>TASK ID</th>
                <th>AGENT</th>
                <th>TYPE</th>
                <th>DURATION</th>
                <th>COST</th>
                <th>STATUS</th>
                <th>HASH</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id}>
                  <td style={{ color: 'var(--text3)' }}>
                    {row.taskId}
                    {row.isReal && <span className="badge b-purple" style={{ fontSize: '8px', marginLeft: '4px' }}>REAL</span>}
                  </td>
                  <td>{row.agentName}</td>
                  <td>{row.type}</td>
                  <td>{fmtDuration(row.durationMs)}</td>
                  <td style={{ color: row.estimatedCost > 0 ? 'var(--green)' : 'var(--red)' }}>
                    ${row.estimatedCost.toFixed(3)}
                  </td>
                  <td>{statusBadge(row.status)}</td>
                  <td style={{ color: 'var(--text3)', fontSize: '9px' }}>
                    {row.inputHash.length > 14 ? row.inputHash.slice(0, 14) + '…' : row.inputHash}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text3)', padding: '20px' }}>
                    No records found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
