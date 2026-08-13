---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false
title: 'Agentic governance taxonomy'
weight: 35
publishDate: 2026-05-20
params:
  authors: [
    {name: "GitHub Well-Architected", handle: "github"},
  ]

pillars:
  - governance
  - application-security
  - architecture
  - productivity

areas:
  - agent-and-extensions
  - enterprise-and-teams
  - security

personas:
  - administrator
  - developer

platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu

features:
  - copilot
---

[Governing agents](/library/governance/recommendations/governing-agents) describes how to configure GitHub's platform capabilities to govern AI agents at enterprise scale: the agent control plane, agent and MCP policies, custom agent lifecycle, audit logging, and orchestration. This guide pairs with that one by providing the inventory framework for what gets configured. Agent governance is the deterministic standards and permissions that shape and constrain what agents are permitted to do; humans participate in the same rule layer as reviewers, approvers, and policy authors. That high-level definition is correct but too coarse to act on. To be actionable at organizational or enterprise scale, governance can be decomposed into five sub-categories that each can be inventoried, configured, and audited independently, and scored against four properties that make each sub-category actionable in a specific scope.

The taxonomy is most useful when read alongside an equivalent assessment of [shared knowledge for agentic engineering](/library/governance/recommendations/agentic-shared-knowledge). Governance is the rule layer; shared knowledge is the information layer. The two together describe whether the conditions under which agents and humans operate are both well-bounded and well-informed.

A note on scope: telemetry, incident records, decisions, runbooks, and customer feedback are context, not governance. A code scanning rule is governance; the alert it produces is an operational signal that becomes context once it is routed and structured. The same separation applies throughout the categories below.

## Governance taxonomy

### Sub-categories of agent governance

