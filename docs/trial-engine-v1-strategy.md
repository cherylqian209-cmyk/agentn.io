# Agentn Trial Engine v1 Strategy (B2B SaaS)

## 1) Positioning

**One-sentence positioning**  
Agentn is the autonomous trial conversion team for B2B SaaS: it monitors every trial, drives activation, and routes sales only when human intervention will increase close rate.

**Homepage headline options**
1. Turn more trials into revenue—automatically.
2. Your autonomous team for trial activation and conversion.
3. Never lose a high-fit trial account again.

**Subhead options**
1. Agentn watches every signup, drives activation milestones, syncs HubSpot + Stripe, and alerts sales only when timing is right.
2. Replace manual SDR/CSM trial follow-up with lifecycle automation built for 7–30 day SaaS trials.
3. Get one control room for trial health, hot accounts, and revenue impact.

**Why this niche is narrow enough to win**
- Clear buyer + pain: founders, growth, revops at 10–100 employee B2B SaaS companies feel trial leakage weekly.
- Shared stack: HubSpot + Stripe + product events create repeatable integration and onboarding playbooks.
- Repeatable funnel: 7–30 day trials share the same lifecycle signals, making strong defaults viable.
- Measurable ROI window: improvements in activation and trial-to-paid are visible inside one billing cycle.

**Why this can become indispensable**
- Agentn becomes system-of-action, not dashboard-only: it executes follow-up and routing.
- It touches high-stakes workflows (lead ownership, conversion moments, CRM truth, trial expiration).
- Revenue teams trust it because decisions are visible, auditable, and linked to conversion outcomes.
- Rip-out cost increases once playbooks, scoring, and sales timing are tuned to the company’s funnel.

---

## 2) Terminology Rewrite

| Old Term | New Term | Why the New Term is Better |
|---|---|---|
| Orchestrator | Trial Engine | Describes business outcome, not architecture. |
| Task | Playbook Step | Sounds like a concrete lifecycle action. |
| Execution plan | Trial Playbook | Matches how growth/revops teams think. |
| Agent spawned | Automation started | Plain language; no AI abstraction needed. |
| Global activity | Trial Timeline | Anchors events to trial lifecycle context. |
| Sync rate | Data health | Explains reliability of connected systems. |
| Compute | Processing usage (Admin) | Kept only in admin/billing context. |
| Cluster load | System capacity (Admin) | Infra details hidden from core users. |
| Neural load | Model usage (Admin) | Transparent, less jargon-heavy. |
| Marketplace | Playbook Library | Connects to business templates. |
| Data lab | Data Mapping | Clear setup purpose. |
| Outreach inbox | Follow-up Queue | Makes queue purpose explicit. |
| Proof of work | Action Log | Simple and auditable term. |
| Forecast | Trial Conversion Forecast | Scoped to trial outcomes. |
| Insights | Funnel Insights | Explicit about what is analyzed. |

---

## 3) Hero Workflows (Operators)

### A) Trial Shepherd
- **Job to be done:** Ensure every new signup gets the right first 7 days of follow-up.
- **Trigger conditions:** `trial_started` event received.
- **Inputs:** Account domain, contact role, plan, referral source, ICP score, trial length.
- **Actions:**
  - Create trial record + owner fallback.
  - Send Day 0 welcome message (email).
  - Schedule milestone checks (Day 1/3/7).
  - Write initial status to HubSpot lifecycle fields.
- **Outputs:** Enriched trial profile, active follow-up cadence, visible timeline.
- **User-visible value:** “No signup left behind” coverage from minute zero.

### B) Activation Watcher
- **Job to be done:** Move users from signup to activation milestone quickly.
- **Trigger conditions:** Key events fired, inactivity windows hit, milestone completion.
- **Inputs:** Product events, activation score, days since signup, team size hints.
- **Actions:**
  - Detect partial vs full activation.
  - Trigger milestone nudges via email.
  - Escalate stalled high-fit accounts into At Risk queue.
  - Update activation stage in CRM.
- **Outputs:** Activation status updates, nudge history, at-risk flags.
- **User-visible value:** More accounts hit “aha” before trial expiration.

### C) Sales Assist Router
- **Job to be done:** Route only high-intent, high-fit trial accounts to humans at the right moment.
- **Trigger conditions:** Intent threshold crossed, buying signals detected, nearing expiration.
- **Inputs:** ICP score, intent score, activation score, pricing-page views, invite events, Stripe payment attempts.
- **Actions:**
  - Create HubSpot task + owner assignment.
  - Post Slack alert (optional) with recommended talk track.
  - Pause low-value automations to avoid message collision.
  - Start “sales assist window” timer.
