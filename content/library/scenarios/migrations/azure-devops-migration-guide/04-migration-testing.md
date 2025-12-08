---
title: Test
description: Migration Testing Guide
weight: 13
slug: test
---

Testing your migration from Azure DevOps to GitHub Enterprise Cloud is an important step to ensure a smooth transition. This guide walks you through validating your migration, so you can identify and resolve issues early and help your team adapt with confidence.

## In this guide

| Section | Description |
|---------|-------------|
| [Test environment setup](#test-environment-setup) | Prepare test organizations and repositories |
| [Migration tool setup](#migration-tool-setup) | Install and configure required tools |
| [Testing approach](#testing-approach) | Run different types of migration tests |
| [User acceptance testing](#user-acceptance-testing) | Verify workflows with end users |
| [Operational testing](#operational-testing) | Test operational procedures |
| [Error handling](#error-handling-and-recovery) | Prepare for potential issues |
| [Documentation](#test-documentation-and-analysis) | Record findings and recommendations |

## Progress tracker

Use this checklist to help guide your migration testing:

- [ ] Test environment configured
- [ ] Migration tools installed and verified
- [ ] Dry run testing completed
- [ ] Integration testing completed
- [ ] Performance testing completed
- [ ] Data integrity validation completed
- [ ] User acceptance testing completed
- [ ] Operational testing completed
- [ ] Error handling procedures documented
- [ ] Test results documented
- [ ] Migration readiness assessment completed

## Learning resources

Before you begin, review these resources to support your migration testing:

- **GitHub documentation**
  - [Performing a test migration](https://docs.github.com/migrations/using-github-enterprise-importer/preparing-to-migrate-with-github-enterprise-importer/performing-a-test-migration-with-github-enterprise-importer)
  - [Troubleshooting migrations](https://docs.github.com/migrations/using-github-enterprise-importer/completing-your-migration-with-github-enterprise-importer/troubleshooting-your-migration-with-github-enterprise-importer)
- **Well-Architected Framework**
  - [Testing strategy](https://wellarchitected.github.com/reliability/testing/)
  - [Risk management](https://wellarchitected.github.com/reliability/risk-mitigation/)

## Test environment setup

### 1. Test organization configuration

Creating a separate test organization allows safe validation of the migration process.

- [ ] Create a test organization in GitHub Enterprise Cloud
- [ ] Configure core settings:

  | Setting | Purpose |
  |---------|----------|
  | Authentication | Match production SSO |
  | Team structure | Mirror planned hierarchy |
  | Repository settings | Test access patterns |
  | Rulesets | Validate policies |

- [ ] Configure test security controls:
  - Apply standard [repository rulesets](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
  - Enable appropriate [security scanning](https://docs.github.com/enterprise-cloud@latest/code-security) _(requires GitHub Code Security for private repositories)_
  - Configure [IP access restrictions](https://docs.github.com/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/managing-allowed-ip-addresses-for-your-organization) (if needed)
  - Set up required permissions and roles

### 2. Test data selection

Choose representative repositories that cover different migration scenarios:

| Size | Description | Purpose |
|------|-------------|----------|
| Small (<100MB) | Quick validation | Basic process testing |
| Medium (100MB-1GB) | Typical repositories | Standard scenarios |
| Large (>1GB) | Performance testing | Timeout validation |
| Historical | Extensive history | Complete history migration |
| LFS-enabled | Large files | Binary file handling |
| Multi-branch | Complex branching | Branch preservation |
| Submodules | External references | Dependency validation |
| Releases | Tagged versions | Asset and tag validation |

### 3. Data preparation requirements

Certain repository characteristics may require special handling:

- [ ] Identify repositories requiring cleanup:
  - Oversized files (>100MB) that need [Git LFS](https://docs.github.com/repositories/working-with-files/managing-large-files/about-git-large-file-storage)
  - Corrupted Git objects
  - Invalid or malformed references
  - Problematic branch names
  - Circular submodule references
  - Sensitive data in history

- [ ] Document remediation approach for each issue type
- [ ] Create cleanup scripts for automation (when possible)
- [ ] Test cleanup processes on copies before applying to source

## Migration tool setup

### 1. GitHub Enterprise Importer

```bash
# Installation
gh extension install github/gh-gei
```

- [ ] Configure required tokens:
  - **Azure DevOps Personal Access Token**:
    - Read scope for:
      - Code
      - Pull Request Threads
      - Work Items
      - Identity
  - **GitHub Personal Access Token**:
    - `repo` scope for full repository access
    - `workflow` scope for Actions
    - `admin:org` scope for organization management
    - `delete_repo` scope (if target repositories may need to be deleted and recreated)

- [ ] Verify Azure DevOps access:
  - Test repository read access
  - Confirm work item access
  - Validate identity scope permissions

- [ ] Test GitHub permissions:
  - Repository creation rights
  - Organization member management
  - Workflow management access
- [ ] Run basic commands
- [ ] Review the [limitations of GitHub Enterprise Importer](https://docs.github.com/migrations/using-github-enterprise-importer/migrating-from-azure-devops-to-github-enterprise-cloud/about-migrations-from-azure-devops-to-github-enterprise-cloud#limitations-on-migrated-data) to understand what data will be migrated

### 2. Additional tools

Prepare supplementary tools that may be needed during migration testing:

- [ ] [git-filter-repo](https://github.com/newren/git-filter-repo) for repository cleanup
- [ ] Custom migration scripts for batch operations
- [ ] Monitoring tools for tracking progress
- [ ] Webhook configuration tools for integration updates
- [ ] Data verification scripts for post-migration validation

## Testing approach

### 1. Dry run testing

- [ ] Run test migrations with `--dry-run` flag:

  ```bash
  gh gei migrate-repo azure-devops --org-url https://dev.azure.com/your-org --project your-project --repo your-repo --github-org your-github-org --dry-run
  ```

- [ ] Document and analyze:
  - Migration duration
  - Data volumes
  - Error messages
  - Warning messages

- [ ] Test with different `--wait-timeout` values:
  - Short timeout for small repositories
  - Extended timeout for large repositories
  - Determine optimal values for your repositories

- [ ] Test with different migration options:
  - `--target-repo` renaming option
  - `--visibility` settings
  - `--metadata-exclusion` settings
  - `--metadata-inclusion` settings

### 2. Integration testing

- [ ] Test Azure Boards integration (if applicable):
  - Work item linking in commits and pull requests
  - Status synchronization
  - User mapping and notifications
  - Bi-directional updates
  - Custom field handling

- [ ] Test Azure Pipelines connectivity (if applicable):
  - Authentication and triggers
  - Secret and environment variable handling
  - Status reporting
  - Cross-service authentication
  - Build definition compatibility

- [ ] Test third-party tool connections:
  - Code analysis integrations
  - Project management tools
  - Security tools
  - Communication tools (Slack, Microsoft Teams)
  - Monitoring and observability tools

### 3. Performance testing

- [ ] Document migration performance:
  - Migration duration by repository size
  - Network bandwidth requirements
  - API rate limit impact
  - Concurrent migration capacity
  - Resource utilization during migration

- [ ] Test post-migration operations:
  - Repository clone performance
  - Pull/push operation speed
  - CI/CD execution times
  - API response times
  - Web interface responsiveness

- [ ] Benchmark common operations:
  - Code search response time
  - Pull request creation and merge time
  - Build trigger and execution time
  - Issue creation and update performance
  - Web interface navigation speed

### 4. Data integrity validation

Verify that all critical data has been properly migrated:

- [ ] Compare repository contents:
  - Source code files
  - Commit count and history
  - Branch structure and names
  - Tags and releases
  - LFS objects

- [ ] Validate metadata:
  - Pull requests and comments
  - Issue content and labels
  - Milestone definitions
  - Project board structure
  - Repository rulesets

- [ ] Check user attribution:
  - Commit authorship
  - Pull request creation and reviews
  - Issue creation and comments
  - Mannequin account mapping

## User acceptance testing

- [ ] Test developer workflows:
  - Code commit and push processes
  - Branch and pull request operations
  - Code review procedures
  - CI/CD pipeline execution
  - Issue creation and management

- [ ] Test administrative functions:
  - User and permission management
  - Repository configuration
  - Security control implementation
  - Audit log access and review
  - Organization and team management

- [ ] Test access and security controls:
  - Authentication flows
  - Authorization boundaries
  - Ruleset effectiveness
  - Required status checks
  - Secret scanning alerts _(requires GitHub Secret Protection for private repositories)_

## Operational testing

### 1. Code freeze planning

- [ ] Define and test freeze procedures:
  - Freeze duration estimation
  - Exception handling process
  - Emergency change protocol
  - Communication templates
  - Verification mechanisms

- [ ] Test repository locking in Azure DevOps:
  - Validate read-only mode effectiveness
  - Verify service hook deactivation
  - Test emergency access procedures
  - Document bypass procedures for critical changes

### 2. Support channel setup

- [ ] Establish and test support infrastructure:
  - Communication channels
  - Incident management process
  - Escalation paths
  - Response time metrics
  - Status reporting mechanisms

- [ ] Create issue templates for common problems:
  - Migration failures
  - Access issues
  - Integration problems
  - Performance concerns
  - Data discrepancies

### 3. Notification systems

- [ ] Test notification mechanisms:
  - Migration status updates
  - Completion notifications
  - Error alerts
  - User communication templates
  - Management reporting

- [ ] Configure monitoring alerts:
  - Migration progress tracking
  - Error rate thresholds
  - Performance degradation alerts
  - Integration failure notifications
  - Security incident alerts

## Error handling and recovery

- [ ] Document common migration issues:
  - Large file errors
  - Rate limit problems
  - Authentication failures
  - Network timeouts
  - Permission issues
  - Metadata migration failures
  - Integration configuration errors

- [ ] Develop and test recovery procedures:
  - Rollback process
  - Data cleanup steps
  - Retry mechanisms
  - Support escalation paths
  - Emergency access procedures

- [ ] Create error resolution guides:
  - Troubleshooting flowcharts
  - Error code reference
  - Common fixes and workarounds
  - Diagnostic procedures
  - Data validation tools

## Test documentation and analysis

- [ ] Document test results for each repository:
  - Success/failure status
  - Issues encountered
  - Solutions applied
  - Performance metrics
  - Data validation summary
  - Integration test results

- [ ] Analyze patterns and compile:
  - Best practices discovered
  - Common pitfalls
  - Recommended workarounds
  - Process improvements
  - Efficiency optimizations

- [ ] Create repository-specific recommendations:
  - Pre-migration cleanup needs
  - Timeout settings
  - Special handling requirements
  - Post-migration verification steps
  - Integration configuration specifics

## Migration readiness assessment

- [ ] Evaluate technical readiness:
  - Tool effectiveness and reliability
  - Process repeatability
  - Error handling robustness
  - Performance adequacy
  - Integration functionality

- [ ] Assess team readiness:
  - Documentation completeness
  - Training effectiveness
  - Support procedure clarity
  - Communication plan adequacy
  - Escalation path understanding

- [ ] Define migration success criteria:
  - Data completeness thresholds
  - Performance benchmarks
  - Error rate tolerances
  - Integration functionality requirements
  - User acceptance metrics

- [ ] Create final migration checklist:
  - Pre-migration preparation steps
  - Migration execution procedures
  - Verification activities
  - Post-migration tasks
  - Rollback triggers and procedures

## Next steps

After completing migration testing:

1. Update your migration runbook with lessons learned
2. Schedule your production migration
3. Proceed to [Repository migration]({{% ref path="05-repository-migration.md" %}})
