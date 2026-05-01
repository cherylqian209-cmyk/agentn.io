'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type TaskType = 'Lead Generation' | 'Cold Outreach' | 'Market Research' | 'Copywriting' | 'Data Scraping' | 'CRM Sync' | 'Optimization'
export type OutputFormat = 'Table' | 'Summary' | 'CSV' | 'JSON' | 'Email Drafts' | 'Research Brief'
export type Recurrence = 'one-time' | 'daily' | 'weekly' | 'monthly'

type Agent = { id: string; name: string; description: string; category: string; pricePerRun: number; rating: number; status: 'verified'|'popular'|'new'|'beta'; tags: string[]; runs: number }
type Task = { id: string; title: string; desiredOutcome: string; type: TaskType; priority: 'low'|'normal'|'high'|'critical'; budgetLimit:number; runtimeLimit:number; outputFormat: OutputFormat; recurrence: Recurrence; status: 'queued'|'routing'|'running'|'validating'|'completed'|'failed'|'disputed'; progress:number; agents: Agent[]; estimatedCost:number; actualCost?:number; estimatedRuntime:string; startedAt?:string; completedAt?:string; proofHash?:string; logs:string[]; artifact?: any; leadICP?: any }
type ActivityEvent = { id:string; type:string; title:string; description:string; timestamp:string; agentName?:string; taskId?:string; status:'success'|'running'|'warning'|'error'|'info'; taskType?: string }
type Contract = { id:string; client:string; agentName:string; taskTitle:string; recurrence:'daily'|'weekly'|'monthly'; monthlyValue:number; sla:number; nextRunDate:string; status:'active'|'expiring'|'at-risk'|'terminated'; createdFromTaskId?:string }
type Proof = { id:string; taskId:string; agentName:string; type:TaskType; duration:string; cost:number; status:'verified'|'pending'|'failed'|'disputed'; hash:string; logs:string[]; artifact?: Record<string, unknown>[] }

const seedAgents: Agent[] = [
  { id: 'a1', name: 'Lead-Extractor-V8', description: 'Extracts leads from web sources.', category: 'DATA', pricePerRun: 0.08, rating: 4.7, status: 'popular', tags: ['lead','data'], runs: 1820 },
  { id: 'a2', name: 'Market-Intel-Bot', description: 'Competitor and market signal intelligence.', category: 'RESEARCH', pricePerRun: 0.22, rating: 4.5, status: 'beta', tags: ['research'], runs: 920 },
  { id: 'a3', name: 'Copywriter-GPT-4X', description: 'High-converting outreach copy generation.', category: 'CONTENT', pricePerRun: 0.15, rating: 4.8, status: 'verified', tags: ['copy'], runs: 2031 },
  { id: 'a4', name: 'Cold-Outreach-Pro', description: 'Multi-channel outreach sequences.', category: 'OUTREACH', pricePerRun: 0.12, rating: 4.9, status: 'verified', tags: ['email'], runs: 2440 },
]

const Ctx = createContext<any>(null)

