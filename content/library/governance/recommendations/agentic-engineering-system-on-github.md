---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false
title: 'Building an agentic engineering system on GitHub'
weight: 25
publishDate: 2026-05-20
params:
  authors: [
    {name: "GitHub Well-Architected", handle: "github"},
  ]

pillars:
  - productivity
  - collaboration
  - architecture
  - governance

areas:
  - agent-and-extensions
  - ci-cd-and-devops
  - context-engineering
  - collaborative-coding
  - enterprise-and-teams
  - developers

personas:
  - administrator
  - developer

platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu

features:
  - copilot
  - github-actions
---

An agentic engineering system is more than a set of tools. It is a configuration of platform capabilities that lets people and agents work together reliably across the lifecycle: defining what should happen next, delivering the change, and detecting whether it produced the intended outcome. This guide maps the moving parts of such a system to the GitHub primitives that implement them, and identifies common patterns and anti-patterns when teams put them together.

This guide is paired with two adjacent design guides:

- [Agentic governance taxonomy](agentic-governance-taxonomy) covers the rule layer: the deterministic standards and permissions that bound what agents and humans can do.
- [Shared knowledge for agentic engineering](agentic-shared-knowledge) covers the information layer: the code, decisions, signals, customer evidence, and agent memory that informs every action.

Read those alongside this guide. Governance and shared knowledge are the two leading areas of investment, implemented within the agentic engineering system described here.

## A short orientation

Three kinds of building block matter for an agentic engineering system on GitHub:

