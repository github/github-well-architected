---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
title: Setup
description: Target Environment Setup Guide
weight: 12
slug: setup
---

Configuring your GitHub Enterprise Cloud environment is a key step in preparing for migration from Azure DevOps. This guide helps you set up your repositories, teams, and integrations so your migration is efficient and reliable.

## In this guide

| Section | Description |
|---------|-------------|
| [Enterprise configuration](#enterprise-configuration) | Configure enterprise-level settings |
| [Identity management](#identity-and-access-management) | Set up authentication and access controls |
| [Azure DevOps integration](#azure-devops-integration) | Prepare for service integrations |
| [Organization structure](#organization-structure) | Design your organization framework |
| [Compliance settings](#compliance-settings) | Set up audit and compliance features |

## Progress tracker

Use this checklist to help guide your setup:

- [ ] Enterprise settings configured
- [ ] Identity provider integration completed
- [ ] Azure DevOps integration prepared
- [ ] Organizations and teams created
- [ ] Security controls implemented
- [ ] Compliance settings established
- [ ] Repository templates created
- [ ] Integrations and packages configured
- [ ] Documentation completed

## Learning resources

Before configuring your target environment, review these resources:

- **GitHub documentation**
  - [Enterprise configuration guide](https://docs.github.com/enterprise-cloud@latest/admin/configuration/configuring-your-enterprise)
  - [Identity and access management](https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management/managing-iam-for-your-enterprise)
  - [Organization security features](https://docs.github.com/enterprise-cloud@latest/organizations/keeping-your-organization-secure)
- [Essentials of administration and governance with GitHub Enterprise Cloud](https://resources.github.com/learn/pathways/administration-governance/essentials/administration-governance-github-enterprise-cloud/)
- **Microsoft Learn**
  - [GitHub administration and product features](https://learn.microsoft.com/en-us/training/paths/github-administration-products/)
  - [GitHub foundations - part 1](https://learn.microsoft.com/en-us/training/paths/github-foundations/)
  - [GitHub foundations - part 2](https://learn.microsoft.com/en-us/training/paths/github-foundations-2/)
- **Well-Architected Framework**
  - [Getting started with GitHub Well-Architected](https://wellarchitected.github.com/library/overview/getting-started-checklist/)
  - [Governance checklist](https://wellarchitected.github.com/library/governance/checklist/)
  - [Security pillar](https://wellarchitected.github.com/pillars/security/)

## Enterprise configuration

### Initial setup

Setting up proper authentication and access controls is essential for a successful migration.

- [ ] [Configure enterprise settings](https://docs.github.com/enterprise-cloud@latest/admin/configuration/configuring-your-enterprise)

  | Setting | Purpose |
  |---------|----------|
  | Policies | Ensure consistency across organizations |
  | Audit logging | Enable centralized tracking |
  | Security controls | Establish baseline protection |

- [ ] Review and configure key policies:
  - Repository creation
  - Organization permissions
  - Security requirements
  - Access controls

## Identity and access management

Identity configuration is critical for both GitHub access and Azure DevOps integration. Before proceeding, ensure you understand your identity provider and user management strategy.

- [ ] Select your authentication strategy:
  - **Individual accounts with SAML SSO**
    - Allows existing GitHub.com accounts
    - Flexible user management
  - **Enterprise managed users**
    - Complete identity lifecycle management
    - Stricter access controls
    - Users managed entirely through IdP

{{< callout type="info" >}}
GitHub Enterprise Cloud with Data Residency requires Managed Users.
{{< /callout >}}

### Provider setup

- [ ] Configure identity provider integration:
  - **[Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/active-directory/saas-apps/github-enterprise-cloud-enterprise-account-tutorial)**
  - **SCIM provisioning** for automated user management
  - **Team synchronization** to map IdP groups to GitHub teams

- [ ] Implement security controls:
  - Two-factor authentication requirements
  - Session management policies
  - Access review schedules

- [ ] Establish emergency access:
  - Recovery codes and emergency access accounts
  - Identity provider outage protocols

- [ ] Set up monitoring:
  - Authentication events
  - User provisioning
  - Identity integration health
  - API usage and rate limits

## Azure DevOps integration

{{< callout type="info" >}}
**Best Practice**: Configure Azure DevOps integrations before beginning repository migrations to maintain workflow continuity. Test connections in a non-production environment first to validate authentication and permissions.
{{< /callout >}}

### Pre-migration integration setup

- [ ] Review your [assessment findings]({{% ref path="02-source-environment-assessment.md" %}}) for Azure DevOps service dependencies
- [ ] Plan integration configuration based on your [project charter]({{% ref path="01-project-planning.md" %}}) decisions
- [ ] Test authentication methods between Azure DevOps and GitHub Enterprise Cloud
- [ ] Validate service connections and permissions before migration begins

### Azure Boards integration

If planning to maintain Azure Boards integration:

- [ ] Configure [Azure Boards app for GitHub](https://learn.microsoft.com/en-us/azure/devops/boards/github/install-github-app?view=azure-devops)
- [ ] Prepare Azure Boards connection templates
- [ ] Configure [work item linking patterns](https://learn.microsoft.com/en-us/azure/devops/boards/github/link-to-from-github?view=azure-devops)
- [ ] Define notification rules and webhook configurations
- [ ] Test work item references and commit linking

### Azure Pipelines integration

If planning to keep Azure Pipelines temporarily or permanently:

- [ ] Choose your [GitHub authentication method](https://learn.microsoft.com/en-us/azure/devops/pipelines/repos/github?view=azure-devops&tabs=yaml#access-to-github-repositories):
  - **GitHub App** (recommended) - Uses Azure Pipelines identity, supports GitHub Checks
  - **OAuth** - Uses your personal GitHub identity
  - **Personal Access Token (PAT)** - Uses your personal GitHub identity with controlled permissions
- [ ] Set up [GitHub repository connections](https://learn.microsoft.com/en-us/azure/devops/pipelines/repos/github?view=azure-devops&tabs=yaml) in Azure DevOps
- [ ] Configure [build trigger policies](https://learn.microsoft.com/en-us/azure/devops/pipelines/repos/github?view=azure-devops&tabs=yaml#ci-triggers) for GitHub repositories
- [ ] Test pipeline triggers and authentication

## Organization structure

{{< callout type="info" >}}
**Reference your assessment**: Before setting up your organization structure, review your findings from the [repository documentation]({{% ref path="02-source-environment-assessment.md#repository-documentation" %}}) and [access patterns]({{% ref path="02-source-environment-assessment.md#access-patterns" %}}) sections in your assessment.

This will help you understand how to properly structure teams and permissions based on your current Azure DevOps setup and repository organization.
{{< /callout >}}

### Organization setup

- [ ] Create organizations based on your planned structure:
  - Consider business unit alignment
  - Plan for scaling with future growth
  - Consider regulatory requirements for data segregation

- [ ] Configure [organization settings](https://docs.github.com/organizations/managing-organization-settings):
  - [Base permissions for repositories](https://docs.github.com/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/setting-base-permissions-for-an-organization)
  - [Repository creation permissions](https://docs.github.com/organizations/managing-organization-settings/restricting-repository-creation-in-your-organization)
  - [GitHub Project permissions](https://docs.github.com/organizations/managing-organization-settings/managing-base-permissions-for-projects)
  - [Team creation permissions](https://docs.github.com/organizations/managing-organization-settings/setting-team-creation-permissions-in-your-organization)
  - [Default branch naming conventions](https://docs.github.com/organizations/managing-organization-settings/managing-the-default-branch-name-for-repositories-in-your-organization)

### Team configuration

- [ ] Create [team structure](https://docs.github.com/enterprise-cloud@latest/organizations/organizing-members-into-teams/about-teams) aligned with your organization needs:
  - Independent teams for department or business units
  - Separate teams for project groups
  - Team maintainers with clearly defined roles
  - Custom team roles with appropriate permissions
  - Clear naming conventions for team organization

- [ ] Configure team membership management based on your authentication strategy:
  - **For organizations with SAML SSO**:
    - Set up [team synchronization](https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management/using-saml-for-enterprise-iam/managing-team-synchronization-for-organizations-in-your-enterprise) to map IdP groups to GitHub teams
    - Define synchronization schedules and conflict resolution policies
  - **For Enterprise Managed Users**:
    - Use [identity provider groups](https://docs.github.com/enterprise-cloud@latest/admin/managing-iam/provisioning-user-accounts-with-scim/managing-team-memberships-with-identity-provider-groups) to manage team memberships
    - Configure group assignment in your IdP
  - Test team membership automation
  - Document team management processes

## Compliance settings

### Audit configuration

- [ ] Set up [audit log streaming](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise):
  - Configure stream destination (SIEM, Cloud storage)
  - Define event filtering
  - Establish monitoring alerts
  - Test log delivery

- [ ] Configure [audit log retention](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/about-the-audit-log-for-your-enterprise):
  - Set retention period (based on compliance requirements)
  - Implement backup policies
  - Define access controls for logs
  - Create compliance reporting procedures

- [ ] Set up compliance reporting:
  - Define report schedules
  - Identify compliance stakeholders
  - Create report templates
  - Establish review procedures

### Policy configuration

- [ ] Configure [repository policies](https://docs.github.com/enterprise-cloud@latest/admin/policies/enforcing-policies-for-your-enterprise/enforcing-repository-management-policies-in-your-enterprise):
  - Visibility settings (private, internal, public)
  - Fork policies
  - Issue creation and management
  - Repository deletion/transfer restrictions
  - Prevent repository visibility changes
  - Enforce default branch naming conventions

- [ ] Configure [custom repository properties](https://docs.github.com/enterprise-cloud@latest/organizations/managing-organization-settings/managing-custom-properties-for-repositories-in-your-organization) to:
  - Categorize repositories (production/development)
  - Track regulatory compliance requirements
  - Mark business criticality levels
  - Support dynamic security enforcement

- [ ] Implement [enterprise-wide](https://docs.github.com/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/managing-policies-for-code-governance) and/or [organization-level](https://docs.github.com/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) repository rulesets for governance at scale:
  - Define common ruleset patterns for different repository types
  - Configure tag protection rules
  - Set up push protection rules
  - Require specific workflows for critical changes
  - Enforce commit signing requirements
  - Apply rulesets with custom targeting using repository properties

- [ ] Configure [Personal Access Token (PAT) policies](https://docs.github.com/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-personal-access-tokens-in-your-enterprise) to:
  - Set maximum token expiration periods
  - Enable fine-grained personal access tokens
  - Configure token access restrictions for organizations

## Repository templates

- [ ] Consider creating [repository templates](https://docs.github.com/repositories/creating-and-managing-repositories/creating-a-template-repository) for common project types:
  - Standard application templates
  - Microservice templates
  - Library and package templates
  - Documentation repositories

- [ ] Set up standard templates:
  - README templates with clear documentation standards
  - CONTRIBUTING guidelines describing workflow processes
  - Issue templates for bug reports, feature requests
  - Pull request templates with review checklists
  - Security policy files
  - Standard license files
  - Default branch configuration

## Integration and package management

### GitHub apps and integrations

- [ ] Configure external integrations, as needed:
  - Monitoring solutions
  - Deployment targets
  - Artifact repositories

### Actions and workflow configuration

{{< callout type="info" >}}
Without enabling GitHub Actions, functionality like [GitHub Copilot Coding Agent](https://docs.github.com/enterprise-cloud@latest/copilot/using-github-copilot/coding-agent/about-assigning-tasks-to-copilot) cannot work.
{{< /callout >}}

- [ ] Set up Actions environments:
  - Development, staging, production
  - Environment protection rules
  - Required reviewers
  - Deployment gates

- [ ] Consider creating Actions [reusable workflows](https://docs.github.com/actions/how-tos/sharing-automations/reusing-workflows):
  - CI build workflows
  - Test automation workflows
  - Release automation workflows
  - Security scanning workflows _(requires GitHub Code Security for private repositories)_
  - Dependency management workflows

### Package management

- [ ] Set up [GitHub Packages](https://docs.github.com/enterprise-cloud@latest/packages/learn-github-packages/introduction-to-github-packages):
  - Configure package repositories
  - Set up access controls
  - Define retention policies
  - Configure CI/CD integration

## Knowledge transfer and documentation

- [ ] Document enterprise configuration:
  - Authentication and identity management
  - Security configurations
  - Policy enforcement
  - Audit and compliance settings

- [ ] Create migration guides:
  - Developer onboarding
  - Workflow translation guides
  - Tool migration procedures
  - Integration configuration

- [ ] Establish support resources:
  - Internal knowledge base
  - Training materials
  - Troubleshooting guides
  - Escalation procedures

## Next steps

After completing your target environment setup:

1. Review the [GitHub Well-Architected Framework Security Pillar](https://wellarchitected.github.com/pillars/security/)
2. Proceed to [Migration Testing]({{% ref path="04-migration-testing.md" %}})
