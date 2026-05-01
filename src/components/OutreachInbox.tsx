'use client'

import { useMemo } from 'react'
import { useMvp } from '@/lib/mvpStore'

const gmailScopes = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
]

export default function OutreachInbox() {
  const { state, connectGmail, useDemoInbox, sendDraft, queueFollowUp } = useMvp()
  const outreach = state.outreach ?? { gmailConnected: false, mode: 'live', threads: [] }

  const metrics = useMemo(() => {
    const sent = outreach.threads.filter((t: any) => t.status === 'sent' || t.status === 'replied').length
    const replied = outreach.threads.filter((t: any) => t.status === 'replied').length
    return {
      sent,
      replied,
      rate: sent ? Math.round((replied / sent) * 100) : 0,
    }
  }, [outreach.threads])

  if (!outreach.gmailConnected) {
    return <div className='page-scroll'>
      <div className='page-header'>
        <div>
          <div className='page-title'>OUTREACH INBOX</div>
          <div className='page-sub'>SEND, RECEIVE & MONITOR AGENT-GENERATED OUTREACH</div>
        </div>
      </div>
      <div className='page-body'>
        <div className='card outreach-disconnected'>
          <div className='page-title' style={{ fontSize: 14 }}>GMAIL LINK REQUIRED</div>
          <p>Connect Gmail to send, receive, and monitor outreach threads from AgentN.</p>
          <div className='outreach-actions'>
            <button className='mbtn-ok' onClick={connectGmail}>Connect Gmail</button>
            <button className='mbtn-cancel' onClick={useDemoInbox}>Use Demo Inbox</button>
          </div>
          <div className='scopes-list'>
            {gmailScopes.map(scope => <div key={scope}>{scope}</div>)}
          </div>
        </div>
      </div>
    </div>
  }

  return <div className='page-scroll'>
    <div className='page-header'>
      <div>
        <div className='page-title'>OUTREACH INBOX</div>
        <div className='page-sub'>SEND, RECEIVE & MONITOR AGENT-GENERATED OUTREACH</div>
      </div>
      <span className='badge b-green'>{outreach.mode === 'demo' ? 'DEMO INBOX' : 'GMAIL CONNECTED'}</span>
    </div>
    <div className='page-body'>
      <div className='stat-row'>
        <div className='stat-box'><div className='stat-lbl'>THREADS MONITORED</div><div className='stat-val'>{outreach.threads.length}</div></div>
        <div className='stat-box'><div className='stat-lbl'>OUTBOUND SENT</div><div className='stat-val'>{metrics.sent}</div></div>
        <div className='stat-box'><div className='stat-lbl'>REPLIES RECEIVED</div><div className='stat-val'>{metrics.replied}</div></div>
        <div className='stat-box'><div className='stat-lbl'>REPLY RATE</div><div className='stat-val'>{metrics.rate}%</div></div>
      </div>

      <div className='table-wrap'>
        <table className='tbl'>
          <thead><tr><th>LEAD</th><th>SUBJECT</th><th>STATUS</th><th>CLASSIFICATION</th><th>ACTIONS</th></tr></thead>
          <tbody>
            {outreach.threads.map((thread: any) => <tr key={thread.id}>
              <td>{thread.leadName}<div className='stat-sub'>{thread.email}</div></td>
              <td>{thread.subject}</td>
              <td><span className={`badge ${thread.status === 'replied' ? 'b-blue' : 'b-amber'}`}>{thread.status}</span></td>
              <td>{thread.classification || 'Awaiting reply'}</td>
              <td>
                <div className='outreach-actions'>
                  {thread.status === 'draft' && <button className='btn-green' onClick={() => sendDraft(thread.id)}>Review + Send</button>}
                  {thread.status === 'replied' && <button className='btn-dim' onClick={() => queueFollowUp(thread.id)}>Agent Follow-up</button>}
                </div>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  </div>
}
