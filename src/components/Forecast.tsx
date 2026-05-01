'use client'

import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Funnel,
  FunnelChart,
  Legend,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { agentPerformanceMock, forecastInputs, forecastMonthlyBase } from '@/lib/forecastMockData'

type SliderKey = Exclude<keyof typeof forecastInputs, 'activeCustomers' | 'targetMrr'>

const sliderMeta: { key: SliderKey; label: string; min: number; max: number; step: number; isPercent?: boolean }[] = [
  { key: 'leadVolume', label: 'Monthly lead volume', min: 200, max: 10000, step: 50 },
  { key: 'qualificationRate', label: 'Qualification rate', min: 0.05, max: 0.8, step: 0.01, isPercent: true },
  { key: 'replyRate', label: 'Reply rate', min: 0.01, max: 0.4, step: 0.01, isPercent: true },
  { key: 'meetingRate', label: 'Meeting booking rate', min: 0.05, max: 0.9, step: 0.01, isPercent: true },
  { key: 'trialRate', label: 'Trial conversion rate', min: 0.05, max: 0.9, step: 0.01, isPercent: true },
  { key: 'paidConversionRate', label: 'Paid conversion rate', min: 0.05, max: 0.8, step: 0.01, isPercent: true },
  { key: 'averageRevenuePerCustomer', label: 'Average revenue per customer', min: 30, max: 2000, step: 10 },
  { key: 'monthlyChurnRate', label: 'Monthly churn', min: 0.005, max: 0.2, step: 0.005, isPercent: true },
]

