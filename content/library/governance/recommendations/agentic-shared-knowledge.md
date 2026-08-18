---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false
title: 'Shared knowledge for agentic engineering'
weight: 35
publishDate: 2026-05-20
params:
  authors: [
    {name: "GitHub Well-Architected", handle: "github"},
  ]

pillars:
  - productivity
  - collaboration
  - architecture

areas:
  - agent-and-extensions
  - context-engineering
  - collaborative-coding
  - developers

personas:
  - administrator
  - developer

platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu

features:
  - copilot
---

The quality of every action an agent takes is bounded by the quality of the context available to it. A coding agent generating a payment retry flow cannot consider an architectural constraint it has never read, cannot follow a convention it has never been shown, and cannot avoid a known pitfall recorded only in someone's head. As Anthropic's engineering team [put it in 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-aiagents), "context is a critical but finite resource for AI agents." This guide describes shared knowledge as the context the engineering system holds, and provides a taxonomy for inventorying and improving it.

## Why shared knowledge matters

Humans have always depended on quality information to do their work, but experienced humans can compensate for gaps through institutional memory, informal networks, and judgment built over years. Agents cannot. They operate strictly within what they can access. An agent given broad permissions but insufficient context will fill gaps with plausible-sounding assumptions, generate code that violates unstated conventions, or solve the wrong problem confidently. The output appears productive, but the rework cost accumulates downstream in failed reviews, rejected pull requests, and defects that reach production.

There is a second consideration. Information that is *available* to an agent is not the same as information the agent actually attends to. Attention across a long context window is finite and unevenly distributed, so even accurate, fresh material can be missed when the window is crowded. Worse, with a large token context an agent is increasingly likely to miss facts or hallucinate new ones. Shared knowledge must therefore be economical as well as accurate: scoped to the decision at hand, with the most relevant material made most prominent.

A scope note before the categories below. The line between the two taxonomies runs through function, not through artifact. If material is being read to inform a decision, it belongs to shared knowledge; if it is being applied to enforce or bound an action, it belongs to [agent governance](/library/governance/recommendations/agentic-governance-taxonomy). An instruction file describing an architectural convention is shared knowledge when an agent reads it before generating code, and it is governance-adjacent when a required check refuses a PR that violates the convention. The same artifact can play both roles; the taxonomies name the roles, not the artifacts.

## Sub-categories of shared knowledge

Five sub-categories together cover the context the engineering system holds. They are designed to be mutually distinct enough to be inventoried separately, and jointly exhaustive of what the high-level idea of "context" usually lumps together.

### 1. Code context

The current state of the codebase: production code, tests, infrastructure-as-code, build configuration, dependency graphs, and the technical debt embedded in them, plus the artifacts that shape how agents work within that code. This is what an agent or human reads before changing anything. Well-named code and thorough unit tests are often the most effective information an agent has, since they demonstrate correct behavior more reliably than standalone documentation and they surface in retrieval where prose descriptions may not. On GitHub, code context lives primarily in repositories themselves, supplemented by [`.github/copilot-instructions.md`](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot) for repository-level conventions, `.github/instructions/` for path-scoped guidance, [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) for ownership signals, and skill and agent definitions (`AGENTS.md`, `SKILL.md`, custom agent configurations) that shape long-term agent behavior alongside the code they act on.

Primary activity served: `Deliver`, with strong feedback into `Define` when code reveals a constraint that should shape the next decision.

### 2. Intent, decision, and knowledge context