- **Outputs:** Prioritized hot-account queue, human handoff package.
- **User-visible value:** Sales spends time where close probability is highest.

---

## 4) Trial Funnel Design

| Stage | Entry Criteria | Exit Criteria | Recommended Automations | Recommended Notifications | CRM Updates |
|---|---|---|---|---|---|
| Signup | `trial_started` received | ICP scored + contact mapped | Welcome email, enrichment, playbook assignment | Internal: new trial digest | Create/associate contact, company, trial start date |
| Qualified | ICP score >= threshold (e.g., 60/100) | Activated OR At Risk | Persona-specific onboarding sequence | Notify owner for high-ACV domains | Set `trial_stage=Qualified`, `icp_tier` |
| Activated | Activation milestone met | High Intent OR Converted | Send “next value” content; prompt team invite | Celebrate activation in digest | Set `activated_at`, `activation_score` |
| High Intent | Intent score >= threshold (e.g., 70/100) | Converted OR Lost/Expired | Sales assist handoff, meeting CTA | Real-time alert to sales | Set `intent_status=High`, create task |
| At Risk | No key activity X days OR trial near expiry without activation | Activated OR Lost/Expired | Rescue cadence, offer help/demo | At-risk queue alert | Set `risk_reason`, `risk_since` |
| Converted | Paid subscription active in Stripe | — | Handoff to onboarding/CS | Win alert with influenced revenue | Set lifecycle stage customer, ARR fields |
| Lost / Expired | Trial ended without payment | Reactivation campaign start | Expiry follow-up sequence | Weekly lost summary | Set `lost_reason` + expiry date |

**Default activation milestone framework**
- **Milestone 1: Setup complete** (account configured + first core object created)
- **Milestone 2: First value event** (first report/automation/integration output)
- **Milestone 3: Collaborative use** (second user invited or shared artifact)
- **Milestone 4: Repeat value** (core value event repeated on separate day)

**Example activation events by SaaS type**
- **Analytics SaaS:** connected data source, dashboard published, dashboard viewed 3+ times.
- **Support SaaS:** first inbox connected, first ticket auto-routed, SLA policy activated.
- **Security SaaS:** first asset scan complete, first policy alert triaged.
- **Workflow SaaS:** first workflow published, first successful run, second team member edits.

---

## 5) Dashboard Information Architecture

**Screen name:** `Trial Command Center`

**Communicate in <10 seconds**
- How many active trials exist.
- Whether activation/conversion trend is up or down.
- Which accounts need action now.

**Primary KPI cards (top row)**
1. Active Trials (current)
2. Activation Rate (7d / 30d)
3. Trial-to-Paid Conversion (30d rolling)
4. Hot Accounts (high intent not yet contacted)
5. At-Risk Qualified Trials
6. Revenue Influenced (won ARR touched by Agentn)

**Main tables/lists**
- **Hot Accounts Now** (account, score, signal, owner, recommended next step)
- **At-Risk Trials** (days inactive, stage, risk reason, last touch)
- **Today’s Follow-up Queue** (automated + pending human tasks)

**Right rail modules**
- Daily Digest snapshot
- Integrations/Data Health
- Playbook performance (top converting sequence)

**Recommended alerts**
- “High-fit account reached intent threshold with 5 days left.”
- “Qualified trial inactive for 72 hours.”
- “Stripe payment attempt failed after trial expiry.”

**Required views**
- Daily Digest
- At-Risk Trials
- Hot Accounts
- Funnel Trends
- Revenue Influenced

---

## 6) v1 Product Scope (Strict)

### Must Have
- Trial lifecycle model + stage transitions.
- HubSpot bi-directional field sync for core trial fields.
- Stripe conversion/expiry ingestion.
- Event ingestion for activation + intent signals.
- Rule-based email follow-up automation.
- Hot accounts queue + at-risk queue.
- Sales handoff task creation in HubSpot.
- Command Center dashboard with 5 core widgets.

### Should Have
- Playbook templates by motion (PLG self-serve, hybrid sales assist).
- Basic scoring controls (threshold tuning).
- Digest email (daily).
- Manual stage override with audit log.

### Nice Later
- In-app nudges/checklists.
- Multivariate message experiments.
- Persona-specific AI copy suggestions.
- Advanced attribution models.
- Vertical-specific activation packs.

---

## 7) Event Schema and Data Model

