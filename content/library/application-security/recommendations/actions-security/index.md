---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false # Set to false when ready to publish
title: 'Securing GitHub Actions Workflows'
publishDate: 2024-08-16
params:
  authors: [{ name: 'Greg Mohler', handle: 'callmegreg' }, { name: 'Kitty Chiu', handle: 'kittychiu' }]

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - application-security

# The areas of the GitHub adoption journey. Inspiration taken from docs.github.com
areas:
  - security

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

# Individuals in key roles on the customer journey, typically consisting of one or more administrators and the end-user community.
personas:
  - administrator
  - application-security-engineer
  - security-analyst
  - compliance
  - internal-auditor
  - developer

# Deployment options for GitHub Enterprise, including Cloud (GHEC), Server (GHES), and Hybrid.
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu
  - github-enterprise-server

# GitHub product functions designed to support every stage of development.
features:
  - github-advanced-security
  - github-actions

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - access-management
  - actions-workflows
  - actions-oidc
  - permissions
  - policies
  - repository-rulesets
  - secrets-management

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - enterprise-support
  - expert-services
  - partners
---

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD025 -->

## Scenario overview

Continuous integration and continuous delivery (CI/CD) are essential components of modern software development. GitHub Actions is a powerful tool that enables developers to automate repetitive tasks and reduce the risk of human error in manual workflows.

However, CI/CD tools inherently provide remote code execution as a service, making them a prime attack vector for malicious actors. Securing GitHub Actions workflows is critical to prevent unauthorized access to the codebase and protect organizations from potential security breaches.

## Key design strategies

To secure GitHub Actions workflows, consider the following strategies:

