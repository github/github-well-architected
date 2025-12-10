---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false # Set to false when ready to publish
title: 'Securing GitHub Actions Workflows'
publishDate: 2024-08-16
params:
  authors: [{ name: 'Greg Mohler', handle: 'callmegreg' }]

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
  - permissions
  - policies
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

Continuous integration and continuous delivery (CI/CD) are essential components of modern software development. GitHub Actions is a powerful tool that enables developers to automate repetitive tasks, and reduce the risk of human error in manual workflows.

However, CI/CD tools at their core offer remote code execution as a service. This makes them a prime attack vector for malicious actors. Securing GitHub Actions workflows is essential to prevent unauthorized access to your codebase, and to protect your organization from potential security breaches.

## Key design strategies and checklist

To secure your GitHub Actions workflows, consider the following strategies:

1. **Use OpenID Connect (OIDC) for authentication**: Use OIDC to establish authentication between GitHub Actions and any downstream systems or cloud providers. This ensures that only authorized users can access those downstream resources without the need for long-lived credentials stored as secrets.
2. **Implement least privilege for workflow permissions**: Limit the permissions granted to GitHub Actions workflows and jobs to the minimum required to perform their tasks. This reduces the risk of privilege escalation and unauthorized access to sensitive resources.
3. **Use Dependabot to upgrade vulnerable Actions**: Dependabot can help you identify and remediate vulnerable dependencies in your Actions workflows. Regularly review and update your dependencies to ensure that you are not using outdated or insecure third-party Actions.
4. **Pin versions of Actions**: Pin the commit hash of Actions used in your workflows to ensure that you are not affected by breaking changes or security vulnerabilities in newer versions. Requiring the use of a commit hash can also be enforced via check box through the actions and reusable workflows policy. This can be enforced at the enterprise, organization, or repository level.
5. **Avoid "unpinnable" Actions**: Avoid using Actions that include unpinned dependencies or that pull in code from external sources without verification. This can introduce security risks and make your workflows vulnerable to supply chain attacks.
6. **Avoid workflow injection**: Ensure that your workflows are not vulnerable to injection attacks by sanitizing user input and avoiding the use of dynamic values in sensitive contexts.
7. **Use caution with public repositories**: Given that anyone on the internet can suggest changes to a public repository, it is important to use caution with regard to the workflow triggers and runners that you use.
8. **Use actions policy to restrict which actions can be used**: The allowed actions and reusable workflows policy enables you to restrict which actions can be executed within an enterprise, organization, or repository. Additionally, this policy allows you to block the use of any specific action. For example, if a compromised action is identified, you can easily block it without needing to search for its usage across your repositories.

## Assumptions and preconditions

