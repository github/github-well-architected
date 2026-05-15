---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT

draft: false # Set to false when ready to publish

title: 'Managing AI credits'
publishDate: 2026-05-13
params:
  authors:
    [
      { name: 'Kitty Chiu', handle: 'kittychiu' },
    ]

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - governance
  - productivity
  - cost-optimization
  - operational-excellence
  - security
  - reliability
  - performance-efficiency

# The areas of the GitHub adoption journey
areas:
  - enterprise-and-teams
  - ci-cd-and-devops
  - administration
  - governance
  - billing-management
  - user-management
  - monitoring-analytics

# Classifications of industries who may be at different stages of the customer journey
verticals:
  - finance
  - information-technology
  - government
  - manufacturing
  - professional-service
  - retail
  - enterprise-software
  - financial-services
  - healthcare
  - technology

# Individuals in key roles on the customer journey
personas:
  - administrator
  - project-manager
  - enterprise-administrator
  - organization-owner
  - billing-manager
  - it-administrator
  - development-manager

# Deployment options for GitHub Enterprise
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu

# GitHub product functions designed to support every stage of development
features:
  - copilot
  - copilot-enterprise
  - copilot-business
  - copilot-ai-credits
  - copilot-chat
  - coding-agents
  - code-review-automation

# Deeper-level topics of the GitHub Platform and its features
components:
  - billing-and-cost-centers
  - insights-and-metrics
  - governance-and-policy
  - budget-management
  - usage-monitoring
  - license-assignment
  - organizational-structure
  - cost-controls
  - reporting-analytics

# Associated teams and other GitHub and Partner resources
github:
  - customer-success-architect
  - customer-success-manager
  - enterprise-support
  - expert-services
  - microsoft
  - customer-success
  - professional-services
  - technical-account-management
---

<!-- markdownlint-disable MD025 -->
<!-- markdownlint-disable MD013 -->

## Scenario overview

Managing AI credits requires governance practices similar to those used for cloud
infrastructure: pooled consumption, variable demand, tiered budget controls,
and cost attribution. It also requires right-sizing model selection, managing
context window usage, and accounting for task complexity.

Each Copilot license contributes a monthly AI credit allowance to a shared
enterprise pool, and usage beyond that pool requires additional spend. Usage is
driven by individual behavior rather than automated workloads, and
the shared pool model means one user's consumption directly affects another's
available included AI credits in the same enterprise account.