1. **Use OpenID Connect (OIDC) for authentication**: Establish authentication between GitHub Actions and external systems or cloud providers using OIDC. Use short-lived tokens whenever possible to access resources, and avoid storing long-lived credentials as secrets.
2. **Configure repository rules**: Implement repository rulesets to enforce security policies and prevent unauthorized or malicious changes.
3. **Implement least privilege for workflow permissions**: Restrict workflow and job permissions to the minimum required. Remove workflow-level permissions and define permissions on individual jobs rather than at the workflow level for finer-grained control.
4. **Use Dependabot to protect the supply chain**: Enable Dependabot alerts and security updates to identify and remediate vulnerable dependencies in workflows. Enable version updates to regularly review and update dependencies.
5. **Pin versions of actions**: Pin actions to a specific commit hash to prevent breaking changes or vulnerabilities in newer versions. Enforce via the allowed actions and reusable workflows policy at the enterprise, organization, or repository level.
6. **Avoid actions with mutable dependencies**: Do not use actions that include mutable dependencies (e.g. `latest`) or pull in external binaries without verification, as they introduce supply chain risks.
7. **Avoid workflow injection**: Sanitize user input and avoid using expression values in sensitive contexts (such as `run` steps) to prevent injection attacks.
8. **Avoid `pull_request_target`**: This event runs workflows in the base repository context with elevated permissions. This can enable malicious execution using pull requests from forks.
9. **Secure `workflow_run` workflows**: Treat all artifacts, code, and data from triggering workflows as untrusted. Use [branch filters](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#limiting-your-workflow-to-run-based-on-branches) and validate all inputs.
10. **Use `head.sha` instead of `head.ref`**: Where possible, reference by commit SHA instead of a user-provided branch name or tag (ref), especially in sensitive contexts (such as `run` steps). If require, use environment variable to store `head.ref` and reference it to prevent injection attack.
11. **Use caution with public repositories**: Anyone can suggest changes to public repositories. Review workflow triggers, and never use self-hosted runners with public repositories.
12. **Restrict allowed actions**: Use the [*Allow enterprise, and select non-enterprise, actions and reusable workflows*](https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise#controlling-access-to-public-actions-and-reusable-workflows) setting  to control which actions can run.

## Assumptions and preconditions

This article assumes readers are familiar with [GitHub Actions](https://docs.github.com/en/enterprise-cloud@latest/actions/about-github-actions/understanding-github-actions) and have experience creating and managing workflows. It also assumes a basic understanding of security best practices and concepts such as authentication, authorization, and OIDC.

## Recommended implementation

### Use OpenID Connect (OIDC) for authentication

CI/CD platforms like GitHub Actions often require access to sensitive resources such as source code repositories, build artifacts, and deployment environments. To ensure that only authorized users and services can access these resources, [use OpenID Connect (OIDC) for authentication](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect).

OIDC eliminates the need for long-lived credentials in Actions secrets, reducing the risk of secret exfiltration. By establishing trust between GitHub Actions and a service that supports OIDC, attributes like organization, repository, workflow, or user can be used as conditions to approve or deny access.

#### Configuring trust relationships with specific claims

When [configuring OIDC trust relationships with cloud providers](https://docs.github.com/en/actions/reference/security/oidc#oidc-claims-used-to-define-trust-conditions-on-cloud-roles) or compliant services, specify granular claims to restrict access to trusted conditions. For example:

- **`sub` claim**: The primary OIDC subject identifier, uniquely representing the repository that requested the token. Use this claim to restrict access to specific repositories and environments. Prefer an exact match on a complete claim instead of wildcard matches.
- **`job_workflow_ref` claim**: Specifies the exact workflow file path and commit SHA. Note that only a limited number of cloud providers support this custom claim (e.g. [Azure](https://learn.microsoft.com/en-us/entra/workload-id/workload-identities-flexible-federated-identity-credentials?tabs=github)).

Define the most granular trust conditions wherever possible to prevent unauthorized access, even from legitimate repositories. [Customize the `sub` claim](https://docs.github.com/en/enterprise-cloud@latest/actions/reference/security/oidc#customizing-the-token-claims) when the cloud provider's OIDC implementation does not support matching **custom claims** or you need immutable identifiers in the `sub`.

- Prefer **immutable identifiers** (e.g., `repository_owner_id:12345:repository_id:67890`) over mutable ones (e.g., `repo:github/some-repo`).

#### Scaling with reusable workflows

OIDC can also [secure reusable workflows](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/using-openid-connect-with-reusable-workflows) across multiple organizations and repositories. Use `job_workflow_ref` to ensure only approved workflows access sensitive resources.

### Configure repository rules

Repository rulesets provide a strong defensive layer that complements workflow-level security measures. Consider these rules:

- [Require pull requests before merging](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-a-pull-request-before-merging): Enforce human review to detect malicious changes. For example, require human review and at least two reviewers to merge to the default branch.
- [Require status checks to pass before merging](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-status-checks-to-pass-before-merging): Ensure automated validation checks pass before merging.
- [Require code scanning results](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-code-scanning-results): Identify security vulnerabilities before merge.
- [Require signed commits](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-signed-commits): Ensure all commits are signed to prove who authored them and that they haven't been modified.
- Restrict bypass permissions: Limit bypass capabilities to emergencies and monitor via audit logs.

### Implement least privilege for workflow permissions

GitHub Actions workflows include a pre-defined `GITHUB_TOKEN` variable that grants [default permissions](https://docs.github.com/en/enterprise-cloud@latest/actions/security-for-github-actions/security-guides/automatic-token-authentication#permissions-for-the-github_token) to jobs in the workflow. These default permissions can be configured as either **permissive** or **restricted** at the [organization level](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization#setting-the-permissions-of-the-github_token-for-your-organization) or at the [repository level](https://docs.github.com/en/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#setting-the-permissions-of-the-github_token-for-your-repository).

Set the organization-level or repository-level default to **restricted** (read-only). Then, define permissions explicitly at the job level using the `jobs.<job_id>.permissions` section. Avoid setting workflow-level permissions globally (at the top of the workflow file) as this grants the same permissions to all jobs. This approach:

- Forces each job to declare only the specific permissions it needs
- Prevents accidental privilege escalation
- Ensures new jobs default to no permissions rather than inherited elevated permissions
- Reduces the attack surface if a job is compromised

For example, define minimal permissions on each job instead of all jobs:

```yaml
name: 'My workflow'

on: [push]

# Remove permissions at the workflow-level to force jobs to define permissions
permissions: {}

jobs:
  some-automate-write-job:
    runs-on: ubuntu-latest

    # Write permission set at job-level
    permissions:
      issues: write
      pull-requests: write

    steps:
      - uses: actions/github-script@v8
```

### Use Dependabot to protect the supply chain

[Dependabot](https://docs.github.com/en/enterprise-cloud@latest/code-security/getting-started/dependabot-quickstart-guide) is a GitHub feature that automatically identifies outdated or vulnerable dependencies across repositories and creates pull requests to update them. By enabling Dependabot, teams can ensure that:

- Actions used in workflows are up to date
- Container images, packages, and other dependencies in the repository are secure
- The supply chain is monitored for vulnerabilities

{{< callout type="warning" >}}
Dependabot will only create Dependabot alerts for vulnerable GitHub Actions that use semantic versioning. Actions pinned to SHAs will only receive version updates, not security alerts. For more information, see [About Dependabot alerts](https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts).
{{< /callout >}}

### Pin versions of actions

When using third-party actions in workflows, pin them to an immutable reference (a commit SHA or the tag from an immutable release) to avoid breaking changes, security vulnerabilities, and supply chain attacks from maliciously modified tags.

Pinning an action to a full-length commit SHA is the most reliable way to use an immutable version of an action. While GitHub offers immutable tags as an alternative, this feature can be disabled by repository owners. Pinning to a specific SHA mitigates the risk of a bad actor changing a tag to point to malicious code. When selecting a SHA, verify it comes from the action's official repository and not a fork. **Use SHAs from tagged releases so Dependabot version updates can suggest updates**. If a tag is used from an immutable release, always verify a new version is also immutable.

To pin the version of an action to a commit SHA, specify the commit hash in the `uses` field of the workflow file. Tie the commit SHA directly to a tag version (not an arbitrary commit on the default branch) and add a comment noting the version. For example:

```yaml
- uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332 # v4.1.7
```

Including the version number in a comment helps teams track versions and makes it easier to identify outdated actions.

Security administrators can enforce policies requiring all GitHub Actions workflows and reusable workflow references to be pinned to full-length commit SHAs. This enforcement is available at the enterprise, organization, and repository levels and can be enabled via a dedicated checkbox in the allowed actions and reusable workflows policy settings.

### Avoid actions with mutable dependencies

Some actions include mutable dependencies or pull in code from external sources without verification. These actions remain mutable even after pinning to a specific commit hash, since they include components that can change behavior without altering the action’s source code. Using mutable actions dependencies introduces security risks and makes workflows vulnerable to supply chain attacks.

To avoid using actions with mutable dependencies, review actions source code and ensure they do not include elements such as unpinned container images, unpinned composite actions, or scripts that download code from external sources without verification.

### Avoid workflow injection

Avoid inserting untrusted input into any executable context such as `run:` blocks using expressions. Values like issue titles, PR bodies, and branch names can be manipulated by attackers to inject malicious commands. Use environment variables to safely incorporate user input.

For more details on the risk of workflow script injections and mitigation strategies, refer to [GitHub Docs](https://docs.github.com/en/enterprise-cloud@latest/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#understanding-the-risk-of-script-injections).

### Avoid `pull_request_target`

The `pull_request_target` event is a privileged workflow trigger that should be used with extreme caution. Unlike `pull_request`, which runs in the context of the pull request branch with read-only permissions and no access to secrets, `pull_request_target` runs in the context of the base repository with full access to repository secrets and write permissions.

The risk arises when a workflow using `pull_request_target` explicitly checks out code from the pull request and executes it. Because the workflow runs with base repository privileges, this combination allows untrusted code to execute with elevated permissions. This scenario is known as a ["pwn request"](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/).

#### When `pull_request_target` is appropriate

The `pull_request_target` trigger is designed for specific use cases where elevated permissions are required to interact with pull requests from forks, such as:

- Posting comments or labels on pull requests
- Updating pull request status or metadata

Avoid this trigger for public repositories, and be cautious in implementing this trigger for internal repositories.

### Secure `workflow_run` workflows

The `workflow_run` event executes workflows after another workflow completes. While useful for privileged operations after validation, it carries security risks. Attackers can modify triggering workflows in pull requests, which then trigger existing `workflow_run` workflows with elevated permissions. Additionally, malicious artifacts uploaded by unprivileged workflows can poison privileged workflows that consume them.

When implementing `workflow_run` workflows:

- Use branch filters to limit where workflows can be triggered
- Verify the event origin with `github.event.workflow_run.event != 'pull_request'`
- Treat all artifacts as untrusted and validate contents before use
- Download artifacts to temporary directories (e.g., `$RUNNER_TEMP`) to prevent workspace pollution
- Avoid defining global environment variables in `$GITHUB_ENV` from untrusted data

### Use caution with public repositories

Public repositories enable open-source collaboration but introduce significant security considerations. The most critical risk is using self-hosted runners with public repositories.

{{< callout type="warning" >}}
Avoid use self-hosted runners with public repositories. When a public repository is configured to use self-hosted runners, anyone who can create a fork can potentially run dangerous code on the self-hosted runner machine by creating a pull request that executes code in a workflow. This can lead to:

- Malicious programs running on the machine
- Escaping the machine's runner sandbox
- Exposing access to the machine's network environment
- Persisting unwanted or dangerous data on the machine
- Poisoning caches that could affect other repositories or workflows
{{< /callout >}}

If allowing pull requests from forks, consider enabling "[require approval for all outside collaborators](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#controlling-changes-from-forks-to-workflows-in-public-repositories)" to require approval before workflows run on fork PRs.

Even ephemeral self-hosted runners carry risks in public repository contexts, as attackers can exploit the window between job start and completion, or leverage shared resources like caches.

{{< callout type="info" >}}
GitHub-hosted runners are network isolated by default. They can make outbound calls but do not have access to other runners. Each GitHub-hosted runner is a clean isolated virtual machine that is destroyed at the end of the job execution.
{{< /callout >}}

### Restrict allowed actions

The [allowed actions and reusable workflows setting](https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise#allowing-select-actions-and-reusable-workflows-to-run) controls which actions can run (or not run) in your organization or enterprise. This provides centralized governance and makes it easy to respond to compromised actions without searching across repositories.

Consider defining the list of allowed actions using policy as code (e.g., via Terraform or the REST API) to establish a request/approval process, track changes for audit purposes, and improve visibility into which actions are allowed.

## Additional solution detail and trade-offs to consider

### Pinning actions based on a version tag

Although pinning to a commit hash is the most secure option, specifying a tag is more convenient and widely used. If specifying a tag, ensure the action's creators are trusted. The ["Verified creator"](https://docs.github.com/en/actions/how-tos/create-and-publish-actions/publish-in-github-marketplace#about-badges-in-github-marketplace) badge on GitHub Marketplace is a useful signal, but it is not a guarantee of security.

For the most secure footprint, trust no one, review the code, and always use commit SHAs.

## Seeking further assistance

<!-- The Hugo shortcode below will fully populate this section -->

{{% seeking-further-assistance-details %}}

## Related links

<!-- The Hugo shortcode below will include a subsection that links to GitHub's documentation. -->

{{% related-links-github-docs %}}

Specific helpful articles:

- [Security Hardening for GitHub Actions](https://docs.github.com/en/enterprise-cloud@latest/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
- [Self-hosted runner security](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners#self-hosted-runner-security)
- [Events that trigger workflows](https://docs.github.com/en/enterprise-cloud@latest/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows)
- [OIDC token claims](https://docs.github.com/en/enterprise-cloud@latest/actions/reference/security/oidc#oidc-token-claims)
- [Secure use reference](https://docs.github.com/en/enterprise-cloud@latest/actions/reference/security/secure-use)

### External Resources

- [Keeping your GitHub Actions and workflows secure Part 1: Preventing pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/)
- [Keeping your GitHub Actions and workflows secure Part 2: Untrusted input](https://securitylab.github.com/resources/github-actions-untrusted-input/)
- [Keeping your GitHub Actions and workflows secure Part 3: How to trust your building blocks](https://securitylab.github.com/resources/github-actions-building-blocks/)
- [Keeping your GitHub Actions and workflows secure Part 4: New vulnerability patterns and mitigation strategies](https://securitylab.github.com/resources/github-actions-new-patterns-and-mitigations/)
