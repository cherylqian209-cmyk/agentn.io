'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type TaskType = 'Lead Generation' | 'Cold Outreach' | 'Market Research' | 'Copywriting' | 'Data Scraping' | 'CRM Sync' | 'Optimization' | 'Data Lab'
export type OutputFormat = 'Table' | 'Summary' | 'CSV' | 'JSON' | 'Email Drafts' | 'Research Brief'
export type Recurrence = 'one-time' | 'daily' | 'weekly' | 'monthly'

type Agent = { id: string; name: string; description: string; category: string; pricePerRun: number; rating: number; status: 'verified'|'popular'|'new'|'beta'; tags: string[]; runs: number }
type Task = { id: string; title: string; desiredOutcome: string; type: TaskType; priority: 'low'|'normal'|'high'|'critical'; budgetLimit:number; runtimeLimit:number; outputFormat: OutputFormat; recurrence: Recurrence; status: 'queued'|'routing'|'running'|'validating'|'completed'|'failed'|'disputed'; progress:number; agents: Agent[]; estimatedCost:number; actualCost?:number; estimatedRuntime:string; startedAt?:string; completedAt?:string; proofHash?:string; logs:string[]; artifact?: any; leadICP?: any }
type ActivityEvent = { id:string; type:string; title:string; description:string; timestamp:string; agentName?:string; taskId?:string; status:'success'|'running'|'warning'|'error'|'info'; taskType?: string }
type Contract = { id:string; client:string; agentName:string; taskTitle:string; recurrence:'daily'|'weekly'|'monthly'; monthlyValue:number; sla:number; nextRunDate:string; status:'active'|'expiring'|'at-risk'|'terminated'; createdFromTaskId?:string }
type Proof = { id:string; taskId:string; agentName:string; type:TaskType; duration:string; cost:number; status:'verified'|'pending'|'failed'|'disputed'; hash:string; logs:string[]; artifact?: Record<string, unknown>[] }
type OutreachThread = { id:string; leadName:string; email:string; subject:string; body:string; status:'draft'|'sent'|'replied'; classification?:'Interested'|'Not interested'|'Referral'|'Out of office'; updatedAt:string }

const seedAgents: Agent[] = [
  { id: 'a1', name: 'Lead-Extractor-V8', description: 'Extracts leads from web sources.', category: 'DATA', pricePerRun: 0.08, rating: 4.7, status: 'popular', tags: ['lead','data'], runs: 1820 },
  { id: 'a2', name: 'Market-Intel-Bot', description: 'Competitor and market signal intelligence.', category: 'RESEARCH', pricePerRun: 0.22, rating: 4.5, status: 'beta', tags: ['research'], runs: 920 },
  { id: 'a3', name: 'Copywriter-GPT-4X', description: 'High-converting outreach copy generation.', category: 'CONTENT', pricePerRun: 0.15, rating: 4.8, status: 'verified', tags: ['copy'], runs: 2031 },
  { id: 'a4', name: 'Cold-Outreach-Pro', description: 'Multi-channel outreach sequences.', category: 'OUTREACH', pricePerRun: 0.12, rating: 4.9, status: 'verified', tags: ['email'], runs: 2440 },
]

const seedOutreachThreads: OutreachThread[] = [
  { id:'OT-1001', leadName:'Maya Chen', email:'maya@northstarhq.com', subject:'AgentN can automate lead qualification for Northstar', body:'Draft ready for review.', status:'draft', updatedAt:new Date().toISOString() },
  { id:'OT-1002', leadName:'Jonas Patel', email:'jonas@arcvelocity.io', subject:'Quick idea for ArcVelocity outbound ops', body:'Sent via AgentN.', status:'sent', updatedAt:new Date().toISOString() },
  { id:'OT-1003', leadName:'Elle Rivera', email:'elle@nova-labs.ai', subject:'Can AgentN reduce outreach ops overhead?', body:'Reply received.', status:'replied', classification:'Interested', updatedAt:new Date().toISOString() },
]

const Ctx = createContext<any>(null)

