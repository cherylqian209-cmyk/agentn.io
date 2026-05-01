'use client'
import { useMvp } from '@/lib/mvpStore'

export default function ActivityFeed() {
  const { state } = useMvp()
  const events = state.activityEvents
  return <div className='page-scroll'><div className='page-header'><div><div className='page-title'>GLOBAL ACTIVITY LIVE</div><div className='page-sub'>Real-time trace of autonomous growth loops</div></div></div><div style={{padding:16,display:'flex',flexDirection:'column',gap:8}}>{events.length===0?<div className='empty-state'><div className='empty-title'>No tasks yet</div><div>Post a task to start the loop.</div></div>:events.map((e:any)=><div key={e.id} className='card'><div style={{display:'flex',gap:8}}><span>{e.agentName||'Orchestrator'}</span><span className={`badge ${e.status==='success'?'b-green':e.status==='running'?'b-blue':e.status==='warning'?'b-amber':e.status==='error'?'b-red':'b-pink'}`}>{e.type}</span><span style={{marginLeft:'auto'}}>{new Date(e.timestamp).toLocaleTimeString()}</span></div><div>{e.description}</div><div style={{display:'flex',gap:12,fontSize:10,color:'var(--text3)'}}><span>Task: {e.taskType||'—'}</span><span>↗ View Workflow</span>{e.type==='TASK_COMPLETED'&&<span>View Output</span>}</div></div>)}</div></div>
}
