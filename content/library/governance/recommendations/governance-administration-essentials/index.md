---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false
title: 'Essentials of governance and administration with GitHub Enterprise'
publishDate: 2026-04-23
params:
  authors:
    - handle: 'rhoticity'
      name: 'Jessi Moths'
    - handle: 'collinmcneese'
      name: 'Collin McNeese'
pillars:
  - governance
areas:
  - enterprise-and-teams
  - administration
  - compliance
  - identity-and-access-management
  - billing
  - security-operations
verticals:
  - automotive
  - manufacturing
  - finance
  - gaming
  - media
  - government
  - information-technology
  - smb-corporate
personas:
  - administrator
  - compliance
  - internal-auditor
  - security-engineer
  - developer-lead
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu
features:
  - organizations
  - repositories
  - teams
  - enterprise-managed-users
  - saml-sso
  - scim
  - rulesets
  - custom-properties
  - personal-access-tokens
  - github-apps
  - audit-log
  - webhooks
  - github-actions
  - github-codespaces
  - github-copilot
  - github-advanced-security
components:
  - governance-and-policy
  - enterprise-settings
  - organization-settings
  - repository-settings
  - billing-and-licensing
  - identity-and-access
  - integrations
  - logging-and-monitoring
github:
  - enterprise-support
  - expert-services
---

<!-- markdownlint-disable MD013 -->

## Scenario overview

A successful GitHub Enterprise Cloud (GHEC) adoption can prevent downstream maintenance burdens while promoting innersource, collaboration, and efficient organizational structures. This guide walks through the foundational concepts and administrative design decisions for GHEC in a single learning flow, from structural components through audit log operations. It is intended for current or prospective enterprise and organization owners (administrators), security architects, and anyone involved with security design, process automation, or other decision-making around a company's GitHub Enterprise governance and configuration.

Each section offers opinionated, prescriptive guidance on architecture and policy trade-offs. For step-by-step procedures, refer to the linked GitHub Docs pages throughout.

## Structural components of GitHub Enterprise Cloud

GHEC provides a number of flexible configuration options, allowing each business to configure the platform to best meet their unique needs. While there is no single "best" way to implement GHEC, there are common patterns and steps you should carefully consider. GHEC has four structural layers that should be treated as separate control planes: enterprise account, organization, repository, and team. Each provides different levels of administrative control and policy enforcement, and understanding how they interact is essential for sound governance.

<figure aria-label="GHEC structural layers: enterprise account, enterprise teams, organizations, repositories, and teams">
<style>
.sc-diagram {
  --sc-bg:#F2F5F3;--sc-ent:#E4EBE6;--sc-ent-bd:#B6BFB8;--sc-ent-lbl:#909692;
  --sc-org:#ffffff;--sc-org-top:#E4EBE6;--sc-org-bd:#B6BFB8;
  --sc-repo:#0FBF3E;--sc-repo-t:#101411;
  --sc-team:#BFFFD1;--sc-team-t:#08872B;
  --sc-txt:#232925;--sc-sub:#909692;
}
.dark .sc-diagram {
  --sc-bg:#101411;--sc-ent:#0A241B;--sc-ent-bd:#08872B;--sc-ent-lbl:#8CF2A6;
  --sc-org:#232925;--sc-org-top:#1a2e1f;--sc-org-bd:#08872B;
  --sc-repo:#0FBF3E;--sc-repo-t:#101411;
  --sc-team:#08872B;--sc-team-t:#BFFFD1;
  --sc-txt:#F2F5F3;--sc-sub:#8CF2A6;
}
.sc-outer{background:var(--sc-bg);border-radius:12px;padding:1.5rem;font-family:inherit;}
.sc-enterprise{background:var(--sc-ent);border:2px solid var(--sc-ent-bd);border-radius:10px;padding:.75rem 1rem 1rem;display:flex;flex-direction:column;gap:.75rem;}
.sc-layer-title{display:flex;flex-direction:column;gap:.15rem;}
.sc-layer-name{font-size:.85rem;font-weight:700;color:var(--sc-txt);}
.sc-layer-desc{font-size:.72rem;color:var(--sc-ent-lbl);}
.sc-orgs-row{display:flex;gap:.75rem;align-items:flex-start;flex-wrap:wrap;}
.sc-org-card{background:var(--sc-org);border:1.5px solid var(--sc-org-bd);border-radius:10px;overflow:hidden;box-shadow:3px 3px 0 var(--sc-org-bd);flex:1;min-width:150px;}
.sc-org-header{background:var(--sc-org-top);padding:.4rem .65rem;border-bottom:1.5px solid var(--sc-org-bd);}
.sc-org-name{display:block;font-size:.82rem;font-weight:700;color:var(--sc-txt);}
.sc-org-sub{display:block;font-size:.67rem;color:var(--sc-sub);margin-top:.1rem;}
.sc-org-body{padding:.5rem .65rem;display:flex;flex-direction:column;gap:.35rem;}
.sc-team-band{background:var(--sc-team);color:var(--sc-team-t);border-radius:5px;padding:.25rem .45rem;font-size:.72rem;font-weight:600;text-align:center;}
.sc-repo-pill{background:var(--sc-repo);color:var(--sc-repo-t);border-radius:5px;padding:.22rem .4rem;font-size:.7rem;font-weight:500;text-align:center;}
.sc-repo-dots{text-align:center;color:var(--sc-sub);font-size:.85rem;letter-spacing:.1em;}
.sc-more{background:var(--sc-org);border:1.5px dashed var(--sc-org-bd);border-radius:10px;display:flex;align-items:center;justify-content:center;padding:.75rem .5rem;font-size:.75rem;color:var(--sc-sub);flex:0 0 70px;align-self:stretch;}
.sc-ent-team-band{background:var(--sc-team);color:var(--sc-team-t);border-radius:6px;padding:.3rem .65rem;font-size:.75rem;font-weight:600;display:flex;align-items:center;justify-content:space-between;}
.sc-ent-team-sub{font-size:.68rem;font-weight:400;opacity:.85;}
@media(max-width:520px){.sc-orgs-row{flex-direction:column;}.sc-more{flex:none;width:100%;padding:.5rem;}}
</style>
<div class="sc-diagram">
<div class="sc-outer">
  <div class="sc-enterprise">
    <div class="sc-layer-title">
      <span class="sc-layer-name">Enterprise account</span>
      <span class="sc-layer-desc">Billing &middot; licensing &middot; IdP integration &middot; enterprise-wide policy &middot; audit log</span>
    </div>
    <div class="sc-ent-team-band">
      <span>Enterprise teams</span>
      <span class="sc-ent-team-sub">Defined at the enterprise level &middot; span multiple organizations</span>
    </div>
    <div class="sc-orgs-row">
      <div class="sc-org-card">
        <div class="sc-org-header">
          <span class="sc-org-name">Organization</span>
          <span class="sc-org-sub">Org-level policies &middot; members &middot; billing rollup</span>
        </div>
        <div class="sc-org-body">
          <div class="sc-team-band">Teams</div>
          <div class="sc-repo-pill">Repository</div>
          <div class="sc-repo-pill">Repository</div>
          <div class="sc-repo-dots">&middot;&middot;&middot;</div>
        </div>
      </div>
      <div class="sc-org-card">
        <div class="sc-org-header">
          <span class="sc-org-name">Organization</span>
          <span class="sc-org-sub">Org-level policies &middot; members &middot; billing rollup</span>
        </div>
        <div class="sc-org-body">
          <div class="sc-team-band">Teams</div>
          <div class="sc-repo-pill">Repository</div>
          <div class="sc-repo-pill">Repository</div>
          <div class="sc-repo-dots">&middot;&middot;&middot;</div>
        </div>
      </div>
      <div class="sc-more">More&hellip;</div>
    </div>
  </div>
</div>
</div>
</figure>

### Enterprise account

