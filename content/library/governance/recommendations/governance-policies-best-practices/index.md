---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false
title: 'GitHub Enterprise Policies & Best Practices'
publishDate: 2024-07-29
params:
  authors: [
    {name: "Abhishek Dutta", handle: "abhi-dutta"},
  ]
# weight: 1
# prev: library/
# next: library/

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - governance

# The areas of the GitHub adoption journey. Inspiration taken from docs.github.com
areas:
  - enterprise-and-teams
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
  - smb-corporate

# Individuals in key roles on the customer journey, typically consisting of one or more administrators and the end-user community.
personas:
  - GitHub Administrator

# Deployment options for GitHub Enterprise, including Cloud (GHEC), Server (GHES), and Hybrid.
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu
  - github-enterprise-server

# GitHub product functions designed to support every stage of development.
features:
  - github-advanced-security
  - repositories
  - governance and policy recommendations for hardening the GitHub settings

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - best-practice
  - governance-and-policy

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - enterprise-support
  - partners
---

<!-- markdownlint-disable MD013 -->

## Scenario overview

Adopting GitHub's general platform best practices is crucial for effectively managing software development projects. These practices provide a structured framework that ensures projects are secure, maintainable, and scalable. By fostering a collaborative and efficient environment, these guidelines help organizations avoid common pitfalls, maintain high-quality codebases, and streamline project workflows. Ultimately, adhering to these best practices leads to successful and sustainable software projects.

## Key design strategies and checklist

Use these key strategies as a baseline to implement GitHub's best practices for governance:

1. [Restrict Actions execution to specific repositories](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization#managing-github-actions-permissions-for-your-organization) and not let repo users and owners to arbitrarily create and execute actions workflow. Set this at the **Organization level**.

2. [Use Actions created by GitHub](https://docs.github.com/en/actions/learn-github-actions/finding-and-customizing-actions) and Verified Creators **wherever applicable**. This settings can be enforced at **Enterprise level**.

3. Default Workflow token permission should be **read-only**: Following the principle of least privilege, it is recommended to set the default workflow token permissions to read-only. Default is read/write, which should be avoided because if a token is compromised, malicious actors can run exploits within the GitHub platform through actions execution.

4. **Disable auto approval** of Pull Requests. By default it is enabled, but it might lead to attackers bypassing code reviews for pull requests and thus approving and merging pull requests unintentionally. This can be set at either the **Enterprise** or **Organizational** level.

5. **Disable forking** if not absolutely needed: You can help prevent sensitive information from being exposed by disabling the ability to fork repositories in your organization.

6. **Disable changing repository visibility**: You should restrict who has the ability to change the visibility of repositories in your organization, such as changing a repository from private to public. Restricting who has the ability to change the visibility of repositories in your organization helps prevent sensitive information from being exposed.

7. Implement **approval flow for fine grained personal access tokens**. If enabled at the Enterprise or Organization level, all organization members must request to get approval for their fine-grained personal access tokens that access any organization in your enterprise. This will help in reviewing which users are accessing what resources and with permissions on the PAT.

8. Enterprise owners should create a policy to **prevent org members from inviting outside collaborators**. Default is “No Policy”. Recommended is Enterprise owners or Organization Owners, so that there is centralized control on who can invite and vet outside collaborators.

9. Set up an Enterprise policy which which **prevents users and members from creating public repositories**.

10. **Webhooks should always be configured with a secret**. Not using a secret in the webhook will mislead the receiving entity of the webhook on the authenticity of the payload received.

11. Webhooks should be configured to **use SSL**.

12. Always use **Repository Rulesets** with fine grained policy enforcements around checks needing pull request review, required checks, and leverage protected branches.
    ![image1](image1.png)

13. **Define CODEOWNERS**: To protect a repository against unauthorized changes, you also need to define owners using a `CODEOWNERS` file. The most secure method is to define a `CODEOWNERS` file in the `.github` directory of the repository and define the repository owner as the owner of either the `CODEOWNERS` file (`/.github/CODEOWNERS @owner_username`) or the whole directory (`/.github/ @owner_username`).

14. Initiate and impose **commit signing** whenever possible. This will deter malicious actors from creating a commit with malicious code and help prevent a possible supply chain attack.

15. **Bypass of rulesets should not be allowed** under the Repository Ruleset configuration. Enforcing policies around repo ruleset is designed for a reason and allowing users to bypass rulesets might allow an attacker to gain access as a user who is allowed to bypass ruleset and compromise the integrity of the codebase.

16. **Runner groups should be limited** to a select number of repositories. Configuring a runner group for all repositories can expose vulnerabilities or allow malicious actors to exploit misconfigured runners. Additionally, maintaining runner groups for specific repositories ensures that self-hosted runners are used for their intended specialized workloads. Granting access to everyone in the organization can lead to wasting resources on unnecessary execution tasks.

17. **Bypass Push Protection:** By default, anyone with write access can bypass a commit blockage due to protection. Considering the criticality of leaked secrets, it is recommended to have bypass capability limited to spefic roles and teams.
    ![image2](image2.png)

18. **Audit log streaming** is often overlooked by enterprises when implementing GitHub. Streaming audit logs from GitHub is crucial for monitoring platform usage trends. The extensive data captured in these logs provides valuable insights into potential unwanted activities occurring on the platform.

## Seeking further assistance

{{% seeking-further-assistance-details %}}

## Related links

{{% related-links-github-docs %}}
