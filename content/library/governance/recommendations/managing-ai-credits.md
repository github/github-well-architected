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
weight: 2
# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - governance
  - productivity

# The areas of the GitHub adoption journey
areas:
  - enterprise-and-teams
  - ci-cd-and-devops

# Classifications of industries who may be at different stages of the customer journey
verticals:
  - finance
  - information-technology
  - government
  - manufacturing
  - professional-service
  - retail
  - healthcare

# Individuals in key roles on the customer journey
personas:
  - administrator
  - project-manager

# Deployment options for GitHub Enterprise
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu

# GitHub product functions designed to support every stage of development
features:
  - copilot

# Deeper-level topics of the GitHub Platform and its features
components:
  - billing-and-cost-centers
  - insights-and-metrics
  - governance-and-policy
  - copilot-business
  - copilot-enterprise
  - copilot-chat
  - coding-agents
  - code-review-automation
  - limits

# Associated teams and other GitHub and Partner resources
github:
  - customer-success-architect
  - customer-success-manager
  - enterprise-support
  - expert-services
  - microsoft
---

<!-- markdownlint-disable MD025 -->
<!-- markdownlint-disable MD013 -->

## Scenario overview

Governing AI credits requires practices similar to managing cloud infrastructure:
granular cost attribution, tiered budget controls, and workload-appropriate model selection.

Without proper governance, a small number of power users or automated agents can
exhaust the enterprise's included AI credits pool, leading to unexpected
usage-based billing (UBB) overages or organization-wide productivity blockers
when budgets are depleted.

Included AI credits are pooled at the GitHub Enterprise account level. Each
Copilot license contributes its monthly included AI credits to the pool. This
shared pool funds GitHub AI products such as
Copilot, Code Quality, and cloud agents. Credits are used through both individual
activity and automated workloads, so one user or workflow’s consumption reduces the credits available to others.

Hard budget enforcement can block AI credit features used by
human and automated workflows, disrupting business operations. Effective
governance must detect and respond to abnormal consumption while preserving
business continuity.