export function MvpProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<any>({ agents: seedAgents, tasks: [], activityEvents: [], proofRecords: [], contracts: [], activeTaskId: null, selectedAgentId: null, toast: '' })
  useEffect(() => { const raw = localStorage.getItem('agentn-mvp'); if (raw) setState(JSON.parse(raw)) }, [])
  useEffect(() => { localStorage.setItem('agentn-mvp', JSON.stringify(state)) }, [state])

  const api = useMemo(() => ({
    state,
    setToast: (toast: string) => setState((s:any)=>({ ...s, toast })),
    clearToast: () => setState((s:any)=>({ ...s, toast: '' })),
    selectAgent: (id:string) => setState((s:any)=>({ ...s, selectedAgentId:id })),
    addAgent: (agent: Agent) => setState((s:any)=>({ ...s, agents:[agent, ...s.agents], activityEvents:[{ id: crypto.randomUUID(), type:'AGENT_SPAWNED', title:'Agent spawned', description:`${agent.name} is now available.`, timestamp:new Date().toISOString(), status:'success', agentName:agent.name }, ...s.activityEvents], toast:'Agent spawned' })),
    addEvent: (event: Partial<ActivityEvent>) => setState((s:any)=>({ ...s, activityEvents:[{ id: crypto.randomUUID(), timestamp:new Date().toISOString(), status:'info', title:'Event', description:'', ...event }, ...s.activityEvents] })),
    runTask: async (draft:any, agents:Agent[]) => {
      const id = `TK-${Date.now().toString().slice(-6)}`
      const task: Task = { id, title:draft.title, desiredOutcome:draft.desiredOutcome, type:draft.type, priority:draft.priority, budgetLimit:draft.budgetLimit, runtimeLimit:draft.runtimeLimit, outputFormat:draft.outputFormat, recurrence:draft.recurrence, status:'queued', progress:0, agents, estimatedCost: Number((agents.reduce((a,b)=>a+b.pricePerRun,0)*1.6).toFixed(2)), estimatedRuntime:`${Math.max(3,agents.length*2)}m`, startedAt:new Date().toISOString(), logs:['Task queued for orchestration.'], leadICP: draft.leadICP }
      setState((s:any)=>({ ...s, tasks:[task, ...s.tasks], activeTaskId:id, activityEvents:[{ id: crypto.randomUUID(), type:'TASK_POSTED', title:'Task posted', description:task.title, timestamp:new Date().toISOString(), status:'info', taskId:id, taskType:task.type }, ...s.activityEvents], toast:'Task started' }))
      let leadResult:any = null
      if (draft.type === 'Lead Generation') {
        const res = await fetch('/api/leadgen/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ icp: draft.leadICP }) })
        leadResult = await res.json()
      }
      const milestones = [
        { p:10, status:'routing', log:'ICP compiled.', type:'ICP_BUILT' },
        { p:25, status:'running', log:'Sources discovered.', type:'SOURCES_DISCOVERED' },
        { p:40, status:'running', log:'Web fetch started.', type:'WEB_FETCH_STARTED' },
        { p:55, status:'running', log:'Web fetch completed.', type:'WEB_FETCH_COMPLETED' },
        { p:70, status:'running', log:'Candidates extracted.', type:'CANDIDATES_EXTRACTED' },
        { p:82, status:'running', log:'Leads scored.', type:'LEADS_SCORED' },
        { p:92, status:'validating', log:'Outreach generated and validated.', type:'OUTREACH_GENERATED' },
        { p:100, status:'completed', log:'Proof created.', type:'PROOF_CREATED' },
      ] as const
      milestones.forEach((m, i) => setTimeout(() => setState((s:any) => {
        const tasks = s.tasks.map((t:Task) => t.id !== id ? t : { ...t, progress:m.p, status:m.status as any, logs:[...t.logs, m.log], completedAt: m.p===100?new Date().toISOString():t.completedAt, proofHash: m.p===100?(leadResult?.proof?.proofHash ?? `0x${Math.random().toString(16).slice(2,18)}`):t.proofHash, actualCost: m.p===100?task.estimatedCost + 0.03:t.actualCost, artifact: m.p===100?(leadResult?.artifact ?? t.artifact):t.artifact }
        )
        const completed = tasks.find((t:Task)=>t.id===id)
        const ev = { id: crypto.randomUUID(), type:m.type, title:m.type.replace('_',' '), description:m.log, timestamp:new Date().toISOString(), status:m.p===100?'success':'running', taskId:id, taskType:draft.type }
        const next:any = { ...s, tasks, activityEvents:[ev, ...s.activityEvents] }
        if (m.p===100 && completed) {
          next.proofRecords = [{ id:`POW-${id}`, taskId:id, agentName:agents.map(a=>a.name).join(', '), type:draft.type, duration:'5m 12s', cost:completed.actualCost, status:'verified', hash:completed.proofHash, logs:completed.logs, artifact:completed.artifact, proofMeta: leadResult?.proof }, ...s.proofRecords]
          if (draft.recurrence !== 'one-time') next.contracts = [{ id:`C-${Date.now().toString().slice(-4)}`, client:'Internal Ops', agentName:agents.map(a=>a.name).join(', '), taskTitle:draft.title, recurrence:draft.recurrence, monthlyValue:Math.round((completed.actualCost??0)*30), sla:98, nextRunDate:new Date(Date.now()+86400000).toISOString(), status:'active', createdFromTaskId:id }, ...s.contracts]
        }
        return next
      }), (i+1)*1400))
    },
    createContractFromTask: (taskId:string) => setState((s:any)=>({ ...s, contracts:[{ id:`C-${Date.now().toString().slice(-4)}`, client:'Internal Ops', agentName:'Task Swarm', taskTitle: s.tasks.find((t:Task)=>t.id===taskId)?.title ?? 'Task', recurrence:'weekly', monthlyValue:240, sla:97, nextRunDate:new Date(Date.now()+86400000).toISOString(), status:'active', createdFromTaskId:taskId }, ...s.contracts], activityEvents:[{ id: crypto.randomUUID(), type:'CONTRACT_CREATED', title:'Contract created', description:`Contract created from ${taskId}`, timestamp:new Date().toISOString(), status:'success', taskId }, ...s.activityEvents], toast:'Contract created' }))
  }), [state])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useMvp = () => useContext(Ctx)