### Core Objects
1. **Account** (`account_id`, `domain`, `company_name`, `employee_count`, `industry`, `icp_score`, `owner_id`)
2. **Contact** (`contact_id`, `email`, `role`, `seniority`, `account_id`, `hubspot_contact_id`)
3. **Trial** (`trial_id`, `account_id`, `start_at`, `end_at`, `stage`, `activation_score`, `intent_score`, `status`)
4. **Event** (`event_id`, `trial_id`, `account_id`, `contact_id`, `event_name`, `event_at`, `properties_json`, `source`)
5. **PlaybookRun** (`run_id`, `trial_id`, `playbook_id`, `state`, `started_at`, `last_step_at`)
6. **Action** (`action_id`, `trial_id`, `action_type`, `channel`, `status`, `created_at`, `completed_at`)
7. **StageHistory** (`trial_id`, `from_stage`, `to_stage`, `changed_at`, `reason`)

### Required Product Events
- `trial_started`
- `user_invited`
- `integration_connected`
- `key_action_completed` (product-specific)
- `session_active`
- `pricing_page_viewed`
- `demo_requested`
- `trial_expiring_soon`
- `subscription_started` (from Stripe)
- `trial_expired`

### Derived Traits / Computed States
- `days_to_expiry`
- `inactive_days`
- `is_high_fit`
- `is_activated`
- `is_high_intent`
- `risk_level` (low/med/high)

### Scoring Models (v1 heuristic)
- **ICP Score (0–100):** company size fit (30), industry fit (20), role/seniority (20), region/segment (10), inferred ACV proxy (20).
- **Intent Score (0–100):** pricing views (20), invite teammates (20), repeat key action (25), demo request (25), trial days remaining <=5 with activity (10).
- **Activation Score (0–100):** setup completion (30), first value event (30), repeat value event (20), collaborator added (20).

---

## 8) Rules Engine (Simple but Powerful)

### Trigger Types
- Event-based (`event_name` occurs)
- State-based (stage changed)
- Time-based (X days since start / before expiry)
- Threshold-based (score crosses value)

### Condition Model
- Boolean groups: `ALL` / `ANY`
- Field operators: equals, contains, >=, <=, in last X days

### Action Types
- Send email template
- Create HubSpot task
- Update trial stage/field
- Assign owner
- Add to queue (hot/at-risk)
- Post webhook/Slack

### Suppression Logic
- Do not send same template twice in 72h.
- Suppress automation if opportunity stage is `Negotiation`.
- Suppress low-priority nudges after manual sales touch in last 24h.

### Cooldown Logic
- Per trial per action type cooldown windows (24h/72h configurable).

### Escalation Logic
- If high-fit + at-risk + <=3 days to expiry => create urgent sales task.

### Human Handoff Rules
- Handoff package must include: why flagged, last 5 signals, recommended outreach line, expiry date.

### Five Default Automation Recipes
1. **Welcome + Setup Push:** on `trial_started`, send welcome + setup checklist.
2. **Activation Stall Rescue:** if no key action in 48h, send help email + resource link.
3. **High Intent Handoff:** intent score crosses 70, create HubSpot task + alert.
4. **Expiry Acceleration:** 3 days before expiry and not activated, send urgency sequence.
5. **Post-Expiry Winback:** 1 day after expiry without conversion, send extension/demo offer.

---

## 9) UX and Navigation

### Primary Nav
- Command Center
- Trials
- Hot Accounts
- At Risk
- Playbooks
- Reports

### Secondary Nav (within pages)
- Filters, saved views, owners, segments, date ranges.

### Move/Merge/Hide Current Items
- Move infra-heavy items (`Compute`, `Clusters`, `Neural Load`) to **Admin > System**.
- Merge `Global Activity` into **Trial Timeline**.
- Replace `Marketplace` with **Playbook Library**.
- Replace `Data Lab` with **Data Mapping** under Setup/Admin.

### Activity Feed Becomes
- **Action Timeline** with human + automated actions in one chronological log tied to each trial/account.

### Main UI Object Model
- Primary object: **Trial Account** (company-centered)
- Nested: contacts, timeline events, scores, current stage, next best action.

---

## 10) Onboarding Flow

**Goal:** live and producing actionable queues within 60 minutes.

### Steps
1. **Connect systems:** HubSpot + Stripe + event source.
2. **Map trial start + conversion events:** choose required canonical events.
3. **Define activation milestone:** pick from templates + one custom key action.
4. **Choose playbook:** PLG default or Hybrid sales-assist default.
5. **Set routing rules:** choose handoff owner logic + alert channel.
6. **Review & launch:** validate sample accounts and turn on automation.

### Success Criteria
- New trial appears in Command Center.
- At least one automation fires in test mode.
- One test HubSpot task created from a mock high-intent event.

**Time-to-value target:** first actionable hot/at-risk queue within Day 1.

---

## 11) Pricing and Packaging

