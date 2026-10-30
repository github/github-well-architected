---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT

draft: false # Set to false when ready to publish

title: 'Governing agents in GitHub Enterprise'
weight: 4
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

Agents — [Copilot cloud agent](https://docs.github.com/copilot/concepts/agents/cloud-agent/about-cloud-agent), [Copilot code review agent](https://docs.github.com/copilot/concepts/agents/code-review), and third-party agents like [Anthropic Claude](https://docs.github.com/copilot/concepts/agents/anthropic-claude) and [OpenAI Codex](https://docs.github.com/copilot/concepts/agents/openai-codex) — are becoming significant contributors to enterprise codebases. GitHub lets teams assign tasks to agents from issues, PRs, and Visual Studio Code in a single workflow. In many organizations, agents already rank among the top contributors by pull request volume.

This introduces new governance challenges. Agents act faster and at broader scale than any individual. They interact with external services through MCP, use skills to extend their capabilities, and execute code in environments that may hold secrets and infrastructure triggers. A single misconfigured enterprise policy or shared agent definition can affect multiple repositories quickly.

For enterprises managing multiple business units, the question is not _whether_ to adopt agents, but _how to govern them_ without creating bottlenecks. This recommendation covers levers for controlling agent behavior, managing costs, enforcing security boundaries, and maintaining audit visibility — while keeping teams productive. Used well, these controls are what let teams adopt new models, agents, and AI features quickly and safely: a clear baseline turns each new capability into a configuration decision rather than a new risk review.

**What "good" looks like:** agents operate within clearly defined trust boundaries, every action is auditable and traceable, model and tool access is centrally managed, new capabilities reach teams quickly through a predictable review path, and cost exposure is predictable and attributable.

## Key design strategies and checklist

1. **Minimize enterprise-level baseline, empower organizations to adapt**

   Set non-negotiable controls at the enterprise level — audit log streaming and model restrictions for compliance — so every organization inherits a governance floor it can build on. Let organizations decide when and how to enable agents, configure MCP, and create their own custom agents within those boundaries. Review the model allowlist regularly — disable outdated models and enable newer ones after any legal review — so teams benefit from model improvements. Pilot new models and settings with a single enterprise team first, then expand.

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

   Agents act autonomously and at scale, so agent observability requires two complementary activities: stream audit events to your SIEM for anomaly detection and long-term retention, and periodically spot-check session transcripts in the GitHub UI for high-risk repositories. Enterprises with Enterprise Managed Users can also stream agent session data — prompts, responses, and tool calls — to a SIEM (public preview). Anti-pattern: relying solely on the GitHub UI for audit review without streaming to an external system for retention and correlation.

   See section [Build agent observability and audit pipeline](#4-build-agent-observability-and-audit-pipeline) for implementation details.

5. **Make cost exposure predictable and attributable**

   Configure spending limits and alerting thresholds for the cost units that agents consume before scaling adoption. Without these guardrails, agent-driven spending can spike unpredictably and be difficult to attribute to specific cost owners.

   Track consumption alongside adoption metrics so cost governance decisions are data-driven. Anti-pattern: enabling agents enterprise-wide without spending limits and discovering overages after the fact.

   See section [Manage agent-related costs](#5-manage-agent-related-costs) for implementation details.

### Quick checklist

#### 1. Policy & governance

- [ ] Copilot, Agent, and MCP policies are configured at the enterprise level in AI controls; see [configure enterprise-level policies](#1-configure-enterprise-level-copilot-agent-and-mcp-policies)
- [ ] An approved model list is configured and updated as new models ship; new models and settings are piloted with an enterprise team first
- [ ] Third-party agents are disabled by default; enabled after a documented review
- [ ] Managed permissions block or require approval for sensitive agent shell commands, file edits, and network domains; see [enterprise managed settings](#enterprise-managed-settings)
- [ ] Sensitive content is protected by controls beyond content exclusion, which doesn't cover every surface
- [ ] AI manager custom role is assigned to delegates; enterprise ownership is not over-granted
- [ ] Enterprise AI governance policies are communicated to org owners and developers

#### 2. Agent setup & standardization

- [ ] Custom instruction libraries with company-specific criteria are published in a shared repository; see [repository custom instructions](#repository-custom-instructions)
- [ ] Organization custom instructions are configured as a baseline for each org; see [organization custom instructions](#organization-custom-instructions)
- [ ] Enterprise custom agents exist in `.github-private` and are configured for enterprise-wide availability; org-scoped agents remain in the org's `.github-private` for narrower distribution; see [enterprise custom agents](#enterprise-custom-agents)
- [ ] Rulesets and CODEOWNERS restrict changes to agentic primitive files; see [protect agentic primitive files](#protect-agentic-primitive-files-with-rulesets)
- [ ] An enterprise MCP allowlist in managed settings matches approved server URLs or commands; MCP definitions in custom agents are reviewed; see [MCP server governance](#mcp-server-governance)
- [ ] Each repository has a `copilot-setup-steps.yml` that pins dependencies for its application type; use rulesets to restrict changes; see [agent environment standardization](#agent-environment-standardization)
- [ ] Agent workloads run on ephemeral runners (GitHub-hosted or ephemeral self-hosted); see [use ephemeral runners](#use-ephemeral-runners-for-agent-execution)
- [ ] Agent activity is sandboxed when agents run locally or in the cloud; see [sandbox agent activity](#sandbox-agent-activity)

#### 3. Security controls & review gates

- [ ] The `GITHUB_TOKEN` in `copilot-setup-steps.yml` is scoped to least privilege; note that this only applies to the setup workflow, not the agent's own operations
- [ ] The cloud agent firewall is enforced organization-wide, repository custom rules are disabled, and the allowlist permits only required external domains; see [cloud agent](#cloud-agent)
- [ ] A code review agent strategy is chosen; see [automatic vs. on-demand code review](#automatic-vs-on-demand-code-review) for trade-offs
- [ ] CI checks, security scans, and code review gates apply equally to agent-authored and human-authored code; see [apply the same gates to agent pull requests](#apply-the-same-gates-to-agent-pull-requests)
- [ ] Agent-generated code is always reviewed at PR time for quality, accuracy, and guideline adherence
- [ ] Developers can use the security extension for the GitHub Copilot app and `/security-review` (both public preview) to catch issues before opening a PR; see [bring security review into agent workflows](#bring-security-review-into-agent-workflows)
- [ ] Custom instructions, agents, skills, and MCP server configurations are refined when recurring issues are found

#### 4. Observability & audit

- [ ] Audit log streaming is enabled and agent events appear in your SIEM; see [audit log streaming](#audit-log-streaming-for-retention-correlation-and-anomaly-detection)
- [ ] Agent sessions are periodically spot-checked via the Agents tab; see [session monitoring](#session-monitoring-for-debugging-and-oversight)
- [ ] `agent_session_id` is correlated across events in your SIEM for end-to-end traceability
- [ ] Agent session streaming (public preview, Enterprise Managed Users) is evaluated for SIEM ingestion; see [audit log streaming](#audit-log-streaming-for-retention-correlation-and-anomaly-detection)
- [ ] SIEM alerts are active for high-risk signals (workflow file changes, ruleset bypass attempts, usage anomalies)

#### 5. Cost management

- [ ] Spending limits are configured per organization or cost center; "stop usage at limit" is enabled for hard caps; see [manage agent-related costs](#5-manage-agent-related-costs)
- [ ] Set spend alerting to responsible teams
- [ ] Model selection education and governance aligns with cost awareness
- [ ] Usage consumption of Copilot is tracked

## Assumptions and preconditions

- Your enterprise uses a **GitHub Enterprise Cloud** environment.
- You have **enterprise owner** access to configure policies that cascade to organizations.
- **GitHub Copilot Business or Enterprise** licenses are assigned. See [Copilot plans overview](https://docs.github.com/copilot/get-started/plans#copilot-plans-overview) for current feature availability by plan.
- **GitHub Actions** is enabled for your enterprise and organizations. The cloud agent runs on Actions runners and consumes Actions minutes.
- You have a **SIEM platform** (e.g., Splunk, Microsoft Sentinel, Datadog) capable of ingesting GitHub audit log streams.
- Your enterprise already has [foundational code security practices](../../application-security/checklist) in place (CI checks, pull review, secret scanning). Agent governance is an additive layer, not a replacement.
- This recommendation does **not** cover GitHub Enterprise Server (GHES) deployments — agent capabilities are cloud-only at this time.
- The term **custom instructions** as used throughout this article broadly encompasses the full agentic configuration layer — including agent definitions (custom agents) and skill definitions (`SKILL.md`) — unless otherwise specified.

## Recommended implementation

### 1. Configure enterprise-level Copilot, agent, and MCP policies

Navigate to your enterprise settings and click **AI controls**. [Enterprise AI Controls and the agent control plane](https://github.blog/changelog/2026-02-26-enterprise-ai-controls-agent-control-plane-now-generally-available/) (generally available) are the single place to govern AI across your enterprise. Before you configure policies, set up how the control plane is run:

- **Delegate administration.** Give your AI administration team a custom enterprise role with the AI controls, audit log, and agent session permissions they need, instead of granting enterprise ownership. See [Establish AI managers](https://docs.github.com/copilot/tutorials/roll-out-at-scale/govern-at-scale/establish-ai-managers).
- **Audit agent activity.** Audit log entries for agent actions on the GitHub platform include `actor_is_agent` and the `user` the agent acted on behalf of, and `agent_session.task` events record when sessions start, finish, or fail. See [Build agent observability and audit pipeline](#4-build-agent-observability-and-audit-pipeline).
- **Protect custom agent files.** Use the built-in push rule to protect custom agent profiles. See [enterprise custom agents](#enterprise-custom-agents).

This centralized pane has three policy surfaces in the sidebar: **Agents**, **Copilot**, and **MCP**. Configure each:

#### Agents → [Copilot cloud agent](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-cloud-agent)

- In most enterprises, start with "Let organizations decide" and enable for a pilot group first.
- Keep third-party agents off until they are reviewed, and publish a documented review path with a clear owner so teams can adopt new agents quickly once they meet your baseline.
- Configure an organization for enterprise custom agents. See section [enterprise custom agents](#enterprise-custom-agents).

{{< callout type="info" >}}
Third-party agents have access to the same repositories where the Copilot agent is enabled. See [Enabling or disabling third-party cloud agents](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies#enabling-or-disabling-third-party-coding-agents-in-your-repositories).
{{< /callout >}}

#### Copilot → [Policies](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies)

- Set model access enforcement. Explicitly select which models are allowed. Update this approved list as new models ship — enable newly GA models after any required review, and evaluate models' behaviors and use cases to ensure they meet your organization's needs. Deprecated models may be removed; ensure newer or alternative models are enabled before retirement dates.
- Pilot new models with a subset of users. With [enterprise teams model policy targeting](https://github.blog/changelog/2026-07-31-enterprise-teams-model-policy-targeting-in-public-preview/) (public preview), set a model to **Optional** and grant it to an early-adopter enterprise team before enabling it for everyone. When you turn on enterprise teams mode, organization-level model settings no longer apply.
- Configure spending limits before scaling adoption. See [manage agent-related costs](#5-manage-agent-related-costs).
- Enable all Copilot capabilities. Toggle off only if you have a specific requirement to restrict a capability.

{{< callout type="warning" >}}
[Content exclusion](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/security-governance-and-network-settings/content-exclusion) doesn't cover every surface. For example, it isn't supported in Edit and Agent modes of Copilot Chat in IDEs, and third-party MCP servers aren't guaranteed to respect it. Don't rely on it alone to keep sensitive content away from agents; combine it with repository access controls and secret management.
{{< /callout >}}

#### MCP

- The right MCP selections (e.g., GitHub MCP Server) in combination with skills, improve user and agent effectiveness and reduce token consumption. Restrict which servers can run with an enterprise allowlist in managed settings. See [MCP server governance](#mcp-server-governance).

#### Enterprise managed settings

[Enterprise managed settings](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started) centrally control Copilot client behavior from a `copilot/managed-settings.json` file in your `.github-private` repository. Users can't weaken these settings locally. Use them to:

- **Set managed permissions.** [Enterprise managed permissions](https://github.blog/changelog/2026-09-09-enterprise-managed-permissions-for-github-copilot-agent-operations/) block, require approval for, or allow agent shell commands, file reads and edits, and network domains. They are generally available in the GitHub Copilot app, Copilot CLI, and Visual Studio Code sessions that use Agent Host. Require approval rather than block where teams need flexibility, so agent workflows keep running with a human in the loop.
- **Enforce an MCP allowlist and sandboxing.** See [MCP server governance](#mcp-server-governance) and [sandbox agent activity](#sandbox-agent-activity).
- **Pilot changes with a team.** Mark a key as overridable and [override it for an enterprise team](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/override-settings-for-teams) to test new models, permissions, or MCP servers before a broad rollout.

Not every key applies to every client — for example, managed permissions don't apply to Copilot cloud agent running on GitHub Actions. Check [client support by key](https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/enterprise-administrators/enterprise-managed-settings#client-support-by-key) before you rely on a setting.

After configuring enterprise policies, communicate clearly to administrators and users. Policies only work if everyone understands them. If you choose "Let orgs decide" for agents, send guidance to org owners on how to enable agents within your enterprise's boundaries.

### 2. Layer agentic configurations

Consistent agent behavior requires layered configuration, and over-centralizing instructions and agents at the enterprise level hurts usability and increases cost. Prompts and custom instructions are most effective when tailored to the repository's language, framework, and domain. Enterprise-level controls should set security and compliance baselines; repository-level configuration is where teams optimize agent effectiveness for their specific codebase. In large enterprises with independent business units, pushing too much governance to the enterprise level leads to generic instructions, wasted tokens, and friction that slows adoption.

#### Repository custom instructions

Create a library of shared [custom instructions](https://docs.github.com/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) starters. Publish these in a shared repository for teams to reference and consume for their own repository. The following types are supported:

| Type | File | Scope |
|------|------|-------|
| Repository-wide | `.github/copilot-instructions.md` | All requests in the repository |
| Path-specific | `.github/instructions/NAME.instructions.md` | Files matching the `applyTo` glob pattern |
| Agent-specific | `AGENTS.md` (or `CLAUDE.md`, `GEMINI.md`) | See [supported agent-specific file locations](https://docs.github.com/copilot/reference/custom-instructions-support) |
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

Use [organization custom instructions](https://docs.github.com/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-organization-instructions) to define a baseline prompt for all users in an organization. Organization owners can configure this in **Organization settings → Copilot → Custom instructions**. Note that organization instructions currently apply to Copilot cloud agent and code review agent on GitHub.com.

Treat these instructions as an organizational baseline — keep them narrow and focused on specific, non-negotiable standards (e.g., security, compliance). Broad or generic org-level instructions add context to every request, consuming tokens without improving results. Layer repository and path-specific instructions for team-level controls where the real effectiveness gains happen.

#### Enterprise custom agents

Define enterprise-level agents to deliver consistent and repeatable expertise, behavior, and tool access across all organizations. [Setup enterprise custom agents](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents) by creating a `.github-private` repository in a designated organization. Then:

1. Navigate to enterprise → **AI controls** → **Agents** tab.
2. Select the source organization containing your `.github-private` repository.
3. Click **Create ruleset** in the "Protect agent files using rulesets" section.

This built-in push rule [allows only enterprise owners to edit agent profiles](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents#protecting-your-agent-files-using-rulesets); other members can still propose changes through pull requests. It also blocks organization owners from creating or editing organization-level custom agents unless you edit the ruleset to target only the source organization.

Consider delegating day-to-day agent management to a team of AI managers while maintaining enterprise-owner control over security-sensitive configurations. See [Establish AI managers](https://docs.github.com/copilot/tutorials/roll-out-at-scale/govern-at-scale/establish-ai-managers).

Note that agents defined in `.github-private` are org-scoped by default. To make them available enterprise-wide, configure the source organization in enterprise AI controls. Some organizations may intentionally keep certain agents org-scoped rather than promoting them enterprise-wide.

{{< callout type="info" >}}
Before deploying a custom agent enterprise-wide, test it in a sandbox repository or with a limited user group. Validate its behavior, then expand. See [Preparing custom agents](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents) for rollout guidance.
{{< /callout >}}

#### MCP server governance

The [GitHub MCP Registry](https://github.com/mcp) provides a curated list of community MCP servers. For enterprise use, you can layer your own governance:

1. Maintain an internal list of reviewed and approved MCP servers with their endpoints, allowed scopes, and review status.
2. Enforce an [enterprise MCP allowlist in managed settings](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-enterprise-allowlist) (generally available) with `allowedMcpServers` and `deniedMcpServers`. Match approved servers by `serverUrl` or `serverCommand` rather than `serverName` — users can rename servers, so name matching is a convenience, not a security control. Deny rules always win, and malformed settings fail closed. Built-in default servers, such as the GitHub MCP server, are always allowed, so control their tool access separately. For teams that need to experiment, [override the allowlist for that enterprise team](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/override-settings-for-teams) instead of loosening it for everyone.
3. Use [rulesets](./managing-repositories-at-scale/rulesets-best-practices) and CODEOWNERS to protect MCP configuration files (`.github/copilot/mcp.json` or `.mcp.json`) in repositories.
4. Review MCP server definitions in custom agent profiles before you publish the agents. The managed-settings allowlist doesn't apply to MCP servers defined in repository custom agent profiles.
5. Optionally, [configure an MCP registry](https://docs.github.com/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-registry) so developers can discover pre-approved servers.

Registry-based restriction ("Registry only") is in public preview and is [not the recommended method](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/enterprise/mcp-management): it matches on server name or ID only, can be bypassed by editing configuration files, and [does not apply to the cloud agent](https://docs.github.com/copilot/reference/supported-surfaces-for-policies). If you use it today, set it to "Allow all" when you move to a managed-settings allowlist to avoid conflicting policies.

{{< callout type="warning" >}}
The managed-settings MCP allowlist is enforced in [Copilot CLI, VS Code, the GitHub Copilot app, JetBrains IDEs, and Copilot in the cloud running in a cloud sandbox](https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/enterprise-administrators/enterprise-managed-settings#client-support-by-key). It is **not** enforced for Copilot cloud agent running on GitHub Actions or for MCP servers defined in custom agent profiles — rely on rulesets, CODEOWNERS, and agent review there. The cloud agent firewall also [does not apply to MCP servers](#cloud-agent).
{{< /callout >}}

#### Agent environment standardization

[Configure the development environment](https://docs.github.com/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment) by creating a `.github/workflows/copilot-setup-steps.yml` in each repository. This workflow runs before the agent starts work, giving you deterministic control over the agent's environment. For runner selection, organization admins can set defaults centrally rather than configuring per-repository.

For additional runtime customization, [hooks](https://docs.github.com/copilot/concepts/agents/hooks) let you inject shell commands at key points during agent execution (e.g., formatting, linting, or logging).

For consistency across similar repositories, share `copilot-setup-steps.yml` examples with company-specific tooling by application type that teams can adapt. Note that reusable workflows are not supported for this file, and composite actions may help share common setup steps. Each repository maintains its own copy. Protect this file with rulesets so changes require review. Organization admins can also [set a default runner and optionally lock it](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-organization/configure-runner-for-coding-agent) so the agent runs on a consistent runner across all repositories.

#### Use ephemeral runners for agent execution

Use [GitHub-hosted runners](https://docs.github.com/actions/concepts/runners/github-hosted-runners) for agent execution. Each job gets a fresh VM that is destroyed after the run, eliminating persistent state and credential leakage between sessions. If you require self-hosted runners, make sure they are ephemeral.

#### Sandbox agent activity

[Sandbox agent activity](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/cloud-and-local-sandboxes) wherever agents run. Local sandboxing in the GitHub Copilot app and Copilot CLI restricts filesystem access, network connectivity, and credential use on the developer's machine; use the `sandbox` key in [enterprise managed settings](#enterprise-managed-settings) to enforce minimum restrictions. For cloud sandboxes, decide which members can use them and keep spending under control. Isolation limits the impact of a misbehaving tool call or prompt injection, so teams can try new agents with less risk.

### 3. Enforce security controls and human review gates

#### Cloud agent

Copilot cloud agent has [built-in security protections](https://docs.github.com/copilot/concepts/agents/cloud-agent/risks-and-mitigations). In the repository's settings, configure additional controls:

- **Firewall.** The agent firewall is enabled by default, restricting the agent's internet access to an allowlist. Organization admins can [manage firewall settings across all repositories](https://docs.github.com/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall) under **Settings → Copilot → Internet access**: set **Enable firewall** to **Enabled** so individual repositories cannot disable it, set **Allow repository custom rules** to **Disabled** so allowlist changes stay centrally reviewed, control the recommended allowlist, and add org-wide custom allowlist entries.
- **Recommended allowlist.** Enabled by default, this permits access to OS package repositories, container registries, language package registries, certificate authorities, and other common development dependencies — not only GitHub services. Review the [full list](https://docs.github.com/copilot/reference/copilot-allowlist-reference#copilot-in-the-cloud-recommended-allowlist) and your custom entries regularly. Customize the allowlist to include any internal registries or services your agents need.

{{< callout type="warning" >}}
The cloud agent firewall is limited to [processes started by the agent via its Bash tool](https://docs.github.com/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall#limitations). It does not apply to MCP servers or processes started in agent environment setup. Treat it as one layer of defense, not a comprehensive network boundary.
{{< /callout >}}

- **Validation tools.** Configure cloud agent to automatically run [built-in code quality and security validation tools](https://docs.github.com/copilot/how-tos/use-copilot-agents/cloud-agent/configuring-agent-settings) on its changes.

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

See [Use custom instructions for Copilot code review](https://docs.github.com/copilot/tutorials/customize-code-review) and [github/awesome-copilot](https://github.com/github/awesome-copilot/tree/main/instructions) examples.

#### Apply the same gates to agent pull requests

Agent pull requests should pass the same gates as any other contribution:

- Apply the same [rulesets](./managing-repositories-at-scale/rulesets-best-practices), required reviews, and security scans to agent-authored pull requests. Don't add agents to bypass lists.
- Scope agent tokens to least privilege. For example, set `GITHUB_TOKEN` permissions in `copilot-setup-steps.yml` explicitly to what setup requires rather than relying on defaults.
- Run agents on [ephemeral runners](#use-ephemeral-runners-for-agent-execution).

#### Bring security review into agent workflows

Give developers security feedback before code reaches a pull request:

- The [security extension for the GitHub Copilot app](https://github.blog/changelog/2026-10-28-security-extension-for-the-github-copilot-app/) (public preview) lists code scanning alerts and asks Copilot to explain or fix them in the local working copy.
- The `/security-review` command (public preview) in [Copilot CLI](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/) and the [GitHub Copilot app](https://github.blog/changelog/2026-07-14-security-reviews-now-available-in-the-github-copilot-app/) scans in-flight changes for high-confidence vulnerabilities.

These tools complement code scanning, secret scanning, and required reviews — they don't replace them.

#### Protect agentic primitive files with rulesets

Agent configuration files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.github/instructions/**/*.instructions.md`), skill configuration files (`SKILL.md`), MCP configuration files (`mcp.json`), and the `.github-private` repository for enterprise custom agents define what agents can do and which tools they can access. Unauthorized modifications can change agent behaviors.

Apply [rulesets](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) to these files so changes require human review before taking effect, and add CODEOWNERS entries so your AI administration or security team approves changes to `mcp.json`, `AGENTS.md`, and `copilot-instructions.md` (see [rulesets best practices](./managing-repositories-at-scale/rulesets-best-practices) for CODEOWNERS integration). For enterprise custom agent profiles, use the built-in push rule; see [enterprise custom agents](#enterprise-custom-agents).

### 4. Build agent observability and audit pipeline

Enterprise owners have two complementary surfaces for monitoring agent activity: audit log streaming for retention and anomaly detection, and session monitoring in the UI for debugging and oversight.

#### Audit log streaming: for retention, correlation, and anomaly detection

[Stream audit logs](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise) to your SIEM platform for long-term retention and correlation. Audit logs capture specific agent and management activities — session creation, commits, PR activity, and policy changes — not the step-by-step session transcript. [Audit log events for agents](https://docs.github.com/copilot/reference/enterprise-administrators/agentic-audit-log-events) such as `action`, `actor_is_agent`, `agent_session_id`, and `user` are the key fields for correlations and anomaly detection.

[Copilot agent session streaming](https://github.blog/changelog/2026-07-02-copilot-agent-session-streaming-is-now-in-public-preview/) (public preview, enterprises with Enterprise Managed Users) adds session data — prompts, responses, and tool calls — from cloud agents, Copilot CLI, and IDEs. Stream it through your audit log streaming endpoint or pull the last 48 hours through the REST API. Enable it under **AI controls → Copilot**, and validate its coverage before you rely on it for detection.

**What to monitor in your SIEM:**

| Signal | Example event / field | Why it matters |
|--------|-----------------------|----------------|
| Agent sessions per user per day | `agent_session_id`, `user` | Detect anomalous usage or compromised accounts |
| MCP policy changes | `copilot.mcp_*` actions | Identify unauthorized changes to approved tool integrations |
| Agent changes to high-risk files (workflows, MCP config, agent instructions) | `git.push`, `pull_request.*` with `actor_is_agent` | High-risk modifications that could affect CI/CD pipelines or agent behavior. Correlate audit events with [webhook payloads](https://docs.github.com/webhooks/webhook-events-and-payloads#push) for file-level detail |
| Changes to environment secrets used by agents | `environment.*` actions | Could alter what agents can access or authenticate to |
| Bypass events on rulesets | `repository_ruleset.*` with `actor_is_agent` | Detect attempts to circumvent governance controls |

#### Session monitoring: for debugging and oversight

Session transcripts give you what audit logs cannot: the agent's reasoning, the commands it ran, and the test output it saw before deciding what to do next. Use them for three things:

- **Triage failures.** When an agent session produces a broken PR or stalls, the transcript shows the exact step where it went wrong — misinterpreted instruction, flaky test, or missing dependency.
- **Spot-check agent sessions.** Schedule periodic transcript reviews for repos that hold secrets, infrastructure-as-code, or CI/CD workflows. Look for patterns: agents modifying files outside their scope, retrying failed commands in loops, or ignoring custom instruction guardrails.
- **Validate new configurations.** After changing custom instructions, `copilot-setup-steps.yml`, or MCP server access, review a few transcripts to confirm agents behave as expected.

Enterprise administrators can review agent sessions from the last 24 hours in **AI controls → Agent sessions**. Each repository also has an **Agents** tab where maintainers can watch past and current sessions in progress. See [Monitoring agentic activity](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/monitor-agentic-activity).

{{< callout type="info" >}}
The GitHub UI is the place to read full session transcripts. To retain session data outside GitHub, evaluate [agent session streaming](https://github.blog/changelog/2026-07-02-copilot-agent-session-streaming-is-now-in-public-preview/) (public preview, Enterprise Managed Users).
{{< /callout >}}

Agent-generated code, custom instructions, and MCP configurations should be reviewed at PR time with the same rigor as human-authored code. The person who triggered the agent is the first-line reviewer and co-author; the PR approver shares responsibility for the merged result. If recurring quality issues surface during reviews, refine your custom instructions.

### 5. Manage agent-related costs

Copilot agents consume both [GitHub Actions minutes and AI credits](https://docs.github.com/copilot/concepts/agents/cloud-agent/about-cloud-agent#copilot-cloud-agent-usage-costs). Standard runners consume your monthly Actions allowance at no additional cost; larger runners incur a per-minute charge. Agent sessions can run for up to 59 minutes. Without spending limits, agent-driven spending can accumulate quickly and be difficult to attribute to specific cost owners.

**What makes agent cost governance different:**

- **Actions minutes add up.** Each agent session consumes GitHub Actions minutes for the duration of the agent's work. Monitor Actions usage to ensure agent workloads do not impact your CI/CD capacity.
- **Model selection amplifies cost.** Different models have different [pricing](https://docs.github.com/copilot/reference/copilot-billing/models-and-pricing). Factor model choice into your cost governance.

For detailed guidance on budget configuration, cost center allocation, user-level budgets, and cost attribution — see [Managing AI credits with FinOps principles](./managing-ai-credits).

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

- [GitHub Enterprise Policies & Best Practices](./governance-policies-best-practices) — general platform security hardening checklist (rulesets, CODEOWNERS, commit signing, audit log streaming)
- [Rulesets Best Practices](./managing-repositories-at-scale/rulesets-best-practices) — guidance on push vs. branch rulesets, file-path scoping, and CODEOWNERS integration
- [Application Security Checklist](../../application-security/checklist) — foundational code security practices (CI checks, pull review, secret scanning) that agent governance builds on
- [Managing AI credits with FinOps principles](./managing-ai-credits) — layered budget configuration, user-level budgets, cost attribution, and usage governance

### External resources

- [Managing enterprise Copilot policies](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies) — model access enforcement and capability toggles
- [Establish AI managers](https://docs.github.com/copilot/tutorials/roll-out-at-scale/govern-at-scale/establish-ai-managers) — delegating day-to-day agent management with custom roles
- [Adding repository custom instructions](https://docs.github.com/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) — `.github/copilot-instructions.md` and path-specific instruction files
- [Adding organization custom instructions](https://docs.github.com/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-organization-instructions) — baseline prompts for all users in an organization
- [Support for different types of custom instructions](https://docs.github.com/copilot/reference/custom-instructions-support) — which agent-specific instruction are supported in which environments
- [Enabling Copilot cloud agent in your enterprise](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-cloud-agent) — enable or disable the cloud agent and configure third-party agent defaults
- [Preparing custom agents for your enterprise](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents) — setting up `.github-private` and rolling out enterprise custom agents
- [github/awesome-copilot](https://github.com/github/awesome-copilot) — curated collection of custom instructions, agents, and Copilot configuration examples
- [About MCP and Copilot](https://docs.github.com/copilot/concepts/context/mcp) — conceptual overview of Model Context Protocol integration in GitHub Copilot
- [Configure an MCP registry](https://docs.github.com/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-registry) — curating a discoverable set of pre-approved MCP servers
- [Restrict MCP server access to a custom registry](https://docs.github.com/copilot/how-tos/administer-copilot/manage-mcp-usage/restrict-based-on-registry) — registry-based restriction (public preview; managed settings is the recommended method)
- [MCP server usage in your company](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/enterprise/mcp-management) — comparison of managed-settings allowlists and registry-based restriction
- [Configuring an MCP server allowlist for your enterprise](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-enterprise-allowlist) — matching approved MCP server URLs or commands in managed settings
- [Getting started with enterprise-managed settings](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started) — centrally controlling Copilot client behavior, including managed permissions
- [Cloud and local sandboxes for GitHub Copilot](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/cloud-and-local-sandboxes) — sandboxing agent activity locally or in the cloud
- [Model Context Protocol specification](https://modelcontextprotocol.io/) — protocol documentation for understanding MCP capabilities and security considerations
- [GitHub MCP Server Policies and Governance](https://github.com/github/github-mcp-server/blob/main/docs/policies-and-governance.md) — control mechanisms for the GitHub MCP server in third-party host applications
- [About Copilot cloud agent](https://docs.github.com/copilot/concepts/agents/cloud-agent/about-cloud-agent) — capabilities, built-in security protections, and operational model of the cloud agent
- [Copilot code review agent](https://docs.github.com/copilot/concepts/agents/code-review) — automatic and on-demand code review powered by Copilot
- [Configure the development environment](https://docs.github.com/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment) — configuring `copilot-setup-steps.yml` to standardize agent runtime environments
- [About hooks](https://docs.github.com/copilot/concepts/agents/hooks) — injecting shell commands at key points during agent execution
- [Customizing the agent firewall](https://docs.github.com/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall) — managing the agent network allowlist at org and repo level
- [Configuring agent settings](https://docs.github.com/copilot/how-tos/use-copilot-agents/cloud-agent/configuring-agent-settings) — enabling built-in code quality and security validation tools on agent changes
- [Monitoring agentic activity](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/monitor-agentic-activity) — enterprise session monitoring UI for real-time agent oversight
- [Audit log events for agents](https://docs.github.com/copilot/reference/enterprise-administrators/agentic-audit-log-events) — reference for agent-specific audit log fields used for SIEM correlation and anomaly detection
- [Streaming the audit log for your enterprise](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise) — configuring audit log streaming to external SIEM platforms
- [Manage and monitor spending for GitHub Copilot](https://docs.github.com/copilot/how-tos/manage-and-track-spending) — tracking Copilot usage, AI credit consumption, and company spending
