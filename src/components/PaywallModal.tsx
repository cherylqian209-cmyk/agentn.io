'use client'
import { useMvp } from '@/lib/mvpStore'

const SOLO_STRIPE_URL = 'https://buy.stripe.com/14AcN6bli0WfayWgOy8g004'
const SWARM_STRIPE_URL = 'https://buy.stripe.com/28E4gA89634n6iG2XI8g005'

export default function PaywallModal(){
  const { state, closePaywall } = useMvp()
  const paywall = state?.billing?.paywall
  if(!paywall) return null
  const cta = paywall.requiredPlan === 'swarm' ? SWARM_STRIPE_URL : SOLO_STRIPE_URL
  return <div className='modal-overlay open' onClick={closePaywall}><div className='modal' onClick={e=>e.stopPropagation()}><h3>{paywall.title}</h3><div>{paywall.body}</div><div className='modal-actions'><button className='mbtn-ok' onClick={()=>{ if(paywall.requiredPlan==='enterprise'){ window.location.href='/contact'; return } window.location.href=cta }}>{paywall.cta}</button><button className='mbtn-cancel' onClick={()=>window.location.href='/'}>Compare plans</button></div></div></div>
}
