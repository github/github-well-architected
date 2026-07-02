---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: true
title: 'Organization structure strategy for GitHub Enterprise'
publishDate: 2026-06-25
weight: 7
params:
  authors:
    - handle: 'djredman99'
      name: 'DJ Redman'
pillars:
  - governance
areas:
  - enterprise-and-teams
  - administration
  - compliance
  - identity-and-access-management
  - billing
verticals:
  - automotive
  - manufacturing
  - finance
  - gaming
  - media
  - government
  - information-technology
  - smb-corporate
  - professional-service
  - retail
personas:
  - administrator
  - compliance
  - internal-auditor
  - developer-lead
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu
  - github-enterprise-cloud-data-residency
features:
  - organizations
  - repositories
  - teams
  - enterprise-managed-users
  - saml-sso
  - scim
  - rulesets
  - github-apps
  - audit-log
  - enterprise-teams
  - custom-properties
components:
  - governance-and-policy
  - enterprise-settings
  - organization-settings
  - identity-and-access
  - billing-and-licensing
github:
  - enterprise-support
  - expert-services
---

<!-- markdownlint-disable MD013 -->

## Overview

How many GitHub organizations should an enterprise use? For years, the conventional guidance was simple: as few as possible—ideally one. That advice reflected real constraints. Before GitHub Enterprise Cloud (GHEC) acquired its modern enterprise-level management tooling, each organization was a largely independent silo. Every policy, every application, every team had to be re-created org by org. Sprawl meant complexity, and complexity meant risk.

That world has changed significantly. GitHub has invested in a broad set of enterprise-level controls—enterprise teams, enterprise rulesets, enterprise-scoped GitHub App installations, enterprise custom properties, enterprise-level identity provider (IdP) sync, and expanded APIs—that allow organizations to be managed centrally even when they number in the dozens or hundreds. The operational cost of running multiple organizations has dropped substantially, and the legitimate business reasons for doing so have not diminished.

This article offers a practical, updated perspective on the org-count decision. It acknowledges the value of the historical keep-it-minimal stance, explains what has changed, and gives enterprises a clear framework for deciding whether their situation calls for a single org, a small number of orgs, or a larger fleet—and how to manage whichever they choose.

> For a broader introduction to GHEC's structural layers and common org architecture models, see [Essentials of governance and administration with GitHub Enterprise](../governance-administration-essentials/).

## The historical guidance and why it existed

GitHub's original recommendation to minimize organizations was well-founded for the platform capabilities of the time. Before enterprise-level tooling existed, running multiple organizations meant:

- **Duplicated configuration.** Every GitHub App, webhook, branch protection rule, and policy had to be configured independently in each organization. A change to a security baseline required touching every org manually or scripting it yourself.
- **Fragmented access management.** Teams were scoped to organizations. A "platform" team that needed consistent access across every org required the team to be recreated in each one and kept in sync manually or with custom tooling.
- **Siloed collaboration.** `@-mentions` and code search are scoped to an organization. Users in separate organizations cannot mention each other by team, cannot easily find each other's work, and cannot contribute via pull request without being added to the repository's organization first.
- **Billing and license complexity.** Before enterprise accounts aggregated license consumption, tracking usage across many independent organizations required manual reconciliation.

Given these constraints, the guidance to keep organization count minimal was pragmatic and appropriate. The cost of sprawl was high, and the enterprise-level tools to offset it simply didn't exist.

## What has changed

GitHub has addressed most of the operational costs of multi-org deployments at the enterprise level. The following capabilities are the most significant:

### Enterprise teams

