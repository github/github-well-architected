---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT

draft: false # Set to false when ready to publish

title: 'Governing agents in GitHub Enterprise'
publishDate: 2026-04-13
params:
  authors:
    [
      { name: 'Kitty Chiu', handle: 'kittychiu' },
      { name: 'Tiago Pascoal', handle: 'tspascoal' },
      { name: 'Ken Muse', handle: 'kenmuse' },
      { name: 'Josh Johanning', handle: 'joshjohanning' },
      { name: 'Ayodeji Ayodele', handle: 'ayodejiayodele' },
    ]

pillars:
  - governance
  - application-security

areas:
  - agent-and-extensions
  - context-engineering
  - enterprise-and-teams
  - security

verticals:
  - automotive
  - finance
  - gaming
  - government
  - information-technology
  - manufacturing
  - media
  - professional-service
  - retail
  - smb-corporate
  - mid-market

personas:
  - administrator
  - developer

platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu
  - github-enterprise-cloud-data-residency

features:
  - copilot
  - github-actions

components:
  - coding-agents
  - review-agents
  - third-party-agents
  - copilot-skill
  - audit-log
  - governance-and-policy
  - mcp-and-extensions
  - billing-and-cost-centers
  - push-rulesets
  - branch-rulesets
  - custom-instructions

github:
  - enterprise-support
  - customer-success-architect
  - expert-services
  - fast-track
  - forward-deployed-engineering
  - microsoft
  - partners
---

<!-- markdownlint-disable MD025 -->
<!-- markdownlint-disable MD013 -->

## Scenario overview

