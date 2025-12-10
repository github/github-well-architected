---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
title: Azure DevOps to GitHub Enterprise Migration Guide
---

This guide is your step-by-step reference for migrating from Azure DevOps to GitHub Enterprise Cloud. Each section provides practical steps, clear recommendations, and links to helpful resources—so you can move forward with confidence.

{{< callout type="info" >}}
Each page in this guide includes focused learning resources to support every phase of your migration journey.
{{< /callout >}}

## Why a Complete Migration Plan Matters

- **Strategic alignment:** Migrations are an opportunity to review workflows, branching strategies, and team structures.
- **Risk mitigation:** A well-structured plan helps prevent data loss, downtime, and security issues.
- **Long-term scalability:** A successful migration prepares your organization for future growth and innovation.

## Learning resources

Start with these foundational resources about GitHub and migration:

- **GitHub documentation**
  - [Introduction to GitHub Enterprise Cloud](https://docs.github.com/enterprise-cloud@latest/get-started/learning-about-github) – Platform overview
  - [Migration fundamentals](https://docs.github.com/enterprise-cloud@latest/migrations/overview/planning-your-migration-to-github) – Core concepts
- **Microsoft Learn**
  - [GitHub Enterprise fundamentals](https://learn.microsoft.com/en-us/training/paths/github-administration-products/) – Platform essentials
  - [Azure DevOps integration](https://learn.microsoft.com/en-us/azure/devops/cross-service/github-integration) – Integration options

## Features and interoperability

When planning a migration from Azure DevOps to GitHub, it's important to understand the differences in features and capabilities, as well as the integration options available to maintain existing Azure DevOps services if needed.

### Key Feature Comparison

#### Repositories and Code Management

- **Azure DevOps:** Supports Git and legacy TFVC repositories, with built-in code review tools.
- **GitHub:** Focuses on Git repositories, with advanced code review workflows, pull requests, and governance capabilities. GitHub's branching and merging strategies are optimized for collaborative development.
- **Integration options:** Complete repository migration with history and metadata using GitHub Enterprise Importer.

#### Work Item Tracking

- **Azure DevOps:** Azure Boards provides comprehensive work item tracking, sprint planning, and reporting features. It is highly configurable and integrates with other Azure DevOps services.
- **GitHub:** GitHub Issues and Projects offer an integrated approach to work item tracking, with templates, labels, sub-issues, issue types, and milestones.
- **Integration options:** Ability to maintain Azure Boards integration with GitHub repositories for teams that prefer Azure Boards.

#### CI/CD

- **Azure DevOps:** Azure Pipelines offers robust CI/CD capabilities, supporting multi-platform builds and deployments.
- **GitHub:** GitHub Actions provides a flexible and customizable automation platform for CI/CD.
- **Integration options:** Ability to continue using Azure Pipelines with GitHub repositories while transitioning.

#### Collaboration and Community

- **Azure DevOps:** Primarily used within organizations for private projects. While it supports public projects, the community aspect is less emphasized.
- **GitHub:** Known for its strong community and collaborative focus. GitHub hosts millions of open-source projects and has this community at its core. Features like discussions, pull requests, and issue tracking foster collaboration among developers worldwide.
- **Integration options:** Not applicable.

## Migration Journey Map

Your migration journey includes these steps:

1. [Project Planning]({{% ref path="01-project-planning.md" %}}) – _Establish your migration strategy and timeline_
2. [Source Environment Assessment]({{% ref path="02-source-environment-assessment.md" %}}) – _Analyze your current Azure DevOps setup_
3. [Target Environment Setup]({{% ref path="03-target-environment.md" %}}) – _Prepare GitHub Enterprise Cloud_
4. [Migration Testing]({{% ref path="04-migration-testing.md" %}}) – _Test and validate your migration process_
5. [Repository Migration]({{% ref path="05-repository-migration.md" %}}) – _Move your code and history_
6. [Post-Migration Activities]({{% ref path="06-post-migration.md" %}}) – _Review, optimize, and support ongoing improvements_

{{< callout type="info" >}}
Start with the Project Planning guide to establish a strong foundation for your migration journey.
{{< /callout >}}

## Getting Started

Before you begin, review these essential resources:

| Resource | Purpose |
|----------|----------|
| [GitHub Enterprise Cloud documentation](https://docs.github.com/enterprise-cloud@latest) | Platform documentation |
| [GitHub Enterprise Importer](https://docs.github.com/migrations/using-github-enterprise-importer) | Migration tool guide |
| [Azure DevOps Integration](https://learn.microsoft.com/en-us/azure/devops/cross-service/github-integration) | Integration options |
| [Well-Architected Framework](https://wellarchitected.github.com/) | Best practices |

## Seeking further assistance
<!-- The Hugo shortcode below will fully populate this section -->

{{% seeking-further-assistance-details %}}

## Migration Checklist

This checklist provides an overview of the necessary steps for migrating from Azure DevOps to GitHub Enterprise Cloud. Detailed information is provided in each section of the guide.

### Migration Tools

Compare tools at [Migration tools comparison on GitHub Docs](https://docs.github.com/enterprise-cloud@latest/migrations/overview/migration-paths-to-github)

### GitHub Enterprise Importer (GEI)

GEI is recommended for most migrations.

#### Key Benefits

| Feature | Description |
|---------|-------------|
| History | _Maintains commit history and authorship_ |
| PRs | _Migrates pull requests with review history_ |
| Work Items | _Preserves links and converts to issues_ |
| Automation | _Supports interactive and scripted migrations_ |
| Reliability | _Provides error handling and retry mechanisms_ |

> Review [GEI limitations on migrated data.](https://docs.github.com/migrations/using-github-enterprise-importer/migrating-from-azure-devops-to-github-enterprise-cloud/about-migrations-from-azure-devops-to-github-enterprise-cloud#limitations-on-migrated-data)

#### Git-based Migration

Consider this approach when:

- You only need to migrate source code
- Metadata migration is not required

### Azure DevOps Integration Options

After migrating repositories to GitHub, you can maintain integration with Azure DevOps services:

#### Azure Boards Integration

- **Work Item Linking**: Connect GitHub repositories to Azure Boards to:
  - Link commits and pull requests to work items
  - Update work item status from GitHub commits
  - View GitHub development activity in Azure Boards
  - [Configure the Azure Boards app for GitHub](https://learn.microsoft.com/en-us/azure/devops/boards/github/install-github-app)

#### Azure Pipelines Integration

- **Build and Deploy from GitHub**: Keep using Azure Pipelines with GitHub repositories:
  - Use Azure Pipelines for CI/CD while migrating gradually
  - Trigger builds from GitHub events
  - Deploy to Azure services
  - [Connect Azure Pipelines to GitHub](https://learn.microsoft.com/en-us/azure/devops/pipelines/repos/github)

### Project Planning

Find additional guidance in the [Project Planning guide]({{% ref path="01-project-planning.md" %}}).

Planning is crucial for a successful migration as it provides a structured framework to identify and address potential challenges, ensuring a smooth and efficient transition with minimal disruption to operations.

- Define the project scope, objectives, and success criteria.
- Document individuals who need to be involved or informed at different stages.
- Identify project stakeholders and decision-makers.
- Establish a project timeline with key milestones.
- Assess potential risks and develop mitigation strategies.
- Create and maintain a migration plan runbook.
- Create a comprehensive communication plan.
- Plan migration pace (e.g., all at once or phased).
- Document migration schedule for each repository.
- Identify and document the training needs for both developers and administrators.

### Assessment of Current Environment

Find additional guidance in the [Source Environment Assessment guide]({{% ref path="02-source-environment-assessment.md" %}}).

Understanding the current environment is fundamental for a successful migration. A thorough assessment provides insights into the existing usage, dependencies, and potential challenges, enabling informed decision-making and minimizing disruptions during the transition.

- Document the current organizational and team structure.
- Document inventory structure to applications and services.
  - Use the `gh ado2gh inventory-report` command to generate reports about your Azure DevOps environment, including organizations, projects, repositories, and pipelines.
- Document dependencies for repositories.
- [Assess and document existing repository data like sizes, commit history, and Git LFS usage.](https://docs.github.com/migrations/overview/planning-your-migration-to-github#building-a-basic-inventory-of-the-repositories-you-want-to-migrate)
- Document branch policies to recreate in the target environment.
- Document the current permissions and access patterns of repositories.
- Document all integrations and external tools in use.
- Document current usage patterns and workflows for transition planning.
- [Design plans for policy and governance of the target environment](https://wellarchitected.github.com/library/governance/checklist/).

### Target Environment Design and Configuration

Find additional guidance in the [Target Environment Setup guide]({{% ref path="03-target-environment.md" %}}).

Making sure that the target GitHub Enterprise Cloud environment is set up for success is critical for a successful migration process. Learn more about GitHub Enterprise Administration and Governance on [GitHub Resources](https://resources.github.com/learn/pathways/administration-governance/essentials/administration-governance-github-enterprise-cloud/) and [GitHub Well Architected](https://wellarchitected.github.com/).

- Administrators should plan for learning about GitHub Enterprise Cloud and its features.
  - [Microsoft Learn](https://learn.microsoft.com/en-us/training/paths/github-administration-products/) has options available for self-paced learning.
- Map source environment repository structures to [target organizations/repositories](https://docs.github.com/migrations/overview/planning-your-migration-to-github#designing-your-organization-structure-for-the-migration-destination).
- Plan the structure of the target environment.
- Plan for handling large files and repositories.
- Plan for handling release tags and release artifacts.
- Set up identity access in the target environment.
- Configure enterprise, organization, and team structure.
- Configure governance and policy settings.
- Conduct security assessments on the target environment.

### Migration Testing and Preparation

Find additional guidance in the [Migration Testing guide]({{% ref path="04-migration-testing.md" %}}).

Thorough testing and preparation are essential for successful migrations, as they help identify and mitigate potential issues, ensuring a smooth transition and minimizing disruptions.

- Define testing criteria and success metrics.
- Identify migration types for each repository.
- Choose migration tools ([GitHub Enterprise Importer](https://docs.github.com/migrations/using-github-enterprise-importer/migrating-between-github-products/about-migrations-between-github-products) is recommended).
- Use `gh ado2gh inventory-report` data to prioritize and batch repositories for migration:
  - Identify inactive repositories that can be archived or migrated later
  - Group repositories by size, activity level, or complexity for efficient migration planning
  - Identify repositories with potential migration challenges (large files, extensive history)
- Correct any issues on existing repository data (such as large files, commit history, metadata sizing, and Git LFS usage) based on migration method.
- [Perform dry-run migrations to identify issues.](https://docs.github.com/migrations/overview/planning-your-migration-to-github#performing-a-dry-run-migration-for-every-repository)
- Identify integration and external tools compatibility issues.
- Run pilot migrations, document and address issues.
- Configure integration and external tools with pilot migrations.
- Communicate with pilot users and gather feedback.
- Establish a process for handling migration failures.
- Validate governance and policy settings for any changes needed.
- Document readiness of the destination environment.
- Document steps to revert in case of failure.

### Repository Migration

Find additional guidance in the [Repository Migration guide]({{% ref path="05-repository-migration.md" %}}).

- Document issues encountered and resolutions.
- Freeze changes in the source environment.
- Create a dedicated migration support channel for issue resolution
- Execute the migration plan runbook.
- Track migration status and fix errors.
- [Link identity attribution](https://docs.github.com/enterprise-cloud@latest/migrations/using-github-enterprise-importer/completing-your-migration-with-github-enterprise-importer/reclaiming-mannequins-for-github-enterprise-importer) (when using GitHub Enterprise Importer).

### Post-Migration Activities

Find additional guidance in the [Post-Migration Activities guide]({{% ref path="06-post-migration.md" %}}).

Post-migration steps are crucial for a successful transition. They involve verifying data integrity, validating functionality, and addressing any issues. Thorough testing minimizes disruptions and ensures the new environment meets requirements. Additionally, it establishes best practices for ongoing maintenance and long-term success.

- Confirm repository visibility, permissions, and access controls.
- Validate migrated data.
- Convert pipelines to GitHub Actions workflows.
- Ensure CI/CD and other integrations work.
- Validate governance and policy settings for any changes needed.
- Validate compliance and auditing requirements.
- Update configurations for integrations and tools.
- Gather developer feedback and improvement suggestions.
- Monitor performance and usage.
- Conduct a post-mortem for lessons learned.
- Plan for deprecation of the source environment.