[Enterprise teams](https://docs.github.com/enterprise-cloud@latest/admin/overview/about-teams) can be defined once at the enterprise level and added to any number of organizations. A single enterprise team can span multiple orgs and receive consistent roles, access grants, and even Copilot licenses—no per-org duplication required.

For EMU enterprises, enterprise teams can be synchronized with IdP groups at the enterprise level, so membership changes in your identity provider propagate to all organizations the team is assigned to without per-org SCIM configuration.

Enterprise teams can be referenced in `@-mentions`, review requests, and issues and pull requests using the `@ent:TEAM-SLUG` format, and can receive bypass access on enterprise and org-level rulesets.

### Enterprise rulesets

[Enterprise rulesets](https://docs.github.com/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-repository-management-policies-in-your-enterprise) establish a non-bypassable governance baseline that applies across all organizations in the enterprise. An enterprise can define what no organization can override—required reviews, branch naming, push restrictions, signed commits—and delegate further rule-making to individual organizations within that envelope.

This layered model means a compliance team can set enterprise-wide security standards once, and organization teams can customize within those constraints. Changes to the enterprise baseline propagate immediately across all organizations without any per-org action.

### Enterprise-level GitHub App installations

[GitHub Apps installed at the enterprise level](https://docs.github.com/enterprise-cloud@latest/apps/maintaining-github-apps/installing-your-own-github-app#installing-your-own-github-app) are available across all organizations without per-org setup. Security scanners, compliance enforcement tools, and developer productivity platforms are common examples. An enterprise-wide installation eliminates the need to re-install and reconfigure these tools as new organizations are created or existing ones are reorganized. Note that the 100-app limit per organization applies to organization-level installations; enterprise-level installations are counted separately.

### Enterprise custom properties

[Custom properties](https://docs.github.com/enterprise-cloud@latest/organizations/managing-organization-settings/managing-custom-properties-for-repositories-in-your-organization) defined at the enterprise level apply across all organizations. This means repository metadata schemes—data classification, criticality tier, team ownership, compliance status—can be governed and queried consistently regardless of which organization a repository belongs to. Rulesets can target repositories based on custom property values, enabling governance rules that follow repository characteristics rather than organizational location.

### Enterprise-level identity and provisioning

Enterprise-level SAML provides a single authentication boundary across all organizations. EMU enterprises provision and deprovision users centrally through the IdP, with a single IdP application governing access to the entire enterprise. This eliminates the per-organization SAML configuration and SCIM provisioning that made multi-org administration burdensome in the past.

### Cost centers and enterprise billing

[Cost centers](https://docs.github.com/enterprise-cloud@latest/billing/managing-your-billing/about-cost-centers) allow billing allocation to be defined independently of org structure. A large enterprise with dozens of organizations can map spending to business units, projects, or Azure subscriptions without having org boundaries track billing boundaries. License consumption is aggregated at the enterprise level: a user who is a member of five organizations counts as one licensed seat.

### Enterprise APIs and automation

GitHub's enterprise APIs provide programmatic management of organizations, teams, rulesets, and members at scale. Tools like the [GitHub Enterprise Importer](https://docs.github.com/enterprise-cloud@latest/migrations/using-github-enterprise-importer) and automation around organization creation, configuration, and teardown make org lifecycle management tractable in a way it was not when everything required manual per-org configuration.

## When to use multiple organizations

Multiple organizations are justified—and often the right choice—in the following scenarios.

### Legal and regulatory separation

Regulated industries often require strict separation between entities for compliance, audit, or liability reasons:

- **Subsidiary or portfolio company isolation.** Companies with operationally independent business units, holding companies with separate legal entities, or portfolio companies with distinct regulatory profiles often need organizations that map to those entities. Organizations can be transferred between enterprise accounts, which eases merger, acquisition, and divestiture workflows.
- **Export controls and IP law.** Some jurisdictions impose strict controls on who can access certain intellectual property. Separating work subject to export control restrictions (for example, ITAR or EAR in the United States) into a dedicated organization with restricted membership and base permissions enforces a security boundary that is harder to achieve within a shared organization.
- **Data classification and residency.** Different classes of data—for example, customer PII under GDPR, defense-classified work, or content subject to contractual confidentiality—may require distinct access models or residency requirements. Organizations with restrictive base permissions and limited membership are one mechanism for enforcing these boundaries. For strict data residency, evaluate [GitHub Enterprise Cloud with Data Residency](https://docs.github.com/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency).
- **Segregation of duties.** Some compliance frameworks require that the teams building, testing, and deploying systems have demonstrably separate access. Multiple organizations can serve as an audit-friendly separation layer when the segregation requirement cannot be satisfied at the team or repository level.

### Open source and public work

Open source projects with outside collaborators present a security boundary challenge in a standard enterprise organization. Outside collaborators in a standard enterprise can access repositories but are not organization members; however, if they are added to an organization, they may gain visibility into internal repositories through base permissions or teams.

A dedicated organization for open source work—separate from corporate organizations—avoids this problem. Contributors can interact with the project without any risk of inadvertent access to proprietary code. This is especially important for portfolio companies and organizations with substantial open source investment.

### Sandbox and experimentation

A shared sandbox organization where developers can freely create and experiment reduces the pressure to clutter primary organizations with proof-of-concept work. Base permissions set to "write" in a sandbox encourage sharing of experiments without the policy constraints of production-grade organizations. A defined process for graduating sandbox repositories into production organizations brings useful work into the managed environment when it's ready.

### Geographic or business unit scale

For very large enterprises with tens of thousands of users spread across major divisions that operate semi-independently, a model that maps one organization per top-level division provides each business unit's platform team with meaningful administrative autonomy while the enterprise layer sets non-negotiable governance baselines. This is distinct from creating separate organizations for teams or projects within a division—that remains an anti-pattern.

### Delegated administration and team autonomy

A frequently overlooked but practical justification for multiple organizations is the need to give teams meaningful administrative ownership of their own environment—without exposing other teams to the risk of those elevated permissions or the private resources associated with them.

Within a single shared GitHub organization, some capabilities are scoped exclusively to organization owners or to roles with significant organizational-level permissions. These include:

- **Organization-level secrets** for Actions and Codespaces—secrets that can be made available across any repository in the organization. In a shared org, a team that needs its own CI/CD secrets cannot restrict other org owners from seeing or modifying those secrets.
- **Actions policies**—controlling which actions and reusable workflows are permitted across the organization's repositories.
- **Built-in elevated roles** such as Security Manager (organization-wide security settings and alert visibility) and CI/CD Admin (managing Actions runners and organization-level Actions policies).
- **Custom organization roles** that delegate specific administrative functions to team leads—for example, the ability to manage teams, configure rulesets, or administer Actions within the organization.
- **Base membership permissions**, default repository visibility, team synchronization settings, and other organization-wide defaults.

In a shared organization, granting any of these permissions to a team's leads creates two problems: the team gains visibility or influence over other teams' resources, and the central platform team becomes an administrative bottleneck for changes that each team should own. When one team's org owner can see or modify another team's organization-level secrets, the isolation that those secrets were meant to provide is weakened.

A dedicated organization per team or division addresses both issues. The team's leads can be organization owners—or be granted custom organization roles—scoped entirely to their own organization. Organization-level secrets are isolated by default: they are not visible or accessible across organization boundaries. The team operates with genuine self-service autonomy, and the central platform team is freed from serving as an intermediary for routine administrative tasks.

This is distinct from access isolation (covered in the legal and regulatory separation section above). The driving concern here is operational and organizational: reducing the administrative burden on a central team while giving distributed teams the control they need to move quickly and manage their own environment.

### Mergers, acquisitions, and divestitures

Organizations can be transferred between enterprise accounts and invited into a new enterprise. This makes GitHub organizations a useful unit of migration management for M&A activities. Acquiring a company's GitHub organization and inviting it into your enterprise account can be significantly easier than migrating all of its repositories into an existing organization. The organization retains its name, URLs, and existing external links while adopting enterprise-level policies.

## When a single organization (or few organizations) is still the right choice

The case for consolidation remains strong for many enterprises. A minimal org structure is appropriate when:

- **Teams and repository permissions can serve the purpose.** If the reason for a separate organization is primarily about managing who sees what, teams with explicit repository access and appropriate base permissions can achieve the same outcome within a single organization with less overhead.
- **Innersource culture matters.** Innersource—the practice of applying open source collaboration patterns to internal work—is materially harder across organization boundaries. `@-mentions` and code search are org-scoped. Developers in separate organizations cannot mention each other's teams, cannot easily discover each other's work, and are more likely to duplicate effort. Where cross-team collaboration and code reuse are strategic objectives, consolidation supports them.
- **Administrative simplicity is a priority.** Each organization carries its own configuration surface area even with enterprise-level tooling. Fewer organizations means fewer places to look when troubleshooting, fewer owners to manage, and a simpler onboarding story for new teams.
- **The team is early in its GitHub adoption.** Starting with a small number of organizations and adding more as genuine need emerges is almost always easier than starting with many and later consolidating. Legacy organizations accumulate debt: integrations, references in documentation, hardcoded repository paths, and institutional memory. It's always easier to add organizations than to remove them.

## Trade-off summary

| Consideration | Single / few organizations | Many organizations |
| --- | --- | --- |
| @-mentions and notifications | Works natively across teams | Cross-org requires enterprise teams |
| Code search and discovery | Single scope, easy | Org-scoped; requires enterprise-wide search |
| Innersource and reuse | Friction-free | Requires deliberate cross-org patterns |
| Policy governance | Simpler; enterprise baseline + one org layer | Enterprise baseline + multiple org layers |
| App installation | Per-org, or enterprise-level | Enterprise-level installation removes duplication |
| Team management | Per-org teams; enterprise teams optional | Enterprise teams essential to reduce duplication |
| Access provisioning | SCIM at org or enterprise level | Enterprise-level EMU provisioning recommended |
| Compliance isolation | Harder; requires team/repo-level controls | Strong audit boundary; maps to legal entities |
| Regulatory separation | Requires additional controls | Organization is a natural boundary |
| Billing granularity | Use cost centers for reporting | Organizations plus cost centers for reporting |
| M&A agility | May require repo migration | Organizations transfer between enterprises |
| Team administrative autonomy | Difficult; org owners have org-wide scope | Natural boundary; teams can be org owners within their own scope |
| Org-level secret isolation | Org owners can see all org-level secrets | Secrets are scoped to the organization; no cross-org visibility |
| Administrative overhead | Lower when governed well | Managed by enterprise-level tooling at scale |

## Decision framework

Use the following questions to guide the org count decision. These are not gates—all questions should be considered together.

1. **Is there a legal or regulatory requirement for separation?** If yes, a separate organization for the separated content or entity is strongly justified. This is the clearest case for multiple organizations.

2. **Are there genuinely independent business entities?** Portfolio companies, subsidiaries, and top-level divisions operating with distinct governance requirements are good candidates for their own organizations. Teams, departments, and projects within a division are not.

3. **Is outside collaborator access a concern?** If you have open source projects or external contractor work that must be separated from internal IP, a dedicated organization makes that boundary explicit and enforceable.

4. **Do you need independent policy customization at the organization level?** Enterprise rulesets set the floor, but organizations can set stricter policies. If a subset of your repositories has materially different security requirements that warrant their own policy layer—not just different teams or access—a separate organization may be appropriate.

5. **Is innersource a strategic goal?** If cross-team code reuse and collaboration are priorities, consolidation is the stronger default. The friction of cross-org contribution is real.

6. **Can you staff organization administration appropriately?** Each organization needs at least two organization owners. At scale, managing organization administration across many organizations requires operational investment or automation. Do not create organizations faster than your capacity to govern them.

7. **Are you early in your GitHub adoption?** If yes, start with fewer organizations and grow with demonstrated need. It is much easier to add organizations over time than to consolidate fragmented ones later.

## Avoiding common mistakes

### Mapping orgs to internal hierarchy

The single most common org structure mistake is creating a separate organization for each internal team, department, or project. Internal management hierarchies change frequently—reorgs, renamed teams, dissolved projects. Organizations are not designed to track that kind of churn. When your org structure mirrors your reporting structure, every reorganization requires re-pathing integrations, updating documentation, and migrating teams and repositories.

Use GitHub teams to reflect internal structure. Use organizations to reflect durable administrative, legal, or compliance boundaries.

The [anti-patterns article](../../scenarios/anti-patterns#fragmented-organization-structure) covers this in more detail.

### Creating organizations to manage notifications

Some teams have historically created separate organizations as a way to limit notification volume. This is an anti-pattern. GitHub provides notification settings, watched repository controls, and team membership configuration that serve this purpose without the administrative overhead and collaboration friction of separate organizations.

### Letting org count grow without governance

If organization creation is ungoverned, organizations proliferate. Every new project or team spawns its own organization, each with its own set of apps, teams, and owners. This creates exactly the management burden that the keep-it-minimal guidance was designed to avoid. Use an organization creation process that requires a defined purpose and an identified set of owners, and review active organization count periodically as part of your governance hygiene.

### Conflating separation with security

Organizations provide an access boundary, but they do not replace security controls. A repository in a restricted organization can still be exfiltrated by a user with access to it. Treat organizations as one layer in a defense-in-depth strategy, not as the primary security control. Repository visibility settings, branch protections, rulesets, audit logging, and secret scanning all apply regardless of org count.

## Multi-org operational patterns

For enterprises that do operate multiple organizations, the following patterns reduce administrative overhead.

### Establish an enterprise-level governance baseline before creating organizations

Define your enterprise-level rulesets, custom properties, GitHub App installations, and SAML/EMU configuration before creating multiple organizations. New organizations automatically inherit the enterprise configuration. Retrofitting these controls across existing organizations is more complex than establishing them upfront.

### Use enterprise teams for cross-org access

Before creating per-org duplicates of teams that span multiple organizations, evaluate enterprise teams. An enterprise team can be assigned to multiple organizations and granted appropriate roles in each. For EMU enterprises, link the enterprise team to an IdP group for automated membership management.

### Automate organization lifecycle management

Use the GitHub API to automate organization creation with a standard configuration template. This ensures every new organization starts from a known-good baseline—team ownership, base permissions, rulesets, and app installations—rather than being manually configured each time. Document the process so organization creation is self-service for teams that have demonstrated a legitimate need.

### Define a repository graduation process for sandbox organizations

If you use a sandbox organization, establish a clear process for moving repositories from sandbox to a primary organization. Include considerations for transferring issues, changing external links, and updating CI/CD pipeline configurations. Without a graduation process, sandbox organizations become permanent homes for work that was only supposed to be temporary.

### Review and consolidate regularly

Audit active organizations periodically. Archive or migrate repositories from legacy organizations that no longer have an active owner or purpose. The goal is not zero organizations—it's the right number for your actual needs. Legacy organizations add noise and administrative load without providing value.

## Summary

GitHub's historical recommendation of minimal organizations reflected the real cost of org sprawl at a time when enterprise-level management tools did not exist. That calculus has changed materially. Enterprise teams, enterprise rulesets, enterprise App installations, enterprise custom properties, and enterprise-level identity management collectively reduce the overhead of operating multiple organizations to a fraction of what it once was.

The right number of organizations for your enterprise is the number that reflects your actual legal, regulatory, compliance, and operational requirements—not the smallest number achievable by shoehorning unrelated entities together, and not the largest number achievable by mapping every team and project to its own organization. Let business requirements drive the structure, not technical limitation or organizational politics.

It is also worth noting that GitHub continues to invest in capabilities that make managing multiple organizations easier. Recent and ongoing work includes enterprise-level custom organization roles that can be defined once and reused across all organizations in the enterprise ([changelog, August 2025](https://github.blog/changelog/2025-08-21-enterprises-can-create-organization-roles-for-use-across-their-enterprise-and-custom-role-limits-have-been-increased/)), expanded governance and role assignment via enterprise teams in public preview ([changelog, October 2025](https://github.blog/changelog/2025-10-23-managing-roles-and-governance-via-enterprise-teams-is-in-public-preview/)), significantly increased enterprise teams scale limits ([changelog, December 2025](https://github.blog/changelog/2025-12-08-enterprise-teams-product-limits-increased-by-over-10x/)), and unified enterprise team support in organization APIs ([changelog, February 2026](https://github.blog/changelog/2026-02-23-enterprise-team-support-in-organization-apis/)). These investments reflect GitHub's direction: providing enterprise-level tooling that makes the operational cost of a larger org count manageable, while preserving the organizational and security boundaries that teams need.

When in doubt, start minimal, govern intentionally, and add organizations as genuine need is demonstrated.

## Seeking further assistance

{{% seeking-further-assistance-details %}}

## Related links

{{% related-links-github-docs %}}

### External resources

- [Essentials of governance and administration with GitHub Enterprise](../governance-administration-essentials/) — broad GHEC administration guide with org architecture models
- [Best practices for structuring organizations in your enterprise](https://docs.github.com/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-organizations-in-your-enterprise/best-practices-for-structuring-organizations-in-your-enterprise) — GitHub Docs guidance on org structure
- [About teams in an enterprise](https://docs.github.com/enterprise-cloud@latest/admin/overview/about-teams) — enterprise teams capabilities and limitations
- [About enterprise accounts](https://docs.github.com/enterprise-cloud@latest/admin/overview/about-enterprise-accounts) — overview of the enterprise account and its components
- [Adding organizations to your enterprise](https://docs.github.com/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-organizations-in-your-enterprise/adding-organizations-to-your-enterprise) — creating, inviting, and transferring organizations
