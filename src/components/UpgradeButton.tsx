'use client'
import { getPaywallCopy, type FeatureKey } from '@/lib/billing/entitlements'
import { useMvp } from '@/lib/mvpStore'

export default function UpgradeButton({feature, className='mbtn-cancel'}:{feature:FeatureKey; className?:string}){
  const { state, setToast } = useMvp()
  const copy = getPaywallCopy(feature, state?.billing?.plan ?? 'free')
  return <button className={className} onClick={()=>setToast(copy.cta)}>🔒 {copy.cta}</button>
}