This article provides opinionated recommendations for managing AI credits and usage-based billing (UBB) through the lens of the
[FinOps Framework](https://learn.microsoft.com/en-us/cloud-computing/finops/framework/finops-framework).
It defers to the authoritative sources for GitHub billing budget configuration
and focuses instead on design decisions, trade-offs, and governance strategies.

{{< callout type="info" >}}
This article assumes the post-1 June 2026 AI credits model rollout unless otherwise noted.
{{< /callout >}}

## Key design strategies and checklist

### 1: Use layered budgets as guardrails, not as allocation

Design budgets as concurrent guardrails, not as a top-down allocation tree.
The layered budgets (enterprise-level → cost center → user) enforce spending
limits at multiple levels simultaneously. The most restrictive budget applies:
a user can be blocked by any budget layer when enforcement is enabled, even if their ULB
and the enterprise-level budget both have remaining balances.

This approach prevents runaway spend while preserving user productivity.
Each layer serves a different governance purpose: enterprise-level budgets cap total
organizational exposure, cost center budgets delegate accountability to cost owners,
and user-level budgets prevent individual overconsumption of shared resources.

User-level budgets (ULBs) are recommended as the only hard enforcement caps, while enterprise and cost center budgets act as monitoring guardrails unless explicitly configured to stop usage.

### 2: Distinguish governance goals for included AI credits and additional spend

Design distinct governance approaches for each spending phase. A billing cycle has two phases: the included AI credits phase (where usage draws from the pre-paid pool) and the additional spend phase (where usage incurs additional charges after the pool is exhausted).
While it is useful to think about these phases separately, current controls do not fully isolate governance between them.

For the included AI credits phase, the primary goal is fair access to a shared pool.
Without guardrails, a small number of heavy users can exhaust the shared pool before others benefit. User-level budgets (ULBs) serve as the primary mechanism to moderate this behavior and promote more balanced consumption.
For the additional spend phase (post-pool spend), the goal shifts to controlling financial exposure. Enterprise and cost center budgets help cap the additional cost your organization is willing to incur.

With UBB, the controls overlap rather than operate independently by phase. ULBs apply across both included credits and additional spend, while enterprise and cost center budgets apply only after the included credits are exhausted. As a result, ULBs serve a dual role: ensuring fair consumption of the shared pool while also acting as a guardrail on overall usage. Enterprise and cost center budgets remain the primary controls for managing additional spend exposure.

Maintaining this distinction keeps your governance approach coherent. It clarifies the different goals at each phase — fair consumption during the included AI credits phase and cost control during the additional spend phase.

### 3: Establish cost attribution before you optimize

Build a reporting pipeline that answers "Which cost centers consume what, and at what
cost?" before making any budget or policy changes. GitHub provides a
downloadable CSV usage report with per-user, per-model, per-day breakdowns.
Use this as the foundation for all optimization decisions.

Without attribution, budget adjustments and model restrictions become guesswork.
Cost visibility is a prerequisite for informed governance — you cannot
right-size budgets or identify waste without first measuring consumption
patterns.

### 4: Align usage guidance with cost transparency

Publish guidance that ties model tier to task complexity and makes the cost
difference visible to users. Token costs vary significantly across
models, and context window usage can drive up consumption quickly.

When users understand the cost implications of model selection and context window usage, they can
make informed trade-offs between capability and consumption. This is the AI
equivalent of right-sizing compute instances: match the resource to the task.

### FinOps checklist

The Start phase
establishes minimum viable governance, the Adopt phase adds cost center-level
controls and reporting, and the Advance phase automates and scales.

#### Start phase

- Design the layered budget structure with stakeholder input
- Define roles and assign response ownership for usage threshold alerts
- Communicate budget policies and thresholds to all Copilot users before
  enforcement begins
- Set an enterprise-level AI credit budget as the baseline monitoring guardrail for additional
  spend
- Set a universal ULB to prevent any single user from consuming a
  disproportionate share of the pooled AI credits
- Identify power users (e.g. agentic workflows, frontier model usage) and plan
  custom ULB overrides

#### Adopt phase

- Create cost centers mapped to business units and assign additional spend
  budgets to each
- Apply custom ULB overrides for defined profiles (e.g. power users)
- Build a cost attribution and reporting pipeline using the AI
  usage CSV report
- Map usage data to users and cost centers for showback reporting
- Publish usage guidance that ties model tier to task complexity
- Establish the operating model with alert response process and task cadence
- Establish a review cadence: weekly during rollout, monthly once stable

#### Advance phase

- Automate budget management via the REST API (bulk ULB overrides, cost
  center mapping, budget adjustments)
- Implement chargeback
- Forecast pooled AI credits exhaustion based on observed trends
- Integrate AI credit reporting with enterprise FinOps tooling

## Assumptions and preconditions

- Your organization uses **GitHub Enterprise Cloud** (GHEC) with Copilot
  Business or Copilot Enterprise licenses.
- You have **enterprise owner** or **billing manager** access to configure
  budgets and cost centers.
- Your enterprise has an established FinOps practice, or at minimum a role
  responsible for metered cost governance.
- Cost centers in GitHub billing are already configured, or you are willing to
  set them up to align with your monitoring requirements.
- You have access to the enterprise AI usage report (CSV download available
  from billing settings).
- User identities can be mapped to business units for cost attribution.

## Recommended implementations

### Step 1: Design the layered budget structure

GitHub's AI credit budgeting uses a layered structure with three budget levels: enterprise-level, cost center, and ULBs. Each layer serves a different governance purpose, and they operate concurrently to enforce spending limits. See [Understanding Copilot budgeting](https://support.github.com/product-guides/github-copilot/get-started/understanding-copilot-budgeting) for definitions and how these budget layers interact.

Design your budget layers by asking targeted questions at each governance level:

**1. User-level: What is the responsible monthly spend per user?**

- What was the average individual spend during the pilot?
- Where are we in the AI SDLC rollout plan?
- What new agentic use cases are we adopting in the coming months?
- What new AI capabilities are we building?
- What is the persona and usage-tier mix (developer, reviewer, SRE, data, business user)?

**2. Scoped level: Which teams or groups need their own additional spend budget on top of the pooled AI credits?**

- What is each group's forecast consumption above the pooled allowance?
- Which projects depend on frontier models or agentic workflows that consume credits faster?
- How variable is their month-to-month usage (seasonality, release cycles)?
- How do we treat shared platform teams vs product teams in the allocation (showback vs chargeback)?
- Who is the accountable budget owner authorized to lift or hold a scope-level cap?
- Which time-bound budgets must be ring-fenced (POCs, hackathons)?
- What signal tells us a scope cap is too tight (throttling productive work) vs too loose (no friction on waste)?

**3. Enterprise-level: How much autonomy should cost owners have over spending?**

- What is the total enterprise AI envelope for the fiscal year?
- What is our monetary commitment vs on-demand PAYG strategy?
- What share sits in the pooled credit reserve vs pre-allocated to cost centers?
- What guardrails, alert thresholds, and approval gates apply to additional spend?
- How do we handle chargeback or showback across business units once pooled credits are exhausted?
- What is the escalation path when the pool is depleted mid-cycle (throttle, top-up, or block)?
- How do we forecast for headcount changes, M&A, and new AI capability launches?

### Step 2: Communicate budget accountability to stakeholders

Before configuring anything, ensure all stakeholders — users, cost
owners, and finance — understand how the layered budgets affect them,
where accountability lies, and how they can monitor their own usage.

#### Assess your change management needs

For users and cost owners new to layered AI credit budgets, publishing diagrams and example scenarios can help them understand budget accountability and what happens when limits are reached.

#### Key points to communicate

- **Each user is accountable for their own budget.** The ULB is the ultimate
  spend cap per user. Once exhausted, the user is blocked from all Copilot
  features (except code completion and next edit suggestions) regardless of remaining budget at any
  other layer.
- **Cost center budgets govern scoped additional spend.** Users assigned
  to a cost center share that additional spend budget. The
  cost owner is accountable for monitoring and managing that budget.
- **Users not assigned to a cost center fall under the enterprise-level budget.**
  If a user is not mapped to any cost center, their additional spend is
  governed solely by the enterprise-level budget. Ensure these users are
  identified and accounted for.
- **The most restrictive budget applies.** Whichever budget has the least
  remaining amount determines whether a request proceeds — a user can be
  blocked by any layer.

Note that default user-facing messages may not clearly indicate which budget layer caused a block. Support processes and self-serve dashboards should account for this.

#### Example scenarios

Publish concrete example scenarios like the following to make the budget rules tangible for users:

Example scenario 1:
> **"I have budget left, why am I blocked?"**
> Alex has a ULB of $200. The enterprise included AI credits pool is still
> available, and Alex's cost center has $10K remaining. But Alex has already
> consumed $200 in AI credits from the shared pool this month. Alex is
> blocked because the ULB is the per-user hard cap — the remaining balance
> in other budgets does not override it.

Example scenario 2:
> **"The enterprise budget is exhausted — will the platform stop?"**
> The Platform Engineering cost center has a $50K additional spend budget.
> The enterprise-level budget ran out on the 20th, and cost center usage is configured to **exclude** from the enterprise budget.
> The Platform Engineering team can continue using Copilot because their cost center budget still has remaining balance.
> Only users not assigned to Platform Engineering cost center are affected by the exhausted enterprise budget.

#### Enable self-serve usage monitoring

Provide users and cost owners with a way to check their own consumption so they can
self-govern usage before hitting their ULB and cost center budgets. For example, users can [view usage in their IDE](https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/monitor-premium-requests#viewing-usage-in-your-ide).

### Step 3: Set the enterprise-level additional spend budget

Navigate to your enterprise billing settings and create an AI credit budget
sized to your total enterprise AI envelope for the fiscal year, adjusted for
your monetary commitment and PAYG arrangement.
This is your **baseline** guardrail for additional spend. Set this even if you
plan to use cost center budgets, because users not assigned to any cost center are
only governed by this budget.

#### Enterprise-level budget configuration

- Budget type: Bundled AI credit budget
- Scope: Enterprise
- Option: Exclude cost center usage
- Disable: "Stop usage when budget limit is reached"
- Enable: Budget threshold alerts (75%, 90%, 100%)
- Assign alert recipients: billing manager(s) and enterprise owner(s)

Recommend **disabling "Stop usage when budget limit is reached"** at the enterprise level to avoid a single global cap that causes engineering disruptions.

#### Enterprise-level budget scope option

If you are planning to implement cost center budgets, decide
whether the enterprise-level budget should **include** or **exclude** cost center
usage:

- **Include** (default): Cost center usage counts against both the cost center
  budget and the enterprise-level budget. The enterprise-level budget acts as a global cap.
- **Exclude**: Cost center usage is only governed by the cost center budget.
  Users in cost centers can continue spending even after the enterprise-level budget
  is exhausted. Users outside cost centers are still governed by the enterprise
  budget.

Recommend **exclude** for most enterprises, especially if a significant
share of spend is pre-allocated to cost centers rather than held in a shared
reserve. With this option, each cost center's additional spend budget acts
as a _dedicated and isolated_ budget for that group —
if other cost centers exhaust the enterprise-level budget, cost centers with remaining
balance continue operating without interruption. This prevents one cost center's
overconsumption from blocking others' productivity. It also
simplifies budget forecasting: each cost owner can plan against their
own budget ceiling without accounting for others' spending patterns. See [Centralized enterprise budget vs. delegated cost center budgets](#centralized-enterprise-budget-vs-delegated-cost-center-budgets).

### Step 4: Create budgets with cost centers

For Copilot AI credits in a GHEC enterprise, cost center budgets must be attached to
a **cost center**. Create one or more cost centers and assign an AI credit
budget to each, sized to each scope's forecast consumption above the pooled
AI credits, with additional allowance for month-to-month variability. This answers the question: "When the pooled AI credits run
dry, how much additional spend is _this_ group allowed to incur?"

{{< callout type="info" >}}
A user can only belong to **one cost center**. However, **multiple budgets**
still apply simultaneously (ULB, cost center budget, and enterprise-level budget).
{{< /callout >}}

When creating a cost center, you need to choose either
**organization** or **user-based** scope. See [Management methods](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/billing/premium-request-management).

Recommend **user-based cost centers** when your organizational
structure does not map cleanly to budget ownership, or when users frequently
span multiple organizations. User-based cost centers give you direct control
over exactly which users fall under each budget without requiring changes to
org membership or Copilot license assignment. For enterprises with clean
org-to-team mapping and SCIM provisioning, organization-based cost centers
reduce ongoing maintenance.

{{< callout type="info" >}}
**ULB and user-based cost center budgets are two different layers**.
ULBs are _user-level_ spend caps that apply to each user regardless of cost center assignment.
User-based cost centers are _groups of users that share_ a cost center budget for additional spend. Users in a user-based cost center are still subject to their ULB.
{{< /callout >}}

Examples of how to scope user-based cost centers, informed by responses from
[Step 1](#step-1-design-the-layered-budget-structure):

- **By role or function:** group all platform engineers into one cost center
  and application developers into another, regardless of which orgs they
  belong to. This addresses how to treat shared platform teams vs product
  teams in the allocation. Roles with higher AI intensity (e.g. agents,
  frontier model usage) get budgets sized to their forecast consumption
  above the pooled allowance, while lighter roles operate under tighter
  guardrails.
- **By budget tier:** create a "power users" cost center for staff whose
  projects depend on frontier models or agentic workflows, and a "standard
  users" cost center for everyone else. Size each tier's budget to its
  actual consumption profile rather than applying a uniform cap that either
  over-provisions or under-serves.
- **By business unit:** assign users from, for example, Finance, Engineering,
  and Product each to their own cost center to enable chargeback or showback
  aligned with P&L ownership. Designate an accountable budget owner per
  cost center who is authorized to lift or hold the scope-level cap.
- **By project or initiative:** temporarily group users working on a
  high-priority initiative (POCs, hackathons, time-bound projects) into a
  dedicated cost center with a ring-fenced additional spend budget. This
  lets you measure the AI credit cost per deliverable and evaluate ROI.

If there is planned month-to-month
variability (seasonality, release cycles), proactively monitor whether the cap is
throttling productive work or providing too little friction on waste.

{{< callout type="info" >}}
If you already use cost centers for chargeback across other products
(Actions, Code Scanning), you cannot create a second set of cost centers
purely for AI credit budgeting. Use ULBs for user-level differentiation
in this scenario.
{{< /callout >}}

#### Scoped budget configuration

- Budget type: Bundled AI credit budget
- Scope: Cost center (organization-based or user-based)
- Disable: "Stop usage when budget limit is reached"
- Enable: Budget threshold alerts (75%, 90%, 100%)
- Assign alert recipients: billing manager(s) and cost owner(s)

### Step 5: Set user-level budgets

User-level budgets (ULBs) define the _individual spending authority_ for each
user — the total amount of AI credits a single user can consume in a billing
period, regardless of whether those credits come from the shared pool or
additional spend. ULBs are the only budget layer that **caps total user consumption across both pooled credits and additional spend**, making them critical for preventing a small number
of heavy users from exhausting the shared pool before others can benefit.

#### Recommended approach

1. Set a universal ULB as the default for all users. Size it using average
   individual spend from your pilot, plus additional margin for your current rollout
   stage and planned AI capability growth.
   See [ULBs and developer productivity](#ulbs-and-developer-productivity).

2. Identify power users early — those adopting agentic use cases, frontier
   models, or new AI capabilities — and set custom ULB overrides sized
   to their persona and usage pattern. Each custom ULB is a 1:1
   assignment to a user.

3. To unblock a user mid-month, apply custom ULB overrides temporarily
   until the next billing cycle.

#### Universal ULB configuration

- Budget type: Bundled AI credit budget
- Scope: Users
- Enable: "Stop usage when budget limit is reached"

### Step 6: Build a cost attribution and reporting pipeline

GitHub provides a downloadable CSV usage report.
This data includes `aic_quantity` (AI credits consumed) and
`aic_gross_amount` (estimated USD cost). Build a reporting pipeline that maps usage to users and cost centers, and surface insights to inform budget adjustments and model guidance. See [Prepare for usage based billing](https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/prepare-for-usage-based-billing).

#### Cost attribution approaches

- **Chargeback model:** At month-end, use the usage report to identify
  consumption by user. If one business unit's users consumed a
  disproportionate share of the shared pool, allocate those costs back to that
  unit using your internal finance processes.
- **Showback model:** Publish per-cost center dashboards without charging back. This
  creates accountability and awareness without the overhead of internal
  billing.

### Step 7: Publish usage guidance

Token costs vary dramatically by model, and context window size drives
consumption further. Provide users with guidance on:

- **Responsible context usage:** Minimize unnecessary context in instructions to
  reduce token consumption.
- **Model selection by task complexity:** Match model tier to the task. See
  [models comparison](https://docs.github.com/en/copilot/reference/ai-models/model-comparison)
  and
  [models pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing).

### Step 8: Establish the operating model

Define ownership and the tasks required to manage AI spend.

#### Roles and responsibilities

| Role | Scope | AI credit responsibilities |
|---|---|---|
| Enterprise Owner | Enterprise and Org | Set policies, configure budgets and alerts, view all usage reports, forecast overall AI credit needs |
| Billing Manager | Enterprise and Org | Configure budgets and alerts, generate usage reports, monitor consumption, adjust budgets |
| Cost Owner | Cost center | Monitor scope usage, respond to alerts, right-size own budget |

#### Task cadence

| Task | Frequency | Owner |
|---|---|---|
| Review consumption alerts | Daily | Billing Manager |
| Generate usage reports and cost-per-user analysis | Weekly | Billing Manager |
| Review budget performance and adjust allocations | Monthly | Cost Owner |
| Right-size budgets | Quarterly | Cost Owner |
| Update governance guidelines | Quarterly | Enterprise Owner |

#### Response process for budget threshold alerts

Define who
receives each alert and what action they take:

- **75%:** Billing Manager reviews consumption trajectory. No action required
  unless the trend projects exhaustion before month-end.
- **90%:** Billing Manager escalates to cost owner. Evaluate whether to
  increase the budget or restrict usage.
- **100%:** If "Stop usage" is enabled, users are blocked automatically.
  Cost Owner decides whether to raise the budget or leave the block in
  place until the next billing cycle.

### Step 9: Review and adjust on a monthly cycle

UBB consumption patterns will emerge over time. During the first three
months, review weekly. After that, shift to monthly reviews aligned with your
billing cycle.

Review checklist:

1. Compare actual consumption against budgets at enterprise, cost center, and user levels.
2. Identify users or cost centers consistently hitting budget limits, interview them to understand usage practices and emerging patterns, and detect anomalies (e.g. unattended or autonomous usage).
3. Analyze usage trends, particularly when during the month the pooled AI credits are exhausted.
   Consider whether to right-size additional spend budgets, add ULB
   overrides, or publish guidance to educate responsible usage.
4. Aggregate weekly data to identify the top 5–10% of consumers.
5. Remediate and update forecasts based on observed trends.

## Additional solution details and design considerations

### Profile usage based on consumption patterns and use cases

Not all users consume AI credits equally. Some may be power users running agentic workflows with frontier models, while others may be light users leveraging smaller models for code completion. Profiling users based on their consumption patterns and use cases can help you plan and forecast more accurately, and identify who may need custom ULB overrides.

Examples of usage patterns:

- Piloting new AI capabilities and enablement
- Agentic workflows with frontier models
- Migration factory with Copilot agents
- Landing zones operations with Copilot agents
- Burst usage in POCs, hackathons, tech conferences, and time-bound projects
- Doubling down on seasonal projects (e.g. retail app for Black Friday, end-of-quarter functions, tax season)

Proactively profile users and their usage patterns, configure cost center budgets, and assign custom ULB overrides. This prevents users from being blocked mid-task while still maintaining overall cost governance.

### ULBs and developer productivity

The goal of a ULB is to manage unplanned spend and cap outlier consumption,
not to restrict typical usage.

Initially, set a high universal ULB to avoid blocking productive work. If the universal ULB is too low, it risks blocking users mid-task. Blocked users lose access to all Copilot features (except code completion and next edit suggestions) until the next billing cycle, or until an admin intervenes with custom ULB overrides.

Start with the per-seat included AI credits value plus a margin. You can use
pilot data to inform this margin. Monitor for the first two billing cycles,
then periodically review and adjust as user behavior and use cases evolve.

### Centralized enterprise budget vs. delegated cost center budgets

| Approach | Benefit | Risk |
|---|---|---|
| Single enterprise-level budget, no cost centers | Simple to manage | No cost center-level accountability; hard to attribute costs |
| Cost centers excluded from enterprise-level budget | Each cost center has a dedicated and isolated budget | Total enterprise spend is delegated; requires individual cost center budget sizing |
| Cost centers included in enterprise-level budget | Global cap plus cost center visibility | Enterprise-level budget can block others that still have cost center budget remaining |

For organizations with 100+ seats, use cost centers mapped
to organizations with the enterprise-level budget set to **exclude** cost center
usage. This gives each cost center a _dedicated_ amount that
cannot be consumed by other cost centers — cost owners can forecast against their own
budget without other cost center dependencies. The enterprise-level budget then acts solely
as a backstop for users not assigned to any cost center. Set a universal
ULB as the cross-cutting safety net.

### Scaling budget management for large enterprises

For enterprises with thousands of users, managing custom ULBs through the
UI is impractical. Use the [GitHub REST API](https://docs.github.com/en/enterprise-cloud@latest/rest/billing/budgets?apiVersion=2026-03-10) to:

- Bulk-create custom ULB overrides.
- Programmatically map users to cost centers.
- Set and adjust enterprise-level and cost center budgets.

## Seeking further assistance

{{% seeking-further-assistance-details %}}

## Related links

{{% related-links-github-docs %}}

### External resources

- [Understanding Copilot budgeting](https://support.github.com/product-guides/github-copilot/get-started/understanding-copilot-budgeting)
- [FinOps Framework](https://learn.microsoft.com/en-us/cloud-computing/finops/framework/finops-framework)
- [Usage management methods in enterprise](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/billing/premium-request-management)
- [Monitoring your GitHub Copilot usage and entitlements](https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/monitor-premium-requests)
- [Prepare for usage-based billing](https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/prepare-for-usage-based-billing)
- [Viewing your usage of metered products and licenses](https://docs.github.com/en/billing/how-tos/products/view-productlicense-use)
- [Models comparison](https://docs.github.com/en/copilot/reference/ai-models/model-comparison)
- [Models and pricing for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)
- [GitHub REST API: Billing budgets](https://docs.github.com/en/enterprise-cloud@latest/rest/billing/budgets?apiVersion=2026-03-10)