This article provides opinionated recommendations for managing AI credits
through the lens of the
[FinOps Framework](https://learn.microsoft.com/en-us/cloud-computing/finops/framework/finops-framework).
It defers to the authoritative sources for GitHub billing budget configuration
and focuses instead on design decisions, trade-offs, and governance strategies.

## Key design strategies and checklist

### 1: Use layered budgets as guardrails, not as allocation

Design budgets as concurrent guardrails rather than as a top-down allocation
tree. GitHub provides four budget scopes: user, cost center, organization, and
enterprise. These scopes serve different purposes and do not form a single
inheritance hierarchy.

A user-level budget (ULB) caps an individual's total AI credit consumption
across both included and metered usage. Cost center, organization, and
enterprise budgets govern metered usage after the included AI credits pool is exhausted.
If an applicable budget is configured to stop usage when it reaches its
limit, available budget at another scope will not be blocked.

Use ULBs to prevent individual overconsumption. Use cost center and organization
budgets to delegate accountability, and use the enterprise budget to control
overall financial exposure.

Use budget alerts and responsible owners as the primary guardrail.
Stop usage only when the financial risk of continued usage exceeds the
business continuity impact of interruption.

### 2: Govern included and metered usage for different outcomes

Apply separate governance goals to the two phases of a billing cycle.

During the **included usage** phase, prioritize fair access to the shared AI credits
pool. Use ULBs and, where appropriate, cost center included usage controls to
prevent a small number of users or teams from consuming a disproportionate
share.

During the **metered usage** phase, prioritize financial control. Use cost center,
organization, and enterprise budgets to define how much additional usage you will fund after the shared pool is exhausted.

ULBs apply across both phases. Account for this overlap when sizing ULBs so that
fair-access controls do not unintentionally block expected metered usage.

### 3: Establish cost attribution before you optimize

Build a reporting pipeline that answers "Which cost centers consume what, and at what
cost?" before enforcing or optimizing budgets and policies. GitHub provides a
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

#### Start phase: baseline guardrail, enable showback

- Design the layered budget structure with stakeholder input
- Define roles and assign response ownership for usage threshold alerts
- Communicate budget policies and thresholds to all Copilot users before
  enforcement begins
- Set an enterprise-level AI credits budget as the baseline monitoring guardrail for
  metered usage
- Keep the enterprise-level hard stop disabled, and assess whether stopping
  usage at lower budget scopes is appropriate based on their business continuity impact
- Build a cost attribution and reporting pipeline using the AI usage report
- If usage history exists, baseline historical consumption and set the universal
  ULB; otherwise, set a deliberately permissive provisional ULB and collect
  one or two billing cycles of data before enforcing tighter limits
- Identify power users and plan appropriate cost center or individual ULBs

#### Adopt phase: layered guardrails, enable chargeback

- Create cost centers mapped to business units and assign metered usage
  budgets to each
- Apply individual or cost center ULBs for defined profiles
  (e.g. platform team, projects, power users)
- Map usage data to users and cost centers for showback reporting
- Implement chargeback if appropriate
- Publish usage guidance that ties model tier to task complexity
- Establish the operating model with alert response process and task cadence
- Establish a review cadence: weekly during rollout, monthly once stable

#### Advance phase: automate and scale, enable forecasting

- Automate budget management via the REST API (e.g. bulk ULB management, cost
  center mapping, budget adjustments)
- Forecast AI credits budgets based on observed trends

## Assumptions and preconditions

- Your organization uses **GitHub Enterprise Cloud** (enterprise) with Copilot
  Business or Copilot Enterprise licenses.
- You have **enterprise owner** or **billing manager** access to configure
  budgets and cost centers.
- You understand the FinOps concept and are inclined to adopt it for managing AI credits.
- Cost centers in GitHub billing are already configured, or you are willing to
  set them up to align with your monitoring requirements.
- You have access to the enterprise AI usage report.
- User identities can be mapped to business units for cost attribution.

## Recommended implementations

### Step 1: Design the layered budget structure

GitHub provides budget controls mainly at four scopes: user, cost center, organization,
and enterprise. Define the purpose and ownership of each applicable scope before
configuring budget amounts.

#### Enterprise scope

- What is your approved monthly or annual budget for metered AI usage?
- How would a hard stop affect people, automated workflows, and business
  continuity?
- What is your monetary commitment and PAYG strategy?
- Should cost centers draw from the shared included usage pool without a limit, or should usage be allocated in proportion to assigned licenses?
- Should cost center usage be separated from the enterprise budget?
- Who can approve a budget increase when the threshold is reached?
- Will the organization use showback, chargeback, or both for metered usage?
- How will forecasts account for headcount, license, and product changes?

#### Cost center and organization scopes

- Which business units or projects require separate metered usage budgets?
- Should accountability follow directly assigned users, cost centers, or
  licensing organizations?
- Does accountability align naturally with GitHub organization boundaries, or does it span multiple organizations?
- Should budget ownership follow GitHub organization structure or spending authority?
- What are the expected metered usage amounts for each scope during a billing cycle?
- Who owns each budget and decides whether to increase or retain its limit?
- Which time-bound budgets must be ring-fenced (POCs, hackathons)?
- How variable is their month-to-month usage (seasonality, release cycles)?
- What signals indicate that a budget alert threshold is too low, causing frequent low-value alerts, or too high, providing insufficient warning?
- How do you treat shared platform teams vs product teams (showback vs chargeback)?

#### User scope

- What were the percentiles of user consumption during the pilot?
- Which user groups require different ULBs because of their expected usage patterns?
- Which agentic or high-cost workloads require custom ULB overrides?
- How much headroom is needed for planned adoption during the next billing
  cycles?
- Who can approve and apply a temporary ULB increase?

### Step 2: Communicate budget accountability to stakeholders

Before configuring anything, ensure all stakeholders — users, cost
owners, and finance — understand how the layered budgets affect them,
where accountability lies, and how they can monitor their own usage.

#### Assess your change management needs

For users and cost owners new to layered AI credits budgets, publishing diagrams and
example scenarios can help them understand budget accountability and what
happens when budget thresholds are reached.

#### Key points to communicate

- **Each user is accountable for their own budget.** A ULB is the ultimate
  spend cap for users. Once their individual ULB is exhausted, users are blocked from related AI
  features (except code completion and next edit suggestions) regardless of remaining budget at any
  other layer.
- **Cost center budgets govern scoped metered usage.** Users assigned
  to this scope share the metered usage budget. The
  cost owner is accountable for monitoring and managing that budget.
- **Users not assigned to a cost center fall under the enterprise-level budget.**
  If a user is not mapped to any cost center, their metered usage is
  governed solely by the enterprise-level budget.

Note that default user-facing messages may not clearly indicate
which budget layer caused a block. Support processes and self-serve
tools should account for this.

#### Example scenarios

Publish concrete example scenarios like the following to make the budget rules tangible for users:

Example scenario 1:
> **"I have budget left, why am I blocked?"**
> Alex has a ULB of $200. The enterprise AI credits pool is still
> available, and Alex's department cost center budget has $10K remaining. But Alex has already
> consumed $200 in AI credits. Alex is
> blocked because the ULB is the per-user hard cap — the remaining balance
> in other budgets does not override it.

Example scenario 2:
> **"The enterprise-level budget is exhausted — will the platform stop?"**
> The enterprise-level budget is configured to **exclude** cost-center usage. The Platform Engineering cost center has a $50K metered usage budget. When the enterprise-level budget is exhausted by the 20th of the month, the team can continue using Copilot because cost center usage is excluded from the enterprise budget and the cost center hard stop is disabled.

#### Enable self-serve usage monitoring

Provide users and cost owners with a way to check their own consumption so they can
self-govern usage before hitting their ULB and cost center budgets. For example, users can
directly track their AI credits usage per billing cycle in their GitHub
settings, or [in their IDE](https://docs.github.com/copilot/how-tos/manage-and-track-spending/monitor-ai-usage#viewing-usage-in-your-ide). See [supported IDE versions](https://docs.github.com/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises#update-your-ide-client-and-extension).

### Step 3: Set the enterprise-level metered usage budget

Create an AI credits budget
sized to your total AI envelope for the fiscal year, and adjusted to
your monetary commitment and PAYG arrangement.
The enterprise-level budget monitors and governs metered usage that is not attributed to a cost center.

#### Enterprise-level budget configuration

- Budget type: AI credits budget
- Scope: Enterprise
- Option: Exclude cost center usage
- Disable: "Stop usage when budget limit is reached"
- Enable: Budget threshold alerts (75%, 90%, 100%)
- Assign alert recipients: billing manager(s) and enterprise owner(s)

Disable **"Stop usage when budget limit is reached"** at the
enterprise level to protect business continuity. Reaching the threshold should
trigger an operational response rather than automatically blocking people and
automated workflows across the enterprise.

#### Enterprise-level budget scope option

If you are planning to implement cost center budgets, decide
whether the enterprise-level budget should **include** or **exclude** cost center
usage:

- **Include**: All cost center usage counts against the enterprise-level
  budget.
- **Exclude**: Usage from all cost centers is excluded from the enterprise-level
  budget and governed by the applicable cost center budgets. Usage outside cost
  centers remains governed by the enterprise-level budget.

**Exclude** cost center usage when spending authority is delegated to cost owners. With this option, each cost center's
metered usage budget acts as a _dedicated_ budget for that group —
cost owners can manage spending against their own funding allocation without
also consuming the shared enterprise-level budget. This simplifies chargeback,
accountability, and forecasting because each cost owner can plan against their
own budget ceiling without accounting for other groups' spending patterns.
See [Centralized enterprise budget vs. delegated cost center budgets](#centralized-enterprise-budget-vs-delegated-cost-center-budgets).

### Step 4: Set the cost center metered usage budget

Define the scope of the cost center and set the metered usage amount for the
budget. The scope is typically for a single objective (e.g. functional
department, project, release pipeline). Right-size the usage forecast for
metered usage, with consideration for month-to-month variability.

#### Examples of scope

Informed by [Step 1](#step-1-design-the-layered-budget-structure) responses:

- **By role or function:** group all platform engineers into one cost center
  and application developers into another, regardless of which orgs they
  belong to. This addresses how to treat shared platform teams vs product
  teams in the allocation. Roles with higher AI intensity (e.g. agents,
  frontier model usage) get budgets sized to their forecast consumption,
  while lighter roles operate under tighter guardrails.
- **By budget tier:** create a "power users" cost center for staff whose
  projects depend on frontier models or agentic workflows, and a "standard
  users" cost center for everyone else. Size each tier's budget to its
  actual consumption profile rather than applying a uniform amount that either
  over-provisions or under-serves.
- **By business unit:** assign users from, for example, Finance, Engineering,
  and Product each to their own cost center to enable chargeback or showback
  aligned with P&L ownership. Designate an owner per
  cost center who is authorized to adjust or retain the scope-level budget.
- **By project or initiative:** temporarily group users working on a
  high-priority initiative (POCs, hackathons, time-bound projects) into a
  dedicated cost center with a ring-fenced metered usage budget. This
  lets you measure the AI credits cost per deliverable and evaluate ROI.

If there is planned month-to-month
variability (seasonality, release cycles), proactively monitor whether the budget
thresholds are triggering unnecessary intervention or providing too little warning on unutilized reserve.

{{< callout type="info" >}}
If you already use cost center budget for chargeback across other products or SKUs
(Actions, CodeQL code scanning), you cannot create a second set of cost centers
purely for AI credits budgeting. Use ULBs in this scenario.
{{< /callout >}}

#### Cost center budget configuration

- Budget type: AI credits budget
- Scope: Cost center (enterprise team, organization, or user assignments)
- Configure: "Stop usage when budget limit is reached" based on the cost
  center's business continuity risk
- Enable: Budget threshold alerts (75%, 90%, 100%)
- Assign alert recipients: billing manager(s) and cost owner(s)

Disable the hard stop for cost centers that support production systems,
critical automated workflows, or other continuity-sensitive work.
If no historical usage data is available, keep the hard stop disabled while
you collect the first one or two billing cycles of baseline data.

### Step 5: Set user-level budgets

A user-level budget (ULB) caps the AI credits a user can consume during a
billing period across both included and metered usage.

There are three types of ULBs:

1. **Universal ULB**: The default enterprise-wide limit applied to any user
   without a more specific ULB.
2. **Cost center ULB**: A custom budget managed through a cost center that overrides the universal ULB.
3. **Individual ULB**: A custom budget assigned directly to one user that overrides both the universal and cost center ULBs.

#### Preventing exhaustion of the AI credits pool

The enterprise AI credits pool is shared among all members. Configure the
**universal ULB** to prevent a small number of heavy users from exhausting
the shared pool before others can benefit. To prevent a **cost center ULB** from drawing unrestricted from the shared pool, enable **AI credit included usage cap** on the cost center. See [Included usage controls for cost centers](https://docs.github.com/copilot/concepts/billing/budgets-for-usage-based-billing#included-usage-controls-for-cost-centers).

#### Cost center ULB for managing per-user budget in groups

Users who shared the same custom ULB can be managed with enterprise
teams. Administrative overhead is minimized when using enterprise teams
compared to creating individual ULBs.

A cost center ULB is most appropriate when:

- Your organization structure does not map cleanly to budget ownership
- Users frequently span multiple organizations
- There are groups of users who have similar AI usage patterns

{{< callout type="info" >}}
**Cost center ULB and cost center budgets are two different layers**.
A ULB is a _per-user_ cap that covers included and metered usage.
Cost center budgets are budgets for _groups of users_ who share the same cap for
metered usage. Users in a cost center budget are still subject to their ULB.
{{< /callout >}}

#### Recommended approach

1. Set a **universal ULB** as the default guardrail. If you have historical
   usage data, size it using average individual spend, plus additional margin
   for your current rollout stage and planned AI capability growth.
   See [ULBs and developer productivity](#ulbs-and-developer-productivity).

2. Use **cost center ULBs** for team-based budget overrides.
   Review [results from Step 1](#step-1-design-the-layered-budget-structure)
   to set up enterprise teams. For example, set up a team for a group of
   data scientists or SREs who regularly use agentic workflows.

3. Identify exceptional power users early and set **individual ULBs**
   sized to their specific usage patterns.

4. To grant an exception to a user mid-month, apply an **individual ULB** override temporarily
   until the next billing cycle.

{{< callout type="info" >}}
A user's usage can be attributed to only **one cost center** at a time. Even though a
user may belong to more than one cost center indirectly via enterprise teams,
the cost center the user is directly assigned to takes priority. When there
is no direct assignment, the oldest enterprise team by creation date takes
priority.
{{< /callout >}}

#### Universal ULB configuration

Budget:

- Budget type: AI credits budget
- Scope: Users - Universal

#### Cost center ULB configuration

Cost center:

- Select enterprise team
- Enable: AI credit included usage cap

Budget:

- Budget type: AI credits budget
- Scope: Users - Cost center (per user)
- Select cost center (associated with enterprise team)

#### Individual ULB configuration

Budget:

- Budget type: AI credits budget
- Scope: Users - Individual user
- Select user

### Step 6: Build a cost attribution and reporting pipeline

GitHub provides a downloadable CSV usage report covering the last 31 days.
This data includes `quantity` (AI credits consumed), `gross_amount` (USD),
`discount_amount` (USD), and `net_amount` (USD). Build a reporting pipeline
that maps usage to users and cost centers, and surface insights to inform
budget adjustments and model guidance. See
[AI usage report](https://docs.github.com/billing/reference/billing-reports#ai-usage-report).

#### Cost attribution approaches

- **Chargeback model:** At month-end, use the usage report to identify
  consumption by cost center. If one user consumed a
  disproportionate share of the shared pool, allocate those costs back to that user's
  cost center using your internal finance processes.
- **Showback model:** Publish cost center specific dashboards without charging back. This
  creates accountability and awareness without the overhead of internal
  billing.

### Step 7: Publish usage guidance

Provide user adoption guidance on:

- **Auto model selection**: Use auto model selection for routine interactive work. It routes each task to an eligible model based on task complexity and model availability. See [auto model selection](https://docs.github.com/copilot/concepts/models/auto-model-selection)
- **Manual model selection by task complexity**: If selecting models manually, match
  the model tier to the task. See
  [models comparison](https://docs.github.com/copilot/reference/ai-models/model-comparison)
  and
  [models pricing](https://docs.github.com/copilot/reference/copilot-billing/models-and-pricing).
- **Session limits**: For Copilot CLI integrations in autonomous workflows or extended interactions, configure a session limit using `--max-ai-credits`. See [Setting an AI credit session limit](https://docs.github.com/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit).
- **Context management**: Minimize unnecessary context in instructions to
  reduce token consumption.

### Step 8: Establish the operating model

Define ownership and the tasks required to manage AI spend. These roles and
functions may be carried out by existing individuals or teams.

#### Roles and responsibilities

| Role | Scope | AI credits responsibilities |
|---|---|---|
| Enterprise owner | Enterprise and organization | Set policies, configure budgets and alerts, view all usage reports, forecast overall AI credit needs |
| Billing manager | Enterprise and organization | Configure budgets and alerts, generate usage reports, monitor consumption, adjust budgets |
| Cost owner | Cost center | Monitor scope usage, respond to alerts, right-size own budget |

#### Task cadence

| Task | Frequency | Owner |
|---|---|---|
| Review consumption alerts | Daily | Cost owner |
| Monitor and investigate abnormal usage spikes | Daily | Billing manager |
| Generate usage reports and cost-per-user analysis | Weekly | Billing manager |
| Review budget performance and usage patterns | Monthly | Cost owner |
| Configure budgets and threshold alerts | Monthly | Billing manager |
| Right-size budgets | Quarterly | Cost owner |
| Update governance guidelines | Quarterly | Enterprise owner |

#### Response process for budget threshold alerts

Define who
receives each alert and what action they take:

- **75%:** The cost owner validates the consumption forecast and identifies
  abnormal usage. No further action is required unless the trend projects reaching the threshold before month-end.
- **90%:** The cost owner engages the billing manager and related stakeholders.
  They decide whether to optimize consumption, restrict non-essential usage, or
  increase the budget.
- **100%:** The cost owner authorizes or denies continued spending. The billing manager
  adjusts the budget, restricts usage, or enables a hard stop. Document the decision and
  its business continuity impact.

### Step 9: Review and adjust on a monthly cycle

AI credit consumption patterns will emerge over time. During the first few billing cycles, review weekly. After that, shift to monthly reviews when the usage patterns are more predictable.

Review checklist:

1. Compare actual consumption against defined budgets at enterprise, organization,
   cost center, and user levels.
2. Identify users or cost centers consistently hitting budget limits, interview
   them to understand usage practices and emerging patterns, and detect
   anomalies (e.g. unattended or autonomous usage).
3. Analyze usage trends, particularly at what point during the month the
   included AI credits are exhausted.
   Consider whether to adjust metered usage budgets and
   ULBs, or publish guidance to educate responsible usage.
4. Aggregate weekly data to identify the top 5–10% of users or workloads.
5. Remediate and update forecasts based on observed trends.

## Additional solution details and design considerations

### Profile usage based on consumption patterns and use cases

Not all users consume AI credits equally. Some may be power users running
agentic workflows with frontier models, while others may be light users
leveraging smaller models for code completion. Profiling users based on their
consumption patterns and use cases can help you plan and forecast more
accurately, and identify who may need custom ULB overrides.

Examples of usage patterns:

- Piloting new AI capabilities and enablement
- Agentic workflows with frontier models
- Migration factory with Copilot agents
- Landing zones operations with Copilot agents
- Burst usage in POCs, hackathons, tech conferences, and time-bound projects
- Doubling down on seasonal projects (e.g. retail app for Black Friday,
  end-of-quarter functions, tax season)

Proactively profile users and their usage patterns, and configure individual and
cost center ULBs. This prevents users from being blocked mid-task while still
maintaining overall cost governance.

### ULBs and developer productivity

The goal of a ULB is to manage unplanned spend and cap outlier consumption,
not to restrict typical usage.

Because ULBs apply to both included and metered usage, validate that they
provide sufficient headroom for expected metered usage. If a ULB is sized
only for a user's expected included usage, the user may be prevented from
consuming legitimate metered usage even when budget is available at the cost
center, organization, or enterprise level.

When historical usage data is available, use it to baseline typical and
high-consumption profiles before setting the universal ULB. Start with the
monetary value of each user's included AI credits, then add a metered usage
allowance informed by the observed data.

When no usage history is available, start with alert-only metered usage
budgets and a deliberately permissive provisional ULB. Monitor for one or two
billing cycles, then use the resulting baseline to set enforced limits.

### Centralized enterprise budget vs. delegated cost center budgets

| Approach | Benefit | Risk |
|---|---|---|
| Single enterprise-level budget, no cost centers, no ULBs | Simple to manage | No cost center-level accountability; hard to attribute costs |
| Cost centers excluded from enterprise-level budget | Each cost center has a dedicated budget | Total enterprise spend is delegated; requires cost center budget sizing |
| Cost centers included in enterprise-level budget | Enterprise-wide monitoring plus cost center oversight | Enterprise budget must account for both cost center and unassigned usage, complicating forecasting |

When you have delegated spending authority, use cost centers with the enterprise-level budget set to **exclude** cost center
usage. This gives each cost center a _dedicated_ amount that
cannot be consumed by other cost centers — cost owners can forecast against their own
budget without other cost center dependencies. The enterprise-level budget then acts solely
as a backstop for users not assigned to any cost center.

### Scaling budget management for large enterprises

For a small number of users, configure custom ULBs through the UI. As the
number of teams grows, use [enterprise teams](https://docs.github.com/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/create-enterprise-teams) to apply cost center ULBs.

{{< callout type="info" >}}
If you use Enterprise Managed Users (EMU), use SCIM to synchronize
enterprise team membership with your identity provider.
{{< /callout >}}

Enterprise team membership and cost center ULBs can be managed at scale through the REST API. For example:

- Add or remove enterprise team members through the
  [enterprise team members API](https://docs.github.com/enterprise-cloud@latest/rest/enterprise-teams/enterprise-team-members?apiVersion=2026-03-10).
- Create and update individual and cost center ULBs through the
  [budgets API](https://docs.github.com/enterprise-cloud@latest/rest/billing/budgets?apiVersion=2026-03-10) with scopes `multi_user_customer` and `multi_user_cost_center`
- Assign resources to cost centers (e.g. users, enterprise teams) or remove those assignments, through
  the [cost centers API](https://docs.github.com/enterprise-cloud@latest/rest/billing/cost-centers?apiVersion=2026-03-10).
- Set and adjust enterprise-level, organization-level, and cost center metered usage budgets
  through the [budgets API](https://docs.github.com/enterprise-cloud@latest/rest/billing/budgets?apiVersion=2026-03-10).

### Budget evaluation order

Refer to [How billing flows through budgets](https://docs.github.com/enterprise-cloud@latest/copilot/concepts/billing/budgets-for-usage-based-billing#how-billing-flows-through-budgets)
for the sequence GitHub uses to evaluate AI credit controls and budgets.

Treat the applicable budgets as concurrent guardrails. Remaining capacity at
one scope does not override an exhausted budget at another applicable scope.
Use the evaluation order when diagnosing blocked usage and sizing layered
budgets to avoid unintended interruptions.

## Seeking further assistance

{{% seeking-further-assistance-details %}}

## Related links

{{% related-links-github-docs %}}

### External resources

- [AI usage report](https://docs.github.com/billing/reference/billing-reports#ai-usage-report)
- [Auto model selection](https://docs.github.com/copilot/concepts/models/auto-model-selection)
- [FinOps Framework](https://learn.microsoft.com/en-us/cloud-computing/finops/framework/finops-framework)
- [GitHub REST API: Billing budgets](https://docs.github.com/enterprise-cloud@latest/rest/billing/budgets?apiVersion=2026-03-10)
- [How billing flows through budgets](https://docs.github.com/enterprise-cloud@latest/copilot/concepts/billing/budgets-for-usage-based-billing#how-billing-flows-through-budgets)
- [Included usage controls for cost centers](https://docs.github.com/copilot/concepts/billing/budgets-for-usage-based-billing#included-usage-controls-for-cost-centers)
- [Models comparison](https://docs.github.com/copilot/reference/ai-models/model-comparison)
- [Models and pricing for GitHub Copilot](https://docs.github.com/copilot/reference/copilot-billing/models-and-pricing)
- [Monitoring your GitHub Copilot usage and entitlements](https://docs.github.com/copilot/how-tos/manage-and-track-spending/monitor-ai-usage)
- [Optimizing your budget configuration](https://docs.github.com/enterprise-cloud@latest/copilot/tutorials/budgets/optimizing-your-budget-configuration)
- [Setting an AI credit session limit](https://docs.github.com/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit)
- [Understanding Copilot budgeting](https://support.github.com/product-guides/github-copilot/get-started/understanding-copilot-budgeting)
- [Update your IDE, client, and extension](https://docs.github.com/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises#update-your-ide-client-and-extension)
- [Usage-based billing for organizations and enterprises](https://docs.github.com/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises)
- [Viewing usage in your IDE](https://docs.github.com/copilot/how-tos/manage-and-track-spending/monitor-ai-usage#viewing-usage-in-your-ide)