**1. Identity and access context.** Who and what is recognized by the system, and at what scope. This is the foundational sub-category: every other control assumes a trustworthy answer to "who is acting." It covers human identity (SAML or OIDC single sign-on, [SCIM provisioning](https://docs.github.com/en/enterprise-cloud@latest/admin/identity-and-access-management), organization and team membership, [repository roles](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization), IP allow lists), machine identity ([GitHub Apps](https://docs.github.com/en/apps) and their installation permissions, [fine-grained personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens), [OIDC trust between GitHub Actions and remote systems](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)), and agent identity (Copilot seat assignment, and the identity an agent acts under when it opens a pull request, runs a workflow, or calls a tool through MCP). It is a prerequisite for every other category and most visible when an agent attempts to act, since identity determines what the action is permitted to be.

**2. Authorization and action boundaries.** What an authenticated identity is permitted to do on protected resources. This is the largest surface and the one most often confused with governance as a whole. It includes [repository rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets) (required pull requests, required reviewers, required status checks, restrictions on force-push and deletion, signed commit requirements, linear history), [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) for review routing, [environment protection rules](https://docs.github.com/en/enterprise-cloud@latest/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments) (required reviewers, wait timers, branch and tag restrictions, deployment branch policies), [GitHub Actions permissions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication) (default `GITHUB_TOKEN` scope, allowed actions list, fork pull request workflow approval, actions policies), and Copilot configuration and policies that govern which models, content, and tools agents may use. The boundary between "agent acts autonomously" and "human approval required" is encoded almost entirely in this sub-category.

**3. Automated assurance controls.** The deterministic checks evaluated against work in flight, configured as required gates rather than advisory output. These controls establish a quality floor for every change and, in aggregate, define the risk envelope the system will tolerate. On the same repository they may be experienced two ways: for well-bounded work the floor plus targeted automation carries most of the load without heavy human attention; for high-stakes work the floor is a prerequisite, not a substitute, for deeper review. Weak floor guardrails let agents (and humans) generate lower-quality work faster; strong ones raise the baseline of everything that ships. They include [code scanning](https://docs.github.com/en/code-security/code-scanning) (CodeQL and third-party tools), [secret scanning with push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning), [Dependabot alerts and security updates](https://docs.github.com/en/code-security/dependabot), the [dependency review action](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review), [artifact attestations and build provenance](https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations-to-establish-provenance-for-builds), required status checks tied to CI suites, and [security configurations](https://docs.github.com/en/code-security/securing-your-organization/meeting-your-specific-security-needs-with-custom-security-configurations/about-custom-security-configurations) that apply enforcement choices consistently across many repositories. The same scanner is governance when it blocks a merge and is detection when its findings are routed for triage; the configuration that makes it blocking belongs here, the finding it produces becomes context.

**4. Audit, provenance, and evidence.** The system's governance memory: the record of who did what, when, under which rule, and with which result. This is what makes governance verifiable rather than aspirational, and it is what auditors, security reviewers, and incident responders rely on. It includes the [enterprise audit log](https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/accessing-the-audit-log-for-your-enterprise) and [audit log streaming](https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise), [signed commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification) and tag signature verification, artifact attestations, deployment history per environment, the [security overview](https://docs.github.com/en/code-security/security-overview/about-security-overview), repository security advisories, and the [agentic audit log fields](#agentic-audit-logs) described below. This category feeds the Define activity in any improvement cycle: when the record reveals a missing rule or a recurring exception, that exception becomes the next rule.

**5. Policy definition and distribution.** The codified rules upstream of enforcement: how policy is expressed, owned, versioned, and propagated to the repositories and environments it applies to. Without this layer, the controls in the other four sub-categories drift per repository and the stack stops being a stack. It includes organization and enterprise policies (base permissions, repository creation, visibility, OAuth app and GitHub App approval, Actions policies and allowlists), [repository rulesets defined at organization or enterprise scope](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/creating-rulesets-for-repositories-in-your-organization), [custom repository properties](https://docs.github.com/en/organizations/managing-organization-settings/managing-custom-properties-for-repositories-in-your-organization) and [organization custom properties](https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-organizations-in-your-enterprise/managing-custom-properties-for-organizations) used as targeting metadata for rulesets and policy (including [Copilot cloud agent enablement](https://github.blog/changelog/2026-04-15-enable-copilot-cloud-agent-via-custom-properties/)), [security configurations](https://docs.github.com/en/code-security/securing-your-organization/meeting-your-specific-security-needs-with-custom-security-configurations/about-custom-security-configurations) as reusable bundles, required workflows, and Copilot Business or Enterprise admin policies (content exclusions, model availability, public code matching). This is the layer that turns governance into a system rather than a set of repository-local choices.

### Agentic audit logs

Traditional audit logs capture what happened and who did it. With agents, you also need to know when an action was performed by an agent versus a human, and on whose behalf the agent was acting. The agent control plane provides dedicated audit log fields for this purpose:

- **`actor`**: identifies the agent that performed the action. AI Controls filters on `actor:Copilot OR actor:Claude OR actor:Codex` to give security teams a scoped view of agent activity.
- **`actor_is_agent`**: identifies when an action was performed by an agent rather than a human.
- **`user` and `user_id`**: show the human the agent is acting on behalf of, maintaining accountability.
- **`agent_session_id`**: the identifier that ties audit events back to a single agent session, so you can reconstruct what the agent did across multiple actions.
- **`agent_session.task` events**: the session lifecycle records (started, finished, failed) that mark the boundaries of each session.

You can navigate to agent-related audit logs directly from the AI Controls tab. This gives security and compliance teams a filtered view to answer questions like "what did agents do in the last 24 hours?" without digging through the full audit log. Together with the other entries in [Audit, provenance, and evidence](#sub-categories-of-agent-governance), these fields are what make agent activity reconstructable after the fact.

## Cross-cutting actionability properties

Decomposing into sub-categories is necessary but not sufficient. Each sub-category becomes actionable only when four properties can be observed and improved against it.

| Property | Question it answers |
|---|---|
| **Coverage** | Does the rule apply everywhere it should: every repository, branch, environment, identity, and agent in scope, with no silent exceptions? |
| **Calibration** | Is the strictness matched to the risk of the work being governed, so that lower risk work has less reliance on humans, with higher risk work having greater human involvement? Is the boundary between deterministic enforcement (rules, gates, policy-as-code that return the same answer every time) and probabilistic judgment (model-based or agent-based review) drawn appropriately for that risk: deterministic on the high-blast-radius and irreversible side, probabilistic where the cost of a wrong call is recoverable? |
| **Enforceability** | Is the rule machine-checkable and blocking at the right point in the lifecycle, or only documented and advisory? |
| **Auditability** | Can a third party reconstruct, after the fact, which rule applied, who it applied to, when it was evaluated, and what the outcome was? |

A maturity assessment of agent governance can be expressed as a five-by-four grid: each sub-category scored on each property. The grid is most useful when each cell is scored against an actual repository, organization, or enterprise rather than against a hypothetical target state, since coverage and calibration only become meaningful at a specific scope. Read alongside the equivalent grid for [shared knowledge](/library/governance/recommendations/agentic-shared-knowledge), the result is a single page that tells you whether agents and humans in this scope operate under conditions that are both well-bounded and well-informed.

## Related content

{{< cards >}}
  {{< card link="/library/governance/recommendations/governing-agents" title="Governing agents" subtitle="Platform-level guidance for agent governance" icon="shield-check" >}}
  {{< card link="/library/governance/recommendations/agentic-shared-knowledge" title="Shared knowledge for agentic engineering" subtitle="The information layer paired with this taxonomy" icon="document-text" >}}
  {{< card link="/library/governance/recommendations/agentic-engineering-system-on-github" title="Building an agentic engineering system on GitHub" subtitle="The system this taxonomy plugs into" icon="sparkles" >}}
  {{< card link="/library/governance/recommendations/governance-policies-best-practices" title="Governance best practices" subtitle="Broader governance guidance" icon="shield-check" >}}
{{< /cards >}}

{{< seeking-further-assistance-details >}}
