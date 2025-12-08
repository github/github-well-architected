---
title: Plan
description: Project Planning Guide
weight: 10
slug: plan
---

A successful migration from Azure DevOps to GitHub Enterprise Cloud requires teamwork, clear goals, and a thoughtful approach. This guide helps you build a structured plan so your migration is smooth, secure, and sets your team up for long-term success.

## In this guide

| Section | Description |
|---------|-------------|
| [Project charter](#project-charter) | Define your objectives, scope, and what success looks like |
| [Integration strategy](#integration-strategy) | Decide which Azure DevOps services to keep in the process |
| [Migration timeline](#migration-timeline) | Plan your project phases and key milestones |
| [Risk management](#risk-management) | Identify potential risks and mitigation strategies |
| [Communication plan](#communication-plan) | Establish clear communication channels and schedules |
| [Training strategy](#training-strategy) | Prepare teams for the new environment |

## Progress tracker

Use this checklist to help guide your planning:

- [ ] Project charter completed
- [ ] Stakeholders identified
- [ ] Integration strategy determined
- [ ] Migration timeline established
- [ ] Risk management plan created
- [ ] Communication plan developed
- [ ] Training strategy defined
- [ ] Developer readiness criteria established
- [ ] Resource planning completed

## Learning resources

Before you begin, review these resources to support your planning:

- [Planning your migration](https://docs.github.com/migrations/overview/planning-your-migration-to-github)

## Project charter

### Define objectives and scope

- [ ] Document migration goals:

  | Goal | Purpose |
  |------|----------|
  | Repository consolidation | Streamline source control |
  | Collaboration improvements | Enhance team efficiency |
  | Integration requirements | Maintain business continuity |
  | Security and compliance | Ensure governance |

- [ ] Define project boundaries:
  - **Repositories**: Which code and artifact repositories are making the move?
  - **Teams**: Who will be impacted: development teams, users, and stakeholders?
  - **Timeline**: What is the project duration and what are the key dates?
  - **Features**: What needs to come over: history, pull requests, work items, boards, pipelines?

- [ ] Establish success metrics:
  - Data integrity (100% code preservation)
  - Performance (speed, system response)
  - Integration availability
  - User adoption

- [ ] Define developer readiness criteria:
  - **Productivity metrics**: Developer workflow completion times, successful repository operations
  - **Competency checkpoints**: Training completion rates, hands-on assessment scores
  - **Adoption indicators**: Active users on GitHub, pull request workflows
  - **Support metrics**: Help desk ticket volume, resolution times for GitHub-related issues
  - **Integration proficiency**: Successful use of Azure DevOps integrations, CI/CD pipeline operations

- [ ] Document out-of-scope items:
  - Legacy system maintenance
  - Optional feature migrations
  - Non-critical integrations

### Integration strategy

Decide which Azure DevOps services to keep using after migrating repositories to GitHub:

- [ ] **Azure Boards decision**:
  - [ ] Continue using Azure Boards for work item tracking
  - [ ] Migrate to GitHub Issues and Projects
  - [ ] Use hybrid approach (Azure Boards + GitHub Issues)
  - Consider: Teams requiring continued access, work item linking requirements, process template dependencies, cross-repository relationships

- [ ] **Azure Pipelines decision**:
  - [ ] Continue using Azure Pipelines for CI/CD
  - [ ] Migrate to GitHub Actions
  - [ ] Use hybrid approach (Azure Pipelines + GitHub Actions)
  - Consider: Release pipeline handling, service connection management, secrets and variables strategy

- [ ] **Other services**:
  - [ ] Azure Artifacts (package management)
  - [ ] Azure Test Plans (testing)
  - [ ] Azure DevOps Extensions and integrations

### Stakeholder management

- [ ] Identify key stakeholders:
  - Executive sponsor
  - Project manager
  - Technical leads
  - Team representatives
  - Security and compliance teams
  - Application owners
  - Change managers

- [ ] Create a RACI matrix for clear roles
- [ ] Schedule regular stakeholder meetings
- [ ] Document individuals who need to be involved at different stages

## Migration timeline

### Project phases

- [ ] **Source Environment Assessment**
  - Azure DevOps services analysis
  - Repository inventory and analysis
  - Integration dependencies mapping
  - Access patterns documentation
  - Performance and compliance considerations

- [ ] **Target Environment Setup**
  - GitHub Enterprise Cloud configuration
  - Organization and team structure
  - Security and compliance settings
  - Integration setup and testing

- [ ] **Migration Testing**
  - Test environment preparation
  - Pilot migration execution
  - Integration validation
  - Team workflow testing
  - Issue identification and resolution

- [ ] **Repository Migration**
  - Pre-migration preparations
  - Repository migration execution
  - Integration updates
  - Team communication and coordination

- [ ] **Post-Migration Activities**
  - Repository governance implementation
  - Performance optimization
  - Team support and training
  - Cleanup and validation

### Key milestones

- [ ] Source environment assessment complete
- [ ] Target environment configured and ready
- [ ] Migration testing successful
- [ ] Team training and readiness validated
- [ ] Repository migrations completed
- [ ] Integrations updated and verified
- [ ] Post-migration governance implemented
- [ ] Team fully operational on GitHub

## Risk management

- [ ] Identify common risks:
  - Data loss during migration (data which is not planned to be migrated)
  - Integration failures
  - Developer change management
  - Timeline delays
  - Resource constraints
  - Compliance issues

- [ ] Develop mitigation strategies:
  - Detailed backup plans
  - Rollback procedures
  - Contingency plans
  - Monitoring and alerting
  - Resource allocation buffers

## Communication plan

Clear, proactive communication keeps everyone aligned and reduces surprises:

- [ ] Establish communication infrastructure:
  - Dedicated migration support channel
  - Migration status dashboard
  - Regular update meetings
  - Escalation paths

- [ ] Define communication schedule:
  - Initial announcement
  - Training notifications
  - Migration timeline updates
  - Go-live communications
  - Post-migration support
  - Freeze period reminders

- [ ] Create communication templates for:
  - Expected timing
  - Expected downtime
  - Emergency contacts

## Training strategy

{{< callout type="info" >}}
If you need help with training content and material, please contact either [GitHub Professional Services](https://github.com/services#services-contact), your Microsoft account team and check the [Enterprise Skills Initiative](https://esi.microsoft.com/), or a GitHub authorized partner.
If you're unsure, please contact your GitHub account representative or [GitHub Support](https://support.github.com/) for assistance.
{{< /callout >}}

Help your administrators and developers feel confident in the new environment and ensure comprehensive readiness:

- [ ] Administrator training plan:
  - [GitHub Administration Fundamentals](https://learn.microsoft.com/training/paths/github-administration-products/)
  - [GitHub Enterprise Cloud administration](https://github.com/services/admin-training-github-enterprise-cloud)
  - Security best practices
  - Audit logging and compliance monitoring

- [ ] Developer training plan:
  - [Git fundamentals review](https://learn.microsoft.com/training/paths/github-foundations/)
  - [GitHub workflow training](https://learn.microsoft.com/training/paths/github-foundations-2/)
  - GitHub Actions for Azure DevOps users
    - [Introduction to Actions](https://learn.microsoft.com/training/modules/introduction-to-github-actions/)
    - [Building Continuous Integration with Actions](https://learn.microsoft.com/training/modules/github-actions-ci/)
  - [Azure DevOps Board → GitHub integration workflows](https://learn.microsoft.com/azure/devops/boards/github/?view=azure-devops)
  - Integration tools training (third-party CI/CD, monitoring, code quality tools)
  - Security awareness

- [ ] Azure DevOps integration-specific training:
  - **Azure Boards integration**: Training on linking GitHub commits and pull requests to Azure Boards work items
    - [Documentation](https://learn.microsoft.com/azure/devops/boards/github/link-to-from-github?view=azure-devops)
  - **Azure Pipelines integration**: Training on GitHub repository authentication and build triggers
    - [Documentation](https://learn.microsoft.com/azure/devops/pipelines/repos/github?view=azure-devops&tabs=yaml)
  - **Workflow transitions**: Training on moving between Azure DevOps and GitHub interfaces
  - **Cross-platform processes**: Training on managing work across both platforms during integration periods

- [ ] Developer readiness validation:
  - Hands-on workshops with test repositories
  - Integration workflow demonstrations
  - Q&A sessions and troubleshooting guides
  - Certification or assessment of core competencies
  - Post-training support and follow-up sessions

## Resource planning

- [ ] Allocate team resources:
  - Migration team members
  - Technical support staff
  - Training resources
  - Documentation writers

- [ ] Develop migration runbook:
  - Step-by-step procedures
  - Troubleshooting guides
  - Contact information
  - Rollback procedures
  - Validation checklists
  - Emergency response protocols
  - Communication templates

## Next steps

1. Proceed to [Environment assessment]({{% ref path="02-source-environment-assessment.md" %}})
2. Consider engaging [GitHub Expert Services](https://github.com/services#services-catalog) for additional support