This article assumes that you are familiar with [GitHub Actions](https://docs.github.com/en/enterprise-cloud@latest/actions/about-github-actions/understanding-github-actions) and have experience creating and managing workflows. It also assumes that you have a basic understanding of security best practices and are familiar with concepts such as authentication and authorization.

## Recommended deployment

### Use OpenID Connect (OIDC) for authentication

CI/CD platforms like GitHub Actions often require access to sensitive resources such as source code repositories, build artifacts, and deployment environments. To ensure that only authorized users and services can access these resources, you should [use OpenID Connect (OIDC) for authentication](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect).

The benefit of OIDC over a more traditional approach of storing secrets as secret variables is that it eliminates the need for long-lived credentials. In turn, there is no longer a risk of a compromised account exfiltrating secrets from your CI/CD environment.

By establishing trust between GitHub Actions and a cloud provider that supports OIDC, attributes like the GitHub organization, repository, workflow, or user can be used to approve or deny access to cloud resources. This provides both a more granular and more secure level of control over who can access what resources, and under what conditions.

In order to scale to many organizations and repositories, [OIDC can be implemented with reusable workflows](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/using-openid-connect-with-reusable-workflows) to ensure that only trusted, centralized workflows can authenticate and view or modify sensitive resources.

### Implement least privilege for workflow permissions

GitHub Actions workflows include a pre-defined `GITHUB_TOKEN` variable that grants [default permissions](https://docs.github.com/en/enterprise-cloud@latest/actions/security-for-github-actions/security-guides/automatic-token-authentication#permissions-for-the-github_token) to the jobs in the workflow. The default permissions can be set to `permissive` or `restricted` [at the organization level](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization#setting-the-permissions-of-the-github_token-for-your-organization) or [at the repository level](https://docs.github.com/en/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#setting-the-permissions-of-the-github_token-for-your-repository).

Additional permissions can be granted to the `GITHUB_TOKEN` by using the `permissions` parameter at the top of the workflow for all jobs, or in the `jobs.<job_id>.permissions` section of the workflow file for that particular job. By specifying the required permissions for each job, you can limit the scope of the `GITHUB_TOKEN` and reduce the risk of privilege escalation.

For example, you can set the permissions for the `GITHUB_TOKEN` variable across all jobs in the workflow by adding the following code snippet at the top of the workflow file:

```yaml
name: 'My workflow'

on: [push]

permissions:
  contents: read
  security-events: read
  pull-requests: write

jobs: ...
```

For more granular control, you can set the permissions for a specific job by adding the following code snippet to the job definition:

```yaml
name: 'My workflow'

on: [push]

jobs:
  stale:
    runs-on: ubuntu-latest

    permissions:
      issues: write
      pull-requests: write

    steps:
      - uses: actions/stale@v5
```

### Use Dependabot to upgrade vulnerable Actions

[Dependabot](https://docs.github.com/en/enterprise-cloud@latest/code-security/getting-started/dependabot-quickstart-guide) is a GitHub feature that automatically identifies and creates pull requests to update outdated dependencies in your repositories. By enabling Dependabot for your repository, you can ensure that your Actions workflows are using the latest versions of dependencies and are not vulnerable to known security issues.

### Pin versions of Actions

When using third-party Actions in your workflows, it is important to pin the Action to a specific commit hash. This ensures that your workflows are not affected by breaking changes or security vulnerabilities in newer versions of the Action, and protects you from supply chain attacks that target the third-party Actions that you use.

Pinning an action to a full length commit SHA is currently the only way to use an action as an immutable release. Pinning to a particular SHA helps mitigate the risk of a bad actor adding a backdoor to the Action's repository, as they would need to generate a SHA-1 collision for a valid Git object payload. When selecting a hash, you should verify it is from the Action's repository and not a repository fork.

To pin the version of an Action, you can specify the commit hash in the `uses` field of the workflow file. For example:

```yaml
- uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332 # v4.1.7
```

Including the version number in a comment can help you and others keep track of the version you are using, and makes it easier to spot when an outdated action is in use. It also enables [Dependabot Security Updates](https://docs.github.com/en/enterprise-cloud@latest/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates) to recommend updates to the Action when a newer, secure version is available.

Security administrators can enforce policies that require all GitHub Actions workflows and reusable workflow references to be pinned to full-length commit SHAs. This enforcement is available at the enterprise, organization, and repository levels. Administrators can enable this requirement using a dedicated checkbox in the allowed actions and reusable workflows policy settings.

### Avoid "unpinnable" Actions

Some Actions include unpinned dependencies or pull in code from external sources without verification. These Actions are considered "unpinnable" because even after pinning to a specific commit hash, they include dynamic components that can change the behavior of the Action without changing the source code for the Action. Using unpinnable Actions in your workflows can introduce security risks and make your workflows vulnerable to supply chain attacks.

To avoid using unpinnable Actions, you should carefully review the source code of the Actions you are using and ensure that they do not include elements such as unpinned container images, unpinned composite Actions, or scripts that download code from external sources without verification.

### Avoid workflow injection

When creating workflows, [custom actions](https://docs.github.com/en/actions/creating-actions/about-custom-actions), and [composite actions](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action), you should always consider whether your code might execute untrusted input from attackers. This can occur when an attacker adds malicious commands and scripts to a context. When your workflow runs, those strings might be interpreted as code which is then executed on the runner.

You can find more details around the risk of workflow script injections and how to mitigate those risks in the [GitHub Docs](https://docs.github.com/en/enterprise-cloud@latest/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#understanding-the-risk-of-script-injections).

### Use caution with public repositories

Public repositories are a great way to enable open source collaboration, but they can also introduce risks if certain workflow triggers are attached to their Actions workflows. For example, the `pull_request_target` trigger runs when a pull request is opened or reopened or when the head branch of the pull request is updated. When combined with an explicit checkout of an untrusted pull request, this can lead to a compromise of the repository's contents and secrets, otherwise referred to as a "pwn request." For more details on how to prevent pwn requests, see the [GitHub Security Lab article](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/).

Another risk related to public repositories is the use of static self-hosted runners. When a public repository is configured to use self-hosted runners, forks of your public repository can potentially run dangerous code on your self-hosted runner machine by creating a pull request that executes the code in a workflow. This can lead to many risks such as:

- Malicious programs running on the machine.
- Escaping the machine's runner sandbox.
- Exposing access to the machine's network environment.
- Persisting unwanted or dangerous data on the machine.

{{< callout type="info" >}}
This is not an issue with GitHub-hosted runners because each GitHub-hosted runner is always a clean isolated virtual machine, and it is destroyed at the end of the job execution.
{{< /callout >}}

## Additional solution detail and trade-offs to consider

### Pinning Actions based on a version tag

Although pinning to a commit hash is the most secure option, specifying a tag is more convenient and is widely used. If you’d like to specify a tag, then be sure that you trust the Action's creators. The ‘Verified creator’ badge on GitHub Marketplace is a useful signal, as it indicates that the Action was written by a team whose identity has been verified by GitHub. Note that there is risk to this approach even if you trust the author, because a tag can be moved or deleted if a bad actor gains access to the repository storing the Action.

## Seeking further assistance

<!-- The Hugo shortcode below will fully populate this section -->

{{% seeking-further-assistance-details %}}

## Related links

<!-- The Hugo shortcode below will include a subsection that links to GitHub's documentation. -->

{{% related-links-github-docs %}}

Specifically, you may find the following links helpful:

- [Security Hardening for GitHub Actions](https://docs.github.com/en/enterprise-cloud@latest/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
- [Self-hosted runner security](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners#self-hosted-runner-security)
- [Events that trigger workflows](https://docs.github.com/en/enterprise-cloud@latest/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows)

### External Resources

- [Keeping your GitHub Actions and workflows secure Part 1: Preventing pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/)
- [Keeping your GitHub Actions and workflows secure Part 2: Untrusted input](https://securitylab.github.com/resources/github-actions-untrusted-input/)
- [Keeping your GitHub Actions and workflows secure Part 3: How to trust your building blocks](https://securitylab.github.com/resources/github-actions-building-blocks/)