export function MvpProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<any>({ agents: seedAgents, tasks: [], activityEvents: [], proofRecords: [], contracts: [], activeTaskId: null, selectedAgentId: null, toast: '', outreach: { gmailConnected: false, mode: 'live', threads: seedOutreachThreads } })
  useEffect(() => { const raw = localStorage.getItem('agentn-mvp'); if (raw) setState(JSON.parse(raw)) }, [])
  useEffect(() => { localStorage.setItem('agentn-mvp', JSON.stringify(state)) }, [state])

  const api = useMemo(() => ({
    state,
    setToast: (toast: string) => setState((s:any)=>({ ...s, toast })),
    clearToast: () => setState((s:any)=>({ ...s, toast: '' })),
    selectAgent: (id:string) => setState((s:any)=>({ ...s, selectedAgentId:id })),
    addAgent: (agent: Agent) => setState((s:any)=>({ ...s, agents:[agent, ...s.agents], activityEvents:[{ id: crypto.randomUUID(), type:'AGENT_SPAWNED', title:'Agent spawned', description:`${agent.name} is now available.`, timestamp:new Date().toISOString(), status:'success', agentName:agent.name }, ...s.activityEvents], toast:'Agent spawned' })),
    addEvent: (event: Partial<ActivityEvent>) => setState((s:any)=>({ ...s, activityEvents:[{ id: crypto.randomUUID(), timestamp:new Date().toISOString(), status:'info', title:'Event', description:'', ...event }, ...s.activityEvents] })),
    connectGmail: () => setState((s:any)=>({ ...s, outreach:{ ...s.outreach, gmailConnected:true, mode:'live' }, activityEvents:[{ id: crypto.randomUUID(), type:'GMAIL_CONNECTED', title:'Gmail connected', description:'OAuth scopes approved for outreach inbox.', timestamp:new Date().toISOString(), status:'success' }, ...s.activityEvents], toast:'Gmail linked' })),
    useDemoInbox: () => setState((s:any)=>({ ...s, outreach:{ gmailConnected:true, mode:'demo', threads:seedOutreachThreads }, activityEvents:[{ id: crypto.randomUUID(), type:'DEMO_INBOX_ENABLED', title:'Demo inbox enabled', description:'Using mock outreach threads for review flow.', timestamp:new Date().toISOString(), status:'info' }, ...s.activityEvents] })),
    sendDraft: (threadId:string) => setState((s:any)=>{ const threads=s.outreach.threads.map((t:OutreachThread)=>t.id===threadId?{...t,status:'sent',updatedAt:new Date().toISOString()}:t); const thread=threads.find((t:OutreachThread)=>t.id===threadId); return { ...s, outreach:{ ...s.outreach, threads }, proofRecords:[{ id:`POW-OUT-${Date.now().toString().slice(-5)}`, taskId:threadId, agentName:'Cold-Outreach-Pro', type:'Cold Outreach', duration:'22s', cost:0.06, status:'verified', hash:`0x${Math.random().toString(16).slice(2,18)}`, logs:['Draft approved by user.','Email sent through Gmail connector.'], artifact:[{ subject: thread?.subject, recipient: thread?.email, action:'sent' }] }, ...s.proofRecords], activityEvents:[{ id: crypto.randomUUID(), type:'OUTREACH_SENT', title:'Outreach sent', description:`${thread?.subject ?? threadId}`, timestamp:new Date().toISOString(), status:'success', taskType:'Cold Outreach' }, ...s.activityEvents], toast:'Outreach sent' } }),
    queueFollowUp: (threadId:string) => setState((s:any)=>{ const thread=s.outreach.threads.find((t:OutreachThread)=>t.id===threadId); return { ...s, proofRecords:[{ id:`POW-OUT-${Date.now().toString().slice(-5)}`, taskId:`FU-${threadId}`, agentName:'Copywriter-GPT-4X', type:'Cold Outreach', duration:'16s', cost:0.04, status:'verified', hash:`0x${Math.random().toString(16).slice(2,18)}`, logs:['Reply classified by agent.','Follow-up drafted and queued for approval.'], artifact:[{ threadId, classification: thread?.classification, action:'follow-up drafted' }] }, ...s.proofRecords], activityEvents:[{ id: crypto.randomUUID(), type:'FOLLOW_UP_DRAFTED', title:'Follow-up drafted', description:`Agent drafted follow-up for ${thread?.leadName ?? threadId}`, timestamp:new Date().toISOString(), status:'running', taskType:'Cold Outreach' }, ...s.activityEvents], toast:'Follow-up draft ready' } }),
    runTask: (draft:any, agents:Agent[]) => {
      const id = `TK-${Date.now().toString().slice(-6)}`
      const task: Task = { id, title:draft.title, desiredOutcome:draft.desiredOutcome, type:draft.type, priority:draft.priority, budgetLimit:draft.budgetLimit, runtimeLimit:draft.runtimeLimit, outputFormat:draft.outputFormat, recurrence:draft.recurrence, status:'queued', progress:0, agents, estimatedCost: Number((agents.reduce((a,b)=>a+b.pricePerRun,0)*1.6).toFixed(2)), estimatedRuntime:`${Math.max(3,agents.length*2)}m`, startedAt:new Date().toISOString(), logs:['Task queued for orchestration.'], leadICP: draft.leadICP }
      setState((s:any)=>({ ...s, tasks:[task, ...s.tasks], activeTaskId:id, activityEvents:[{ id: crypto.randomUUID(), type:'TASK_POSTED', title:'Task posted', description:task.title, timestamp:new Date().toISOString(), status:'info', taskId:id, taskType:task.type }, ...s.activityEvents], toast:'Task started' }))
    },
    createContractFromTask: (taskId:string) => setState((s:any)=>({ ...s, contracts:[{ id:`C-${Date.now().toString().slice(-4)}`, client:'Internal Ops', agentName:'Task Swarm', taskTitle: s.tasks.find((t:Task)=>t.id===taskId)?.title ?? 'Task', recurrence:'weekly', monthlyValue:240, sla:97, nextRunDate:new Date(Date.now()+86400000).toISOString(), status:'active', createdFromTaskId:taskId }, ...s.contracts], activityEvents:[{ id: crypto.randomUUID(), type:'CONTRACT_CREATED', title:'Contract created', description:`Contract created from ${taskId}`, timestamp:new Date().toISOString(), status:'success', taskId }, ...s.activityEvents], toast:'Contract created' }))
  ,
    recordDataOperation: (datasetId:string, title:string, description:string, affectedRows=0) => setState((s:any)=> {
      const ts = new Date().toISOString()
      return {
        ...s,
        activityEvents:[{ id: crypto.randomUUID(), type:'DATA_LAB_OP', title, description, timestamp:ts, status:'info', taskType:'Data Lab' }, ...s.activityEvents],
        proofRecords:[{ id:`POW-DATA-${Date.now().toString().slice(-6)}`, taskId:`DATA-${datasetId.slice(0,6)}`, agentName:'Data Lab Engine', type:'Data Lab', duration:'instant', cost:0, status:'verified', hash:`0x${Math.random().toString(16).slice(2,18)}`, logs:[description], artifact:[{ affectedRows, datasetId, title }] }, ...s.proofRecords]
      }
    })
  }), [state])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useMvp = () => useContext(Ctx)
