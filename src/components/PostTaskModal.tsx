'use client'
import { useMemo, useState } from 'react'
import { useMvp } from '@/lib/mvpStore'

export default function PostTaskModal({ open, onClose }: { open: boolean; onClose: () => void; onCompleted?: (result: unknown) => void }) {
  const { state, runTask, addEvent } = useMvp()
  const [step, setStep] = useState<'form'|'plan'>('form')
  const [f, setF] = useState({ title:'', desiredOutcome:'', type:'Lead Generation', priority:'normal', budgetLimit:100, runtimeLimit:30, outputFormat:'Table', recurrence:'one-time' })
  const [leadICP, setLeadICP] = useState({ productDescription:'', targetCustomer:'', industry:'', geography:'', companySize:'', buyingSignals:'', exclusions:'', desiredCount:25, sourceUrls:'', recurrence:'one-time' })
  const hasSearchKey = Boolean(process.env.NEXT_PUBLIC_SEARCH_API_KEY)
  const sourceUrls = leadICP.sourceUrls.split('\n').map(v => v.trim()).filter(Boolean).slice(0,10)
  const sampleMode = f.type === 'Lead Generation' && sourceUrls.length === 0 && !hasSearchKey

  const agents = useMemo(() => {
    const map: Record<string, string[]> = {
      'Lead Generation':['Lead-Extractor-V8','Market-Intel-Bot','Copywriter-GPT-4X','Cold-Outreach-Pro'],
      'Market Research':['Market-Intel-Bot','Scraper-Cluster-X','Summary-Agent'],
      'Copywriting':['Copywriter-GPT-4X','Performance-Scorer','Variant-Generator'],
    }
    return (map[f.type] || ['Lead-Extractor-V8']).map(n => state.agents.find((a:any)=>a.name===n) || { id:n, name:n, pricePerRun:0.1 })
  }, [f.type, state.agents])
  if (!open) return null
  return <div className="modal-overlay open" onClick={e=>e.target===e.currentTarget&&onClose()}><div className="modal" style={{width:620}}>
    {step==='form' ? <>
      <h3>Post New Task</h3>
      <label>Task title</label><input placeholder='Find 25 qualified B2B SaaS leads...' value={f.title} onChange={e=>setF({...f,title:e.target.value})}/>
      <label>Desired outcome</label><textarea value={f.desiredOutcome} onChange={e=>setF({...f,desiredOutcome:e.target.value})}/>
      <label>Task type</label><select value={f.type} onChange={e=>setF({...f,type:e.target.value})}>{['Lead Generation','Cold Outreach','Market Research','Copywriting','Data Scraping','CRM Sync','Optimization'].map(v=><option key={v}>{v}</option>)}</select>
      {f.type === 'Lead Generation' && <>
        <label>What you sell</label><input value={leadICP.productDescription} onChange={e=>setLeadICP({...leadICP, productDescription:e.target.value})} />
        <label>Target customer</label><input value={leadICP.targetCustomer} onChange={e=>setLeadICP({...leadICP, targetCustomer:e.target.value})} />
        <label>Industry / Geography / Company size</label><input placeholder='B2B SaaS / US / 1-200' value={`${leadICP.industry} / ${leadICP.geography} / ${leadICP.companySize}`} onChange={e=>{ const [industry, geography, companySize] = e.target.value.split('/').map(v=>v.trim()); setLeadICP({...leadICP, industry, geography, companySize}) }} />
        <label>Buying signals (comma-separated)</label><input value={leadICP.buyingSignals} onChange={e=>setLeadICP({...leadICP, buyingSignals:e.target.value})} />
        <label>Exclusions (comma-separated)</label><input value={leadICP.exclusions} onChange={e=>setLeadICP({...leadICP, exclusions:e.target.value})} />
        <label>Desired lead count</label><input type='number' value={leadICP.desiredCount} onChange={e=>setLeadICP({...leadICP, desiredCount:Number(e.target.value)})} />
        <label>Source URLs (public only, one per line, max 10)</label><textarea value={leadICP.sourceUrls} onChange={e=>setLeadICP({...leadICP, sourceUrls:e.target.value})} />
        {hasSearchKey ? <div className='card'>Find sources automatically is enabled.</div> : <div className='card'>Find sources automatically unavailable (no search API key).</div>}
        {sampleMode && <div className='card'>Sample mode: no URLs and no search key. Output will be labeled sample data.</div>}
      </>}
      <div className='modal-actions'><button className='mbtn-cancel' onClick={onClose}>Cancel</button><button className='mbtn-ok' onClick={()=>{addEvent({type:'EXECUTION_PLAN_GENERATED',title:'Execution plan generated',description:f.title || 'New task',status:'info',taskType:f.type});setStep('plan')}}>Generate Execution Plan</button></div>
    </> : <>
      <h3>Execution Plan</h3>
      <div className='card'>Detected sources: {sourceUrls.length || 0} · Recommended agents: {agents.map((a:any)=>a.name).join(', ')}</div>
      <div className='card'>Estimated fetches: {Math.min(10, Math.max(1, sourceUrls.length)) + 25} max · Expected leads: {leadICP.desiredCount}</div>
      <div className='card'>Scoring rubric: ICP(40) + signals(25) + contact(20) + recent/public evidence(10) + clean evidence(5)</div>
      <div className='card'>Validation checks: URL safety, fetch visibility, evidence presence, deterministic score grades.</div>
      <div className='modal-actions'><button className='mbtn-cancel' onClick={()=>setStep('form')}>Edit Task</button><button className='mbtn-cancel' onClick={onClose}>Cancel</button><button className='mbtn-ok' onClick={()=>{runTask({ ...f, leadICP: { ...leadICP, buyingSignals: leadICP.buyingSignals.split(',').map(v=>v.trim()).filter(Boolean), exclusions: leadICP.exclusions.split(',').map(v=>v.trim()).filter(Boolean), sourceUrls, recurrence: f.recurrence } }, agents); onClose(); setStep('form')}}>Approve & Run</button></div>
    </>}
  </div></div>
}
