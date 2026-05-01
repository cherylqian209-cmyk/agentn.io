import { NextResponse } from 'next/server'
import { canUseFeature, getUpgradePlanForFeature, hasReachedLimit, type FeatureKey, type Plan } from './entitlements'

export type UsageSnapshot = { scansThisMonth:number; leadsRevealedThisMonth:number; draftsGeneratedThisMonth:number; activeAgents:number; workspacesUsed:number }
export const getRequestPlan = (req: Request): Plan => ((req.headers.get('x-agentn-plan') as Plan) || 'free')
export function paywallError(feature: FeatureKey) {
  const requiredPlan = getUpgradePlanForFeature(feature)
  return NextResponse.json({ code:'PAYWALL_REQUIRED', feature, requiredPlan, message:`${feature} requires ${requiredPlan} plan` }, { status: 402 })
}
export function enforceFeature(plan: Plan, feature: FeatureKey) { return canUseFeature(plan, feature) }
export function enforceLimit(plan: Plan, key:'scansPerMonth'|'leadsPerMonth'|'draftsPerMonth'|'maxActiveAgents'|'maxWorkspaces', usage:number) { return !hasReachedLimit(plan, key, usage) }
