---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false # Set to false when ready to publish
title: 'Rulesets Best Practices'
publishDate: 2024-10-08
params:
  authors:
    [
      { name: 'Ari LiVigni', handle: 'arilivigni' },
      { name: 'Greg Mohler', handle: 'callmegreg' },
      { name: 'Greg Ose', handle: 'gregose' },
      { name: 'Collin McNeese', handle: 'collinmcneese' },
    ]

# Aliases
aliases:
  - '/library/governance/recommendations/rulesets-best-practices'

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - governance

# The areas of the GitHub adoption journey. Inspiration taken from docs.github.com
areas:
  - collaborative-coding
  - developers

# Classifications of industries who may be at different stages of the customer journey.
verticals:
  - automotive
  - manufacturing
  - finance
  - gaming
  - media
  - government
  - information-technology
  - healthcare
  - retail
  - education
  - energy
  - telecommunications
  - hospitality
  - professional-services
  - smb-corporate

# Individuals in key roles on the customer journey, typically consisting of one or more administrators and the end-user community.
personas:
  - administrator
  - application-security-engineer
  - compliance
  - developer
  - internal-auditor
  - security-analyst

# Deployment options for GitHub Enterprise, including Cloud (GHEC), Server (GHES), and Hybrid.
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-data-residency
  - github-enterprise-cloud-plus-emu
  - github-enterprise-server

# GitHub product functions designed to support every stage of development.
features:
  - rulesets
  - custom properties

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - audit-log
  - best-practice
  - governance-and-policy
  - policies
  - teams
  - enterprise-settings
  - organization-settings
  - repository-settings

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - enterprise-support
  - expert-services
  - partners
---

<!-- This disables the linting rule for multiple top-level headers -->
<!-- markdownlint-disable MD025 -->
<!-- markdownlint-disable MD013 -->

## Scenario overview

Enterprises need consistent, enforceable guardrails for how code enters, evolves within, and is released from repositories. GitHub repository rulesets and custom properties let you express policy once and apply it broadly while still allowing controlled exceptions.

## Key design strategies and checklist

1. Define ownership & scope
   - Decide what lives at the enterprise / organization ruleset layer vs. delegated repository rulesets.
   - Create a RACI matrix (owner for design, approver for enforcement changes, reviewers, informed dev community).
2. Start with a minimal baseline ruleset in Evaluate mode
   - Use Evaluate to surface potential merge/push friction before enforcement.
   - Track violations (Rule Insights) to prioritize developer enablement.
3. Tier your protection
   - Map repositories to tiers via custom properties (e.g. `production=true`, `security_tier=high|medium|low`).
   - Attach progressively stronger rulesets per tier (baseline → production → sensitive).
4. Centralize critical workflows
   - Use required workflows and status checks for organization-wide gates.
   - Keep them in internal reusable workflow repos and version them.