The [enterprise account](https://docs.github.com/enterprise-cloud@latest/admin/overview/about-enterprise-accounts) is the highest-level construct within GHEC. Treat it as an administrative-only control plane for billing, licensing, identity provider integration, support entitlements, log management, and enterprise-wide policy enforcement. Standard end users do not typically have any need to interact with the enterprise account interface.

### Organizations

Enterprises consist of one or more organizations to which users are added. Organizations are the "owners" of shared repositories, teams, discussions, and projects. They let administrators set more granular policies on repositories belonging to the organization, as well as user behavior within the organization. Policies not enforced at the enterprise level are distributed out to be defined at each individual organization.

Enterprise-level rulesets, custom properties, GitHub Apps installed at the enterprise level, and enterprise-scoped team synchronization give administrators consistent policy controls across multiple organizations without duplicating configuration in each one. How many organizations your enterprise uses is a structural and business decision, not a technical constraint. The organization architecture patterns section later in this guide walks through common models and how to choose between them.

Organizations also serve as a starting point to further drill down into billing, usage, and licensing data for reporting, which is aggregated at the enterprise account level. Consumption-based services, such as GitHub Actions and Codespaces, are reported at both the repository and organization level. Spending limits on these services can be set on a per-organization basis.

Organizations are typically the highest-level construct an end user interacts with. For example, they might perform an organization-wide code search or log into an organization with SAML. Although there may be multiple organizations that your enterprise owners manage within an enterprise account, from an end user's perspective the organizations function as completely separate containers.

### Repositories

Repositories host your application source code and other files. They are the primary construct developers interface with on GitHub, including accessing application security metrics, CI/CD workflows, and other day-to-day activities. Repositories roll up to the organization level. However, certain repository visibility options do allow for repositories to be visible as read-only to users that are outside of the organization, or even the enterprise.

### Teams

GitHub teams group users of common projects, specialized skills, or other infrastructural commonalities. Teams can provide role-based access to collections of repositories, allowing you to create permission management structures while keeping content discoverability and reuse as open as possible.

Teams used for permission management should be [synced with an identity provider (IdP) group](https://docs.github.com/enterprise-cloud@latest/organizations/managing-saml-single-sign-on-for-your-organization/managing-team-synchronization-for-your-organization), which allows existing access processes and audit controls to manage access to code, onboarding, and offboarding.

Permissions aren't the only use for teams, though. You can use GitHub teams to encourage collaboration among project teams and/or topic-based teams (not explicitly defined in your IdP). Teams can also be automatically assigned as reviewers to code.

In terms of hierarchy and configuration inheritance, teams roll up to the organization level. This means that in order to reuse the same team across many organizations within your enterprise account, you would need to recreate it in each organization.

Enterprise owners can view and manage teams across all organizations from the enterprise level. For EMU enterprises, this extends further: team membership can be [synchronized with IdP groups at the enterprise level](https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management/using-enterprise-managed-users-for-iam/managing-team-memberships-with-identity-provider-groups), rather than configuring group sync independently in each organization. This is a significant operational advantage in multi-organization deployments where the same platform, security, or compliance teams need consistent access across all organizations. A single IdP group mapping governs membership in all of them.

[Enterprise teams](https://docs.github.com/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/create-enterprise-teams) take this further by allowing you to define teams at the enterprise level and grant them administrative roles or add them directly to organizations. If you need the same team to operate across multiple organizations, evaluate enterprise teams as a way to reduce duplicated team configurations and simplify cross-organization access management.

## Choosing a user access model

GHEC supports two distinct user access models. Both give you access to the same features and ease of hosting, but each is designed to facilitate different types of workflows and security guardrails. You'll need to select the model that best fits your business needs during your initial enterprise account creation, so it's important to understand both.

Each model uses a different type of user account that isn't mutually interchangeable. Switching from one to the other later is not simple and requires both migration tools and an additional process to migrate user history.

### Standard model ("Bring your own account")

The standard model emphasizes connection with the public, open source parts of GitHub.com. As the name suggests, users bring their own personal accounts to work in much the same way they might use their personal phone, laptop, or other device. They own the account and it follows them as they join, contribute, and leave organizations and participate in the GitHub community, not just during their employment at a company or work on a certain project.

Enterprises and their organizations then link these accounts and use SAML identities to authenticate access to their private resources. With a supported IdP and GitHub configuration, you can use [System for Cross-domain Identity Management (SCIM)](https://docs.github.com/enterprise-cloud@latest/organizations/managing-saml-single-sign-on-for-your-organization/about-scim-for-organizations) to further use linked workplace identity associations to grant or terminate access to those protected resources automatically.

Standard enterprises must also decide whether to configure SAML at the enterprise level or independently per organization. Enterprise-level SAML is recommended for most deployments because it provides a single authentication boundary and simplifies administration. Organization-level SAML is appropriate when different organizations genuinely require different IdPs or SAML configurations. For guidance on this decision, see [Deciding whether to configure SAML for your enterprise or your organizations](https://docs.github.com/enterprise-cloud@latest/admin/managing-iam/using-saml-for-enterprise-iam/deciding-whether-to-configure-saml-for-your-enterprise-or-your-organizations).

The standard model also allows you to add external users as outside collaborators to specific repositories with certain permissions for only those repositories. These external users who use their personal GitHub accounts are exempted from any SAML authentication requirements imposed on normal members.

**Trade-offs**: Enterprises cannot enforce or standardize account-related requirements, like mandating username formats, emails, or display names. Instead of a common corporate format for usernames, employees will use whatever GitHub username they chose for themselves, possibly many years before they joined your organization. The enterprise can only control policy-related behavior for their member and collaborator users in this model, and even then, only the behavior that occurs within the context of the enterprise account and its organizations. What the user does in the context of their own account or other non-enterprise organizations and repositories is not subject to the enterprise's controls.

The standard model also permits both private and public repositories to be hosted within the same enterprise organization, unless explicitly disabled by policy. This flexibility can be key for open source participation, but some companies choose to disallow public repositories to keep a more clear boundary between private and public.

**The standard model may be a good fit if you:**

- Require developers to interface seamlessly with public and open source communities as part of daily work
- Need to easily add outside collaborators without requiring SAML or IdP provisioning
- Make heavy use of public repositories, Gists, or public Pages and Discussions

### Enterprise Managed Users (EMU)

The EMU model prioritizes centralized enterprise control of a standardized work account from a corporate IdP. The EMU model uses company-owned, work-only GitHub accounts that operate exclusively within the confines of a company's enterprise account. When a user joins your company and is given GHEC access, they get an EMU work account that only operates and is visible in your company's enterprise account. When they leave your company or otherwise lose their GHEC access, that EMU work account is also suspended.

The full lifecycle of these accounts, including authentication and provisioning, is managed by a supported IdP, such as Microsoft Entra ID (formerly Azure Active Directory), Okta, or PingFederate. EMU supports both SAML and [OIDC](https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management/using-enterprise-managed-users-for-iam/configuring-oidc-for-enterprise-managed-users) for authentication. OIDC is the recommended choice when using Microsoft Entra ID, as it enables Entra ID's [Conditional Access Policy](https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management/using-enterprise-managed-users-for-iam/about-support-for-your-idps-conditional-access-policy) (CAP) to govern GitHub access alongside other corporate resources. This provides a unified access control posture and removes the need for a separate IP allow list.

The enterprise can standardize EMU account information, including username formatting, email addresses, and display names, which supports improved transparency and reporting.

With the strict IdP account backing requirement for work accounts, outside collaborators cannot be invited in the same way as with the standard user model. All users, including external guests, must be provisioned through your IdP. [Guest collaborators](https://docs.github.com/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/enabling-guest-collaborators) are a distinct account type available in some EMU plans that allows IdP-provisioned external users to access specific repositories without consuming a full enterprise license or receiving member-level organization access. This makes guest collaborators a practical option for contractors, auditors, and vendor partners.

Beyond providing more standardization, the EMU model also adds guardrails against making private content publicly visible, such as accidentally pushing to public GitHub.com repositories. Not only do EMU enterprises prevent public repository creation, but EMU users cannot perform write-type actions such as pushing, starring, or creating issues or pull requests in repositories outside of their enterprise account.

EMU users have full read access to view and clone GitHub.com's public repositories, however. While EMU accounts cannot be used for open source write-type activities, the tradeoff of these additional guardrails is a more stringent divide between enterprise and open source.

**The EMU model may be a good fit if you:**

- Your security requirements prioritize a separation between the public GitHub.com community and your enterprise content over a connection to open source
- The EMU model supports your IdP (Microsoft Entra ID, Okta, PingFederate) and you want to centrally standardize and manage your users' GitHub accounts as specialized work accounts only for use in the enterprise context
- You don't require (or want) collaborators outside your IdP to be added directly to specific repositories, and will instead provision these users as normal or guest accounts in their IdP directory
- You don't require public repositories or other public-facing features, like GitHub Gists, or public Pages or Discussions

{{< callout type="info" >}}
If your developers will be regularly building and maintaining open source code as a part of their daily work, the standard model may be best. However, if you need full control of your developers' accounts and a firm separation between the open source community and your company's code, EMUs will be a better user model fit.
{{< /callout >}}

{{< callout type="info" >}}
Enterprises with regulatory requirements for data sovereignty should evaluate [GitHub Enterprise Cloud with Data Residency (GHE.com)](https://docs.github.com/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency). GHE.com is a variant of GHEC that stores your data in a specific geographic region and requires the EMU user model. Like the choice between standard and EMU, this is a decision that must be made at enterprise creation time and is not reversible without migration. Review residency region availability and feature parity with your security and legal teams before committing.
{{< /callout >}}

## Organization architecture strategies

Within GHEC, organizations are shared accounts where your users collaborate across many projects at once, with sophisticated security and administrative features. It's important to plan your structure in advance to avoid creating unnecessary silos and administrative overhead. A good structure will facilitate collaboration and discovery while reducing administrative overhead.

### Recommended number of organizations

The right number of organizations depends on your enterprise's collaboration needs, legal and regulatory requirements, and how your teams are structured. Enterprise-level controls reduce per-organization overhead, so keep organization count driven by business requirements, not technical limitations.

That said, each organization still carries its own configuration surface area. Be intentional about how many you create. Organizations are designed to maintain separation from each other, and that separation can inhibit collaboration and impede innersource culture if applied where teams and repository permissions would serve the same purpose.

Some enterprises require multiple organizations for legitimate reasons:

- Legal or business distinctions between sets of content and users
- Data classification or regulatory requirements
- Mergers, acquisitions, divestitures, and other commercial changes
- Providing a test/sandbox area for training and experimentation

### Avoid indexing organizations to internal management structure

We recommend against mapping organizations to your internal management hierarchy—creating a separate organization for each team, department, or project to manage permissions and minimize notifications. This approach restricts organizational flexibility, siloes collaboration, and creates downstream work when the structure changes, such as re-pathing integrations and updating external links. Internal management structures change frequently; your GHEC configuration should handle reorganizations without requiring changes to the organizations themselves.

Instead, use GitHub teams within an organization to assign roles and permissions. Teams and users within the same organization can easily find each other's content, mention one another, and collaborate.

The guidance above applies to internal management structure. It is distinct from the question of whether legally or operationally independent entities—such as portfolio company subsidiaries, or genuinely separate top-level business divisions in a large enterprise—warrant their own organizations. The three models below address both cases.

The following three models represent the most common organization architecture patterns. Each is well-suited to a different set of enterprise contexts. Choose the one that matches your collaboration needs, compliance requirements, and operational structure.

### Model 1: Single organization

<figure aria-label="Model 1: Single organization">
<style>
.oms-diagram {
  --oms-bg:#F2F5F3;--oms-ent:#E4EBE6;--oms-ent-lbl:#909692;
  --oms-cyl:#ffffff;--oms-cyl-top:#E4EBE6;--oms-str:#B6BFB8;
  --oms-repo:#0FBF3E;--oms-repo-t:#101411;
  --oms-team:#BFFFD1;--oms-team-t:#08872B;
  --oms-txt:#232925;--oms-cyl-lbl:#909692;
  --oms-desc-bg:#BFFFD1;--oms-bullet:#232925;
  --oms-note-bg:#F2F5F3;--oms-note-bd:#E4EBE6;--oms-note-t:#909692;
}
.dark .oms-diagram {
  --oms-bg:#101411;--oms-ent:#0A241B;--oms-ent-lbl:#8CF2A6;
  --oms-cyl:#232925;--oms-cyl-top:#1a2e1f;--oms-str:#08872B;
  --oms-repo:#0FBF3E;--oms-repo-t:#101411;
  --oms-team:#08872B;--oms-team-t:#BFFFD1;
  --oms-txt:#F2F5F3;--oms-cyl-lbl:#8CF2A6;
  --oms-desc-bg:#0A241B;--oms-bullet:#E4EBE6;
  --oms-note-bg:#232925;--oms-note-bd:#B6BFB8;--oms-note-t:#B6BFB8;
}
.oms-outer{background:var(--oms-bg);border-radius:12px;padding:1.5rem 1.5rem 1.25rem;font-family:inherit;}
.oms-enterprise{background:var(--oms-ent);border-radius:10px;padding:.75rem 1rem 1rem;display:flex;flex-direction:column;align-items:center;gap:.75rem;}
.oms-ent-lbl{align-self:flex-start;font-size:.75rem;font-weight:600;color:var(--oms-ent-lbl);letter-spacing:.04em;text-transform:uppercase;}
.oms-body{display:flex;gap:1.25rem;align-items:flex-start;width:100%;}
.oms-card-wrap{flex:0 0 200px;}
.oms-org-card{background:var(--oms-cyl);border:1.5px solid var(--oms-str);border-radius:10px;overflow:hidden;box-shadow:4px 4px 0 var(--oms-str);}
.oms-card-header{background:var(--oms-cyl-top);padding:.5rem .75rem;border-bottom:1.5px solid var(--oms-str);}
.oms-card-name{display:block;font-size:.9rem;font-weight:700;color:var(--oms-txt);}
.oms-card-type{display:block;font-size:.7rem;color:var(--oms-cyl-lbl);margin-top:.1rem;}
.oms-card-body{padding:.6rem .75rem;display:flex;flex-direction:column;gap:.35rem;}
.oms-teams-band{background:var(--oms-team);color:var(--oms-team-t);border-radius:5px;padding:.28rem .5rem;font-size:.75rem;font-weight:600;text-align:center;margin-bottom:.1rem;}
.oms-repo-pill{background:var(--oms-repo);color:var(--oms-repo-t);border-radius:5px;padding:.28rem .5rem;font-size:.75rem;font-weight:500;text-align:center;}
.oms-repo-dots{text-align:center;color:var(--oms-cyl-lbl);font-size:.9rem;letter-spacing:.1em;padding:.1rem 0;}
.oms-desc-wrap{flex:1;display:flex;flex-direction:column;gap:.6rem;}
.oms-desc{background:var(--oms-desc-bg);border-radius:8px;padding:.65rem .75rem .5rem;}
.oms-desc ul{list-style:disc;margin:0;padding:0 0 0 1rem;}
.oms-desc li{font-size:.8rem;line-height:1.6;color:var(--oms-bullet);}
.oms-note{background:var(--oms-note-bg);border:1px solid var(--oms-note-bd);border-radius:8px;padding:.55rem .75rem;font-size:.75rem;line-height:1.5;color:var(--oms-note-t);}
@media(max-width:560px){.oms-body{flex-direction:column;}.oms-card-wrap{flex:none;width:100%;max-width:220px;margin:0 auto;}}
</style>
<div class="oms-diagram">
<div class="oms-outer">
  <div class="oms-enterprise">
    <span class="oms-ent-lbl">Enterprise account</span>
    <div class="oms-body">
      <div class="oms-card-wrap">
        <div class="oms-org-card">
          <div class="oms-card-header">
            <span class="oms-card-name">Organization</span>
            <span class="oms-card-type">All repositories</span>
          </div>
          <div class="oms-card-body">
            <div class="oms-teams-band">Teams</div>
            <div class="oms-repo-pill">Repo</div>
            <div class="oms-repo-pill">Repo</div>
            <div class="oms-repo-pill">Repo</div>
            <div class="oms-repo-dots">&middot;&middot;&middot;</div>
          </div>
        </div>
      </div>
      <div class="oms-desc-wrap">
        <div class="oms-desc">
          <ul>
            <li>All or most repositories in one org</li>
            <li>Teams control access to individual repos</li>
            <li>Recommend an &ldquo;all-members&rdquo; team for open repos</li>
            <li>Base permissions typically set to None or Read</li>
            <li>Enterprise-level rulesets enforce policy at scale</li>
            <li>Works well when one org meets all compliance needs</li>
          </ul>
        </div>
        <div class="oms-note">Optional: add a small number of restricted or location-specific orgs only when legal or operational requirements demand a separate boundary.</div>
      </div>
    </div>
  </div>
</div>
</div>
</figure>

A single organization serves all or the vast majority of repositories. This model works well when your collaboration, compliance, and access needs can be managed within a single administrative boundary using teams and repository permissions.

Most users of this model set their organization's [base permissions](https://docs.github.com/enterprise-cloud@latest/organizations/managing-user-access-to-your-organizations-repositories/setting-base-permissions-for-an-organization) to none, requiring explicit team assignment for repository access. By itself, this approach creates silos, greatly limits visibility, and actively prevents innersource. To counter this tendency, we recommend creating an "all members" team and adding it to repositories that should be open for collaboration. You can even have this team automatically added to all repositories by default, with an exception process for truly need-to-know repositories.

Slight variations on this model exist to handle extenuating circumstances. For example, you might maintain one or two restricted organizations for projects that must be kept completely separate from all other work, like projects for highly sensitive customers. Similarly, you might use a separate organization to segment repositories managed by teams in particular locations to address concerns around intellectual property laws.

### Model 2: Red-green-sandbox-archive

<figure aria-label="Enterprise account: Red-green-sandbox-archive model">
<style>
.eas-diagram {
  --eas-bg:#F2F5F3;--eas-cyl:#ffffff;--eas-cyl-top:#E4EBE6;--eas-str:#B6BFB8;
  --eas-repo:#0FBF3E;--eas-repo-t:#101411;
  --eas-txt:#232925;--eas-cyl-lbl:#909692;--eas-sec-lbl:#232925;--eas-bullet:#232925;
  --eas-desc-a:#BFFFD1;--eas-desc-d:#F2F5F3;--eas-desc-d-b:#E4EBE6;
}
.dark .eas-diagram {
  --eas-bg:#101411;--eas-cyl:#232925;--eas-cyl-top:#1a2e1f;--eas-str:#08872B;
  --eas-repo:#0FBF3E;--eas-repo-t:#101411;
  --eas-txt:#F2F5F3;--eas-cyl-lbl:#8CF2A6;--eas-sec-lbl:#F2F5F3;--eas-bullet:#E4EBE6;
  --eas-desc-a:#0A241B;--eas-desc-d:#232925;--eas-desc-d-b:#B6BFB8;
}
.eas-outer{background:var(--eas-bg);border-radius:12px;padding:1.5rem 1.5rem 1.25rem;font-family:inherit;}
.eas-diag-title{color:var(--eas-txt);font-size:1.1rem;font-weight:700;margin:0 0 1rem;}
.eas-cols{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;align-items:start;}
.eas-col{display:flex;flex-direction:column;gap:.5rem;}
.eas-org-card{background:var(--eas-cyl);border:1.5px solid var(--eas-str);border-radius:10px;overflow:hidden;box-shadow:3px 3px 0 var(--eas-str);}
.eas-card-header{background:var(--eas-cyl-top);padding:.45rem .6rem;border-bottom:1.5px solid var(--eas-str);}
.eas-card-name{display:block;font-size:.85rem;font-weight:700;color:var(--eas-txt);}
.eas-card-type{display:block;font-size:.68rem;color:var(--eas-cyl-lbl);margin-top:.1rem;}
.eas-card-body{padding:.5rem .6rem;display:flex;flex-direction:column;gap:.3rem;}
.eas-repo-pill{background:var(--eas-repo);color:var(--eas-repo-t);border-radius:5px;padding:.25rem .4rem;font-size:.72rem;font-weight:500;text-align:center;}
.eas-repo-dots{text-align:center;color:var(--eas-cyl-lbl);font-size:.85rem;letter-spacing:.1em;}
.eas-sec-label{text-align:center;font-size:.78rem;font-weight:600;color:var(--eas-sec-lbl);line-height:1.3;min-height:2.2em;}
.eas-desc{border-radius:8px;padding:.65rem .75rem .5rem;}
.eas-desc-active{background:var(--eas-desc-a);}
.eas-desc-inactive{background:var(--eas-desc-d);border:1px solid var(--eas-desc-d-b);}
.eas-desc ul{list-style:disc;margin:0;padding:0 0 0 1rem;}
.eas-desc li{font-size:.72rem;line-height:1.55;color:var(--eas-bullet);}
@media(max-width:600px){.eas-cols{grid-template-columns:repeat(2,1fr);}}
</style>
<div class="eas-diagram">
<div class="eas-outer">
  <p class="eas-diag-title">Enterprise account</p>
  <div class="eas-cols">
    <div class="eas-col">
      <div class="eas-org-card">
        <div class="eas-card-header">
          <span class="eas-card-name">Sandbox</span>
          <span class="eas-card-type">Sandbox repos</span>
        </div>
        <div class="eas-card-body">
          <div class="eas-repo-pill">Repo</div>
          <div class="eas-repo-pill">Repo</div>
          <div class="eas-repo-dots">&middot;&middot;&middot;</div>
        </div>
      </div>
      <div class="eas-sec-label">Sandbox</div>
      <div class="eas-desc eas-desc-active"><ul>
        <li>Collaborative</li>
        <li>Unstructured naming</li>
        <li>Governed by broad AD groups</li>
        <li>No base read permissions</li>
        <li>Not viable for production usage</li>
        <li>No consumption services</li>
      </ul></div>
    </div>
    <div class="eas-col">
      <div class="eas-org-card">
        <div class="eas-card-header">
          <span class="eas-card-name">Green</span>
          <span class="eas-card-type">Internal repos</span>
        </div>
        <div class="eas-card-body">
          <div class="eas-repo-pill">Repo</div>
          <div class="eas-repo-pill">Repo</div>
          <div class="eas-repo-dots">&middot;&middot;&middot;</div>
        </div>
      </div>
      <div class="eas-sec-label">Innersource (Internal)</div>
      <div class="eas-desc eas-desc-active"><ul>
        <li>Majority of code here</li>
        <li>Standardized naming</li>
        <li>Base read permissions</li>
        <li>Governed by granular ALM groups</li>
        <li>Viable for production usage</li>
        <li>Topics for discoverability</li>
        <li>Consumption enabled</li>
      </ul></div>
    </div>
    <div class="eas-col">
      <div class="eas-org-card">
        <div class="eas-card-header">
          <span class="eas-card-name">Red</span>
          <span class="eas-card-type">Private repos</span>
        </div>
        <div class="eas-card-body">
          <div class="eas-repo-pill">Repo</div>
          <div class="eas-repo-pill">Repo</div>
          <div class="eas-repo-dots">&middot;&middot;&middot;</div>
        </div>
      </div>
      <div class="eas-sec-label">Restricted (Highly confidential)</div>
      <div class="eas-desc eas-desc-active"><ul>
        <li>Reduced set of repos</li>
        <li>Standardized naming</li>
        <li>Governed by granular ALM groups</li>
        <li>No base read permission</li>
        <li>Consumption enabled</li>
      </ul></div>
    </div>
    <div class="eas-col">
      <div class="eas-org-card" style="border-style:dashed;box-shadow:none;opacity:.8;">
        <div class="eas-card-header">
          <span class="eas-card-name">Archive</span>
          <span class="eas-card-type">Deprecated repos</span>
        </div>
        <div class="eas-card-body">
          <div class="eas-repo-pill" style="opacity:.5;">Repo</div>
          <div class="eas-repo-pill" style="opacity:.5;">Repo</div>
        </div>
      </div>
      <div class="eas-sec-label">Not accessible</div>
      <div class="eas-desc eas-desc-inactive"><ul>
        <li>Restricted to enterprise Admins</li>
      </ul></div>
    </div>
  </div>
</div>
</div>
</figure>

This model uses two primary organizations plus a sandbox:

- **Green organization**: The primary collaboration space, hosting roughly 90% of repositories. Set base permissions to "write" to promote innersource and empower users to propose changes. Use rulesets on the default branch to ensure that users can only propose changes, and that those proposed changes go through the defined code review and approval process.
- **Red organization**: For need-to-know repositories only. Set base permissions to "none" so teams must be explicitly added. Have a defined process for creating repositories and teams here to prevent unnecessary, self-imposed constraints.
- **Sandbox organization**: A shared space where any user can create and experiment with repositories, more visible and encouraging of collaboration than personal repositories. This is especially important if you configure GHEC to prevent developers from creating personal repositories. Define a process for moving work from sandbox into green or red organizations to ensure experiments can transition into more formal management.
- **Archive organization** (optional): Contains repositories that are no longer actively maintained. Repositories can be [transferred](https://docs.github.com/enterprise-cloud@latest/repositories/creating-and-managing-repositories/transferring-a-repository) here from other organizations. Note that transferring repositories here changes the owner/name syntax and may make finding the repository more challenging if users expect it in the original organization.

### Model 3: Portfolio company

<figure aria-label="Model 3: Portfolio company">
<style>
.omp-diagram {
  --omp-bg:#F2F5F3;--omp-ent:#E4EBE6;--omp-ent-lbl:#909692;
  --omp-cyl:#ffffff;--omp-cyl-top:#E4EBE6;--omp-str:#B6BFB8;
  --omp-repo:#0FBF3E;--omp-repo-t:#101411;
  --omp-sandbox:#BFFFD1;--omp-sandbox-t:#08872B;
  --omp-txt:#232925;--omp-cyl-lbl:#909692;
  --omp-note-bg:#F2F5F3;--omp-note-bd:#E4EBE6;--omp-note-t:#909692;
}
.dark .omp-diagram {
  --omp-bg:#101411;--omp-ent:#0A241B;--omp-ent-lbl:#8CF2A6;
  --omp-cyl:#232925;--omp-cyl-top:#1a2e1f;--omp-str:#08872B;
  --omp-repo:#0FBF3E;--omp-repo-t:#101411;
  --omp-sandbox:#08872B;--omp-sandbox-t:#BFFFD1;
  --omp-txt:#F2F5F3;--omp-cyl-lbl:#8CF2A6;
  --omp-note-bg:#232925;--omp-note-bd:#B6BFB8;--omp-note-t:#B6BFB8;
}
.omp-outer{background:var(--omp-bg);border-radius:12px;padding:1.5rem 1.5rem 1.25rem;font-family:inherit;}
.omp-enterprise{background:var(--omp-ent);border-radius:10px;padding:.75rem 1rem 1rem;display:flex;flex-direction:column;gap:.75rem;}
.omp-ent-lbl{font-size:.75rem;font-weight:600;color:var(--omp-ent-lbl);letter-spacing:.04em;text-transform:uppercase;}
.omp-bu-row{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;align-items:start;}
.omp-org-card{background:var(--omp-cyl);border:1.5px solid var(--omp-str);border-radius:10px;overflow:hidden;box-shadow:3px 3px 0 var(--omp-str);}
.omp-card-dashed{border-style:dashed;box-shadow:none;opacity:.75;}
.omp-card-header{background:var(--omp-cyl-top);padding:.45rem .6rem;border-bottom:1.5px solid var(--omp-str);}
.omp-card-name{display:block;font-size:.85rem;font-weight:700;color:var(--omp-txt);}
.omp-card-type{display:block;font-size:.68rem;color:var(--omp-cyl-lbl);margin-top:.1rem;}
.omp-card-body{padding:.5rem .6rem;display:flex;flex-direction:column;gap:.3rem;}
.omp-repo-pill{background:var(--omp-repo);color:var(--omp-repo-t);border-radius:5px;padding:.25rem .4rem;font-size:.72rem;font-weight:500;text-align:center;}
.omp-repo-dots{text-align:center;color:var(--omp-cyl-lbl);font-size:.85rem;letter-spacing:.1em;}
.omp-sandbox-row{background:var(--omp-sandbox);border-radius:8px;padding:.6rem .75rem;display:flex;align-items:center;gap:.6rem;}
.omp-sandbox-text{font-size:.82rem;font-weight:600;color:var(--omp-sandbox-t);line-height:1.4;}
.omp-sandbox-sub{font-size:.72rem;color:var(--omp-sandbox-t);opacity:.85;}
.omp-note{background:var(--omp-note-bg);border:1px solid var(--omp-note-bd);border-radius:8px;padding:.55rem .75rem;font-size:.75rem;line-height:1.5;color:var(--omp-note-t);}
@media(max-width:560px){.omp-bu-row{grid-template-columns:repeat(2,1fr);}}
</style>
<div class="omp-diagram">
<div class="omp-outer">
  <div class="omp-enterprise">
    <span class="omp-ent-lbl">Enterprise account</span>
    <div class="omp-bu-row">
      <div class="omp-org-card">
        <div class="omp-card-header">
          <span class="omp-card-name">BU Org 1</span>
          <span class="omp-card-type">Division repos</span>
        </div>
        <div class="omp-card-body">
          <div class="omp-repo-pill">Repo</div>
          <div class="omp-repo-pill">Repo</div>
          <div class="omp-repo-dots">&middot;&middot;&middot;</div>
        </div>
      </div>
      <div class="omp-org-card">
        <div class="omp-card-header">
          <span class="omp-card-name">BU Org 2</span>
          <span class="omp-card-type">Division repos</span>
        </div>
        <div class="omp-card-body">
          <div class="omp-repo-pill">Repo</div>
          <div class="omp-repo-pill">Repo</div>
          <div class="omp-repo-dots">&middot;&middot;&middot;</div>
        </div>
      </div>
      <div class="omp-org-card omp-card-dashed">
        <div class="omp-card-header">
          <span class="omp-card-name">BU Org N</span>
          <span class="omp-card-type">Division repos</span>
        </div>
        <div class="omp-card-body">
          <div class="omp-repo-pill">Repo</div>
          <div class="omp-repo-pill">Repo</div>
          <div class="omp-repo-dots">&middot;&middot;&middot;</div>
        </div>
      </div>
    </div>
    <div class="omp-sandbox-row">
      <div>
        <div class="omp-sandbox-text">Shared Sandbox</div>
        <div class="omp-sandbox-sub">Single sandbox org shared across all business units</div>
      </div>
    </div>
    <div class="omp-note">Archives: keep deprecated repositories in the primary BU org rather than a separate archive org to minimize active organization count.</div>
  </div>
</div>
</div>
</figure>

There are a few scenarios in which the red-green model may not adequately match your company's internal structures. Very large companies with tens of thousands of employees divided into relatively static business units may find this model insufficient. Also in this camp are portfolio companies with operating units that function independently of one another. These companies may also experience regular mergers, acquisitions, and divestitures.

For very large companies, map GHEC organizations to the highest-level corporate division (one level below the CEO). These will generally be divisions that are static in nature because reorganizations typically happen within these divisions, leaving the top-level structure as-is. For portfolio companies, map organizations to each business entity. Organizations can be transferred between enterprise accounts, easing merger and divestiture management.

Where possible, keep a single organization per operating unit. At most, implement a minimal red-green structure for each major division. Consider a single sandbox across all units and keeping archives in the primary organization to minimize active organization count.

{{< callout type="info" >}}
Open source projects for portfolio companies should be kept in a dedicated organization, separate from corporate organizations, to avoid security boundary issues with outside collaborators.
{{< /callout >}}

### Creating and managing organizations

For procedures on creating, transferring, and managing organizations, see [Adding organizations to your enterprise](https://docs.github.com/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-organizations-in-your-enterprise/adding-organizations-to-your-enterprise). Key governance considerations:

- Organization names must be unique across all of GitHub.com, regardless of enterprise ownership. Plan naming conventions before creation.
- When transferring an organization, ensure you have sufficient licenses to accommodate additional unique users.
- Use your identity provider for provisioning rather than manual role assignment. This applies to both new and transferred organizations.

## Teams, roles, and access governance

Teams and member roles sit at the very bottom of GHEC's structural hierarchy and provide the most fine-grained controls regarding individual member capabilities and access. It's through these components that you'll be able to most closely mirror your internal structure in GHEC.

### Inviting and assigning users to organizations

Users need to be given access to organizations in order to gain access to content. EMU enterprises assign users to organizations via IdP provisioning, while standard enterprises invite users, who must accept. The best way to manage user membership in your organizations is to add users to teams, because it allows you to use automation like [group SCIM](https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management/using-enterprise-managed-users-for-iam/managing-team-memberships-with-identity-provider-groups) (EMU) or [organization SCIM](https://docs.github.com/enterprise-cloud@latest/organizations/managing-saml-single-sign-on-for-your-organization/about-scim-for-organizations) (non-EMU) to manage organization membership.

Managing organizations through automation means you don't have to remember to remove users manually to ensure their access and license are removed if and when they leave an organization.

For non-SCIM access management, organization owners can [directly invite users](https://docs.github.com/enterprise-cloud@latest/organizations/managing-membership-in-your-organization/inviting-users-to-join-your-organization). Manual invitations expire if they are not accepted within seven days. Manually-invited users will need to be manually removed when they leave; manual invitation does not have a built-in deprovisioning process.

### User offboarding

Automate user removal by using SCIM-based deprovisioning through your IdP. As a safety net, configure the [unaffiliated users policy](https://docs.github.com/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/control-offboarding) to control what happens when a user loses all organization membership within your enterprise. Without this policy, users who are removed from all organizations may remain as enterprise members, consuming a license and retaining access to enterprise-level resources. Combine SCIM deprovisioning with the unaffiliated users policy to ensure that offboarded employees do not retain dormant access.

### Use teams to grant permissions

Grant permissions to teams rather than individuals wherever possible. Team membership can be synced with IdP groups, and creation of permission structures can be automated using [webhooks](https://docs.github.com/webhooks/about-webhooks) and the [GitHub API](https://docs.github.com/rest?apiVersion=latest).

### Enterprise roles

- **Enterprise owner**: Can access and manage all settings across the enterprise and see all members and outside collaborators for every organization.
- **Billing manager**: Can access and manage only billing settings.
- **Enterprise App manager**: Can [manage enterprise-owned GitHub App installations](https://docs.github.com/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-roles-in-your-enterprise/abilities-of-roles#app-managers) without requiring full enterprise owner privileges. Useful for delegating app governance to a platform or integrations team.

Enterprise owners can also create [custom enterprise roles](https://docs.github.com/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-roles-in-your-enterprise) with a selected set of enterprise-level permissions. Custom enterprise roles let you delegate specific administrative responsibilities without granting full enterprise owner access. This follows the same least-privilege principle as custom organization and repository roles, applied at the highest governance layer.

EMU enterprises must provision all enterprise members and administrative roles through their IdP. Standard enterprises can assign administrative roles on GitHub.com.

### Organization roles

- **Member**: The default, non-administrative role in an organization. Members have a number of permissions by default, including the ability to create repositories and project boards, although these can be changed by enterprise or organization policy.
- **Organization owner**: Complete administrative access over an organization, including full access and control over all repositories. This role should be limited to only the number of users required to support your business needs, since organization owners possess permissions for potentially destructive or sensitive actions. However, there should always be more than one organization owner in each organization for contingency purposes, in case one is unavailable, leaves, or loses access.
- **Outside collaborator**: Has access to one or more organization repositories but is not a member of the organization. Consultants or temporary employees often occupy this role. Outside collaborators are invited directly per repository using their GitHub account or email address. EMU enterprises cannot add outside collaborators because all users must be provisioned from the connected IdP.
- **Security manager**: An organization-level role that organization owners can assign to any team. When applied, it gives every member of the team permissions to manage security alerts and settings across the organization, as well as read permissions for all repositories. Useful for security teams and auditors.
- **Billing manager**: Can view and manage the billing information and settings for a specific organization. Useful in multi-organization enterprises where you might not want to grant full enterprise billing manager rights to some users.
- **GitHub App manager**: Can manage settings of [GitHub App registrations](https://docs.github.com/enterprise-cloud@latest/organizations/managing-programmatic-access-to-your-organization/adding-and-removing-github-app-managers-in-your-organization) owned by an organization, but cannot install or uninstall apps.
- **Team maintainer**: Can manage team membership and settings, like team name and avatar. Teams that use IdP groups to automate membership do not and cannot have maintainers by design, since there is a very limited scope of work for a maintainer to do when they cannot manually update user membership.

Organization owners can also create [custom organization roles](https://docs.github.com/enterprise-cloud@latest/organizations/managing-peoples-access-to-your-organization-with-roles/about-custom-organization-roles) with a specific combination of permissions. Custom roles let you elevate a user above the default Member permission set without granting full organization owner access. They are well-suited for personas with narrowly scoped administrative responsibilities, such as CI/CD administrators, audit log reviewers, or Dependabot managers. Custom organization roles apply least privilege at the organizational level in the same way custom repository roles do at the repository level.

### Repository roles and custom roles

Do not use Admin as a default repository permission. Use Read or Write as a starting point and rely on rulesets to control how code reaches protected branches. For the full set of [repository roles](https://docs.github.com/enterprise-cloud@latest/organizations/managing-user-access-to-your-organizations-repositories/repository-roles-for-an-organization) and their capabilities, see GitHub Docs.

When different levels of access are given through different routes, such as team membership and the base permissions for an organization, the highest access overrides for each specific permission. If a person has been given conflicting access, you'll see a "Mixed roles" warning on the repository access page. You do not necessarily need to resolve conflicting access. This information is there for your awareness so that the conflicting permissions do not cause confusion.

You can create up to five [custom repository roles](https://docs.github.com/enterprise-cloud@latest/organizations/managing-peoples-access-to-your-organization-with-roles/about-custom-repository-roles) per organization for more granular control. Custom repository roles inherit permissions from a default role and then add [additional permissions](https://docs.github.com/enterprise-cloud@latest/organizations/managing-peoples-access-to-your-organization-with-roles/about-custom-repository-roles#additional-permissions-for-custom-roles). After you create a custom role, anyone with admin access to a repository can assign the role to an individual or team.

## Programmatic access and integrations

GHEC offers several methods for API and command line access, and it's best practice to know the advantages, disadvantages, and limitations of each. If you intend to integrate other tools with GitHub or build automation, you will also need to extend and secure these programmatic access options using GitHub's app platforms and webhooks.

### Personal access tokens (PATs)

Use [fine-grained PATs](https://docs.github.com/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#fine-grained-personal-access-tokens) over classic PATs. Fine-grained PATs provide required expiration dates, granular scopes, and repository-level access control. Set an enterprise [policy to restrict classic PAT access](https://docs.github.com/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-personal-access-tokens-in-your-enterprise) to reduce your attack surface.

For fine-grained PATs, require [administrator approval](https://docs.github.com/enterprise-cloud@latest/organizations/managing-programmatic-access-to-your-organization/setting-a-personal-access-token-policy-for-your-organization) before tokens can access enterprise resources. This provides a governed on-ramp for automation tokens.

For repeated or long-lived API access, use a GitHub App instead of a PAT. Apps provide enterprise-level scalability, short-lived tokens, and are not tied to an individual user's account.

### SSH keys and certificate authorities

If you want to centrally manage command line access and avoid per-user PAT management, configure an [SSH certificate authority (CA)](https://docs.github.com/enterprise-cloud@latest/organizations/managing-git-access-to-your-organizations-repositories/about-ssh-certificate-authorities). CA-signed certificates do not require individual SAML authorization, which simplifies access management for larger teams. You can also require that all command line access use CA-signed SSH certificates, eliminating the need for users to manage their own keys or PATs for Git operations.

### IP allow lists

If you configure an [IP allow list](https://docs.github.com/enterprise-cloud@latest/admin/configuration/hardening-security-for-your-enterprise/restricting-network-traffic-to-your-enterprise-with-an-ip-allow-list), include the IP ranges of all installed integrations. Missing ranges will cause integrations to silently fail. EMU enterprises using OIDC must also add integration IP ranges to their IdP's [conditional access policy](https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management/using-enterprise-managed-users-for-iam/about-support-for-your-idps-conditional-access-policy) (CAP).

For GitHub-hosted Actions runners with [four or more vCPUs](https://docs.github.com/enterprise-cloud@latest/actions/using-github-hosted-runners/using-larger-runners#networking-for-larger-runners), you can receive a static IP address unique to your enterprise to add to your allow list or IdP CAP.

### GitHub Apps

If you plan to use the GitHub API in a repeated manner, it is a best practice to use an app to interact with the API instead of accessing it directly. In particular, we recommend the GitHub App framework over the OAuth framework for app integrations. GitHub Apps offer many advantages over OAuth apps and PAT-based API access, including:

- Fine-grained permissions and choice over repository access
- Short-lived tokens and enhanced security
- The ability to act independently of or on behalf of a user
- Scalable rate limits
- Built-in webhooks

GitHub also supports a robust community of pre-existing integrations using both GitHub App and OAuth interfaces. If you're looking to integrate with other tools in your development toolchain, it's likely there's already an app-based GitHub integration out there for you to install and start using.

Administrators control which apps are installed for organizations, which repositories and permissions they are granted, and can require administrator approval for installations. Enterprise owners can also [install GitHub Apps at the enterprise level](https://docs.github.com/enterprise-cloud@latest/apps/using-github-apps/installing-a-github-app-on-your-enterprise).

An enterprise-level installation makes the app available across all organizations without per-organization setup, eliminating the management burden for broadly-needed platform tools. Security scanners, compliance tooling, and developer productivity tools are common examples of apps that benefit from enterprise-level installation. Note that the 100 GitHub App installations per organization limit applies to organization-level installations; apps installed at the enterprise level are not counted against that limit.

### Webhooks

Webhooks provide a way for notifications to be delivered to an external web server whenever certain events occur on GitHub, instead of polling the API on a schedule to check if certain events have occurred. They deliver a JSON payload securely over HTTPS POST.

**On-premises webhook delivery**: As part of your GHEC deployment, you may need webhooks to send notifications to applications hosted behind your firewall. With proper network configuration, GHEC can notify these systems by implementing a form of reverse proxy, which includes a publicly routable fully-qualified domain name (FQDN) and URL rewrite and port forwarding to the appropriate application. This pattern can be implemented using off-the-shelf components from vendors like ngrok, configuring existing web servers like NGINX, or a commercial product such as a WAF or API gateway.

**Securing webhook deliveries**: When implementing a reverse proxy to handle webhook delivery, only allow inbound HTTPS traffic on port 443, restrict traffic to GitHub's [webhook IP ranges](https://api.github.com/meta), terminate SSL and inspect payloads, and ensure integrations use [webhook signatures](https://docs.github.com/developers/webhooks-and-events/webhooks/securing-your-webhooks).

**Avoid API polling**: If you are writing an integration or automation against the GitHub API, you should avoid API polling. GitHub enforces [rate limits](https://docs.github.com/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#rate-limits-for-requests-from-personal-accounts) on API activity. Regularly polling the API, especially in larger organizations, will hit the rate limit. Rather than polling on a scheduled basis, you should use webhooks to be notified of events on GitHub instead.

## Audit log operations

Whether you operate in a highly regulated industry or not, audit logs are an essential way to keep track of the various activities taking place on GHEC. From configuration changes to API access to every push or pull of code, the audit logs provide detailed records at several structural levels, and it's important to know how to access, capture, and interact with this data from the get-go.

### What audit logs include and why streaming matters

GHEC audit logs cover configuration changes, API access, and Git events at both the [enterprise](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/accessing-the-audit-log-for-your-enterprise) and [organization](https://docs.github.com/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization#accessing-the-audit-log) levels. For the full list of audited event types and retention periods, see [About the audit log for your enterprise](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/about-the-audit-log-for-your-enterprise).

Default retention is limited, so set up audit log streaming from day one. If streaming is not feasible, automate periodic exports to retain data beyond the default retention window.

### Audit log streaming

You can configure audit log streaming at the enterprise account level to ensure all data captured is held within your preferred log management system and retained in accordance with existing policies. This is one method to access Git event data. The audit log retains Git events for seven days, but provided you are streaming and pause for no more than seven days, you'll experience no loss of that data. Benefits include:

- **Data exploration**: Examine streamed events using your preferred tool for querying large quantities of data. The stream contains both audit events and Git events across the entire enterprise account.
- **Data analysis**: Streamed data is useful for ongoing large-scale analysis, such as for anomaly detection.
- **Data continuity**: You can pause the stream for up to seven days without losing any audit data.
- **Data retention**: Keep your exported audit logs and Git events data as long as you need to for reporting and audits, as well as for a quick response in case of a security incident or other urgent data need.

GitHub supports native streaming to Azure Events Hubs, Datadog, and Splunk, and can write directly to AWS S3, Azure Blob Storage, and Google Cloud Storage.

{{< callout type="warning" >}}
GitHub strongly recommends that enterprise customers set up audit log streaming or automated export to retain this critical security data beyond the default retention period.
{{< /callout >}}

### Audit log export and API

If audit log streaming won't work for you, or you need a one-time data export or a more targeted set of events, you can also use the audit log export and API options to retrieve audit log data at both the [enterprise](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/exporting-audit-log-activity-for-your-enterprise) and [organization](https://docs.github.com/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization#exporting-the-audit-log) levels. Exports provide downloadable JSON or CSV files. When you export audit log events, you can further filter your export by querying one or more of the [supported qualifiers](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/searching-the-audit-log-for-your-enterprise#search-based-on-the-action-performed) to filter for specific log events. Git events are exportable only in JSON format.

The [audit log API](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/using-the-audit-log-api-for-your-enterprise) is also available via REST. However, if your end goal is long-term monitoring and reporting on your logs, we strongly recommend using the audit log streaming option over the API. You'll avoid having to concern yourself with API authentication and rate limit constraints, and you'll be able to configure your monitoring and reporting exactly how you'd like in your data system of choice.

### Audit log configuration

By default, GHEC audit logs do not display the source IP address for events. Optionally, to ensure compliance and respond to threats, you can enable a configuration option at the [enterprise](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/displaying-ip-addresses-in-the-audit-log-for-your-enterprise) and/or [organization](https://docs.github.com/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/displaying-ip-addresses-in-the-audit-log-for-your-organization) level to display the full IP address associated with the actor responsible for each event.

Although GitHub's account terms have users agree to the collection of their IP addresses, you are responsible for meeting any legal obligations that accompany the viewing or storage of IP addresses displayed within your organization's audit log. If you use the standard user model, you will only see an IP address logged when users take actions associated with your enterprise itself, or private or internal repositories. The feature can be disabled at any time.

## Enterprise policy baselines and delegations

Configurations and policies not applied at the enterprise level are managed in each organization. This lets you manage your desired balance between centralized and distributed administration. Most policies at the enterprise level have an equivalent at the organization level, giving you control over what is enforced uniformly vs. what is delegated.

It's a best practice to review your policies and configurations with all stakeholders, including members from development, security, operations, and any other affiliated teams. You want to optimize for both the collaboration and flexibility your end users need to get their work done, as well as the compliance and security requirements you need to protect your company.

{{< callout type="info" >}}
Enterprise policy and settings require ongoing maintenance and review to make sure that they are up to date and meet the evolving needs of your organization. For more details, see [governance policies best practices]({{< relref "../governance-policies-best-practices/index.md" >}}) page.
{{< /callout >}}

## Billing, licensing, and consumption services

The enterprise account is the central point for managing all billing and licensing within GHEC, including all organizations that are part of your enterprise. It is important to review your billing configuration as one of the first steps when setting up your enterprise account. Setting up a payment method and confirming your spending limits ensures that you are ready to begin using consumption-based services like GitHub Actions, Packages, and Codespaces immediately, in line with your budgets and policies.

### User licenses

GHEC uses a unique-user licensing model, which means that GitHub counts each member or outside collaborator once for billing purposes, even if the user account has membership in multiple organizations in an enterprise or access to multiple repositories owned by your organization. You must have enough user licenses in your enterprise to continue inviting or provisioning additional users. Key rules:

**These count as a billable unique user:**

- Enterprise owner who is a member or owner of at least one organization
- Organization member, including owners
- Outside collaborator on private or internal repositories (excluding forks)
- [Dormant user](https://docs.github.com/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/managing-dormant-users)
- Anyone with a pending invitation to become an organization owner or member (non-EMU only)

**These do not count:**

- Enterprise owner or billing manager who is not a member of any organization
- Billing manager for individual organizations with no other usage
- Pending invitations for billing manager or outside collaborator on public repositories (non-EMU only)
- Suspended managed user accounts (EMU only)

### Consumption-based services

Use of consumption-based services, such as GitHub-hosted Actions runners, shared storage for GitHub Actions and Packages, and Codespaces, are billed per unit consumed. Consumption across all of your enterprise's organizations will be aggregated to a single invoice at the enterprise level. Your GHEC plan includes a flat amount of storage and usage ([entitlements](https://docs.github.com/enterprise-cloud@latest/billing/managing-billing-for-github-actions/about-billing-for-github-actions#included-storage-and-minutes)) per month. These included services are intended to help your company get started using GitHub Actions and Packages, such as by enabling simple workflow automations, supporting pilot activities, running tests of security scans, and other non-business-critical usage. If you intend to use GitHub Actions and/or Packages as part of your production DevSecOps pipelines, you should plan to set up payment and spending limits to ensure you can continue to use these services beyond the included entitlements each month.

**Payment**: You can [connect an Azure Subscription ID](https://docs.github.com/enterprise-cloud@latest/billing/managing-the-plan-for-your-github-account/connecting-an-azure-subscription) to your enterprise account to pay for any consumption-based services overages beyond your enterprise's entitlements. This is the preferred billing method over monthly invoices. The Azure subscription will be used only for billing purposes; no resources will be created or used in your Azure subscription itself. To connect your Azure subscription, you must have owner permissions to the Azure subscription and be an enterprise owner on GitHub.

**Spending limits**: Set per-service spending limits for [Actions](https://docs.github.com/enterprise-cloud@latest/billing/managing-billing-for-github-actions/managing-your-spending-limit-for-github-actions), [Packages](https://docs.github.com/enterprise-cloud@latest/billing/managing-billing-for-github-packages/managing-your-spending-limit-for-github-packages), and [Codespaces](https://docs.github.com/enterprise-cloud@latest/billing/managing-billing-for-github-codespaces/managing-the-spending-limit-for-github-codespaces). A $0 spending limit prevents any additional charges for that service, but still allows use of that service until the included entitlements are used up. You can also set your spending limit to unlimited, which will keep a service running regardless of how much is spent. The default spending limit for invoiced customers is set to unlimited, so if you would prefer to set a specific spending limit, be sure to update it.

**Reporting**: Insight into consumption services billing is provided at both the per-organization and aggregate enterprise levels. You can view monthly consumption in the user interface, or you can download granular usage reports in a CSV format. These reports are intended to be a starting point for your further analysis, chargebacks, or other more in-depth reporting.

### Cost centers

For multi-organization enterprises, [cost centers](https://docs.github.com/enterprise-cloud@latest/billing/using-the-new-billing-platform/about-the-new-billing-platform-for-enterprises) let you allocate consumption spending to specific business units independently from your organization structure. Define cost centers early, alongside your initial billing configuration, so that spending data is attributed correctly from the start. If your enterprise is billed through Azure, you can also map cost centers to separate Azure subscriptions, which simplifies chargeback reporting for finance teams. Without cost centers, consumption data is only broken down by organization, which may not align with how your business tracks budgets.

## Repository governance and visibility

Repositories host application source code and other files, and are the core construct within which developers build software. They are used to access application security metrics, CI/CD workflows, and other day-to-day activities. Just as there are controls and permissions at the enterprise and organization levels, repositories offer controls to manage issue tracking, proposed changes, and code reviews.

### Repository visibility

GHEC supports [public, internal, and private repository visibility types](https://docs.github.com/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility). Choose your default visibility carefully. Internal visibility promotes innersource by making repositories read-accessible to all enterprise members. Private visibility restricts access to explicitly assigned teams and users. EMU enterprises cannot create public repositories.

Control who can change visibility after creation. Repository administrators cannot change a repository's visibility setting unless [allowed by explicit policy](https://docs.github.com/enterprise-cloud@latest/organizations/managing-organization-settings/restricting-repository-visibility-changes-in-your-organization). Restricting visibility changes to organization owners reduces the risk of accidental exposure.

{{< callout type="warning" >}}
Changing repository visibility can have downstream effects on forking and other features. Review the [impact of a repository visibility change](https://docs.github.com/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility#about-repository-visibility-changes) before proceeding.
{{< /callout >}}

### Rulesets and mergeability

Rulesets are groups of rules that, among other things, define policies and set controls over who, when, how, and under what conditions a pull request may be merged. They can be defined at four levels: per repository, targeting a set of repositories within an organization, for an entire organization, or at the enterprise level to enforce rules across all organizations simultaneously.

Multiple rulesets can apply at one time and are evaluated using [rule layering](https://docs.github.com/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets#about-rule-layering). When conditions for mergeability are set up, it's not enough for a user to just have write access to a repository; they must also meet all of the mergeability conditions to have their pull request merge and become part of your codebase.

Enterprise-level rulesets are particularly powerful for establishing a non-bypassable governance baseline: define at the enterprise level what no organization can override, then delegate additional rule-making to organizations and repositories within that envelope. For enterprises with multiple organizations, this layered approach is the recommended pattern. The enterprise sets the baseline, and organizations customize within it.

Some of the conditions that rulesets can check include: requiring pull requests before merging, requiring status checks to pass, requiring signed commits, requiring linear history, requiring deployments to succeed, restricting creations, updates, and deletions, blocking force pushes, and [metadata restrictions](https://docs.github.com/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#metadata-restrictions), among others.

Anyone with read access to a repository can see what rulesets are actively applied to that repository at any given time, so they can check the constraint status without being given additional access, and be aware of what constraints would apply if a change were to be requested.

Rules can be set to "evaluate" mode to check how they would apply before enforcement. The [rule insights page](https://docs.github.com/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/managing-rulesets-for-a-repository#viewing-insights-for-rulesets) shows which actions would be affected.

{{< callout type="info" >}}
Branch protection rules are a legacy method of mergeability control. Rulesets are more flexible and functional and are the preferred approach going forward. For deep guidance on rulesets, see [repository rulesets best practices]({{< relref "../managing-repositories-at-scale/rulesets-best-practices.md" >}}) page.
{{< /callout >}}

### Repository settings

A few of the same settings seen at the enterprise and organization levels are available at the individual repository level, including [Actions policies](https://docs.github.com/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository), [security feature enablement](https://docs.github.com/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-security-and-analysis-settings-for-your-repository), and [forking settings](https://docs.github.com/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/managing-the-forking-policy-for-your-repository). You can also enable and disable features like [Issues](https://docs.github.com/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/disabling-issues), [GitHub Discussions](https://docs.github.com/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/enabling-or-disabling-github-discussions-for-a-repository), and [Projects](https://docs.github.com/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/disabling-project-boards-in-a-repository) per repository, which can be useful when you need to limit the use of certain repositories, such as during feature rollouts or when archiving content.

For any repository-level settings, these must be set to be more restrictive than any enterprise or organization policies or settings. For example, if your enterprise or organization policy is set to disallow any forking, you will not be able to allow forking per repository. However, if the policy for your enterprise or organization permits use of any actions, you can set a per-repository policy to only permit use of a specified list of allowed actions in that repository.

### Custom properties

Custom properties let you define a structured metadata schema for repositories. You can classify repositories by data sensitivity, team ownership, compliance scope, or any other dimension that drives governance decisions. Properties can be required, with allowed values enforced at repository creation time and monitored for drift. Custom properties can be defined at both the [organization](https://docs.github.com/enterprise-cloud@latest/organizations/managing-organization-settings/managing-custom-properties-for-repositories-in-your-organization) and [enterprise](https://docs.github.com/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-repositories-in-your-enterprise/managing-custom-properties-for-repositories-in-your-enterprise) levels. Enterprise-level custom properties apply across all organizations, ensuring a consistent metadata schema without per-organization duplication.

Custom properties are most powerful when paired with enterprise-level rulesets. You can target a ruleset to apply only to repositories with a specific property value, for example enforcing signed commits only on repositories tagged `data-classification: restricted`. This decouples policy enforcement from organizational structure: you govern repositories by what they are, not which organization they happen to live in. For detailed guidance on defining a property schema and automating governance workflows around it, see [custom properties best practices]({{< relref "../managing-repositories-at-scale/custom-properties-best-practices.md" >}}) page.

## Quick checklist

- [ ] Establish a single enterprise account for all internal work
- [ ] Choose the appropriate user access model (standard or EMU) before creating the enterprise
- [ ] Choose an organization architecture model (single, red-green-sandbox, or portfolio company) that matches your collaboration needs and compliance requirements
- [ ] Avoid mapping organizations to internal management hierarchy; use teams and repository permissions for collaboration boundaries instead
- [ ] Review all enterprise policies with development, security, and operations stakeholders
- [ ] Set intentional base permissions that balance innersource with security needs
- [ ] Configure repository creation, forking, and visibility change policies
- [ ] Set up a payment method and spending limits for consumption-based services before scaling
- [ ] Use fine-grained PATs over classic PATs; prefer GitHub Apps for repeated API access
- [ ] Sync teams with IdP groups for automated onboarding and offboarding
- [ ] Limit the organization owner role; maintain at least two owners per organization for contingency
- [ ] Use rulesets over legacy branch protection rules for mergeability controls
- [ ] Set up audit log streaming or automated export for data retention
- [ ] Verify and approve domains for email notification control
- [ ] Set Actions policies to allow enterprise actions plus selected non-enterprise actions
- [ ] Enable IP address display in audit logs if required by compliance
- [ ] Define a custom properties schema for repositories to support policy targeting and compliance reporting
- [ ] Configure enterprise-level rulesets to establish a non-bypassable governance baseline across all organizations
- [ ] Use custom enterprise and organization roles to delegate narrowly scoped responsibilities rather than granting full owner access at either level
- [ ] Review GitHub App installations and migrate broadly-needed tools to enterprise-level installation
- [ ] Enable required workflows at the enterprise level for organization-wide compliance gates and security scans
- [ ] Evaluate OIDC over SAML for EMU if using Microsoft Entra ID to leverage Conditional Access Policy integration
- [ ] Decide whether to configure SAML at the enterprise level or per organization for standard enterprises
- [ ] Configure the unaffiliated users policy to control what happens when users lose all organization membership
- [ ] Define cost centers early to align consumption spending with business unit budgets
- [ ] Evaluate enterprise teams for cross-organization access management

## Anti-patterns to avoid

- **Creating an organization for every team or project**: This fragments collaboration, multiplies administrative overhead, and impedes innersource. Use teams and repository permissions instead.
- **Using "allow all actions" without review**: Exposing your enterprise to unvetted third-party actions increases supply chain risk. Curate an allow list and reference actions by commit SHA.
- **Leaving spending limits at unlimited without monitoring**: Invoiced customers default to unlimited spending. Set explicit limits or implement monitoring to avoid unexpected charges.
- **Relying solely on manual user provisioning**: Without SCIM automation, departed employees may retain access. Automate provisioning and deprovisioning through your IdP.
- **Polling the GitHub API instead of using webhooks**: Polling wastes rate limit budget and creates unnecessary load. Use webhooks for event-driven integrations.
- **Ignoring audit log retention**: Default retention is limited. Failing to set up streaming or export means losing critical security data.
- **Granting Admin as a base permission**: This gives all members administrative access to all repositories, including destructive capabilities. Use Read or Write as a base and elevate through team assignment.
- **Switching user access models after deployment**: Migrating between standard and EMU requires migration tools and process. Choose correctly up front.
- **Installing GitHub Apps organization by organization for enterprise-wide tools**: When an app needs to operate across all organizations, use enterprise-level installation. Per-organization installation multiplies management overhead, scatters approval governance, and creates configuration drift between organizations.
- **Granting full owner access when a custom role would suffice**: Enterprise owner and organization owner access are broadly permissive. Create a custom enterprise or organization role instead, scoped to the specific capabilities that persona needs, such as audit log access, runner group management, or Dependabot administration.
- **Ignoring user offboarding**: Without a configured unaffiliated users policy and SCIM-based deprovisioning, departed users may retain dormant enterprise access or consume licenses indefinitely.

## Related guidance

- [Governance policies best practices]({{< relref "../governance-policies-best-practices/index.md" >}})
- [Repository rulesets best practices]({{< relref "../managing-repositories-at-scale/rulesets-best-practices.md" >}})
- [Custom properties best practices]({{< relref "../managing-repositories-at-scale/custom-properties-best-practices.md" >}})

## Seeking further assistance

{{% seeking-further-assistance-details %}}

## Related links

- [Best practices for enterprises](https://docs.github.com/enterprise-cloud@latest/admin/overview/best-practices-for-enterprises)
- [About enterprise accounts](https://docs.github.com/enterprise-cloud@latest/admin/overview/about-enterprise-accounts)
- [About organizations](https://docs.github.com/enterprise-cloud@latest/organizations/collaborating-with-groups-in-organizations/about-organizations)
- [About teams](https://docs.github.com/enterprise-cloud@latest/organizations/organizing-members-into-teams/about-teams)
- [About repositories](https://docs.github.com/enterprise-cloud@latest/repositories/creating-and-managing-repositories/about-repositories)
- [Identifying the best authentication method for your enterprise](https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management/managing-iam-for-your-enterprise/identifying-the-best-authentication-method-for-your-enterprise)
- [About Enterprise Managed Users](https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management/using-enterprise-managed-users-for-iam/about-enterprise-managed-users)
- [About enterprise policies](https://docs.github.com/enterprise-cloud@latest/admin/policies/enforcing-policies-for-your-enterprise/about-enterprise-policies)
- [Setting policies for your enterprise](https://docs.github.com/enterprise-cloud@latest/admin/policies)
- [About billing for your enterprise](https://docs.github.com/enterprise-cloud@latest/billing/managing-your-github-billing-settings/about-billing-for-your-enterprise)
- [About per-user pricing](https://docs.github.com/enterprise-cloud@latest/billing/managing-the-plan-for-your-github-account/about-per-user-pricing)
- [About rulesets](https://docs.github.com/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [Roles in an enterprise](https://docs.github.com/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/roles-in-an-enterprise)
- [Roles in an organization](https://docs.github.com/enterprise-cloud@latest/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization)
- [Repository roles for an organization](https://docs.github.com/enterprise-cloud@latest/organizations/managing-user-access-to-your-organizations-repositories/repository-roles-for-an-organization)
- [About custom repository roles](https://docs.github.com/enterprise-cloud@latest/organizations/managing-peoples-access-to-your-organization-with-roles/about-custom-repository-roles)
- [About programmatic access in your organization](https://docs.github.com/enterprise-cloud@latest/organizations/managing-programmatic-access-to-your-organization/about-programmatic-access-in-your-organization)
- [Managing your personal access tokens](https://docs.github.com/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [About SSH certificate authorities](https://docs.github.com/enterprise-cloud@latest/organizations/managing-git-access-to-your-organizations-repositories/about-ssh-certificate-authorities)
- [About creating GitHub Apps](https://docs.github.com/enterprise-cloud@latest/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps)
- [Enforcing policies for GitHub Actions in your enterprise](https://docs.github.com/enterprise-cloud@latest/admin/policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise)
- [About the audit log for your enterprise](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/about-the-audit-log-for-your-enterprise)
- [Streaming the audit log for your enterprise](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise)
- [Displaying IP addresses in the audit log for your enterprise](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/displaying-ip-addresses-in-the-audit-log-for-your-enterprise)
- [About custom organization roles](https://docs.github.com/enterprise-cloud@latest/organizations/managing-peoples-access-to-your-organization-with-roles/about-custom-organization-roles)
- [Managing custom roles for your enterprise](https://docs.github.com/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-roles-in-your-enterprise)
- [Managing custom properties for repositories in your enterprise](https://docs.github.com/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-repositories-in-your-enterprise/managing-custom-properties-for-repositories-in-your-enterprise)
- [Configuring OIDC for Enterprise Managed Users](https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management/using-enterprise-managed-users-for-iam/configuring-oidc-for-enterprise-managed-users)
- [About guest collaborators](https://docs.github.com/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/enabling-guest-collaborators#about-guest-collaborators)
- [Managing GitHub Apps for your enterprise](https://docs.github.com/enterprise-cloud@latest/admin/managing-github-apps-for-your-enterprise)
- [About GitHub Enterprise Cloud with Data Residency](https://docs.github.com/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency)
- [Required workflows](https://docs.github.com/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-workflows-to-pass-before-merging)
