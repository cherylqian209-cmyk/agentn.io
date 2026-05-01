'use client'

import { useState } from 'react'

const PERIODS = ['7D', '30D', '90D', 'ALL']

export default function Insights() {
  const [period, setPeriod] = useState('7D')

  const taskBars = [
    { label: 'Lead Gen', pct: 82, color: 'var(--green)' },
    { label: 'Copywriting', pct: 61, color: 'var(--blue)' },
    { label: 'Scraping', pct: 74, color: 'var(--amber)' },
    { label: 'Optimization', pct: 38, color: 'var(--pink)' },
    { label: 'CRM Sync', pct: 29, color: 'var(--purple)' },
  ]
  const agentBars = [
    { label: 'NEXUS-44', pct: 95, color: 'var(--green)' },
    { label: 'GLYPH-97', pct: 88, color: 'var(--green2)' },
    { label: 'ZENITH-190', pct: 76, color: 'var(--blue)' },
    { label: 'CIPHER-08', pct: 64, color: 'var(--amber)' },
    { label: 'ORION-31', pct: 51, color: 'var(--text2)' },
  ]
  const dayBars = [
    { day: 'MON', h: 62, color: 'var(--green3)' },
    { day: 'TUE', h: 71, color: 'var(--green3)' },
    { day: 'WED', h: 84, color: 'var(--green2)' },
    { day: 'THU', h: 79, color: 'var(--green2)' },
    { day: 'FRI', h: 95, color: 'var(--green)' },
    { day: 'SAT', h: 55, color: 'var(--green3)' },
    { day: 'SUN', h: 41, color: 'var(--green3)' },
  ]

  return (
    <div className="page-scroll">
      <div className="page-header">
        <div>
          <div className="page-title">INSIGHTS</div>
          <div className="page-sub">Performance analytics & growth intelligence</div>
        </div>
        <div className="inner-tabs">
          {PERIODS.map(p => (
            <div key={p} className={`itab${period === p ? ' active' : ''}`} onClick={() => setPeriod(p)}>{p}</div>
          ))}
        </div>
      </div>
      <div className="page-body">
        <div className="stat-row">
          <div className="stat-box"><div className="stat-lbl">TASKS COMPLETED</div><div className="stat-val" style={{ color: 'var(--green)' }}>48,210</div><div className="stat-sub up">↑ 14% vs last week</div></div>
          <div className="stat-box"><div className="stat-lbl">REVENUE GENERATED</div><div className="stat-val" style={{ color: 'var(--text)' }}>$12.4k</div><div className="stat-sub up">↑ 5% vs last week</div></div>
          <div className="stat-box"><div className="stat-lbl">AVG TASK COST</div><div className="stat-val" style={{ color: 'var(--text)' }}>$0.042</div><div className="stat-sub dn">↑ 2% (higher load)</div></div>
          <div className="stat-box"><div className="stat-lbl">UPTIME</div><div className="stat-val" style={{ color: 'var(--green)' }}>99.97%</div><div className="stat-sub">7-day window</div></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="card">
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>TASK VOLUME BY TYPE</div>
            {taskBars.map(b => (
              <div key={b.label} className="insight-bar-row">
                <div className="insight-bar-label">{b.label}</div>
                <div className="insight-bar-track">
                  <div className="insight-bar-fill" style={{ width: `${b.pct}%`, background: b.color }}>{b.pct}%</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>TOP PERFORMING AGENTS</div>
            {agentBars.map(b => (
              <div key={b.label} className="insight-bar-row">
                <div className="insight-bar-label">{b.label}</div>
                <div className="insight-bar-track">
                  <div className="insight-bar-fill" style={{ width: `${b.pct}%`, background: b.color }}>{b.pct}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>DAILY OPS VOLUME — LAST 7 DAYS</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
            {dayBars.map(b => (
              <div key={b.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '100%', background: b.color, borderRadius: '3px 3px 0 0', height: `${b.h}%` }} />
                <div style={{ fontFamily: 'var(--mono)', fontSize: '8px', color: 'var(--text3)' }}>{b.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