- **Stocks** are what the system accumulates over time and draws on later. The term is borrowed from [system dynamics](https://en.wikipedia.org/wiki/System_dynamics). Two stocks matter for this WAF adaptation: **governance** (the rule layer that bounds what agents and humans can do) and **shared knowledge** (the information layer that informs every action). The AES source framework also tracks a lagging **customer value** stock that these two feed into; this guide focuses on the two leading stocks because they are the ones GitHub primitives directly build.
- **Activities** are the work the system performs: deciding what to do next, doing it, and observing what happened. These map roughly to the Define, Deliver, and Detect cadence familiar from many lifecycle frameworks.
- **Modes** describe how participants act within an activity. A Director sets direction. A Performer executes within that direction. An Assessor evaluates the result. Either humans or agents can hold any mode (or multiple modes) where governance permits.

This guide focuses on stocks and activities. Modes will be introduced in a forthcoming design principle, *Design for agentic engineering*.
<!-- TODO: restore link to /library/design-principles/design-for-agentic-engineering once #1016 lands -->

## Stocks: GitHub primitives

The table below maps each stock to the GitHub capabilities that build, store, or expose it. The capability list is not exhaustive; it focuses on what teams typically reach for first.

| Stock | GitHub capabilities |
|---|---|
| **Governance (rule layer)** | [Repository rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets), [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), required status checks, [environment protection rules](https://docs.github.com/en/enterprise-cloud@latest/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments), [secret scanning with push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning), [Dependabot](https://docs.github.com/en/code-security/dependabot), [code scanning](https://docs.github.com/en/code-security/code-scanning), [Copilot code review](https://docs.github.com/en/copilot/using-github-copilot/code-review/using-copilot-code-review), [Copilot Code Quality](https://docs.github.com/en/copilot/how-tos/agents/copilot-code-review/configuring-coding-guidelines), [security configurations](https://docs.github.com/en/code-security/securing-your-organization/meeting-your-specific-security-needs-with-custom-security-configurations/about-custom-security-configurations), [audit log and audit log streaming](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/audit-log-events-for-your-organization), Copilot Business or Enterprise admin policies, [MCP access policy](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer/enterprises/manage-github-copilot-in-your-enterprise/manage-mcp-servers-for-your-enterprise), agentic workflows, [agentic audit log fields](agentic-governance-taxonomy#agentic-audit-logs) (`actor_is_agent`, `agent_session_id`) |
| **Shared knowledge (information layer)** | Repository contents, [`.github/copilot-instructions.md`](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot), `.github/instructions/` path-scoped guidance, [issue templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository), pull request templates, architecture decision records committed to the repository, [GitHub Wiki](https://docs.github.com/en/communities/documenting-your-project-with-wikis), [Discussions](https://docs.github.com/en/discussions), [Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects), linked issues and cross-references, [MCP servers](https://docs.github.com/en/copilot/customizing-copilot/extending-copilot-coding-agent-with-mcp) for external context |

## Activities: GitHub primitives

The table below maps each activity to the capabilities that support it. Many primitives appear in more than one activity, because the same capability often plays different roles depending on where in the cycle it is used. A pull request is both a Deliver artifact (the proposed change) and a Detect surface (the place where review and check outcomes are recorded). An Actions workflow can enforce governance and emit signal in the same run.

| Activity | GitHub capabilities |
|---|---|
| **Define** | [Issues](https://docs.github.com/en/issues) with structured templates, [Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects) for prioritization and sprint planning, [labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work) and milestones, agent-drafted issues from custom Copilot agents, [Discussions](https://docs.github.com/en/discussions) for proposal-stage conversation |
| **Deliver** | [GitHub Copilot coding agent](https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks) (agent Performer), [GitHub Actions](https://docs.github.com/en/actions) (CI/CD orchestration), [pull requests](https://docs.github.com/en/pull-requests) (review and merge flow), [Codespaces](https://docs.github.com/en/codespaces) (development environments), [Packages](https://docs.github.com/en/packages), branch deploy workflows, [reusable workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows) for shared delivery patterns |
| **Detect** | [Actions](https://docs.github.com/en/actions) workflows that emit structured signal, [Dependabot alerts](https://docs.github.com/en/code-security/dependabot), [code scanning](https://docs.github.com/en/code-security/code-scanning) findings, [security advisories](https://docs.github.com/en/code-security/security-advisories), repository insights, deployment status checks, [webhooks](https://docs.github.com/en/webhooks) for external observability, [MCP servers](https://docs.github.com/en/copilot/customizing-copilot/extending-copilot-coding-agent-with-mcp) for telemetry ingestion, [Copilot usage metrics dashboard and API](https://github.blog/changelog/2025-10-28-copilot-usage-metrics-dashboard-and-api-in-public-preview/) |

## Common patterns

A handful of patterns recur across teams that get agentic engineering working at scale.

**Calibrated review, deterministic floor.** Branch ruleset, required checks, CODEOWNERS, and environment rules are configured so that well-bounded changes (documentation updates, dependency bumps, formatting passes, generated-spec updates) can flow through agents acting as Performers (executing the work) and automated Assessors (evaluating the result) without holding up human reviewers. Higher-stakes changes attract the human attention they warrant. The boundary is encoded in [authorization and action boundaries](agentic-governance-taxonomy#governance-taxonomy), not in informal convention.

**Instruction files as a primary work product.** `.github/copilot-instructions.md` and path-scoped instructions under `.github/instructions/` are kept current alongside code. Architectural conventions, file-layout expectations that cannot be inferred from directory names, and known pitfalls live in versioned files agents can read, not in tribal knowledge. In our experience, when agent-opened pull requests stop being merge-ready, the most effective intervention is rarely a better model: better shared knowledge, effective issue scoping, and accessible prior decisions tend to move the merge rate further than a model upgrade does.

**Structured handoffs from one cycle to the next.** Pull request descriptions describe intended behavior, what changed and why, what risks remain, what telemetry should be watched, and what the recovery path is if reality disagrees with the plan. Test outcomes, coverage, and static-analysis findings live in [checks](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/using-jobs-in-a-workflow), pull request comments, and [coverage reports](https://docs.github.com/en/code-security/how-tos/maintain-quality-code/set-up-code-coverage) rather than being restated in the description. Issues link forward to the resulting pull requests and backward to the decisions that motivated them. Detect outputs are routed to the surface that best consumes them: incident reports, telemetry summaries, and customer feedback live in Issues, Discussions, or external systems accessible through MCP; corrections to how an agent handled a class of task route into instruction files where they can prevent the next occurrence.

**Orchestrator and worker agents within pre-authorized scope.** When a task is too large or too diverse for a single agent execution, an orchestrator agent decomposes it and delegates sub-tasks to worker agents. The orchestrator holds Director mode toward the workers while remaining a Performer relative to the human Director above it. Industry writing sometimes calls this pattern [loop engineering](https://newsletter.pragmaticengineer.com/p/what-is-loop-engineering); the terminology is unsettled, but the shape is the same. This is a configuration of existing modes, not a new mode, and it is bounded by the same authorization rules as any other agent action.

## Anti-patterns

Three patterns produce volume without value and tend to be the first signs that a team has expanded agent participation faster than the supporting stocks.

**Uniform review ceremony.** Every change gets the same level of human review regardless of risk. Reviewers become the bottleneck, attention on high-risk work gets diluted, and rubber-stamping becomes the de facto policy. The fix is calibration: encode the boundary between deterministic enforcement and human judgment in [authorization and action boundaries](agentic-governance-taxonomy#governance-taxonomy), and let low-risk work flow through automated controls.

**Agent volume without shared knowledge investment.** Agents open pull requests, but engineers spend more time reviewing and rejecting them than they would have spent doing the work themselves. The most effective intervention is rarely a better model. It is better inputs, drawn from the whole [shared knowledge](agentic-shared-knowledge) surface: instruction files, skills, and agent configurations that describe architectural conventions and known pitfalls; well-scoped issues with clear acceptance criteria; and prior decisions the agent can reach that are narrowly scoped enough to still apply. Stale or overbroad decisions and skills degrade output; kept current and scoped, they lift it. See [shared knowledge for agentic engineering](agentic-shared-knowledge) for the inventory and improvement framework.

**Detection that lags delivery.** Agents accelerate `Deliver`, but the team has not invested equivalent capability in `Detect`. Changes ship faster than the system can observe them, and the gap between "what changed" and "what we know about what changed" widens. Symptoms include incidents discovered by customers rather than telemetry, support ticket spikes traced back to changes nobody is monitoring, and post-incident reviews that produce learnings nobody routes back into instruction files. The fix is to treat detection coverage as a delivery requirement: a change is not complete until the system can observe whether it produced the intended outcome.

## Putting the pieces together

A practical way to assess an agentic engineering system on GitHub is to walk one workflow end-to-end and audit each activity against each stock. For every cell, list what supports the workflow today and what is missing.

| Activity | Governance (rule layer) | Shared knowledge (information layer) |
|---|---|---|
| **Define** | Which policies govern who can open, edit, and prioritize this class of work? Which required approvals apply before work enters Deliver? | What issue templates, prior decisions, acceptance criteria, and customer signal does the definer (human or agent) reach for? |
| **Deliver** | Which rulesets, environment rules, CODEOWNERS, and required checks bound the change? What is the agent identity permitted to do end-to-end? | What instruction files, skills, agent configurations, and code context does the delivering agent or human reach for? |
| **Detect** | Which audit and provenance controls capture what actually happened? Which controls block release if the signal is bad? | What telemetry, incident records, and customer signal are structured and routed back into shared knowledge for the next Define cycle? |

Cells with concrete answers on both sides ("supporting: X; missing: Y") are cells where agent participation can be expanded with confidence. Cells with vague answers or empty "missing" columns are usually the wrong place to expand next; the right move is to close a gap in either governance or shared knowledge before delegating further.

When Detect surfaces a defect, the audit should produce three linked outputs, not one: the fix itself; tests that reproduce the defect and pin the corrected behavior; and any changes to instruction files, skills, or agent configurations that prevent the same class of defect from being generated again. All three feed back into the shared knowledge column of the next cycle.

## Related content

{{< cards >}}
  {{< card link="governing-agents" title="Governing agents" subtitle="Platform-level guidance for agent governance" icon="shield-check" >}}
  {{< card link="agentic-governance-taxonomy" title="Agentic governance taxonomy" subtitle="The rule layer paired with this system" icon="document-text" >}}
  {{< card link="agentic-shared-knowledge" title="Shared knowledge for agentic engineering" subtitle="The information layer paired with this system" icon="document-text" >}}
  {{< card link="../../productivity/recommendations/engineering-system-metrics" title="Engineering system metrics" subtitle="Measuring the engineering system overall" icon="chart-bar" >}}
  {{< card link="../../architecture/recommendations/expanding-enterprise-custom-agents-context" title="Expanding enterprise custom agents context" icon="sparkles" >}}
{{< /cards >}}

{{% seeking-further-assistance-details %}}
