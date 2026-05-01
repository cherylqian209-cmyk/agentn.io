'use client';
import { useMemo, useState } from 'react';
import { OpportunityReport, OpportunityScanInput } from '@/lib/opportunity/types';

type Stage = 'landing' | 'scan' | 'loading' | 'report';
const steps = ['Analyzing business model','Identifying target customers','Finding acquisition channels','Generating sample opportunities','Drafting outreach','Building recommended workflow'];
const plans = [
  { name:'Free', price:'$0', items:['1 opportunity scan','10 sample opportunities','5 outreach drafts','workflow preview'] },
  { name:'Starter', price:'$19/mo', items:['250 opportunities/month','CSV export','saved workflows','manual outreach drafts'] },
  { name:'Pro', price:'$49/mo', items:['1,000 opportunities/month','enrichment','recurring scans','email queue','inbox monitoring','campaign analytics'] },
  { name:'Agency', price:'$149/mo', items:['multiple clients','white-label reports','team seats','higher limits'] }
];

export default function Home() {
  const [stage, setStage] = useState<Stage>('landing');
  const [loadingStep, setLoadingStep] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<OpportunityReport | null>(null);
  const [input, setInput] = useState<OpportunityScanInput>({ businessDescription:'', offerDescription:'', primaryGoal:'leads', preferredChannels:['email'] });

  const minimal = useMemo(() => !input.websiteUrl && input.businessDescription.trim().length < 20, [input]);
  const track = (name:string) => console.log('analytics', name);

  const runScan = async () => {
    if ((!input.websiteUrl && !input.businessDescription.trim()) || !input.offerDescription.trim() || !input.primaryGoal) { setError('Please complete required fields.'); return; }
    setError(''); setStage('loading'); track('opportunity_scan_started');
    let step = 0;
    const timer = setInterval(() => { step += 1; setLoadingStep(Math.min(step, steps.length-1)); }, 650);
    try {
      const res = await fetch('/api/opportunity-scan', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(input) });
      if (!res.ok) throw new Error('fail');
      const data = await res.json();
      setReport(data); setStage('report'); track('opportunity_scan_completed'); track('opportunity_report_viewed');
    } catch {
      setError('We could not generate the scan. Try simplifying your business description or entering your website again.');
      setStage('scan');
    } finally { clearInterval(timer); }
  };

  if (stage === 'landing') return <main className='op-wrap'><section className='hero'><h1>Your autonomous growth team.</h1><p>AgentN scans your business, finds revenue opportunities, and turns them into executable growth workflows.</p><div className='row'><button className='btn-green' onClick={()=>setStage('scan')}>Find my first 10 opportunities</button><button className='btn-dim' onClick={()=>document.getElementById('how')?.scrollIntoView({behavior:'smooth'})}>See how it works</button></div></section><section id='how' className='grid4'>{['Scan','Find','Draft','Execute'].map(s=><article key={s} className='card'><h3>{s}</h3><p>AgentN {s.toLowerCase()} stage preview for autonomous growth workflows.</p></article>)}</section><section className='grid4'>{['Founders','Agencies','Sales Teams','Operators'].map(s=><article key={s} className='card'><h3>{s}</h3><p>Find leads, draft outreach, and compound acquisition with automation.</p></article>)}</section><section className='grid4'>{plans.map(p=><article className='card' key={p.name}><h3>{p.name}</h3><p>{p.price}</p></article>)}</section></main>;

  if (stage === 'loading') return <main className='op-wrap'><h2>AgentN Opportunity Scan</h2><div className='card'>{steps.map((s,i)=><div key={s} className='step'>{i<=loadingStep?'●':'○'} {s}</div>)}</div></main>;

  if (stage === 'report' && report) return <main className='op-wrap report'><div className='sticky'><button className='btn-green' onClick={()=>{setShowUpgrade(true);track('upgrade_modal_opened')}}>Upgrade to execute workflow</button><button className='btn-dim' onClick={()=>alert('Please sign in to save report.')}>Save report</button></div>{minimal && <p className='warn'>Add more detail to improve this scan.</p>}<section className='card'><h2>Business Summary</h2><p>{report.businessSummary}</p></section><section className='card'><h2>Recommended ICP</h2><p>{report.recommendedICP.segmentName} — {report.recommendedICP.painPoint} — Trigger: {report.recommendedICP.buyingTrigger}</p></section><section className='card'><h2>Top Acquisition Channels</h2>{report.channels.map(c=><div key={c.id}><strong>{c.name}</strong> ({c.difficulty}/{c.expectedUpside}) — {c.whyItFits}</div>)}</section><section className='card'><h2>10 Sample Opportunities <span className='badge'>Free Preview</span></h2>{report.opportunities.map(o=><div key={o.id} className='opp'><strong>{o.name}</strong> <span className='badge'>{o.confidenceScore}%</span><p>{o.whyRelevant}</p><small>{o.sourceHint}</small></div>)}</section><section className='card'><h2>Outreach Pack</h2>{report.outreachDrafts.map(d=><div key={d.id} className='opp'><strong>{d.subject}</strong><p>{d.body}</p><button className='btn-dim' onClick={()=>{navigator.clipboard.writeText(`${d.subject}\n${d.body}`);track('outreach_copied')}}>Copy outreach</button></div>)}</section><section className='card'><h2>Recommended Agent Workflow</h2><ol>{report.workflowSteps.map(s=><li key={s}>{s}</li>)}</ol><button className='btn-dim' onClick={()=>{track('locked_run_workflow_clicked'); setShowUpgrade(true)}}>Run this workflow (Locked)</button></section><section className='card'><h2>Revenue Opportunity Estimate</h2><p>{report.revenueEstimate.conservative} / {report.revenueEstimate.moderate} / {report.revenueEstimate.upside}</p></section><section className='card'><h3>AgentN found your first 10 opportunities. Upgrade to turn this into an autonomous growth workflow.</h3><button className='btn-green' onClick={()=>setShowUpgrade(true)}>Upgrade to execute workflow</button><button className='btn-dim' onClick={()=>alert('Sign in required to save report.')}>Save report</button><button className='btn-dim' onClick={()=>{track('locked_export_clicked'); setShowUpgrade(true)}}>Export CSV (Locked)</button></section>{showUpgrade && <div className='modal'><div className='card'><h2>Upgrade to execute this workflow automatically.</h2><div className='grid4'>{plans.map(p=><div key={p.name}><strong>{p.name}</strong><p>{p.price}</p><button className='btn-green' onClick={()=>track('upgrade_clicked')}>Choose {p.name}</button></div>)}</div><button className='btn-dim' onClick={()=>setShowUpgrade(false)}>Close</button></div></div>}<div className='mobilebar'><button className='btn-green' onClick={()=>setShowUpgrade(true)}>Upgrade</button></div></main>;

  return <main className='op-wrap'><h2>Opportunity Scan</h2>{error && <p className='warn'>{error}</p>}<div className='card form'>{['websiteUrl','companyName','businessDescription','offerDescription','targetCustomer','pricePoint','geography','notes'].map((k)=><input key={k} placeholder={k} value={(input as any)[k]||''} onChange={e=>setInput(s=>({ ...s, [k]:e.target.value }))} />)}<select value={input.primaryGoal} onChange={e=>setInput(s=>({...s, primaryGoal:e.target.value as any}))}><option value='leads'>leads</option><option value='users'>users</option><option value='bookings'>bookings</option><option value='replies'>replies</option><option value='sales'>sales</option></select><input placeholder='preferred channels comma-separated' value={input.preferredChannels.join(',')} onChange={e=>setInput(s=>({...s, preferredChannels:e.target.value.split(',').map(v=>v.trim()).filter(Boolean)}))} /><button className='btn-green' onClick={runScan}>Generate opportunity scan</button></div></main>;
}