Agents — [Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent), [Copilot code review agent](https://docs.github.com/en/copilot/concepts/agents/code-review), and third-party agents like [Anthropic Claude](https://docs.github.com/en/copilot/concepts/agents/anthropic-claude) and [OpenAI Codex](https://docs.github.com/en/copilot/concepts/agents/openai-codex) — are becoming significant contributors to enterprise codebases. GitHub lets teams assign tasks to agents from issues, PRs, and Visual Studio Code in a single workflow. In many organizations, agents already rank among the top contributors by pull request volume.

This introduces new governance challenges. Agents act faster and at broader scale than any individual. They interact with external services through MCP, use skills to extend their capabilities, and execute code in environments that may hold secrets and infrastructure triggers. A single misconfigured enterprise policy or shared agent definition can affect multiple repositories quickly.

For enterprises managing multiple business units, the question is not _whether_ to adopt agents, but _how to govern them_ without creating bottlenecks. This recommendation covers levers for controlling agent behavior, managing costs, enforcing security boundaries, and maintaining audit visibility — while keeping teams productive.

**What "good" looks like:** agents operate within clearly defined trust boundaries, every action is auditable and traceable, model and tool access is centrally managed, and cost exposure is predictable and attributable.

## Key design strategies and checklist

1. **Minimize enterprise-level baseline, empower organizations to adapt**

   Set non-negotiable controls at the enterprise level — audit log streaming and model restrictions for compliance — so every organization inherits a governance floor it can build on. Let organizations decide when and how to enable agents, configure MCP, and create their own custom agents within those boundaries. Review the model allowlist regularly — disable outdated models and enable newer ones after any legal review — so teams benefit from model improvements.

   The baseline should stay minimal — set guardrails for audit and compliance, then let organizations and repositories create and refine their own agents and configurations. Anti-pattern: organizations enabling agents without audit log streaming or model restrictions.

   See section [Configure enterprise-level Copilot, agent, and MCP policies](#1-configure-enterprise-level-copilot-agent-and-mcp-policies) for implementation details.

2. **Layer agentic configuration**

   Set enterprise-level controls for security and compliance baselines, then let teams tailor custom instructions and MCP access at the repository level for maximum effectiveness. Without layered configuration, enterprises either over-centralize (generic instructions, wasted tokens, friction) or under-govern (inconsistent agents, unreviewed MCP access, ad-hoc setups).

   Human review is even more important in the agentic world — a single instruction or MCP configuration change can alter agent behavior across many sessions and repositories. Require human review for all repository changes, including agent configuration files and MCP server configurations. Standardize the agent environment so agents build and test more reliably across repositories. Anti-pattern: allowing developers to configure arbitrary MCP servers, agent instructions, or custom agents without review, or letting agents discover and install dependencies through trial and error.

   See section [Layer agentic configurations](#2-layer-agentic-configurations) for implementation details.

3. **Enforce security controls and human review gates on agent output**

   The cloud agent's built-in protections provide a baseline, but they are not sufficient on their own. Layer additional protections including CODEOWNERS, branch rulesets requiring independent review, firewall restrictions, and least-privilege token scoping. Choose a [code review agent strategy](#automatic-vs-on-demand-code-review) based on your team's risk tolerance.

   Treat agent-authored code with the same rigor as human-authored code — same CI checks, security scans, and review gates. Anti-pattern: exempting agent-created changes from existing checks or rulesets — agent PRs should pass the same gates as any other contribution.

   See section [Enforce security controls and human review gates](#3-enforce-security-controls-and-human-review-gates) for implementation details.

4. **Make agent activity auditable and traceable**

   Stream audit logs to your SIEM so agent-related events (e.g., session creation, commits, PR activity, policy changes) are retained. Agent activities can be correlated using the `agent_session_id` field.

   Agents act autonomously and at scale, so agent observability requires two complementary activities: stream audit events to your SIEM for anomaly detection and long-term retention, and periodically spot-check session transcripts in the GitHub UI for high-risk repositories — transcripts are only available in the UI and cannot be exported. Anti-pattern: relying solely on the GitHub UI for audit review without streaming to an external system for retention and correlation.

   See section [Build agent observability and audit pipeline](#4-build-agent-observability-and-audit-pipeline) for implementation details.

5. **Make cost exposure predictable and attributable**

   Configure spending limits and alerting thresholds for the cost units that agents consume before scaling adoption. Without these guardrails, agent-driven spending can spike unpredictably and be difficult to attribute to specific cost owners.

   Track consumption alongside adoption metrics so cost governance decisions are data-driven. Anti-pattern: enabling agents enterprise-wide without spending limits and discovering overages after the fact.

   See section [Manage agent-related costs](#5-manage-agent-related-costs) for implementation details.

### Quick checklist

#### 1. Policy & governance

- [ ] Copilot, Agent, and MCP policies are configured at the enterprise level; see [configure enterprise-level policies](#1-configure-enterprise-level-copilot-agent-and-mcp-policies)
- [ ] Available models reviewed and configured
- [ ] Third-party agents are disabled by default; enabled only after review
- [ ] AI manager custom role is assigned to delegates; enterprise ownership is not over-granted
- [ ] Enterprise AI governance policies are communicated to org owners and developers

#### 2. Agent setup & standardization

- [ ] Custom instruction libraries with company-specific criteria are published in a shared repository; see [repository custom instructions](#repository-custom-instructions)
- [ ] Organization custom instructions are configured as a baseline for each org; see [organization custom instructions](#organization-custom-instructions)
- [ ] Enterprise custom agents exist in `.github-private` and are configured for enterprise-wide availability; org-scoped agents remain in the org's `.github-private` for narrower distribution; see [enterprise custom agents](#enterprise-custom-agents)
- [ ] Rulesets restrict changes to agentic primitive files; see [protect agentic primitive files](#protect-agentic-primitive-files-with-rulesets)
- [ ] Each repository has a `copilot-setup-steps.yml` that pins dependencies for its application type; use rulesets to restrict changes; see [agent environment standardization](#agent-environment-standardization)
- [ ] Agent workloads run on ephemeral runners (GitHub-hosted or ephemeral self-hosted); see [use ephemeral runners](#use-ephemeral-runners-for-agent-execution)

#### 3. Security controls & review gates

- [ ] The `GITHUB_TOKEN` in `copilot-setup-steps.yml` is scoped to least privilege; note that this only applies to the setup workflow, not the agent's own operations
- [ ] The cloud agent firewall is enabled and the allowlist is configured to permit only required external domains; see [cloud agent](#cloud-agent)
- [ ] A code review agent strategy is chosen; see [automatic vs. on-demand code review](#automatic-vs-on-demand-code-review) for trade-offs
- [ ] CI checks, security scans, and code review gates apply equally to agent-authored and human-authored code
- [ ] Agent-generated code is always reviewed at PR time for quality, accuracy, and guideline adherence
- [ ] Custom instructions, agents, skills, and MCP server configurations are refined when recurring issues are found

#### 4. Observability & audit

- [ ] Audit log streaming is enabled and agent events appear in your SIEM; see [audit log streaming](#audit-log-streaming-for-retention-correlation-and-anomaly-detection)
- [ ] Agent sessions are periodically spot-checked via the Agents tab; see [session monitoring](#session-monitoring-for-debugging-and-oversight)
- [ ] `agent_session_id` is correlated across events in your SIEM for end-to-end traceability
- [ ] SIEM alerts are active for high-risk signals (workflow file changes, ruleset bypass attempts, usage anomalies)

#### 5. Cost management

- [ ] Spending limits are configured per organization or cost center; "stop usage at limit" is enabled for hard caps; see [manage agent-related costs](#5-manage-agent-related-costs)
- [ ] Set spend alerting to responsible teams
- [ ] Model selection education and governance aligns with cost awareness
- [ ] Usage consumption of Copilot is tracked

## Assumptions and preconditions

- Your enterprise uses a **GitHub Enterprise Cloud** environment.
- You have **enterprise owner** access to configure policies that cascade to organizations.
- **GitHub Copilot Business or Enterprise** licenses are assigned. See [comparing Copilot plans](https://docs.github.com/en/copilot/get-started/plans#comparing-copilot-plans) for current feature availability by plan.
- **GitHub Actions** is enabled for your enterprise and organizations. The cloud agent runs on Actions runners and consumes Actions minutes.
- You have a **SIEM platform** (e.g., Splunk, Microsoft Sentinel, Datadog) capable of ingesting GitHub audit log streams.
- Your enterprise already has [foundational code security practices]({{< relref "/library/application-security/checklist" >}}) in place (CI checks, pull review, secret scanning). Agent governance is an additive layer, not a replacement.
- This recommendation does **not** cover GitHub Enterprise Server (GHES) deployments — agent capabilities are cloud-only at this time.
- The term **custom instructions** as used throughout this article broadly encompasses the full agentic configuration layer — including agent definitions (custom agents) and skill definitions (`SKILL.md`) — unless otherwise specified.

## Recommended implementation

### 1. Configure enterprise-level Copilot, agent, and MCP policies

Navigate to your enterprise settings and click **AI controls**. This centralized pane has three policy surfaces in the sidebar: **Agents**, **Copilot**, and **MCP**. Configure each:

#### Agents → [Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/manage-copilot-coding-agent)

- In most enterprises, start with "Let organizations decide" and enable for a pilot group first.
- Configure an organization for enterprise custom agents. See section [enterprise custom agents](#enterprise-custom-agents).

{{< callout type="info" >}}
Third-party agents have access to the same repositories where the Copilot agent is enabled. See [Enabling or disabling third-party cloud agents](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies#enabling-or-disabling-third-party-coding-agents-in-your-repositories).
{{< /callout >}}

#### Copilot → [Policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies)

- Set model access enforcement. Explicitly select which models are allowed. Review the allowlist regularly — enable newly GA models after any required review, and evaluate models' behaviors and use cases to ensure they meet your organization's needs. Deprecated models may be removed; ensure newer or alternative models are enabled before retirement dates.
- Enable all Copilot capabilities. Toggle off only if you have a specific requirement to restrict a capability.

#### MCP

- The right MCP selections (e.g., GitHub MCP Server) in combination with skills, improve user and agent effectiveness and reduce token consumption. See [MCP server governance](#mcp-server-governance).

After configuring enterprise policies, communicate clearly to administrators and users. Policies only work if everyone understands them. If you choose "Let orgs decide" for agents, send guidance to org owners on how to enable agents within your enterprise's boundaries.

### 2. Layer agentic configurations

Consistent agent behavior requires layered configuration, and over-centralizing instructions and agents at the enterprise level hurts usability and increases cost. Prompts and custom instructions are most effective when tailored to the repository's language, framework, and domain. Enterprise-level controls should set security and compliance baselines; repository-level configuration is where teams optimize agent effectiveness for their specific codebase. In large enterprises with independent business units, pushing too much governance to the enterprise level leads to generic instructions, wasted tokens, and friction that slows adoption.

#### Repository custom instructions

Create a library of shared [custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) starters. Publish these in a shared repository for teams to reference and consume for their own repository. The following types are supported:

| Type | File | Scope |
|------|------|-------|
| Repository-wide | `.github/copilot-instructions.md` | All requests in the repository |
| Path-specific | `.github/instructions/NAME.instructions.md` | Files matching the `applyTo` glob pattern |
| Agent-specific | `AGENTS.md` (or `CLAUDE.md`, `GEMINI.md`) | See [supported agent-specific file locations](https://docs.github.com/en/copilot/reference/custom-instructions-support) |
| Skill definition | `SKILL.md` | Provides specialized domain knowledge and workflows for agents |

For example, your instructions might include:

```markdown
# Common guardrails for agents

- Follow OWASP secure coding practices. Never hardcode credentials.
- Generate unit tests for all new public functions.
- Do not modify CI/CD workflow files without explicit approval.
- Use the company's approved linting and formatting rules.
```

{{< callout type="info" >}}
Support for agent-specific instruction files (e.g., `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) varies across environments. Not all cloud agents or IDEs honor all of these files, which means the same repository can produce different agent behavior depending on where the agent runs. If you rely on agent-specific files, test in each target environment and document which files are supported where.
{{< /callout >}}

#### Organization custom instructions

Use [organization custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-organization-instructions) to define a baseline prompt for all users in an organization. Organization owners can configure this in **Organization settings → Copilot → Custom instructions**. Note that organization instructions currently apply to Copilot cloud agent and code review agent on GitHub.com.

Treat these instructions as an organizational baseline — keep them narrow and focused on specific, non-negotiable standards (e.g., security, compliance). Broad or generic org-level instructions add context to every request, consuming tokens without improving results. Layer repository and path-specific instructions for team-level controls where the real effectiveness gains happen.

#### Enterprise custom agents

Define enterprise-level agents to deliver consistent and repeatable expertise, behavior, and tool access across all organizations. [Setup enterprise custom agents](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents) by creating a `.github-private` repository in a designated organization. Then:

1. Navigate to enterprise → **AI controls** → Custom agents section.
2. Select the source organization containing your `.github-private` repository.
3. Click **Create ruleset** in the "Protect agent files using rulesets" section.

Consider delegating day-to-day agent management to a team of AI managers while maintaining enterprise-owner control over security-sensitive configurations. See [Establish AI managers](https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/establish-ai-managers).

Note that agents defined in `.github-private` are org-scoped by default. To make them available enterprise-wide, configure the source organization in enterprise AI controls. Some organizations may intentionally keep certain agents org-scoped rather than promoting them enterprise-wide.

{{< callout type="info" >}}
Before deploying a custom agent enterprise-wide, test it in a sandbox repository or with a limited user group. Validate its behavior, then expand. See [Preparing custom agents](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents) for rollout guidance.
{{< /callout >}}

#### MCP server governance

The [GitHub MCP Registry](https://github.com/mcp) provides a curated list of community MCP servers. For enterprise use, you can layer your own governance:

1. Maintain an internal list of reviewed and approved MCP servers with their endpoints, allowed scopes, and review status.
2. Use [rulesets]({{< relref "rulesets-best-practices.md" >}}) to protect MCP configuration files (`.github/copilot/mcp.json` or `.mcp.json`) in repositories.
3. [Configure an MCP registry](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-registry) to curate a discoverable set of pre-approved servers. If your policy requires strict control, set the [MCP allowlist policy](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-server-access) to "Registry only." For enterprises where teams need to experiment, use "Allow all" with rulesets on `.github/copilot/mcp.json` and `.mcp.json` (step 2) so changes require review.

Registry enforcement matches on server name, can be bypassed, and [does not apply to the cloud agent](https://docs.github.com/en/copilot/concepts/mcp-management#supported-surfaces) — treat it as a governance signal and discoverability layer for IDEs, not a hard security boundary. Rulesets on `mcp.json` (step 2) are the primary technical control against unauthorized MCP endpoints across all surfaces except for cloud agent.

{{< callout type="warning" >}}
MCP registry and allowlist enforcement [does not cover all Copilot surfaces](https://docs.github.com/en/copilot/concepts/mcp-management#supported-surfaces). It applies to IDEs (e.g., Visual Studio Code, JetBrains) but **not** to the cloud agent. The cloud agent firewall also [does not apply to MCP servers](#cloud-agent).
{{< /callout >}}

#### Agent environment standardization

[Customize the agent's development environment](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment) by creating a `.github/workflows/copilot-setup-steps.yml` in each repository. This workflow runs before the agent starts work, giving you deterministic control over the agent's environment. For runner selection, organization admins can set defaults centrally rather than configuring per-repository.

For additional runtime customization, [hooks](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-hooks) let you inject shell commands at key points during agent execution (e.g., formatting, linting, or logging).

For consistency across similar repositories, share `copilot-setup-steps.yml` examples with company-specific tooling by application type that teams can adapt. Note that reusable workflows are not supported for this file, and composite actions may help share common setup steps. Each repository maintains its own copy. Protect this file with rulesets so changes require review. Organization admins can also [set a default runner and optionally lock it](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-organization/configure-runner-for-coding-agent) so the agent runs on a consistent runner across all repositories.

#### Use ephemeral runners for agent execution

Use [GitHub-hosted runners](https://docs.github.com/en/actions/using-github-hosted-runners/using-github-hosted-runners/about-github-hosted-runners) for agent execution. Each job gets a fresh VM that is destroyed after the run, eliminating persistent state and credential leakage between sessions. If you require self-hosted runners, make sure they are ephemeral.

### 3. Enforce security controls and human review gates

#### Cloud agent

Copilot cloud agent has [built-in security protections](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent#built-in-security-protections). In the repository's settings, configure additional controls:

- **Firewall.** The agent firewall is enabled by default, restricting the agent's internet access to an allowlist. Organization admins can [manage firewall settings across all repositories](https://docs.github.com/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-firewall), enforcing the firewall org-wide so individual repositories cannot disable it, controlling the recommended allowlist, and adding org-wide custom allowlist entries.
- **Recommended allowlist.** Enabled by default, this permits access to OS package repositories, container registries, language package registries, certificate authorities, and other common development dependencies — not only GitHub services. Review the [full list](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference#copilot-cloud-agent-recommended-allowlist). Customize the allowlist to include any internal registries or services your agents need.

{{< callout type="warning" >}}
The cloud agent firewall is limited to [processes started by the agent via its Bash tool](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-firewall#limitations). It does not apply to MCP servers or processes started in agent environment setup. Treat it as one layer of defense, not a comprehensive network boundary.
{{< /callout >}}

- **Validation tools.** Configure cloud agent to automatically run [code scanning, secret scanning, dependency checks, and Copilot code review](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/configuring-agent-settings) on its changes.

#### Code review agent

Enable **Automatic reviews** with a ruleset at organization or repository level, and curate review criteria in custom instructions to ensure review consistency. For example, a path-specific `.github/instructions/code-review.instructions.md` might include:

```markdown
---
description: 'Code review standards'
applyTo: '**'
---

## Code review standards

- Block merge for security vulnerabilities, exposed secrets, logic errors, and breaking API changes.
- Flag missing tests for critical paths, N+1 queries, and significant deviations from established patterns.
- Suggest improvements for naming, readability, and minor convention deviations — but do not block merge.
```

See [Use custom instructions](https://docs.github.com/en/copilot/tutorials/use-custom-instructions) and [github/awesome-copilot](https://github.com/github/awesome-copilot/tree/main/instructions) examples.

#### Protect agentic primitive files with rulesets

Agent configuration files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.github/instructions/**/*.instructions.md`), skill configuration files (`SKILL.md`), MCP configuration files (`mcp.json`), and the `.github-private` repository for enterprise custom agents define what agents can do and which tools they can access. Unauthorized modifications can change agent behaviors.

Apply [rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) to these files so changes require human review before taking effect.

### 4. Build agent observability and audit pipeline

Enterprise owners have two complementary surfaces for monitoring agent activity: audit log streaming for retention and anomaly detection, and session monitoring in the UI for debugging and oversight.

#### Audit log streaming: for retention, correlation, and anomaly detection

[Stream audit logs](https://docs.github.com/en/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise) to your SIEM platform for long-term retention and correlation. Audit logs capture specific agent and management activities — session creation, commits, PR activity, and policy changes — not the step-by-step session transcript. [Agentic audit log events](https://docs.github.com/en/copilot/reference/agentic-audit-log-events) such as `action`, `actor_is_agent`, `agent_session_id`, and `user` are the key fields for correlations and anomaly detection.

**What to monitor in your SIEM:**

| Signal | Example event / field | Why it matters |
|--------|-----------------------|----------------|
| Agent sessions per user per day | `agent_session_id`, `user` | Detect anomalous usage or compromised accounts |
| MCP policy changes | `copilot.mcp_*` actions | Identify unauthorized changes to approved tool integrations |
| Agent changes to high-risk files (workflows, MCP config, agent instructions) | `git.push`, `pull_request.*` with `actor_is_agent` | High-risk modifications that could affect CI/CD pipelines or agent behavior. Correlate audit events with [webhook payloads](https://docs.github.com/en/webhooks/webhook-events-and-payloads#push) for file-level detail |
| Changes to environment secrets used by agents | `environment.*` actions | Could alter what agents can access or authenticate to |
| Bypass events on rulesets | `repository_ruleset.*` with `actor_is_agent` | Detect attempts to circumvent governance controls |

#### Session monitoring: for debugging and oversight

Session transcripts give you what audit logs cannot: the agent's reasoning, the commands it ran, and the test output it saw before deciding what to do next. Use them for three things:

- **Triage failures.** When an agent session produces a broken PR or stalls, the transcript shows the exact step where it went wrong — misinterpreted instruction, flaky test, or missing dependency.
- **Spot-check agent sessions.** Schedule periodic transcript reviews for repos that hold secrets, infrastructure-as-code, or CI/CD workflows. Look for patterns: agents modifying files outside their scope, retrying failed commands in loops, or ignoring custom instruction guardrails.
- **Validate new configurations.** After changing custom instructions, `copilot-setup-steps.yml`, or MCP server access, review a few transcripts to confirm agents behave as expected.

Enterprise administrators can review sessions from the last 28 days in **AI controls → Agent sessions**. Each repository also has an **Agents** tab where maintainers can watch past and current sessions in progress. See [Monitoring agentic activity](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/monitor-agentic-activity).

{{< callout type="info" >}}
Session transcripts are available only through the GitHub UI — they cannot be streamed to a SIEM or retrieved via API.
{{< /callout >}}

Agent-generated code, custom instructions, and MCP configurations should be reviewed at PR time with the same rigor as human-authored code. The person who triggered the agent is the first-line reviewer and co-author; the PR approver shares responsibility for the merged result. If recurring quality issues surface during reviews, refine your custom instructions.

### 5. Manage agent-related costs

Copilot agents consume both [GitHub Actions minutes and premium requests](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-copilot/about-billing-for-github-copilot#allowance-usage-for-copilot-coding-agent). Standard runners consume your monthly Actions allowance at no additional cost; larger runners incur a per-minute charge. Agent sessions can run for up to 59 minutes. Without spending limits, agent-driven spending can accumulate quickly and be difficult to attribute to specific cost owners.

**What makes agent cost governance different:**

- **Actions minutes add up.** Each agent session consumes GitHub Actions minutes for the duration of the agent's work. Monitor Actions usage to ensure agent workloads do not impact your CI/CD capacity.
- **Model selection amplifies cost.** Different models have different [request multipliers](https://docs.github.com/en/copilot/concepts/billing/copilot-requests). Factor model choice into your cost governance.

For detailed operational procedures — budget configuration workflows, license tier upgrades, cost center allocation, KPI benchmarks, and troubleshooting — see [Managing GitHub Copilot Premium Request Units (PRUs)]({{< relref "copilot-policies-best-practices/copilot_pru_enterprise_admin_playbook.md" >}}).

{{< callout type="info" >}}
Cost governance is part of AI governance. Predictable costs keep adoption sustainable. Revisit budgets quarterly as you scale usage or adopt new features.
{{< /callout >}}

## Additional solution details and trade-offs to consider

### Enterprise-controlled vs. organization-delegated policies

| Factor | Enterprise-controlled | Organization-delegated |
|--------|-----------------------|------------------------|
| Consistency | Uniform across all orgs | May diverge between teams |
| Flexibility | Lower — orgs cannot expand beyond baseline | Higher — orgs self-serve |
| Admin overhead | Central team manages all policy | Distributed across org owners |

**Trade-off:** Enterprise control reduces flexibility for individual business units. In practice, many enterprises use a hybrid: enforce non-negotiable security policies at the enterprise level (audit logging, rulesets) while letting organizations opt in to models, agents, and features within those boundaries. This ensures no org can use an unapproved model or disable audit logging, but teams have autonomy on timing and usage.

If you operate multiple independently governed business units (e.g., subsidiaries, acquired companies, or independent product lines), this hybrid approach is typically the right starting point.

### Automatic vs. on-demand code review

Review quality depends heavily on custom instructions. Without instructions, reviews may be generic or noisy. Invest in curating review criteria (see section [code review agent](#code-review-agent)) before scaling automatic reviews broadly.

| Approach | Pros | Cons |
|----------|------|------|
| **Automatic on high-risk repos, on-demand elsewhere** | Consistent coverage where it matters most; lower noise on low-risk repos | Requires repo classification (e.g., custom properties) and maintenance |
| **Automatic on all PRs** | Uniform coverage; no repos slip through | Can produce generic comments at scale if instructions are not present |
| **On-demand only** | Developers invoke when valuable; saves cost on non-value-adding reviews | Relies on developers remembering to request reviews; high-risk changes may go unreviewed |

## Seeking further assistance

{{% seeking-further-assistance-details %}}

## Related links

{{% related-links-github-docs %}}

### Related articles in this framework

- [GitHub Enterprise Policies & Best Practices]({{< relref "governance-policies-best-practices" >}}) — general platform security hardening checklist (rulesets, CODEOWNERS, commit signing, audit log streaming)
- [Rulesets Best Practices]({{< relref "rulesets-best-practices.md" >}}) — guidance on push vs. branch rulesets, file-path scoping, and CODEOWNERS integration
- [Application Security Checklist]({{< relref "/library/application-security/checklist" >}}) — foundational code security practices (CI checks, pull review, secret scanning) that agent governance builds on
- [Managing GitHub Copilot Premium Request Units (PRUs)]({{< relref "copilot-policies-best-practices/copilot_pru_enterprise_admin_playbook.md" >}}) — budget configuration, license tier management, KPI benchmarks, and cost optimization procedures

### External resources

- [Managing enterprise Copilot policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies) — model access enforcement and capability toggles
- [Establish AI managers](https://docs.github.com/en/copilot/tutorials/roll-out-at-scale/establish-ai-managers) — delegating day-to-day agent management with custom roles
- [Adding repository custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) — `.github/copilot-instructions.md` and path-specific instruction files
- [Adding organization custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-organization-instructions) — baseline prompts for all users in an organization
- [Support for different types of custom instructions](https://docs.github.com/en/copilot/reference/custom-instructions-support) — which agent-specific instruction are supported in which environments
- [Managing Copilot coding agent for your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/manage-copilot-coding-agent) — enable or disable the cloud agent and configure third-party agent defaults
- [Preparing custom agents for your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents) — setting up `.github-private` and rolling out enterprise custom agents
- [github/awesome-copilot](https://github.com/github/awesome-copilot) — curated collection of custom instructions, agents, and Copilot configuration examples
- [About MCP and Copilot](https://docs.github.com/en/copilot/concepts/context/mcp) — conceptual overview of Model Context Protocol integration in GitHub Copilot
- [Configure an MCP registry](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-registry) — curating a discoverable set of pre-approved MCP servers
- [Configure MCP server access](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-server-access) — allowlist policies for MCP server usage
- [Model Context Protocol specification](https://modelcontextprotocol.io/) — protocol documentation for understanding MCP capabilities and security considerations
- [GitHub MCP Server Policies and Governance](https://github.com/github/github-mcp-server/blob/main/docs/policies-and-governance.md) — control mechanisms for the GitHub MCP server in third-party host applications
- [About Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent) — capabilities, built-in security protections, and operational model of the cloud agent
- [Copilot code review agent](https://docs.github.com/en/copilot/concepts/agents/code-review) — automatic and on-demand code review powered by Copilot
- [Customizing the cloud agent environment](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment) — configuring `copilot-setup-steps.yml` to standardize agent runtime environments
- [About hooks](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-hooks) — injecting shell commands at key points during agent execution
- [Customizing the agent firewall](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-firewall) — managing the agent network allowlist at org and repo level
- [Configuring agent settings](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/configuring-agent-settings) — enabling code scanning, secret scanning, and dependency checks on agent changes
- [Monitoring agentic activity](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/monitor-agentic-activity) — enterprise session monitoring UI for real-time agent oversight
- [Agentic audit log events](https://docs.github.com/en/copilot/reference/agentic-audit-log-events) — reference for agent-specific audit log fields used for SIEM correlation and anomaly detection
- [Streaming the audit log for your enterprise](https://docs.github.com/en/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise) — configuring audit log streaming to external SIEM platforms
- [Managing your GitHub Copilot usage and spending](https://docs.github.com/en/billing/using-the-new-billing-platform/managing-billing-for-your-products/managing-your-github-copilot-usage-and-spending) — budget configuration, spending limits, and alerting thresholds in the billing platform