| Tier | Who it’s for | Limits that Matter | Feature Gates | Suggested Price |
|---|---|---|---|---|
| Launch | Early PLG teams, <=300 trials/mo | Monthly trial volume, 1 playbook, 3 users | Core dashboard, basic automations, HubSpot/Stripe sync | $500–$900/mo |
| Growth | Scaling teams, 300–2,000 trials/mo | Trial volume, 5 playbooks, 10 users | Advanced scoring, SLA alerts, digest reports, priority support | $1,500–$3,000/mo |
| Scale | Hybrid sales-led orgs, 2,000+ trials/mo | Volume bands + seats | Multi-team routing, custom objects, SSO, dedicated success | $4,000+/mo |

**Packaging logic**
- Meter by **active trials/month** + feature depth.
- Position value as **incremental conversions and influenced ARR**, not AI usage.

---

## 12) 6-Week Implementation Plan

| Week | Product Decisions | Data Work | Backend Logic | Frontend UX | Integrations | QA / Pilot |
|---|---|---|---|---|---|---|
| 1 | Finalize funnel stages, scoring heuristics, v1 copy | Define canonical schema + event contract | Stage transition service skeleton | Nav restructure + Command Center wireframe | Audit HubSpot/Stripe fields | Test plan + pilot customer selection |
| 2 | Lock playbook templates (PLG/Hybrid) | Build ingestion + normalization pipelines | Rules engine v1 (triggers/conditions/actions) | Trials list + trial detail timeline | HubSpot write-back for stages/tasks | Event replay test harness |
| 3 | Lock alert priorities + handoff thresholds | Derived metrics jobs (scores, risk, intent) | Automation runner + suppression/cooldown | Hot Accounts + At Risk views | Stripe conversion/expiry listeners | Integration contract tests |
| 4 | Finalize onboarding wizard content | Backfill/migration for existing accounts | Daily digest generator + report APIs | Onboarding wizard + playbook selection | HubSpot owner assignment logic | End-to-end staging validation |
| 5 | Pilot UX refinements | Data quality monitoring | Audit log + manual override endpoints | KPI cards + funnel trend + revenue influenced | Optional Slack/webhook alerts | Pilot run with 2–3 design partners |
| 6 | GA readiness checklist | Metrics instrumentation | Reliability hardening + retries | Empty states, tooltips, docs links | Final mapping templates | UAT sign-off, launch playbook |

---

## 13) Design Principles

1. **Business language first:** every label should be legible to a founder or revops lead.
2. **Opinionated defaults:** prebuilt trial lifecycle + playbooks beat blank setup.
3. **Revenue accountability:** every workflow ties to activation, conversion, or influenced ARR.
4. **Human-in-the-loop at the right time:** automate broad follow-up, escalate only high-value moments.
5. **Visibility builds trust:** every action is explainable via timeline + reason codes.
6. **Fast time-to-value:** onboarding must produce useful queues in under one day.

---

## Optional Execution Artifacts

### Sample left-nav
- Command Center
- Trials
- Hot Accounts
- At Risk
- Playbooks
- Reports
- Admin (Integrations, Data Mapping, System)

### Sample dashboard wireframe (text)
- **Top row:** Active Trials | Activation Rate | Conversion Rate | Hot Accounts | At-Risk Qualified | Revenue Influenced
- **Middle left (60%):** Hot Accounts Now table
- **Middle right (40%):** At-Risk Trials table
- **Bottom left:** Funnel Trend (Signup→Qualified→Activated→Converted)
- **Bottom right:** Daily Digest + Data Health + Recent Escalations

### Sample onboarding wizard
1. Connect HubSpot
2. Connect Stripe
3. Confirm trial start event (`trial_started`)
4. Pick activation milestone template
5. Select playbook (PLG / Hybrid)
6. Configure sales handoff owner + alert channel
7. Launch in test mode

### Sample automation recipe UI
- **Recipe Name:** High Intent Sales Handoff
- **Trigger:** Intent score crosses 70
- **Conditions:** ICP >=60 AND Stage in {Qualified, Activated} AND days_to_expiry <=7
- **Actions:** Create HubSpot task, send Slack alert, set stage=High Intent
- **Cooldown:** 72h per account
- **Suppression:** Skip if open opportunity exists in late stage

### 10 exact UI labels to replace
1. Orchestrator → Trial Engine
2. Tasks → Follow-up Steps
3. Execution Plans → Trial Playbooks
4. Global Activity → Trial Timeline
5. Sync Status → Data Health
6. Marketplace → Playbook Library
7. Data Lab → Data Mapping
8. Outreach Inbox → Follow-up Queue
9. Forecast → Conversion Forecast
10. Insights → Funnel Insights
