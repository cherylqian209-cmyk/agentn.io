'use client'
import { useMemo, useState } from 'react'
import { useMvp } from '@/lib/mvpStore'

export default function PostTaskModal({ open, onClose }: { open: boolean; onClose: () => void; onCompleted?: (result: unknown) => void }) {
  const { state, runTask, addEvent } = useMvp()
  const [step, setStep] = useState<'form'|'plan'>('form')
  const [f, setF] = useState({ title:'', desiredOutcome:'', type:'Lead Generation', priority:'normal', budgetLimit:100, runtimeLimit:30, outputFormat:'Table', recurrence:'one-time' })
  const agents = useMemo(() => {
    const map: Record<string, string[]> = {
      'Lead Generation':['Lead-Extractor-V8','Market-Intel-Bot','Copywriter-GPT-4X','Cold-Outreach-Pro'],
      'Market Research':['Market-Intel-Bot','Scraper-Cluster-X','Summary-Agent'],
      'Copywriting':['Copywriter-GPT-4X','Performance-Scorer','Variant-Generator'],
    }
    return (map[f.type] || ['Lead-Extractor-V8']).map(n => state.agents.find((a:any)=>a.name===n) || { id:n, name:n, pricePerRun:0.1 })
  }, [f.type, state.agents])
  if (!open) return null
  return <div className="modal-overlay open" onClick={e=>e.target===e.currentTarget&&onClose()}><div className="modal" style={{width:560}}>
    {step==='form' ? <>
      <h3>Post New Task</h3>
      <label>Task title</label><input placeholder='Find 25 qualified B2B SaaS leads for Yacht Labs and draft personalized outreach.' value={f.title} onChange={e=>setF({...f,title:e.target.value})}/>
      <label>Desired outcome</label><textarea value={f.desiredOutcome} onChange={e=>setF({...f,desiredOutcome:e.target.value})}/>
      <label>Task type</label><select value={f.type} onChange={e=>setF({...f,type:e.target.value})}>{['Lead Generation','Cold Outreach','Market Research','Copywriting','Data Scraping','CRM Sync','Optimization'].map(v=><option key={v}>{v}</option>)}</select>
      <label>Priority</label><select value={f.priority} onChange={e=>setF({...f,priority:e.target.value})}>{['low','normal','high','critical'].map(v=><option key={v}>{v}</option>)}</select>
      <label>Budget limit</label><input type='number' value={f.budgetLimit} onChange={e=>setF({...f,budgetLimit:Number(e.target.value)})}/>
      <label>Runtime limit (min)</label><input type='number' value={f.runtimeLimit} onChange={e=>setF({...f,runtimeLimit:Number(e.target.value)})}/>
      <label>Output format</label><select value={f.outputFormat} onChange={e=>setF({...f,outputFormat:e.target.value})}>{['Table','Summary','CSV','JSON','Email Drafts','Research Brief'].map(v=><option key={v}>{v}</option>)}</select>
      <label>Recurrence</label><select value={f.recurrence} onChange={e=>setF({...f,recurrence:e.target.value})}>{['one-time','daily','weekly','monthly'].map(v=><option key={v}>{v}</option>)}</select>
      <div className='modal-actions'><button className='mbtn-cancel' onClick={onClose}>Cancel</button><button className='mbtn-ok' onClick={()=>{addEvent({type:'EXECUTION_PLAN_GENERATED',title:'Execution plan generated',description:f.title || 'New task',status:'info',taskType:f.type});setStep('plan')}}>Generate Execution Plan</button></div>
    </> : <>
      <h3>Execution Plan</h3>
      <div className='card'>Recommended agents: {agents.map((a:any)=>a.name).join(', ')}</div>
      <div className='card'>Estimated runtime: {Math.max(3,agents.length*2)}m · Estimated cost: ${(agents.reduce((n:number,a:any)=>n+(a.pricePerRun||0.1),0)*1.6).toFixed(2)}</div>
      <div className='card'>Expected deliverable: {f.outputFormat} · Validation checks: source completeness, duplicate removal, output format, budget, SLA.</div>
      <div className='card'>Risk level: {f.priority==='critical'?'Medium':'Low'} · Recurring contract eligible: Yes</div>
      <div className='modal-actions'><button className='mbtn-cancel' onClick={()=>setStep('form')}>Edit Task</button><button className='mbtn-cancel' onClick={onClose}>Cancel</button><button className='mbtn-ok' onClick={()=>{runTask(f, agents); onClose(); setStep('form')}}>Approve & Run</button></div>
    </>}
  </div></div>
}
