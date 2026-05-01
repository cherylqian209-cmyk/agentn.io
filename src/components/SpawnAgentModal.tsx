'use client'

import { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  onSpawned: (agent: { id: string; name: string }) => void
}

export default function SpawnAgentModal({ open, onClose, onSpawned }: Props) {
  const [type, setType] = useState('WORKER_NODE')
  const [cluster, setCluster] = useState('')
  const [directive, setDirective] = useState('')
  const [budget, setBudget] = useState('0.50')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSpawn() {
    if (!cluster.trim() || !directive.trim()) {
      setError('Cluster target and directive are required.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, cluster, directive, budget: parseFloat(budget) || 0.5 }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? 'Failed to spawn agent')
      }
      const agent = await res.json()
      onSpawned(agent)
      setCluster('')
      setDirective('')
      setBudget('0.50')
      setType('WORKER_NODE')
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <h3>⊕ SPAWN NEW AGENT</h3>

        <label>AGENT TYPE</label>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="WORKER_NODE">WORKER_NODE</option>
          <option value="ORCHESTRATOR">ORCHESTRATOR</option>
          <option value="SCOUT">SCOUT</option>
          <option value="OPTIMIZER">OPTIMIZER</option>
        </select>

        <label>CLUSTER TARGET</label>
        <input
          type="text"
          placeholder="e.g. cold-email-cluster-v3"
          value={cluster}
          onChange={e => setCluster(e.target.value)}
        />

        <label>INITIAL DIRECTIVE</label>
        <textarea
          placeholder="Describe the task this agent should execute..."
          value={directive}
          onChange={e => setDirective(e.target.value)}
        />

        <label>COMPUTE BUDGET (USD)</label>
        <input
          type="number"
          placeholder="0.50"
          min="0"
          step="0.01"
          value={budget}
          onChange={e => setBudget(e.target.value)}
        />

        {error && (
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--red)', marginBottom: '8px' }}>
            ✕ {error}
          </div>
        )}

        <div className="modal-actions">
          <button className="mbtn-cancel" onClick={onClose} disabled={loading}>CANCEL</button>
          <button className="mbtn-ok" onClick={handleSpawn} disabled={loading}>
            {loading ? <span className="spinner" style={{ display: 'inline-block', width: '12px', height: '12px' }} /> : '⊕ SPAWN'}
          </button>
        </div>
      </div>
    </div>
  )
}