5. Bypass & exception model
   - Grant bypass only to roles/teams with clear break-glass standard operating procedures.
   - Monitor bypass exceptions via the audit log, [REST API](https://docs.github.com/enterprise-cloud@latest/rest/repos/bypass-requests), webhooks, or the native [rule insights](https://docs.github.com/enterprise-cloud@latest/organizations/managing-organization-settings/managing-rulesets-for-repositories-in-your-organization#viewing-insights-for-rulesets) dashboard; look for patterns indicating a need to adjust rules.
6. Change management & versioning
   - [Rulesets history](https://docs.github.com/enterprise-cloud@latest/organizations/managing-organization-settings/managing-rulesets-for-repositories-in-your-organization#using-ruleset-history) is retained for 180 days; you can view all the changes to a ruleset and revert back to a specific iteration.
7. Measurement & feedback
   - Metrics: % repos covered per tier, # blocked events by rule, mean time to remediate violation patterns, bypass frequency.
   - Use rule insights to adjust high-friction rules.
8. Leverage curated recipes safely
   - Refer to [GitHub's starter workflows](https://github.com/github/ruleset-recipes) (treat as starting points; review & adapt).
9. Phase your rollout
   - **Test phase** - Start with a ruleset in evaluate mode, targeting only your test repos to confirm functionality works as intended.
   - **Pilot phase** - Roll out to specific pilot teams by selecting several named repos; validate results and incorporate feedback as needed.
   - **Expand phase** - Expand to the entirety of the tier you're targeting (all repos or dynamic by property); review rule insights and adjust rules where failures occur.
   - **Enforce phase** - Move rule to active mode where requirements become blocking controls; continue monitoring failures/bypasses and adjust rules as needed.
10. Documentation & training
    - Create a lightweight internal page including required rules per tier, how to request an exception, and how to interpret a failed push.
    - Developers should know about new rules before they're live, especially when those rules could block their workflow.

### Quick checklist

| Area       | Action                                                |
| ---------- | ----------------------------------------------------- |
| Governance | RACI defined; approval workflow documented            |
| Targeting  | Custom properties applied to ≥90% active repos        |
| Rollout    | Baseline ruleset in Evaluate ≥1 sprint before enforce |
| Exceptions | Audit log review cadence (weekly)                     |
| Automation | tools/export & drift detection in CI                  |
| Metrics    | Dashboard for coverage, violations, bypasses          |

## Assumptions and preconditions

- Agreement on taxonomy for repository tiers and custom property keys/values.
- GitHub Actions reusable workflows producing stable status checks before you enforce them.
- Plan availability for rulesets - refer to GitHub Docs: [Available rules for rulesets](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).
- Required roles:
  - Organization owners or custom role with "Manage organization ref update rules and rulesets" for org-level rulesets
  - Repo admins or custom role with "Edit repository rules" for repo-level rulesets
  - Custom properties managed by owners or delegated roles.

## Recommended implementation

### 1. Custom properties strategy

{{< callout type="information" >}}
Read more on working with custom properties in [custom properties best practices]({{< relref "custom-properties-best-practices.md" >}}).
{{< /callout >}}

Define a schema that makes sense for your organization. For example:

| Property      | Type                                            | Purpose                     |
| ------------- | ----------------------------------------------- | --------------------------- |
| production    | boolean                                         | Attach production ruleset   |
| security_tier | single-select (Low, Medium, High)               | Progressive enforcement     |
| compliance    | multi-select (SOC 2, FedRAMP, HIPAA, PCI, etc.) | Target additional workflows |
| app_id        | text                                            | Link to CMDB / inventory    |

Populate on repo creation and [automate updates via API](https://docs.github.com/enterprise-cloud@latest/rest/repos/custom-properties?apiVersion=2022-11-28#create-or-update-custom-property-values-for-a-repository) to prevent drift.

{{< callout type="warning" >}}
For public repositories, avoid custom properties that could expose sensitive information (e.g. internal project names, security posture).
{{< /callout >}}

### 2. Baseline ruleset (all active repos)

Protect main development branches with minimal developer friction. Ideal for repositories that are small internal projects led by a single developer or initial proof of concept work that is being iterated on before being deployed to production environments.

Recommended rules include (see [Available rules for rulesets](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets) for definitions):

**Branch rules**:

- **Block force pushes & deletions** - These protect against accidental or malicious destruction of commit history, ensuring code changes remain auditable and recoverable. Force pushes can overwrite colleagues' work and break CI/CD pipelines that rely on stable commit references.
- **Require a pull request before merging** - This establishes a minimal review gate that creates visibility into all changes, enables automated checks to run, and provides an opportunity for knowledge sharing even if formal approval isn't required at this tier.
- **Require workflows to pass (e.g. central security/compliance workflow once stable inclusive of [Dependency Review](https://docs.github.com/enterprise-cloud@latest/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review))** - Automated security scanning catches common vulnerabilities before they enter the main branch, reducing remediation costs. Dependency Review specifically prevents introduction of known-vulnerable packages that could compromise the entire software supply chain.

### 3. Production tier ruleset

Applied where repository supports a production application (e.g. custom property `production=true`). Add/tighten:

**Branch rules**:

- **Additional pull request requirements:**
  - **Required approvals ≥ 1** - Ensures at least one peer reviews changes to reduce defects and spread knowledge before merging.
  - **Dismiss stale pull request approvals when new commits are pushed** - Prevents outdated approvals from being applied to revised code, ensuring reviewers validate the final set of changes.
  - **Require review from CODEOWNERS** - Ensures domain experts and maintainers validate changes to sensitive or critical areas.
  - **Require approval of the most recent reviewable push** - Guarantees that approvals correspond to the latest reviewed commit.
  - **Require conversation resolution before merging** - Ensures reviewer feedback is addressed and reduces the risk of overlooked issues.
  - **Automatically request [Copilot code review](https://docs.github.com/enterprise-cloud@latest/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui)** - Adds an automated review layer to surface potential issues quickly and at scale.
- **Require code scanning results (severity threshold tuned to avoid overly cautious blocks)** - Integrates automated security scanning (e.g. [CodeQL](https://docs.github.com/enterprise-cloud@latest/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql)) to catch vulnerabilities prior to merging while tuning thresholds to reduce noisy false positives.

### 4. Sensitive / regulated tier ruleset

Organizations subject to compliance frameworks like SOX, HIPAA, PCI DSS, FedRAMP, or SOC 2 often need to demonstrate security controls during audits, including evidence that code changes follow proper authorization and review processes before affecting production systems.

Consider these rules where a repository supports sensitive data or regulated applications (e.g. custom property `security_tier=high`). Add/tighten:

**Branch rules**:

- **Require signed commits (if developer signing adoption ≥80%)** - Provides stronger provenance and non-repudiation for commits, supporting audit and compliance requirements.
- **Require deployments to succeed before merging via required status checks** - Ensures that changes pass deployment validation and do not introduce regressions into production systems.
- **Consider additional required workflows**:
  - **Additional security scanning (IaC analysis/DAST)** - Detects infrastructure and runtime vulnerabilities that basic code scanning may miss.
  - **Secret scanning bypass detection (e.g. [Secret Scanning Review Action](https://github.com/marketplace/actions/secret-scanning-review-action))** - Helps detect attempts to circumvent secret scanning and prevents sensitive data leakage.
  - **License compliance and security checks with [Dependency Review](https://github.com/actions/dependency-review-action)** - Prevents introducing dependencies with known vulnerabilities or overly restrictive licenses.
- **Restrict metadata (e.g. author email domain)** - Ensures that valid employee accounts are used to suggest changes.

**Push rules**:

- **Restrict file paths (e.g. `.github/secret_scanning.yml` or high-risk paths)** - Limits the surface area for accidental or malicious changes to critical configuration or secret scanning policies.
- **Restrict file extensions (e.g. binaries)** - Prevents large or executable files from being added without proper review, reducing risk and repository bloat.
- **Restrict file size (e.g. oversized artifacts)** - Prevents oversized files that can hinder repo performance or be used as an exfiltration vector.

### 5. Exception & bypass flow

Consider your bypass actors carefully to avoid accidental "impossible merge" situations. For example, when a required workflow is unavailable, when an external status check cannot complete, or when a single-person team has no peer available to review changes. Audit all bypass events so recurring patterns can guide rule adjustments instead of repeated bypasses.

When bypass actors have been configured, the general flow is:

1. Developer opens a PR or push is blocked.
2. Developer checks internal guidance (ideally linked in the organization README).
3. If emergency: authorized role uses bypass.
4. Ruleset owners perform weekly review; adjust rules if recurring pattern emerges.

## Additional solution detail and trade-offs to consider

### Finding the Right Balance

Finding the right balance between enterprise, organization, and repository level rulesets depends on your specific project and team needs. Key factors to consider:

- **Control**: Trade-off between central control and distributed repo-level flexibility
- **Complexity**: Frequency and complexity of rule changes; complex rules may be safer at smaller scale where change impact is limited
- **Risk impact**: Strict security or compliance requirements can be better defined at enterprise/organization level where repository owners have less administrative control or bypass ability
- **Commonality**: Level of consistency and standardization required across repositories
- **Bypass exceptions**: Enterprise/organization level rulesets benefit from role-type bypass exceptions (org/repo admins), while explicit actor bypasses should be more tightly scoped

Some repositories benefit from inheriting most rules from the enterprise/organization level, while others need more customization and autonomy. A hybrid approach with selective exceptions and overrides may suit specific cases. The goal is maximizing ruleset benefits without compromising code productivity and quality.

#### Implementation Approaches

- **Minimal Inheritance**: Define only essential high-level rules (code quality, security, compliance) at enterprise/organization level. Leave remaining rules to repository owners and teams for maximum customization and autonomy.
- **Strict Inherited Enforcement**: Define and enforce comprehensive rules across all repositories to ensure enterprise-wide uniformity and alignment. Reduces risk of errors and deviations but limits team flexibility and creativity.
- **Micro Rulesets**: Define multiple rule sets targeting different repository groups based on project type, domain, or function. Enables granular specificity while allowing differentiation and adaptation.

{{< callout type="warning" >}}
Avoid enabling too many restrictive rules simultaneously; stage them and monitor friction. Push rulesets can block legitimate automation if not tested; pilot them first.
{{< /callout >}}

## Seeking further assistance

<!-- The Hugo shortcode below will fully populate this section -->

{{% seeking-further-assistance-details %}}

## Related links

<!-- The Hugo shortcode below will include a subsection that links to GitHub's documentation. -->

{{% related-links-github-docs %}}

Specific ruleset and custom properties documentation can be found here:

- [Managing rulesets for repositories in your organization](https://docs.github.com/enterprise-cloud@latest/organizations/managing-organization-settings/managing-rulesets-for-repositories-in-your-organization)
- [Available rules for rulesets](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [Troubleshooting rules](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/troubleshooting-rules)
- [Managing custom properties for repositories in your organization](https://docs.github.com/organizations/managing-organization-settings/managing-custom-properties-for-repositories-in-your-organization)
- [Audit log events for rulesets](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/audit-log-events-for-your-enterprise#repository_ruleset)

<!-- ### External Resources -->

<!-- Optionally add any external resources that are related to your article or that could provide additional information or context for your readers.
This could include links to tutorials, blog posts, or other articles. -->
