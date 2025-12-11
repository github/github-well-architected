---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
title: Migrate
description: Repository Migration Guide
weight: 14
slug: migrate
---

This guide provides step-by-step instructions for migrating from Azure DevOps to GitHub Enterprise Cloud. The focus is on maintaining repository integrity, keeping your team informed, and ensuring your workflows continue to run smoothly.

## In this guide

| Section | Description |
|---------|-------------|
| [Pre-migration checklist](#pre-migration-checklist) | Preparation and verification steps |
| [Learning resources](#learning-resources) | Essential documentation and guides |
| [Migration execution](#migration-execution) | Step-by-step migration process |
| [Azure DevOps integration](#azure-devops-integration-implementation) | Configure Azure DevOps connections |
| [Developer transition](#developer-transition) | Developer access and workflow changes |

## Progress tracker

Use this checklist to help guide your migration:

- [ ] Final verification (environment readiness and test completion)
- [ ] Communication plan (stakeholder notifications and timing)
- [ ] Source environment (repository freeze and backup)
- [ ] Migration (repository transfer execution)
- [ ] Data integrity (content and history verification)
- [ ] Mannequins (user identity mapping)
- [ ] Security (GitHub security controls)
- [ ] Integrations (service connections and webhooks)
- [ ] Team access (repository permissions and SSH keys)

## Learning resources

Before you begin, review these migration-specific resources to support your work:

- **GitHub documentation**
  - [Migrating repositories with GitHub Enterprise Importer](https://docs.github.com/migrations/using-github-enterprise-importer/migrating-repositories-with-github-enterprise-importer/migrating-repositories-with-github-enterprise-importer)
  - [Reclaiming mannequins](https://docs.github.com/migrations/using-github-enterprise-importer/completing-your-migration-with-github-enterprise-importer/reclaiming-mannequins-for-github-enterprise-importer)
  - [Troubleshooting your migration](https://docs.github.com/migrations/using-github-enterprise-importer/completing-your-migration-with-github-enterprise-importer/troubleshooting-your-migration-with-github-enterprise-importer)

## Pre-migration checklist

### Final verification

- [ ] Verify target environment readiness:

  | Component | Purpose | Status |
  |-----------|---------|---------|
  | [Authentication](https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management) | Immediate user access | |
  | [Teams and permissions](https://docs.github.com/organizations/organizing-members-into-teams/about-teams) | Prevent access issues | |
  | [Repository policies](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) | Security compliance | |
  | [Integration settings](https://docs.github.com/enterprise-cloud@latest/get-started/exploring-integrations/about-using-integrations) | Service continuity | |
  | [Repository rulesets](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) | Code integrity | |
  | [Audit logging](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/about-the-audit-log-for-your-enterprise) | Compliance tracking | |

- [ ] Perform environment validation tests:
  - Confirm user access and permissions using test accounts
  - Verify security controls using security simulations
  - Test integrations with sample data flows
  - Run sample workflows to confirm CI/CD readiness
  - Validate repository template functionality
  - Confirm audit logging configuration

### Communication plan

- [ ] Share detailed migration timeline with all stakeholders. Example:

  ```mermaid
  gantt
    title Migration schedule
    dateFormat  YYYY-MM-DD
    section Preparation
    Announce migration    :a1, 2025-04-15, 1d
    Team assignments     :a2, after a1, 3d
    Freeze period       :a3, after a2, 1d
    section Migration
    Execute migration   :a4, after a3, 2d
    Validation         :a5, after a4, 1d
    Identity mapping   :a6, after a5, 2d
    section Transition
    Training           :a7, after a4, 3d
    Support period     :a8, after a5, 5d
  ```

- [ ] Communicate critical information:
  - Expected timing for each repository migration
  - Expected downtime for each system
  - Emergency contacts for migration issues
  - Rollback procedures and triggers
  - Support channels during and after migration
  - Training resources for new workflows
  - Documentation on new processes

- [ ] Establish communication cadence:
  - Pre-migration briefing (1 day before)
  - Migration day status updates (every 2 hours)
  - Post-migration summary (end of day)
  - Issue resolution updates (as needed)
  - Success confirmation (after validation)

## Migration execution

### Source environment preparation

- [ ] Enable read-only mode for affected repositories:
  - Configure Azure DevOps repositories as read-only
  - Disable build triggers in Azure Pipelines
  - Pause integration services and webhooks
  - Document current active branches for verification

- [ ] Take final backup of repositories for rollback if needed:
  - Clone repositories with all branches and tags
  - Archive Azure DevOps project configurations
  - Export pipeline definitions and variable groups
  - Capture current access control settings
  - Document active work items and their states

- [ ] Record key Azure DevOps settings:
  - Branch policies and protection rules
  - Security settings and access controls
  - Build definitions and triggers
  - Release pipelines and environments
  - Service connections and credentials
  - Work item process templates

### Repository migration

Execute the migration using GitHub Enterprise Importer. For complete instructions, see [Migrating repositories from Azure DevOps to GitHub Enterprise Cloud](https://docs.github.com/migrations/using-github-enterprise-importer/migrating-from-azure-devops-to-github-enterprise-cloud/migrating-repositories-from-azure-devops-to-github-enterprise-cloud).

```bash
# Basic migration command (all parameters are required)
gh ado2gh migrate-repo --ado-org your-org --ado-team-project your-project --ado-repo your-repo --github-org your-github-org --github-repo your-repo

# Common options
# --target-repo-visibility private     # Set visibility: public, private, or internal (defaults to private)
# --queue-only                         # Only queue the migration, don't wait for completion
# --verbose                            # Show detailed output
```

{{< callout type="info" >}}
By default, `gh ado2gh migrate-repo` will run the migration and wait for completion. For large repositories, this may take several hours. Use `--queue-only` to queue the migration and check status separately with `gh ado2gh wait-for-migration`.
{{< /callout >}}

- [ ] Monitor migration progress and review logs:
  - Check the "Migration Log" issue automatically created in each migrated repository
  - Download migration logs for offline analysis using `gh ado2gh download-logs --github-target-org your-org --target-repo your-repo --migration-log-file migration.log` (see [Accessing your migration logs](https://docs.github.com/migrations/using-github-enterprise-importer/completing-your-migration-with-github-enterprise-importer/accessing-your-migration-logs-for-github-enterprise-importer))
  - Review migration warnings for data that didn't migrate as expected
  - Track completion times for performance benchmarking
  - Keep stakeholders informed of progress
  - Capture performance metrics for future planning

- [ ] Handle migration errors:
  - Review error logs to identify patterns
  - Address issues based on troubleshooting guide
  - Use `gh ado2gh abort-migration` to cancel problematic migrations if needed
  - Retry failed migrations after corrective action
  - Document workarounds for persistent issues
  - Escalate critical blockers to support channels
  - Update runbooks with solutions to common problems

### Verification

Verify the data and state of migrated repositories:

- [ ] Repository content:
  - All branches present (compare branch count)
  - Commit history complete (validate commit counts)
  - Tags present (check tag presence)
  - Code security maintained (validate access controls)

- [ ] Metadata:
  - Pull requests (check status, comments, and work item links)
  - Comments and reviews (check completeness)
  - Labels and milestones (verify definitions)
  - User attribution (review mannequins for reclamation)

- [ ] Repository settings:
  - Visibility (private/public/internal)
  - Access controls and permissions
  - Security scanning settings _(requires GitHub Code Security for private repositories)_
  - Webhooks configured correctly
  - Default branch name and merge settings

- [ ] Test core workflows:
  - Repository cloning and fetching
  - Branch creation and pushing
  - Pull request creation and merging
  - GitHub Actions workflow execution
  - Issue creation and management
  - Code search functionality

- [ ] Test critical integrations:
  - Azure DevOps connections
  - Authentication systems
  - Required third-party tools
  - Essential webhooks
  - Core automation

### Mannequin reclamation

After successful migration, you'll need to map migrated users (represented by mannequins) to their GitHub identities:

- [ ] Review mannequin accounts in the migrated repository:
  - Check the "Migration Log" issue in the migrated repository for mannequin information
  - Generate a CSV file of mannequins using `gh ado2gh generate-mannequin-csv`
  - Review mannequins directly in the GitHub UI under repository settings

- [ ] [Reclaim mannequins](https://docs.github.com/migrations/using-github-enterprise-importer/completing-your-migration-with-github-enterprise-importer/reclaiming-mannequins-for-github-enterprise-importer):

  **Important prerequisites:**
  - Users must be granted access to the organization before mannequins can be reclaimed
  - For Enterprise Managed Users, use `--skip-invitation` flag
  - For standard organizations, users will receive an email invitation to accept

  ```bash
  # Create a CSV mapping file with this format:
  # mannequin-user-login,target-user-login
  # mannequin_1,actual_username_1
  # mannequin_2,actual_username_2

  # For Enterprise Managed Users:
  gh ado2gh reclaim-mannequin --github-org your-org --github-repo your-repo --csv mapping.csv --skip-invitation

  # For standard organizations:
  gh ado2gh reclaim-mannequin --github-org your-org --github-repo your-repo --csv mapping.csv
  ```

- [ ] Validate mannequin reclamation:
  - Verify attribution appears correctly in the UI
  - Check pull request authorship
  - Review remaining unclaimed mannequins

## Azure DevOps integration implementation

### Azure Boards implementation

- [ ] Install the Azure Boards GitHub app
  1. Navigate to the Azure DevOps project
  2. Go to Project Settings > GitHub connections
  3. Select "GitHub" and follow the authorization flow
  4. Choose the GitHub organization and repositories to connect

- [ ] Connect the repositories to Azure Boards
  - Link GitHub repositories to Azure Boards project
  - See [Link to work items from GitHub](https://learn.microsoft.com/azure/devops/boards/github/link-to-from-github?view=azure-devops) for detailed guidance

- [ ] Test the integration by linking commits and pull requests to work items
  - Create test work items in Azure Boards
  - Reference them in GitHub commits and pull requests
  - Verify bi-directional updates
  - Confirm status changes propagate correctly

### Azure Pipelines implementation

- [ ] Configure service connections to GitHub repositories
  1. In Azure DevOps, navigate to Project Settings > Service connections
  2. Create a new GitHub service connection
  3. Configure authentication (OAuth or PAT)
  4. Set appropriate permissions and scopes
  5. Test the connection with a simple pipeline

- [ ] Update pipeline definitions for the new source locations
  - Modify YAML pipelines to reference GitHub repositories
  - Update classic pipelines to use GitHub sources
  - Configure CI triggers for GitHub events
  - Set up pull request validation pipelines
  - Update environment deployment approvals

- [ ] Set up build triggers for [GitHub events](https://docs.github.com/actions/reference/events-that-trigger-workflows)
  - Configure branch and path filters as needed
  - Define additional triggers based on your workflow requirements

- [ ] Validate pipeline execution and deployment
  - Run test builds from GitHub source
  - Verify artifacts are generated correctly
  - Test deployment to target environments
  - Validate status reporting back to GitHub
  - Check webhook functionality

## Developer transition

### Developer access

- [ ] Verify team member access to repositories
  - Confirm all developers have appropriate permissions
  - Validate team membership sync from IdP
  - Test repository visibility to authorized users
  - Verify required review assignments
  - Check custom role assignments

- [ ] Test authentication methods (SSH/HTTPS)
  - Verify SSH key configurations
  - Test HTTPS access with appropriate credentials
  - Validate personal access token scopes
  - Configure credential helpers if needed
  - Document authentication requirements

- [ ] Update Git remote URLs:

  ```bash
  git remote set-url origin https://github.com/org/repo.git
  ```

  - Provide command templates for all repositories
  - Consider providing a script for bulk updates
  - Document branch tracking configuration
  - Update CI/CD references to repositories
  - Update external tool references

### Developer workflow

- [ ] Clear cached credentials
  - Provide instructions for different operating systems
  - Document Git credential manager configuration
  - Address common credential issues
  - Update team password managers if needed

- [ ] Update internal documentation
  - Workflow diagrams and procedures
  - Code review guidelines
  - Branch naming conventions
  - Commit message standards
  - Release processes
  - Security practices

- [ ] Provide command reference for common Git operations
  - Branch creation and management
  - Pull request workflows
  - Commit signing procedures
  - Issue linking syntax
  - GitHub CLI commands

## Next steps

After completing the repository migration:

1. Verify all repositories are accessible and functioning
2. Ensure mannequins have been properly reclaimed
3. Confirm critical integrations are working
4. Proceed to [Post-migration activities]({{% ref path="06-post-migration.md" %}})
