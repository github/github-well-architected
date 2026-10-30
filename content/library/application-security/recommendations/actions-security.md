---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false # Set to false when ready to publish
title: 'Securing GitHub Actions Workflows'
weight: 5
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

1. **Use OpenID Connect (OIDC) for authentication**: Establish authentication between GitHub Actions and external systems, cloud providers, or secret vaults using OIDC. Use short-lived tokens whenever possible to access resources, and inventory and reduce stored secrets.
2. **Configure repository rules**: Implement repository rulesets to enforce security policies and prevent unauthorized or malicious changes.
3. **Implement least privilege for workflow permissions**: Set the default `GITHUB_TOKEN` to read-only and block Actions from approving pull requests. Remove workflow-level permissions and define permissions on individual jobs rather than at the workflow level for finer-grained control.
4. **Use Dependabot to protect the supply chain**: Enable Dependabot alerts and security updates to identify and remediate vulnerable dependencies in workflows. Enable version updates to regularly review and update dependencies.
5. **Pin versions of actions**: Pin actions to a full-length commit SHA or adopt workflow lockfiles, and enforce both with policy at the enterprise, organization, or repository level.
6. **Avoid actions with mutable dependencies**: Do not use actions that include mutable dependencies (e.g. `latest`) or pull in external binaries without verification, as they introduce supply chain risks.
7. **Avoid workflow injection**: Sanitize user input and avoid using expression values in sensitive contexts (such as `run` steps) to prevent injection attacks. Scan workflow files with CodeQL.
8. **Avoid `pull_request_target`**: This event runs workflows in the base repository context with elevated permissions. This can enable malicious execution using pull requests from forks. GitHub's default rule blocks it in public repositories from December 2, 2026.
9. **Secure `workflow_run` workflows**: Treat all artifacts, code, and data from triggering workflows as untrusted. Use [branch filters](https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows#limiting-your-workflow-to-run-based-on-branches) and validate all inputs.
10. **Use `head.sha` instead of `head.ref`**: Where possible, reference by commit SHA instead of a user-provided branch name or tag (ref), especially in sensitive contexts (such as `run` steps). If required, store `head.ref` in an environment variable and reference that variable to prevent injection attacks.
11. **Use caution with public repositories**: Anyone can suggest changes to public repositories. Review workflow triggers, require approval before running workflows from external contributors, and never use self-hosted runners with public repositories.
12. **Restrict allowed actions**: Use the [*Allow enterprise, and select non-enterprise, actions and reusable workflows*](https://docs.github.com/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise#controlling-access-to-public-actions-and-reusable-workflows) setting to allow only GitHub-authored and individually approved actions and reusable workflows.
13. **Control who and what can trigger workflows**: Use workflow execution protections to limit which actors and events can start workflows.
14. **Protect deployments with environments**: Gate deployment jobs and their secrets behind required reviewers and branch restrictions.
15. **Secure runners**: Prefer GitHub-hosted or ephemeral self-hosted runners in restricted groups, and restrict egress.

## Assumptions and preconditions

This article assumes readers are familiar with [GitHub Actions](https://docs.github.com/enterprise-cloud@latest/actions/get-started/understand-github-actions) and have experience creating and managing workflows. It also assumes a basic understanding of security best practices and concepts such as authentication, authorization, and OIDC.

## Recommended implementation

### Use OpenID Connect (OIDC) for authentication

CI/CD platforms like GitHub Actions often require access to sensitive resources such as source code repositories, build artifacts, and deployment environments. To ensure that only authorized users and services can access these resources, [use OpenID Connect (OIDC) for authentication](https://docs.github.com/actions/concepts/security/openid-connect).

OIDC eliminates the need for long-lived credentials in Actions secrets, reducing the risk of secret exfiltration. By establishing trust between GitHub Actions and a service that supports OIDC, attributes like organization, repository, workflow, or user can be used as conditions to approve or deny access. Use OIDC with cloud providers and secret vaults, such as [HashiCorp Vault](https://docs.github.com/enterprise-cloud@latest/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-hashicorp-vault).

#### Configuring trust relationships with specific claims

When [configuring OIDC trust relationships with cloud providers](https://docs.github.com/actions/reference/security/oidc#oidc-claims-used-to-define-trust-conditions-on-cloud-roles) or compliant services, specify granular claims to restrict access to trusted conditions. For example:

- **`sub` claim**: The primary OIDC subject identifier, uniquely representing the repository that requested the token. Use this claim to restrict access to specific repositories and environments. Prefer an exact match on a complete claim instead of wildcard matches.
- **`job_workflow_ref` claim**: Specifies the exact workflow file path and commit SHA. Note that only a limited number of cloud providers support this custom claim (e.g. [Azure](https://learn.microsoft.com/en-us/entra/workload-id/workload-identities-flexible-federated-identity-credentials?tabs=github)).

Define the most granular trust conditions wherever possible to prevent unauthorized access, even from legitimate repositories. For deployments, scope trust to both the repository and the [deployment environment](#protect-deployments-with-environments), so only jobs that pass the environment's protection rules can obtain credentials. [Customize the `sub` claim](https://docs.github.com/enterprise-cloud@latest/actions/reference/security/oidc#customizing-the-token-claims) when the cloud provider's OIDC implementation does not support matching **custom claims**.

- Prefer **immutable identifiers** (e.g., `repo:octo-org@123456/octo-repo@456789`) over mutable ones (e.g., `repo:octo-org/octo-repo`). On GitHub Enterprise Cloud, repositories created after July 15, 2026 use [immutable subject claims](https://docs.github.com/enterprise-cloud@latest/actions/reference/security/oidc#immutable-subject-claims) by default; opt in older repositories and update trust policies to match.

#### Scaling with reusable workflows

OIDC can also [secure reusable workflows](https://docs.github.com/actions/how-tos/secure-your-work/security-harden-deployments/oidc-with-reusable-workflows) across multiple organizations and repositories. Use `job_workflow_ref` to ensure only approved workflows access sensitive resources.

#### Inventory and reduce remaining secrets

Use the [REST API for Actions secrets](https://docs.github.com/enterprise-cloud@latest/rest/actions/secrets) to list organization, repository, and environment secrets. Record what each secret is, who owns it, and which repositories can use it. Replace cloud keys with OIDC, move the rest into [environments](#protect-deployments-with-environments) with required reviewers, and rotate stale secrets. For credentials that can access GitHub itself, review the [enterprise credential inventory](https://docs.github.com/enterprise-cloud@latest/admin/managing-iam/respond-to-incidents/reviewing-credentials-in-your-enterprise).

### Configure repository rules

Repository rulesets provide a strong defensive layer that complements workflow-level security measures. Consider these rules:

- [Require pull requests before merging](https://docs.github.com/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-a-pull-request-before-merging): Enforce human review to detect malicious changes. For example, require human review and at least two reviewers to merge to the default branch.
- [Require status checks to pass before merging](https://docs.github.com/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-status-checks-to-pass-before-merging): Ensure automated validation checks pass before merging.
- [Require code scanning results](https://docs.github.com/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-code-scanning-results): Identify security vulnerabilities before merge.
- [Require signed commits](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-signed-commits): Ensure all commits are signed to prove who authored them and that they haven't been modified.
- Restrict bypass permissions: Limit bypass capabilities to emergencies and monitor via audit logs.

### Implement least privilege for workflow permissions

GitHub Actions workflows include a pre-defined `GITHUB_TOKEN` variable that grants [default permissions](https://docs.github.com/enterprise-cloud@latest/actions/tutorials/authenticate-with-github_token) to jobs in the workflow. These default permissions can be configured as either **permissive** or **restricted** at the [organization level](https://docs.github.com/enterprise-cloud@latest/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization#setting-the-permissions-of-the-github_token-for-your-organization) or at the [repository level](https://docs.github.com/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#setting-the-permissions-of-the-github_token-for-your-repository).

The default depends on [when the enterprise or organization was created](https://docs.github.com/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise#workflow-permissions) (read-only on or after February 2, 2023; read and write before), so set it explicitly. Set the enterprise-level default to **restricted** (read-only) so organizations can't choose a more permissive one. Then, define permissions explicitly at the job level using the `jobs.<job_id>.permissions` section. Avoid setting workflow-level permissions globally (at the top of the workflow file) as this grants the same permissions to all jobs. This approach:

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

Also turn off [**Allow GitHub Actions to create and approve pull requests**](https://docs.github.com/enterprise-cloud@latest/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization#preventing-github-actions-from-creating-or-approving-pull-requests) so that the `GITHUB_TOKEN` can't create or approve pull requests. Workflow approvals should never stand in for required human review.

### Use Dependabot to protect the supply chain

[Dependabot](https://docs.github.com/enterprise-cloud@latest/code-security/tutorials/secure-your-dependencies/dependabot-quickstart) is a GitHub feature that automatically identifies outdated or vulnerable dependencies across repositories and creates pull requests to update them. By enabling Dependabot, teams can ensure that:

- Actions used in workflows are up to date
- Container images, packages, and other dependencies in the repository are secure
- The supply chain is monitored for vulnerabilities

{{< callout type="warning" >}}
Dependabot will only create Dependabot alerts for vulnerable GitHub Actions that use semantic versioning. Actions pinned to SHAs will only receive version updates, not security alerts. For more information, see [Dependabot alerts](https://docs.github.com/code-security/concepts/supply-chain-security/dependabot-alerts).
{{< /callout >}}

### Pin versions of actions

When using third-party actions in workflows, pin them to an immutable reference (a commit SHA or the tag from an immutable release) to avoid breaking changes, security vulnerabilities, and supply chain attacks from maliciously modified tags.

Pinning an action to a full-length commit SHA is the most reliable way to use an immutable version of an action. While GitHub offers immutable tags as an alternative, this feature can be disabled by repository owners. Pinning to a specific SHA mitigates the risk of a bad actor changing a tag to point to malicious code. When selecting a SHA, verify it comes from the action's official repository and not a fork. **Use SHAs from tagged releases so Dependabot version updates can suggest updates**. If a tag is used from an immutable release, always verify a new version is also immutable.

To pin the version of an action to a commit SHA, specify the commit hash in the `uses` field of the workflow file. Tie the commit SHA directly to a tag version (not an arbitrary commit on the default branch) and add a comment noting the version. For example:

```yaml
- uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332 # v4.1.7
```

Including the version number in a comment helps teams track versions and makes it easier to identify outdated actions.

Security administrators can enforce policies requiring all GitHub Actions workflows and reusable workflow references to be pinned to full-length commit SHAs. This enforcement is available at the enterprise, organization, and repository levels and can be enabled via the [**Require actions to be pinned to a full-length commit SHA**](https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/) checkbox in the allowed actions and reusable workflows policy settings.

#### Use workflow lockfiles

[Workflow lockfiles](https://github.blog/changelog/2026-10-28-github-actions-workflow-lockfiles-are-generally-available/) (generally available in October 2026) keep readable tag references in workflows while running the exact commits you locked, including transitive actions. Generate the lockfile with the `gh actions-lock` GitHub CLI extension; Dependabot version updates regenerate matching entries. Once lockfiles are in place, enable the [**Require lockfile**](https://docs.github.com/enterprise-cloud@latest/actions/how-tos/administer/control-workflow-execution#require-lockfile) protection and keep SHA pinning enforced, which an onboarded workflow's lockfile satisfies. [Lockfiles](https://docs.github.com/enterprise-cloud@latest/actions/concepts/security/workflow-dependency-lockfiles) don't cover reusable workflows called at the job level (`jobs.<job_id>.uses`), so pin those by SHA. Lockfiles also don't decide whether a dependency is safe; review each action before you lock it.

### Avoid actions with mutable dependencies

Some actions include mutable dependencies or pull in code from external sources without verification. These actions remain mutable even after pinning to a specific commit hash, since they include components that can change behavior without altering the action’s source code. Using mutable actions dependencies introduces security risks and makes workflows vulnerable to supply chain attacks.

To avoid using actions with mutable dependencies, review actions source code and ensure they do not include elements such as unpinned container images, unpinned composite actions, or scripts that download code from external sources without verification.

### Avoid workflow injection

Avoid inserting untrusted input into any executable context such as `run:` blocks using expressions. Values like issue titles, PR bodies, and branch names can be manipulated by attackers to inject malicious commands. Use environment variables to safely incorporate user input.

For more details on the risk of workflow script injections and mitigation strategies, refer to [Secure use reference](https://docs.github.com/enterprise-cloud@latest/actions/reference/security/secure-use).

[Scan your workflows with CodeQL](https://github.blog/security/application-security/how-to-secure-your-github-actions-workflows-with-codeql/), which supports GitHub Actions as a language, and [require code scanning results](#configure-repository-rules) in rulesets.

### Avoid `pull_request_target`

The `pull_request_target` event is a privileged workflow trigger that should be used with extreme caution. Unlike `pull_request`, which gives fork pull requests a read-only `GITHUB_TOKEN` and no secrets, `pull_request_target` runs in the base repository context with its secrets and `GITHUB_TOKEN`.

The risk arises when a workflow using `pull_request_target` explicitly checks out code from the pull request and executes it. Because the workflow runs with base repository privileges, this combination allows untrusted code to execute with elevated permissions. This scenario is known as a ["pwn request"](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/). Never check out and run pull request code in a workflow that has secrets or write access. Don't set `allow-unsafe-pr-checkout: true` on `actions/checkout` unless the checked-out code is never executed.

#### GitHub's default rule for public repositories

GitHub's [default rule disables `pull_request_target`](https://docs.github.com/enterprise-cloud@latest/actions/reference/security/securely-using-pull_request_target#default-policy-for-pull_request_target) on public repositories without an applicable event policy; it doesn't apply to private or internal repositories. The rule runs in evaluate mode today and will be [enforced on December 2, 2026](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/). Review policy insights to find affected workflows, move those that don't need elevated access to `pull_request`, keep the block, and allow-list specific workflows only where needed by using [workflow file targeting](#control-who-and-what-can-trigger-workflows).

Untrusted triggers such as `pull_request_target` get [read-only access to the default branch's Actions cache](https://github.blog/changelog/2026-06-26-read-only-actions-cache-for-untrusted-triggers/), which prevents cache poisoning. Don't override this default with a write-capable [`cache-mode`](https://github.blog/changelog/2026-09-10-control-github-actions-cache-access-with-cache-mode/); save caches from a trusted trigger such as `push`.

#### When `pull_request_target` is appropriate

The `pull_request_target` trigger is designed for specific use cases where elevated permissions are required to interact with pull requests from forks, such as:

- Posting comments or labels on pull requests
- Updating pull request status or metadata

On public repositories, use this trigger only in workflows you explicitly allow as exceptions to the default rule, and act only on pull request metadata. Be cautious with this trigger in internal and private repositories as well.

### Secure `workflow_run` workflows

The `workflow_run` event executes workflows after another workflow completes. While useful for privileged operations after validation, it carries security risks. Attackers can modify triggering workflows in pull requests, which then trigger existing `workflow_run` workflows with elevated permissions. Additionally, malicious artifacts uploaded by unprivileged workflows can poison privileged workflows that consume them.

When implementing `workflow_run` workflows:

- Use branch filters to limit where workflows can be triggered
- Verify the event origin with `github.event.workflow_run.event != 'pull_request'`
- Never check out and run pull request code in a workflow that has secrets or write access
- Treat all artifacts as untrusted and validate contents before use
- Download artifacts to temporary directories (e.g., `$RUNNER_TEMP`) to prevent workspace pollution
- Avoid defining global environment variables in `$GITHUB_ENV` from untrusted data

### Use caution with public repositories

Public repositories enable open-source collaboration but introduce significant security considerations. The most critical risk is using self-hosted runners with public repositories.

{{< callout type="warning" >}}
Never use self-hosted runners with public repositories. When a public repository is configured to use self-hosted runners, anyone who can create a fork can potentially run dangerous code on the self-hosted runner machine by creating a pull request that executes code in a workflow. This can lead to:

- Malicious programs running on the machine
- Escaping the machine's runner sandbox
- Exposing access to the machine's network environment
- Persisting unwanted or dangerous data on the machine
- Poisoning caches that could affect other repositories or workflows
{{< /callout >}}

If allowing pull requests from forks, enable "[Require approval for all external contributors](https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#controlling-changes-from-forks-to-workflows-in-public-repositories)" to require approval before workflows run on fork PRs. First-time-contributor settings can be bypassed by first landing an innocuous change.

In public repositories on GitHub.com, GitHub Actions also [automatically holds potentially malicious workflow runs for approval](https://github.blog/changelog/2026-07-28-github-actions-holds-potentially-malicious-workflows-for-approval/). Review the workflow changes before you approve a held run. This protection isn't available on GitHub Enterprise Server.

Even ephemeral self-hosted runners carry risks in public repository contexts, as attackers can exploit the window between job start and completion, or leverage shared resources like caches.

{{< callout type="info" >}}
Each GitHub-hosted runner is a clean, isolated virtual machine that is destroyed at the end of the job execution and does not have access to other runners. However, GitHub-hosted runners have unrestricted outbound network access by default. See [Secure runners](#secure-runners).
{{< /callout >}}

### Restrict allowed actions

The [allowed actions and reusable workflows setting](https://docs.github.com/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise#allowing-select-actions-and-reusable-workflows-to-run) controls which actions can run (or not run) in your organization or enterprise. This provides centralized governance and makes it easy to respond to compromised actions without searching across repositories.

Allow only GitHub-authored actions and individually approved actions and reusable workflows, rather than all Marketplace actions or all actions from verified creators. To respond to a compromised action, [block it or a specific version](https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/) with a `!` prefix; blocks override any allow rule.

Consider defining the list of allowed actions using policy as code (e.g., via Terraform or the REST API) to establish a request/approval process, track changes for audit purposes, and improve visibility into which actions are allowed.

### Control who and what can trigger workflows

By default, anyone with write access to a repository can trigger its workflows. [Workflow execution protections](https://docs.github.com/enterprise-cloud@latest/actions/concepts/about-actions-policies) ([generally available](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/)) let you define an allowlist at the enterprise, organization, and repository levels:

- **Actor rules** control who can trigger workflows, so you can separate who contributes code from who runs CI.
- **Event rules** control which events can start workflows, such as `pull_request_target` or `workflow_dispatch`.

Set baselines at the enterprise level and layer narrower rules below. Scope rules to workflow files, for example restricting `deploy.yml` to a deployment team while leaving CI open to all contributors. Start in **evaluate** mode (GitHub Enterprise Cloud only) and review policy insights before you enforce. Manage rules as code with the [REST API](https://docs.github.com/enterprise-cloud@latest/rest/actions/policies). For steps, see [Governing execution of GitHub Actions workflows](https://docs.github.com/enterprise-cloud@latest/actions/how-tos/administer/control-workflow-execution).

### Protect deployments with environments

[Deployment environments](https://docs.github.com/enterprise-cloud@latest/actions/reference/workflows-and-actions/deployments-and-environments) attach protection rules and secrets to a deployment target; a job can't access an environment's secrets until its protection rules pass. For each sensitive environment:

- Add **required reviewers**, and enable **Prevent self-review** so the person who triggered a deployment can't approve it.
- Disable **Allow administrators to bypass configured protection rules**.
- Restrict **deployment branches and tags** to protected branches or specific name patterns, such as `main` or `releases/*`.

Store deployment credentials as environment secrets rather than repository or organization secrets, or replace them with [OIDC](#use-openid-connect-oidc-for-authentication) trust scoped to the environment.

### Secure runners

- Prefer GitHub-hosted runners, which run each job in a fresh virtual machine.
- When you need self-hosted runners, use [ephemeral runners](https://docs.github.com/enterprise-cloud@latest/actions/reference/runners/self-hosted-runners#ephemeral-runners-for-autoscaling) that run a single job, and place them in [runner groups](https://docs.github.com/enterprise-cloud@latest/actions/concepts/runners/runner-groups) restricted to the organizations, repositories, and workflows that need them.
- Never use self-hosted runners with [public repositories](#use-caution-with-public-repositories).
- Keep self-hosted runners current. On GitHub Enterprise Cloud, [minimum version enforcement](https://github.blog/changelog/2026-09-28-self-hosted-runner-version-enforcement-date-has-moved/) began September 29, 2026. Runners below the minimum versions can't register or run jobs.

GitHub-hosted runners have unrestricted outbound network access by default, which eases exfiltration. GitHub's [native egress firewall](https://github.blog/news-insights/product-news/whats-coming-to-our-github-actions-2026-security-roadmap/) for GitHub-hosted runners (technical preview) enforces an allowlist from outside the runner VM, so it holds even if a job is compromised. Evaluate it where available; until then, restrict outbound traffic on runner networks you control.

## Additional solution detail and trade-offs to consider

### Pinning actions based on a version tag

Although pinning to a commit hash is the most secure option, specifying a tag is more convenient and widely used. If specifying a tag, ensure the action's creators are trusted, and use [workflow lockfiles](#use-workflow-lockfiles) so each tag resolves to a commit you reviewed. The ["Verified creator"](https://docs.github.com/actions/how-tos/create-and-publish-actions/publish-in-github-marketplace#about-badges-in-github-marketplace) badge on GitHub Marketplace is a useful signal, but it is not a security review of the action's code.

For the most secure footprint, trust no one, review the code, and always pin each action to a reviewed commit by using a SHA or a lockfile.

## Seeking further assistance

<!-- The shortcode below will fully populate this section -->

{{% seeking-further-assistance-details %}}

## Related links

<!-- The shortcode below will include a subsection that links to GitHub's documentation. -->

{{% related-links-github-docs %}}

Specific helpful articles:

- [Self-hosted runners reference](https://docs.github.com/actions/reference/runners/self-hosted-runners)
- [Events that trigger workflows](https://docs.github.com/enterprise-cloud@latest/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [OIDC token claims](https://docs.github.com/enterprise-cloud@latest/actions/reference/security/oidc#oidc-token-claims)
- [Secure use reference](https://docs.github.com/enterprise-cloud@latest/actions/reference/security/secure-use)
- [Securely using `pull_request_target`](https://docs.github.com/enterprise-cloud@latest/actions/reference/security/securely-using-pull_request_target)

### External Resources

- [Keeping your GitHub Actions and workflows secure Part 1: Preventing pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/)
- [Keeping your GitHub Actions and workflows secure Part 2: Untrusted input](https://securitylab.github.com/resources/github-actions-untrusted-input/)
- [Keeping your GitHub Actions and workflows secure Part 3: How to trust your building blocks](https://securitylab.github.com/resources/github-actions-building-blocks/)
- [Keeping your GitHub Actions and workflows secure Part 4: New vulnerability patterns and mitigation strategies](https://securitylab.github.com/resources/github-actions-new-patterns-and-mitigations/)
