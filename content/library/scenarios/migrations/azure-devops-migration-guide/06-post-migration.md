---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
title: Post-Migration
description: Post-Migration Activities Guide
weight: 15
slug: post-migration
---

This guide provides step-by-step instructions for post-migration activities after moving from Azure DevOps to GitHub Enterprise Cloud. The focus is on maintaining governance, optimizing performance, and supporting your team for long-term success.

## In this guide

| Section | Description |
|---------|-------------|
| [Repository governance](#repository-governance) | Configure rulesets, templates, and custom properties |
| [Integration verification](#integration-verification) | Verify Azure DevOps integrations and connections |
| [Team enablement](#team-enablement) | Update documentation, training, and support structures |
| [Source system retirement](#source-system-retirement) | Execute Azure DevOps deprecation and data preservation |
| [Ongoing maintenance](#ongoing-maintenance) | Establish routines, governance evolution, and metrics |

## Progress tracker

Use this checklist to help guide your post-migration activities:

- [ ] Repository governance implemented (rulesets, templates, custom properties)
- [ ] Azure DevOps integrations verified and validated
- [ ] Team documentation updated and training provided
- [ ] Support structure established with escalation procedures
- [ ] Source system deprecation plan executed
- [ ] Routine maintenance processes defined
- [ ] Success metrics and reporting established
- [ ] Governance evolution cycles implemented

## Learning resource

Before you begin, review these post-migration resources to support your work:

- **GitHub documentation**
  - [About GitHub Enterprise Cloud](https://docs.github.com/enterprise-cloud@latest/admin/overview/about-github-enterprise-cloud)
  - [Governance and policy recommendations](https://wellarchitected.github.com/library/governance/recommendations/governance-policies-best-practices/)
- **Well-Architected Framework**
  - [Governance Checklist](https://wellarchitected.github.com/library/governance/checklist/)
  - [Security Best Practices](https://wellarchitected.github.com/library/application-security/recommendations/actions-security/)
  - [Repository Rulesets](https://wellarchitected.github.com/library/governance/recommendations/rulesets-best-practices/)

## Repository governance

- [ ] Configure [repository rulesets](https://docs.github.com/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) for governance at scale:
  - Deploy enterprise or organization-level rulesets:
    - Ruleset patterns for critical branches (main, develop)
    - Tag protection rules to prevent unauthorized tag deletion
    - Push protection rules for code quality and security
    - Required status checks and mandatory workflows
    - Metadata restrictions (commit message formats, signed commits)
  - Implement security best practices:
    - Pull request requirements (minimum reviewers, dismiss stale reviews)
    - Signed commit enforcement using ruleset metadata restrictions
    - Force push restrictions and linear history requirements
    - Code owner reviews for sensitive file paths
    - Restrict bypass permissions to specific roles

- [ ] Establish standardized repository settings:
  - Create [repository templates](https://docs.github.com/repositories/creating-and-managing-repositories/creating-a-template-repository) for new projects
  - Define consistent README structure
  - [Configure default community health files](https://docs.github.com/communities/setting-up-your-project-for-healthy-contributions):
    - CONTRIBUTING guidelines
    - Issue templates
    - Pull request templates
    - Security policy
    - Code of conduct

- [ ] Apply [repository custom properties](https://docs.github.com/enterprise-cloud@latest/organizations/managing-organization-settings/managing-custom-properties-for-repositories-in-your-organization):
  - Business criticality levels (Critical, High, Medium, Low)
  - Compliance frameworks (SOC2, GDPR, HIPAA, PCI-DSS)
  - Data sensitivity classification (Public, Internal, Confidential, Restricted)
  - Environment status (Production, Staging, Development, Testing)
  - Owner team assignment and contact information
  - Security risk assessment levels

## Integration verification

If you've maintained integrations with Azure DevOps services:

### Azure Boards and Pipelines

- [ ] Verify Azure Boards integration:
  - Repository connections
  - Work item references and status updates
  - Bi-directional notifications
  - User mapping
- [ ] Validate Azure Pipelines functionality:
  - Service connection status
  - Build triggers and repository webhooks
  - Build execution and artifact publishing
  - Deployment flows

## Team enablement

### Documentation and training

- [ ] Update team documentation:
  - GitHub flow and branch strategies documentation
  - Pull request and code review processes
  - Repository structure and naming conventions
  - Issue and project management workflows
  - Security policies and compliance procedures
  - GitHub Actions workflow documentation
  - Support escalation paths and contact information
- [ ] Provide ongoing training:
  - GitHub Enterprise Cloud feature training
  - Advanced Git workflows and best practices
  - GitHub Actions for CI/CD pipeline development
  - Repository management and governance
  - GitHub API and integrations for automation
- [ ] Create knowledge bases for:
  - Common issues and solutions
  - Best practices for repositories
  - Workflow optimization techniques
  - Integration configuration guides
  - Security implementation guidance

### Support structure

- [ ] Establish internal support mechanisms:
  - Internal help resources
  - Escalation procedures with defined SLAs
  - GitHub Enterprise Support access and contact procedures
  - Regular office hours and training sessions
  - Community of practice forums and discussions
  - Troubleshooting runbooks and common issue resolution guides
- [ ] Implement feedback systems:
  - Collection mechanisms
  - Regular review cycles
  - Process improvement tracking
  - Feature request management
  - User satisfaction measurements

## Source system retirement

- [ ] Execute Azure DevOps deprecation plan:
  - Set repositories to read-only
  - Archive essential data and audit logs
  - Document system configurations
  - Remove unnecessary integrations
  - Clean up service accounts
  - Plan final decommissioning

- [ ] Preserve critical information:
  - Migration decisions and documentation
  - Custom scripts and tools
  - Configuration records
  - Incident reports and resolutions
  - Historical metrics and reports

## Ongoing maintenance

### Routine maintenance

- [ ] Establish regular maintenance routines:
  - Repository cleanup (archived repositories, unused branches, stale forks)
  - Access permission audits and user lifecycle management
  - GitHub Actions runner health and capacity monitoring
  - Audit log analysis and compliance reporting
  - Custom properties and repository metadata validation

- [ ] Define operational processes:
  - Access request workflows
  - Repository creation standards
  - Code archival procedures
  - Emergency protocols
  - Recovery procedures

### Governance evolution

- [ ] Implement governance improvement cycles:
  - Quarterly policy reviews and updates
  - Collect and analyze feedback
  - Track exceptions and adjustments
  - Monitor compliance trends
  - Update documentation and training

- [ ] Maintain compliance documentation:
  - Policy version history
  - Change justifications
  - Exception tracking
  - Audit preparation
  - Compliance reporting

### Success metrics and reporting

- [ ] Define and track key metrics:
  - Repository health metrics (commit frequency, PR merge time, active contributors)
  - Code review metrics (review coverage, time to review, quality metrics)
  - GitHub Actions performance (workflow success rates, build times, runner utilization)
  - Developer productivity metrics (time to merge, code churn, deployment frequency)
  - Cost optimization metrics (Actions minutes usage, storage consumption, licensing utilization)
  - Audit log analysis and compliance reporting
- [ ] Establish reporting cadence:
  - Weekly health checks
  - Monthly performance reviews
  - Quarterly governance assessments
  - Annual strategy alignment
  - Ad-hoc security audits

## Next steps

1. Schedule regular governance reviews
2. Plan iterative improvements
3. Monitor adoption metrics
4. Update documentation regularly
5. Collect team feedback
6. Optimize workflows based on metrics

Remember that post-migration success requires ongoing attention to governance, security, and team enablement. Regular reviews and updates of these processes ensure continued alignment with organizational goals and industry best practices.
