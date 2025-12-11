---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
title: Assess
description: Source Environment Assessment Guide
weight: 11
slug: assess
---

A thorough assessment of your current Azure DevOps environment is essential for a successful migration. This guide helps you identify what matters most so you can plan with confidence and minimize surprises.

## In this guide

| Section | Description |
|---------|-------------|
| [Azure DevOps environment analysis](#azure-devops-environment-analysis) | Evaluate current services usage |
| [Repository analysis](#repository-analysis) | Analyze code repositories for migration planning |
| [Integration inventory](#integration-inventory) | Document integration dependencies |
| [Access patterns](#access-patterns) | Map security and access controls |
| [Performance considerations](#performance-considerations) | Plan for migration performance |

## Progress tracker

Use this checklist to help guide your assessment:

- [ ] Azure DevOps services assessed
- [ ] Repository inventory created
- [ ] Integration dependencies documented
- [ ] Access controls mapped
- [ ] Performance considerations documented
- [ ] Repository categorization completed
- [ ] Compliance requirements documented
- [ ] Migration impact analysis completed

## Learning resources

Before you start, review these resources to support your assessment:

- **GitHub documentation**
  - [About migrations from Azure DevOps to GitHub Enterprise Cloud](https://docs.github.com/enterprise-cloud@latest/migrations/using-github-enterprise-importer/migrating-from-azure-devops-to-github-enterprise-cloud/about-migrations-from-azure-devops-to-github-enterprise-cloud)
  - [Building a migration inventory](https://docs.github.com/migrations/overview/planning-your-migration-to-github#building-a-basic-inventory-of-the-repositories-you-want-to-migrate)
- **Microsoft Learn**
  - [About GitHub integration with Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/cross-service/github-integration?view=azure-devops)

## Azure DevOps environment analysis

### Azure DevOps services assessment

Identify which Azure DevOps services you want to retain to ensure your teams remain productive.

#### Azure Boards assessment

- **Active projects**
  > Decide whether to keep Azure Boards integration or move to GitHub Issues.
  - [ ] Identify teams using Boards
  - [ ] Document work item types and custom fields
  - [ ] Map workflow customizations
  - [ ] List integration points with repositories
  - [ ] Catalog team dependencies on features

#### Azure Pipelines assessment

- **Pipeline configuration**
  > Plan your CI/CD migration approach and effort.
  - [ ] Document pipeline types (classic UI based vs. YAML)
  - [ ] List build and release definitions
  - [ ] Map environment configurations
  - [ ] Catalog variable groups, secrets and secure files
  - [ ] Document service connections
  - [ ] List deployment targets (consider migration alternatives if deployment groups are used)

### Integration dependencies

Please refer to the training strategy in [project planning]({{% ref path="01-project-planning.md" %}}) for assistance in training on any additional integration dependencies.

Understanding service relationships is key to maintaining workflows:

#### Work item relationships

- **Repository links**
  - [ ] Repository references _(ensures traceability)_
  - [ ] Pull request links _(preserves development history)_
  - [ ] Commit links _(maintains audit trail)_
  - [ ] Build references _(ensures CI/CD traceability)_

#### Pipeline dependencies

- **Build system links**
  - [ ] Source repositories _(maps build triggers)_
  - [ ] Artifact feeds _(ensures package continuity)_
  - [ ] External services _(identifies integration points)_
  - [ ] Environment resources _(maintains deployment capability)_

## Repository analysis

Analyzing repositories helps you plan migration batches and identify challenges early.

### Initial analysis

The GitHub Enterprise Importer (GEI) tool provides a starting point. Before running the tool, ensure you have credentials configured for Azure DevOps and GitHub:

- [Personal Access Tokens Guidance for GitHub](https://docs.github.com/migrations/using-github-enterprise-importer/migrating-from-azure-devops-to-github-enterprise-cloud/managing-access-for-a-migration-from-azure-devops#personal-access-tokens-for-github)
- [Personal Access Tokens Guidance for Azure DevOps](https://docs.github.com/migrations/using-github-enterprise-importer/migrating-from-azure-devops-to-github-enterprise-cloud/managing-access-for-a-migration-from-azure-devops#personal-access-tokens-for-azure-devops)

With configured credentials, use this command to generate an inventory report of your Azure DevOps environment:

```bash
gh ado2gh inventory-report
```

This command scans your Azure DevOps organization and generates CSV report files:

1. **orgs.csv** - Organization overview with counts of team projects, repositories, and pipelines
2. **pipelines.csv** - Pipeline definitions across team projects and repositories
3. **repos.csv** - Repository details including size, activity metrics, and pipeline usage
4. **team-projects.csv** - Team project statistics with repository and pipeline counts

{{< callout type="warning" >}}
**TFVC Repository Limitation**: Team Foundation Version Control (TFVC) repositories cannot be directly migrated to GitHub. If your Azure DevOps environment includes TFVC repositories, you'll need to either:

- Convert TFVC repositories to Git within Azure DevOps first using [git-tfs](https://docs.github.com/migrations/importing-source-code/using-the-command-line-to-import-source-code/importing-a-team-foundation-version-control-repository#migrating-with-git-tfs) or the [Azure DevOps TFVC to Git import process](https://learn.microsoft.com/en-us/azure/devops/repos/git/import-from-tfvc)
- Plan to leave TFVC repositories in Azure DevOps if conversion isn't feasible
- Archive TFVC repository content separately if the repositories are no longer active

Identify all TFVC repositories during your assessment to plan appropriate conversion or retention strategies.
{{< /callout >}}

Review these reports to:

- Identify repository sizes and activity levels
- Map pipeline dependencies
- Plan migration batches based on team projects
- Identify repositories needing special handling

### Repository documentation

- **For each repository:**
  - [ ] Repository type (Git vs. TFVC) _(identifies repositories that cannot be migrated)_
  - [ ] Size and commit history _(helps estimate migration duration)_
  - [ ] Number of branches _(identifies complexity)_
  - [ ] [Git LFS usage](https://docs.github.com/repositories/working-with-files/managing-large-files) _(plans for large files)_
  - [ ] External dependencies _(ensures system functionality)_
  - [ ] Branch protection rules _(maintains code quality)_
  - [ ] Release tags and artifacts _(preserves release history)_
  - [ ] Pull requests and issues _(for preserving development context)_
  - [ ] Wiki content _(for documentation preservation)_
  - [ ] Submodule usage _(requires special handling)_
  - [ ] Repository hooks and webhooks _(identifies automation)_

### Integration inventory

Understanding your integration landscape ensures business processes remain functional:

- [ ] Document current integrations:
  - CI/CD pipelines - Ensures build and deployment processes continue
  - External services - Maps third-party tools that need reconfiguration
  - Webhooks - Identifies automation that needs updating
  - Service connections - Maps authentication that needs to be recreated
  - [Azure Boards linkages](https://learn.microsoft.com/en-us/azure/devops/boards/github/) - Maintains work item tracking functionality

### Access patterns

Security and access control mapping ensures uninterrupted team productivity:

- [ ] Document current access controls:
  - User roles and permissions - Maintains security posture in GitHub
  - Service accounts - Ensures automation continues functioning
  - [Microsoft Entra ID integration settings](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/access-with-azure-ad) - Plans identity management transition
  - IP allow lists - Maintains network security policies
  - Security policies - Ensures compliance requirements are met

## Analysis and planning

Strategic categorization helps optimize the migration process:

### Repository categorization

- [ ] Categorize repositories by:
  - Activity level (active/inactive) - Prioritizes critical repositories
  - Size (small/medium/large) - Plans migration batches efficiently
  - Complexity (simple/complex) - Estimates effort and identifies risks
  - Migration priority (high/medium/low) - Creates logical migration sequence
  - Required features (LFS, Actions, etc.) - Ensures necessary GitHub features are enabled
  - Business criticality - Identifies repositories needing additional security

### Integration assessment

- [ ] For each integration:
  - Document GitHub equivalent
  - Plan migration approach
  - Identify potential challenges
  - Estimate effort required
  - Document API usage and potential rate limit impacts

### Access control mapping

Use this table to map your Azure DevOps permissions to their GitHub equivalents:

| Azure DevOps | GitHub |
|--------------|--------|
| Project Collection Administrators | [Organization Owner](https://docs.github.com/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization) |
| Project Administrators | [Repository Admin role](https://docs.github.com/organizations/managing-user-access-to-your-organizations-repositories/repository-roles-for-an-organization) via [Organization Teams](https://docs.github.com/organizations/organizing-members-into-teams/about-teams) |
| Contributors | [Repository Write role](https://docs.github.com/organizations/managing-user-access-to-your-organizations-repositories/repository-roles-for-an-organization) via [Organization Teams](https://docs.github.com/organizations/organizing-members-into-teams/about-teams) |
| Readers | [Repository Read role](https://docs.github.com/organizations/managing-user-access-to-your-organizations-repositories/repository-roles-for-an-organization) via [Organization Teams](https://docs.github.com/organizations/organizing-members-into-teams/about-teams) |
| Branch Policies | [Repository Rulesets](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) |

{{< callout type="info" >}}
With GitHub Enterprise Cloud, you can create [custom repository roles](https://docs.github.com/enterprise-cloud@latest/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/about-custom-repository-roles) for more granular permission control beyond the standard Read, Triage, Write, Maintain, and Admin roles.

This can be particularly useful for complex Azure DevOps permission structures that don't map cleanly to the built-in GitHub roles.
{{< /callout >}}

#### Mapping checklist

- [ ] Map Project Collection Administrators to Organization Owners
- [ ] Create GitHub teams for Project Administrators with Admin repository role
- [ ] Create GitHub teams for Contributors with Write repository role
- [ ] Create GitHub teams for Readers with Read repository role

## Compliance and security

Understanding your security and compliance requirements ensures your GitHub environment maintains or enhances your security posture:

### Security requirements

- [ ] Document security requirements:
  - Authentication methods - Ensures proper identity management transition
  - Authorization policies - Maintains access control consistency
  - [IP allow lists](https://docs.github.com/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/managing-allowed-ip-addresses-for-your-organization) - Preserves network security boundaries
  - [Secret scanning](https://docs.github.com/enterprise-cloud@latest/code-security/secret-scanning/about-secret-scanning) - Enhances security with GitHub's advanced capabilities _(requires GitHub Secret Protection for private repositories)_
  - [Code scanning](https://docs.github.com/enterprise-cloud@latest/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning) - Leverages GitHub's security features _(requires GitHub Code Security for private repositories)_
  - Security notifications - Ensures proper alerting workflows

### Compliance assessment

- [ ] Review compliance requirements:
  - Audit logging needs - Ensures regulatory compliance continuity
  - Retention policies - Maintains data governance requirements
  - Access controls - Preserves security compliance
  - [Security hardening](https://docs.github.com/enterprise-cloud@latest/admin/configuration/hardening-security-for-your-enterprise) - Implements GitHub security best practices
  - Approval workflows - Maintains governance controls

## Migration impact analysis

Understanding impact helps minimize disruption and plan proper support:

### Team impact

- [ ] Assess impact on:
  - Development workflows - Plans for workflow transitions and training needs
  - Review processes - Ensures code quality practices are maintained
  - Release procedures - Maintains reliable deployment processes
  - Documentation practices - Updates process documentation appropriately
  - Daily activities - Minimizes developer productivity disruption

### Tool impact

- [ ] Evaluate impact on:
  - Build systems - Ensures continuous integration remains functional
  - Deployment processes - Maintains reliable delivery pipelines
  - Testing frameworks - Preserves quality assurance processes
  - Monitoring tools - Maintains system observability
  - Dependencies management - Ensures proper package access

### Timeline impact

- [ ] Consider impact of:
  - Repository sizes - Determines migration batch planning
  - Number of repositories - Influences overall timeline
  - Integration complexity - Affects setup and testing duration
  - Team availability - Plans around team schedules and commitments
  - Freeze periods - Accommodates business requirements

## Performance considerations

Understanding performance factors helps optimize the migration process:

### API and rate limits

- **Service boundaries**
  - [ ] [GitHub API rate limits](https://docs.github.com/enterprise-cloud@latest/rest/overview/rate-limits-for-the-rest-api) _(plans migration pace)_
  - [ ] [Azure DevOps API rate limits](https://learn.microsoft.com/en-us/azure/devops/integrate/concepts/rate-limits?view=azure-devops) _(prevents interruptions)_
  - [ ] Concurrent migration capacity _(optimizes throughput)_
  - [ ] Migration tool throttling _(ensures reliability)_
  - [ ] Network bandwidth requirements _(especially for large repositories)_

### Migration scale planning

- **Execution strategy**
  - [ ] Repository batch sizing _(optimizes efficiency)_
  - [ ] Migration scheduling _(minimizes business impact)_
  - [ ] Team coordination _(ensures smooth transition)_
  - [ ] Rollback windows _(provides safety nets)_
  - [ ] Clone and push operation performance _(especially for large repos)_

- **Batch planning**
  - [ ] Group repositories with similar characteristics
  - [ ] Plan for small validation batches first
  - [ ] Accommodate team dependencies in batching
  - [ ] Schedule high-priority repositories early
  - [ ] Allow buffer time between batches for issue resolution

## Next steps

After completing your environment assessment:

1. Review the [GitHub Well-Architected Framework](https://wellarchitected.github.com/library/governance/checklist/) for governance planning
2. Proceed to [Target Environment Setup]({{% ref path="03-target-environment.md" %}}) to prepare your GitHub Enterprise Cloud environment

{{< callout type="info" >}}
Use the inventory report data to create a migration timeline that minimizes disruption to active development work.
{{< /callout >}}
