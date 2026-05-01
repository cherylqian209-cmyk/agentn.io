'use client'

import { useState } from 'react'

interface TaskRunResult {
  taskId: string
  taskRunId: string
  artifact: { content: string; type: string }
  proofLog: { model: string; durationMs: number; estimatedCost: number; status: string; inputHash: string; outputHash: string }
}

interface Props {
  open: boolean
  onClose: () => void
  onCompleted: (result: TaskRunResult) => void
}

type Step = 'form' | 'running' | 'done' | 'error'

export default function PostTaskModal({ open, onClose, onCompleted }: Props) {
  const [goal, setGoal] = useState('')
  const [targetCustomer, setTargetCustomer] = useState('')
  const [desiredOutput, setDesiredOutput] = useState('')
  const [budget, setBudget] = useState('1.00')
  const [step, setStep] = useState<Step>('form')
  const [result, setResult] = useState<TaskRunResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [statusText, setStatusText] = useState('')

  async function handleRun() {
    if (!goal.trim()) {
      setErrorMsg('Goal is required.')
      return
    }
    setErrorMsg('')
    setStep('running')
    setStatusText('Creating task record...')

    try {
      // 1. Create task
      const taskRes = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, targetCustomer, desiredOutput, budget: parseFloat(budget) || 1 }),
      })
      if (!taskRes.ok) throw new Error((await taskRes.json()).error ?? 'Failed to create task')
      const { taskId } = await taskRes.json()

      setStatusText('Running AI agent...')

      // 2. Execute task run
      const runRes = await fetch('/api/task-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, goal, targetCustomer, desiredOutput }),
      })
      if (!runRes.ok) throw new Error((await runRes.json()).error ?? 'Task run failed')
      const runData: TaskRunResult = await runRes.json()

      setResult(runData)
      setStep('done')
      onCompleted(runData)
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Unknown error')
      setStep('error')
    }
  }

  function handleClose() {
    setStep('form')
    setResult(null)
    setErrorMsg('')
    setGoal('')
    setTargetCustomer('')
    setDesiredOutput('')
    setBudget('1.00')
    onClose()
  }

  if (!open) return null

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) handleClose() }}>
      <div className="modal" style={{ width: '480px' }}>
        {step === 'form' && (
          <>
            <h3>▷ POST TASK</h3>

            <label>GROWTH GOAL *</label>
            <textarea
              placeholder="e.g. Generate 20 cold email subject lines for a B2B SaaS targeting CTOs"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              style={{ minHeight: '70px' }}
            />

            <label>TARGET CUSTOMER</label>
            <input
              type="text"
              placeholder="e.g. Series B SaaS founders, 50–200 employees"
              value={targetCustomer}
              onChange={e => setTargetCustomer(e.target.value)}
            />

            <label>DESIRED OUTPUT</label>
            <input
              type="text"
              placeholder="e.g. List of subject lines with open-rate scores"
              value={desiredOutput}
              onChange={e => setDesiredOutput(e.target.value)}
            />

            <label>BUDGET (USD)</label>
            <input
              type="number"
              placeholder="1.00"
              min="0"
              step="0.01"
              value={budget}
              onChange={e => setBudget(e.target.value)}
            />

            {errorMsg && (
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--red)', marginBottom: '8px' }}>
                ✕ {errorMsg}
              </div>
            )}

            <div className="modal-actions">
              <button className="mbtn-cancel" onClick={handleClose}>CANCEL</button>
              <button className="mbtn-ok" onClick={handleRun}>▷ RUN TASK</button>
            </div>
          </>
        )}

        {step === 'running' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--green)', marginBottom: '16px' }}>
              ▷ EXECUTING TASK
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <span className="spinner" style={{ width: '24px', height: '24px' }} />
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text3)' }}>{statusText}</div>
          </div>
        )}

        {step === 'done' && result && (
          <>
            <h3>✓ TASK COMPLETED</h3>

            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', marginBottom: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ARTIFACT OUTPUT
            </div>
            <div className="artifact-box">{result.artifact.content}</div>

            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              PROOF OF WORK
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '12px' }}>
              {[
                { label: 'MODEL', val: result.proofLog.model },
                { label: 'STATUS', val: result.proofLog.status },
                { label: 'DURATION', val: `${(result.proofLog.durationMs / 1000).toFixed(1)}s` },
                { label: 'EST. COST', val: `$${result.proofLog.estimatedCost.toFixed(4)}` },
                { label: 'INPUT HASH', val: result.proofLog.inputHash.slice(0, 14) + '…' },
                { label: 'OUTPUT HASH', val: result.proofLog.outputHash.slice(0, 14) + '…' },
              ].map(row => (
                <div key={row.label} className="econ-card">
                  <div className="econ-lbl">{row.label}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text)', fontWeight: 700, marginTop: '2px', wordBreak: 'break-all' }}>{row.val}</div>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="mbtn-ok" onClick={handleClose} style={{ flex: 'none', width: '100%' }}>✓ CLOSE</button>
            </div>
          </>
        )}

        {step === 'error' && (
          <>
            <h3 style={{ color: 'var(--red)' }}>✕ TASK FAILED</h3>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text2)', marginBottom: '16px' }}>
              {errorMsg}
            </div>
            <div className="modal-actions">
              <button className="mbtn-cancel" onClick={handleClose}>CLOSE</button>
              <button className="mbtn-ok" onClick={() => setStep('form')}>↺ RETRY</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
