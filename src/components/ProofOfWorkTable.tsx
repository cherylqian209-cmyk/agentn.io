'use client'
import { useState } from 'react'
import { useMvp } from '@/lib/mvpStore'
import { normalizeGeneratedItems, toCsvExport, toJsonExport } from '@/lib/generatedItems'

export default function ProofOfWorkTable() {
  const { state, createContractFromTask, requireFeature } = useMvp()
  const [sel, setSel] = useState<any>(null)
  const rows = state.proofRecords

  const exportPayload = sel
    ? normalizeGeneratedItems(sel.artifact?.generated ?? sel.artifact?.items ?? sel.artifact?.leads ?? sel.artifact, sel.artifact?.generated?.requestedCount ?? sel.artifact?.summary?.requested ?? 1)
    : null

  return <div className='page-scroll'><div className='page-header'><div><div className='page-title'>PROOF OF WORK</div></div></div><div className='page-body'>{rows.length===0?<div className='empty-state'><div className='empty-title'>No proof records yet</div></div>:<div className='table-wrap'><table className='tbl'><thead><tr><th>TASK</th><th>AGENT</th><th>TYPE</th><th>COST</th><th>STATUS</th></tr></thead><tbody>{rows.map((r:any)=><tr key={r.id} onClick={()=>setSel(r)} style={{cursor:'pointer'}}><td>{r.taskId}</td><td>{r.agentName}</td><td>{r.type}</td><td>${r.cost?.toFixed(2)}</td><td><span className='badge b-green'>{r.status}</span></td></tr>)}</tbody></table></div>}</div>{sel&&<div className='modal-overlay open' onClick={()=>setSel(null)}><div className='modal' onClick={e=>e.stopPropagation()}><h3>Proof Detail</h3><div>Task ID: {sel.taskId}</div><div>Status: Verified</div><div>Proof hash: {sel.hash}</div><div>Source URLs: {(sel.proofMeta?.sourceUrls ?? []).join(', ') || 'sample mode'}</div><div>Fetch stats: {sel.proofMeta?.successfulFetchCount ?? 0} success / {sel.proofMeta?.failedFetchCount ?? 0} failed</div><div>Generated {exportPayload?.generatedCount ?? 0} of {exportPayload?.requestedCount ?? 0} requested items.</div><div>Validation checks: {(sel.proofMeta?.validationChecks ?? []).join(', ')}</div>
{sel.artifact?.leads?.length ? <div className='table-wrap'><table className='tbl'><thead><tr><th>Company</th><th>Website</th><th>Contact</th><th>Role</th><th>Email</th><th>Signal</th><th>Fit Score</th><th>Suggested Opener</th><th>Source</th></tr></thead><tbody>{sel.artifact.leads.map((l:any)=><tr key={l.id}><td>{l.companyName}</td><td>{l.website}</td><td>{l.contactName ?? '—'}</td><td>{l.role ?? '—'}</td><td>{l.email ?? '—'}</td><td>{(l.buyingSignals??[])[0] ?? '—'}</td><td>{l.fitScore} ({l.scoreGrade})</td><td>{l.personalizedOpener}</td><td>{l.sourceUrl}</td></tr>)}</tbody></table></div> : <div className='artifact-box'>{JSON.stringify(sel.artifact,null,2)}</div>}
<div className='modal-actions'><button className='mbtn-ok' disabled={!exportPayload?.items.length} onClick={()=>{if(!requireFeature('exportCsv')||!exportPayload) return; const blob=new Blob([JSON.stringify(toJsonExport(exportPayload), null, 2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${sel.taskId}.json`; a.click()}}>Export JSON</button><button className='mbtn-ok' disabled={!exportPayload?.items.length} onClick={()=>{if(!requireFeature('exportJson')||!exportPayload) return; const blob=new Blob([toCsvExport(exportPayload)],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${sel.taskId}.csv`; a.click()}}>Export CSV</button><button className='mbtn-ok' onClick={()=>createContractFromTask(sel.taskId)}>Create Weekly Lead Contract</button></div></div></div>}</div>
}