The record of why the system is the way it is, together with the broader internal corpus that explains how it works: product requirements, architecture decision records, design docs, roadmaps, RFCs, resolved-issue history, runbooks, onboarding docs, internal wikis, glossaries, team handbooks, and the corpora that get indexed into retrieval systems. On GitHub, this material lives in [Issues](https://docs.github.com/en/issues), [Discussions](https://docs.github.com/en/discussions), [Wikis](https://docs.github.com/en/communities/documenting-your-project-with-wikis), repository documentation under `docs/`, and increasingly through [MCP servers](https://docs.github.com/en/copilot/customizing-copilot/extending-copilot-coding-agent-with-mcp) that surface external knowledge bases.

Primary activity served: `Define`, with relevance to all activities depending on the query.

### 3. Operational signal context

Live and historical signals from the running system: telemetry, logs, traces, metrics, incident records, evaluation results, and agent reasoning traces. The [Copilot usage metrics dashboard and API](https://github.blog/changelog/2025-10-28-copilot-usage-metrics-dashboard-and-api-in-public-preview/), Actions run history, [Dependabot alerts](https://docs.github.com/en/code-security/dependabot), [code scanning](https://docs.github.com/en/code-security/code-scanning) findings, [Copilot Code Quality](https://docs.github.com/en/copilot/how-tos/agents/copilot-code-review/configuring-coding-guidelines) outputs, deployment history, and external observability platforms surfaced through MCP all contribute to this category. Evaluations and benchmarks sit inside this sub-category rather than as a separate one, on the basis that they are operational measurements of system behavior.

Primary activity served: feeds Define (it comes from Detect).

### 4. Customer context

Direct evidence of what customers do, want, and complain about: support tickets, interview transcripts, usage analytics, NPS verbatims, sales-call notes, churn reasons. Customer context rarely lives natively on GitHub, but it can be linked into Issues, surfaced through MCP servers connected to support and analytics platforms, or summarized as recurring artifacts in repository documentation. The closer customer signal sits to where work is defined, the more reliably it shapes that work.

Primary activity served: Define, with feedback into Detect when a customer signal sets a measurement target.

### 5. Agent memory and session context

The state agents accumulate within and across runs: scratchpads, episodic memory, learned task patterns, prior tool-call results, and inter-agent handoff artifacts. Most of this material has a short effective half-life. Reasoning traces and tool-call histories often stop being relevant the moment the underlying code changes, and old traces re-entered into a fresh context can push an agent toward outdated behaviors. Two subsets have longer value. First, patterns that generalize, such as recurring conventions or effective task decompositions, are worth graduating into skills or instruction files rather than left buried in session logs. Second, the trace itself is the primary evidence base for auditing what an agent did and for improving the shared knowledge that guided it: [agent session streaming](https://github.blog/changelog/2026-07-02-copilot-agent-session-streaming-is-now-in-public-preview/) (public preview) is the emerging mechanism for turning that evidence base into a durable signal that can be joined against other metrics. On GitHub today, much of this material is implicit in the conversation history of an [agent session](https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks) or the artifacts an agent leaves behind in pull request descriptions, comments, and commit messages. Treating the durable subset as structured outputs, and letting the ephemeral remainder age out, is what turns this sub-category from a liability into shared knowledge.

Primary activity served: `Deliver` primarily, but relevant whenever an agent runs.

## Cross-cutting actionability properties

Decomposing into sub-categories is necessary but not sufficient. Each sub-category becomes actionable only when four properties can be observed and improved against it.

| Property | Question it answers |
|---|---|
| **Retrievability** | Can the right slice be found at the right time, by both humans and agents? Is it indexed, linked, and reachable through the tools the consumer is using? |
| **Structure** | Is it in a form a model or tool can consume efficiently? Are headings, fields, and relationships consistent enough for retrieval to be precise? |
| **Freshness** | How stale is it, and is staleness visible? Can a consumer tell whether a document still reflects the system it describes? |
| **Provenance and trust** | Where did it come from, and how confident should a downstream consumer be in it? Is the source attributable, and is the level of review or validation knowable? |

A maturity assessment of shared knowledge can be expressed as a five-by-four grid: each sub-category scored on each property. This grid is most useful when read alongside an equivalent assessment of [agent governance](/library/governance/recommendations/agentic-governance-taxonomy#governance-taxonomy), the rule layer that decides what agents and humans are permitted to do with the context they hold. The two together describe whether the conditions under which agents and humans operate are both well-informed and well-bounded.

## What strengthens and degrades shared knowledge

Shared knowledge strengthens when it is treated as a deliberate work product rather than a byproduct. Structured instruction files describe architectural conventions and constraints; well-scoped issues carry clear acceptance criteria and links to prior decisions that still apply; architecture decision records sit in the repository where agents can reference them, and are pruned or clearly superseded when the decision no longer holds. Documentation is updated as part of the delivery process rather than deferred. Detect outputs (telemetry, incident learnings, customer feedback) are structured and routed back into the shared knowledge agents and humans consume. Overbroad or out-of-date decisions actively degrade output. They push agents toward former behaviors instead of current ones, and can prevent an agent from seeking the correct behavior even when the code allows for it.

Shared knowledge degrades through neglect and through saturation. Neglect includes outdated documentation, invalid code comments, unresolved technical debt (including poor coding practices), inconsistent information, and institutional memory that is not captured in the code or in content which can be referenced. Saturation is the opposite failure: the context contains irrelevant data, inefficient or repeated details, references to inaccessible content, or is nearing token limits. All of these dilute attention on the details that should drive the decision. The practical defense is treating context capture as a continuous obligation, crafting instructions, skills, and agents in a way that ensures every piece of data earns its place in the window.

## Signals to track

A small set of indicators tells you whether shared knowledge is improving in step with delivery velocity, or falling behind it.

| Signal | What it tells you |
|--------|-------------------|
| **Context artifact freshness** | Age of documentation, instruction files, and architecture records. Staleness is a leading indicator that the next agent action will be based on a degraded picture. |
| **Rate of agent outputs accepted after human review** | The direction can be helpful, but not always an indicator of quality. Low acceptance rates on agent-opened work often point at shared-understanding gaps rather than model gaps. High acceptance rates alone do not confirm quality: an agent can reach the goal without honoring guardrails or without producing the most maintainable path. Pair this signal with checks on how the goal was reached, including which files were touched, which conventions were followed, and which paths were tried and abandoned. |
| **Time spent on context creation and maintenance** | Leading indicator of whether context is treated as infrastructure. Teams that spend zero time here are usually accruing context debt. |
| **Retrieval precision** | Proportion of agent retrievals that surface material the agent actually used to produce the output, versus material that was returned but ignored or contradicted. |

## Implementation approach

Shared knowledge does not need to be perfect everywhere before agent work begins. It needs to be sufficient for the specific class of action being delegated. The phased approach below is incremental: each phase improves a specific sub-category for a specific workflow before expanding to the next.

### Phase 1: Inventory

Before improving anything, understand what already exists. Identify, per sub-category, where the material lives, who owns it, and what shape it is in. Many organizations discover that the issue is not absence but fragmentation: the material exists, but in places agents cannot reach.

### Phase 2: Pick one workflow

Select one workflow where an agent would add clear value (for example, agent-opened pull requests on a single repository, or agent-drafted issues for a single product area). Map the context that workflow needs, sub-category by sub-category. Close the most consequential gaps before expanding.

### Phase 3: Make freshness visible

For each piece of material the workflow depends on, make staleness observable. Last-edited timestamps, "context owner" labels, automated checks that flag drift between code and documentation, and structured review cycles all serve this purpose. Material whose freshness cannot be assessed is material no consumer can fully trust.

### Phase 4: Expand and prune in step

As you expand to new workflows, expand context coverage. As you observe what context is actually attended to, prune what is not. Both moves are necessary. Adding without pruning leads to saturation; pruning without adding leaves new workflows unsupported.

## Related content

{{< cards >}}
  {{< card link="/library/governance/recommendations/governing-agents" title="Governing agents" subtitle="Platform-level guidance for agent governance" icon="shield-check" >}}
  {{< card link="/library/governance/recommendations/agentic-governance-taxonomy" title="Agentic governance taxonomy" subtitle="The rule layer that pairs with shared knowledge" icon="document-text" >}}
  {{< card link="/library/architecture/recommendations/expanding-enterprise-custom-agents-context" title="Expanding enterprise custom agents context" subtitle="Practical patterns for context engineering at scale" icon="sparkles" >}}
  {{< card link="/library/productivity/recommendations/engineering-system-metrics" title="Engineering system metrics" subtitle="Measuring the engineering system overall" icon="chart-bar" >}}
{{< /cards >}}

{{% seeking-further-assistance-details %}}