export default function Forecast() {
  const [inputs, setInputs] = useState(forecastInputs)

  const computed = useMemo(() => {
    const newCustomers =
      inputs.leadVolume * inputs.qualificationRate * inputs.replyRate * inputs.meetingRate * inputs.trialRate * inputs.paidConversionRate
    const churnedCustomers = inputs.activeCustomers * inputs.monthlyChurnRate
    const netNewCustomers = newCustomers - churnedCustomers
    const currentMRR = inputs.activeCustomers * inputs.averageRevenuePerCustomer

    const buildProjection = (multiplier: number) => {
      let customers = inputs.activeCustomers
      return forecastMonthlyBase.map((month, idx) => {
        const adjustedNew = newCustomers * multiplier
        const adjustedChurned = customers * inputs.monthlyChurnRate
        customers = Math.max(customers + adjustedNew - adjustedChurned, 0)
        const mrr = customers * inputs.averageRevenuePerCustomer
        return { ...month, monthIndex: idx + 1, customers, mrr }
      })
    }

    const expected = buildProjection(1)
    const conservative = buildProjection(0.7)
    const aggressive = buildProjection(1.3)

    const chartData = expected.map((point, index) => ({
      month: point.month,
      conservative: conservative[index].mrr,
      expected: point.mrr,
      aggressive: aggressive[index].mrr,
      lowConfidence: point.mrr * 0.9,
      highConfidence: point.mrr * 1.1,
    }))

    const latestExpected = expected[expected.length - 1].mrr
    const projected30 = expected[0].mrr
    const projected90 = expected[2].mrr
    const projectedARR = latestExpected * 12
    const daysToTarget = netNewCustomers > 0
      ? Math.ceil(Math.max((inputs.targetMrr - currentMRR) / (netNewCustomers * inputs.averageRevenuePerCustomer), 0) * 30)
      : Infinity

    const funnelCounts = [
      inputs.leadVolume,
      inputs.leadVolume * inputs.qualificationRate,
      inputs.leadVolume * inputs.qualificationRate * 0.8,
      inputs.leadVolume * inputs.qualificationRate * inputs.replyRate,
      inputs.leadVolume * inputs.qualificationRate * inputs.replyRate * inputs.meetingRate,
      inputs.leadVolume * inputs.qualificationRate * inputs.replyRate * inputs.meetingRate * inputs.trialRate,
      newCustomers,
    ]
    const funnelSteps = ['Total Leads', 'Qualified Leads', 'Contacted', 'Replies', 'Meetings', 'Trials', 'Paid Customers']
    const funnel = funnelSteps.map((step, index) => {
      const count = funnelCounts[index]
      const prev = index === 0 ? count : funnelCounts[index - 1]
      return {
        step,
        count: Math.round(count),
        conversion: prev > 0 ? count / prev : 0,
        revenueImpact: count * inputs.averageRevenuePerCustomer,
      }
    })

    const weightedReply = inputs.replyRate * 100
    const weightedConversion = inputs.paidConversionRate * 100
    const weightedLeadVolume = Math.min((inputs.leadVolume / 3500) * 100, 100)
    const weightedChurn = Math.max(100 - inputs.monthlyChurnRate * 500, 0)
    const weightedVelocity = Math.min((netNewCustomers / 20) * 100, 100)
    const healthScore = Math.round(weightedReply * 0.22 + weightedConversion * 0.22 + weightedLeadVolume * 0.2 + weightedChurn * 0.2 + weightedVelocity * 0.16)

    const healthStatus =
      inputs.monthlyChurnRate > 0.08 ? 'Churn risk' :
      inputs.replyRate < 0.05 ? 'Conversion bottleneck' :
      inputs.leadVolume < 1200 ? 'Needs more leads' :
      latestExpected < inputs.targetMrr ? 'Revenue target at risk' : 'Healthy'

    const sensitivity = [
      { label: 'Qualified leads', delta: inputs.leadVolume * 0.1 * inputs.qualificationRate * inputs.replyRate * inputs.meetingRate * inputs.trialRate * inputs.paidConversionRate * inputs.averageRevenuePerCustomer },
      { label: 'Reply rate', delta: inputs.leadVolume * inputs.qualificationRate * 0.01 * inputs.meetingRate * inputs.trialRate * inputs.paidConversionRate * inputs.averageRevenuePerCustomer },
      { label: 'Trial conversion', delta: inputs.leadVolume * inputs.qualificationRate * inputs.replyRate * inputs.meetingRate * 0.01 * inputs.paidConversionRate * inputs.averageRevenuePerCustomer },
      { label: 'Churn', delta: -inputs.activeCustomers * 0.01 * inputs.averageRevenuePerCustomer },
    ]
    const biggestDriver = sensitivity.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0]

    return {
      chartData,
      summary: { currentMRR, projected30, projected90, projectedARR, daysToTarget },
      funnel,
      healthScore,
      healthStatus,
      biggestDriver,
      latestExpected,
    }
  }, [inputs])

  const attributionRows = useMemo(() => agentPerformanceMock
    .map(agent => ({ ...agent, efficiencyScore: (agent.revenueAttributed / agent.leadsGenerated) * 10 }))
    .sort((a, b) => b.revenueAttributed - a.revenueAttributed), [])

  return <div className="page-scroll forecast-page"><div className="page-header"><div className="page-title">FORECAST COMMAND CENTER</div></div>
    <div className="forecast-grid">
      <div className="forecast-main">
        <div className="forecast-card summary-grid">{[
          ['Current MRR', computed.summary.currentMRR],
          ['Projected MRR (30d)', computed.summary.projected30],
          ['Projected MRR (90d)', computed.summary.projected90],
          ['Projected ARR', computed.summary.projectedARR],
          ['Days to target MRR', computed.summary.daysToTarget === Infinity ? '—' : computed.summary.daysToTarget],
        ].map(([label, value]) => <div className="summary-card" key={String(label)}><div>{label}</div><strong>{typeof value === 'number' ? `$${Math.round(value).toLocaleString()}` : value}</strong></div>)}</div>
        <div className="forecast-card chart-card"><h3>Revenue Forecast</h3><ResponsiveContainer width="100%" height={320}><LineChart data={computed.chartData}><CartesianGrid stroke="#2a332a" strokeDasharray="3 3" /><XAxis dataKey="month" stroke="#8a9e8a" /><YAxis stroke="#8a9e8a" /><Tooltip /><Legend /><Area dataKey="highConfidence" stroke="none" fill="#00ff8820" /><Area dataKey="lowConfidence" stroke="none" fill="#0a0c0a" /><Line type="monotone" dataKey="conservative" stroke="#4499ff" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="expected" stroke="#00ff88" strokeWidth={3} dot={false} /><Line type="monotone" dataKey="aggressive" stroke="#ff66cc" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>

        <div className="forecast-card"><h3>Pipeline Funnel</h3><ResponsiveContainer width="100%" height={280}><FunnelChart><Tooltip /><Funnel dataKey="count" data={computed.funnel} isAnimationActive /></FunnelChart></ResponsiveContainer><div className="funnel-list">{computed.funnel.map(step => <div key={step.step}><span>{step.step}: {step.count}</span><span>{(step.conversion * 100).toFixed(1)}% · ${Math.round(step.revenueImpact).toLocaleString()}</span></div>)}</div></div>

        <div className="forecast-card"><h3>Scenario Simulator</h3><div className="sliders">{sliderMeta.map(slider => <label key={slider.key}><span>{slider.label}: <strong>{slider.isPercent ? `${(inputs[slider.key] * 100).toFixed(1)}%` : Math.round(inputs[slider.key]).toLocaleString()}</strong></span><input type="range" min={slider.min} max={slider.max} step={slider.step} value={inputs[slider.key]} onChange={e => setInputs(prev => ({ ...prev, [slider.key]: Number(e.target.value) }))} /></label>)}</div><div className="insight-box">What changed? <strong>{computed.biggestDriver.label}</strong> is the largest revenue driver ({computed.biggestDriver.delta >= 0 ? '+' : ''}${Math.round(computed.biggestDriver.delta).toLocaleString()} MRR sensitivity).</div></div>

        <div className="forecast-card"><h3>Agent Attribution</h3><table className="agent-table"><thead><tr><th>Agent</th><th>Leads</th><th>Replies</th><th>Pipeline</th><th>Won</th><th>Revenue</th><th>Efficiency</th></tr></thead><tbody>{attributionRows.map(agent => <tr key={agent.name}><td>{agent.name}</td><td>{agent.leadsGenerated}</td><td>{agent.repliesGenerated}</td><td>${agent.pipelineCreated.toLocaleString()}</td><td>{agent.customersWon}</td><td>${agent.revenueAttributed.toLocaleString()}</td><td>{agent.efficiencyScore.toFixed(1)}</td></tr>)}</tbody></table></div>
      </div>

      <div className="forecast-side">
        <div className="forecast-card"><h3>Pipeline Health Score</h3><ResponsiveContainer width="100%" height={220}><RadialBarChart cx="50%" cy="50%" innerRadius="55%" outerRadius="90%" barSize={18} data={[{ name: 'health', value: computed.healthScore, fill: '#00ff88' }]} startAngle={210} endAngle={-30}><RadialBar dataKey="value" cornerRadius={12} /><Tooltip /></RadialBarChart></ResponsiveContainer><div className="health-score">{computed.healthScore}/100</div><div className="health-status">{computed.healthStatus}</div></div>
        <div className="forecast-card"><h3>Next Best Moves</h3><ul className="next-moves"><li>Increase monthly qualified leads by {Math.max(Math.round((10000 - computed.latestExpected) / (inputs.averageRevenuePerCustomer * 0.18)), 0)} to hit $10k MRR in 60 days.</li><li>Reply rate is your biggest bottleneck. Improve from {(inputs.replyRate * 100).toFixed(1)}% to {(Math.min(inputs.replyRate * 100 + 2, 100)).toFixed(1)}% to add ${Math.round(inputs.leadVolume * inputs.qualificationRate * 0.02 * inputs.meetingRate * inputs.trialRate * inputs.paidConversionRate * inputs.averageRevenuePerCustomer).toLocaleString()} projected MRR.</li><li>{attributionRows[0].name} is producing the highest revenue per lead. Allocate more volume there.</li><li>Churn above 8% makes the aggressive forecast unlikely.</li></ul></div>
        <div className="forecast-card"><h3>Revenue Velocity</h3><ResponsiveContainer width="100%" height={200}><BarChart data={computed.chartData}><CartesianGrid stroke="#2a332a" strokeDasharray="3 3" /><XAxis dataKey="month" stroke="#8a9e8a" /><YAxis stroke="#8a9e8a" /><Tooltip /><Bar dataKey="expected" fill="#00ff8866" /></BarChart></ResponsiveContainer></div>
      </div>
    </div>
  </div>
}
