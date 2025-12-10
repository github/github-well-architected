---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false
title: 'GitHub Repositories Threat Model'
publishDate: 2024-05-29
params:
  authors: [
    {name: "Preston Martin", handle: "pmartindev"},
  ]
# weight: 1
# prev: library/
# next: library/

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - application-security

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
  - administrator
  - developer
  - end-user

# Deployment options for GitHub Enterprise, including Cloud (GHEC), Server (GHES), and Hybrid.
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu
  - github-enterprise-server

# GitHub product functions designed to support every stage of development.
features:
  - github-advanced-security
  - repositories

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - best-practice
  - governance-and-policy

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - enterprise-support
  - partners
---

<!-- markdownlint-configure-file { "MD013": { "headings": false } } -->
<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD025 -->

## Scenario overview

Source code repositories are a prime target by threat actors to ultimately
compromise an application or system. This threat model aims to identify and
mitigate the risks associated with GitHub repositories.

The threat model is tightly scoped to the ***Source Integrity*** section
of **Supply Chain Security** as illustrated in the left side of the diagram below.
The scope informs both the threat actors and the threats themselves. The threat
actors may contain threats within themselves which highlights the
various ways a threat actor could gain access to a GitHub repository.

![Supply Chain](image1.png)

*Figure attribution: This diagram is derived from the [SLSA Supply Chain Threats model](https://slsa.dev/spec/v1.0/threats), version 1.0, from the [SLSA Framework](https://github.com/slsa-framework/slsa). Licensed under [Community Specification License 1.0](https://github.com/slsa-framework/slsa/blob/main/LICENSE.md).*

## System analysis

GitHub has the role of a multifaceted platform acting not only as the
sole source code repository but as something that encompasses version
control, project management, CI, issue and bug tracking, automation,
etc.

There are a number a ways both humans and machines authenticate and
interact with GitHub

- GitHub Account

- Okta Session

- Personal Access Tokens and SSH keys

- Enterprise Apps

- 3rd Party Apps

- Non-MFA Service Accounts

There are a number of these authentication mechanisms that reside
outside of a company's trust boundary. There is an extension of the
trust boundary which is identified by having limited control mechanisms
in place. For example, once an access token has been created and granted
access, there is no control over the token from the customer's
organization.

There are a number of public repositories which require extra controls
compared to the private repositories where anyone on the Internet can
access them where it's possible to submit a change to the code. There
are a number of "types" of repositories

- Repos that contain code that is shipped to a customer or pushed internally

- Repos that are essential to the supply chain where they're
    responsible for backporting or maintaining services

- Repos that are not officially supported by the customer but are free for
    a customer or the community to download and run

- Repos that are not products or offerings - anything else etc.

Beyond authentication there are a number of roles within a GitHub
repository, there is the concept of GitHub teams which can be assigned a
role, and there are outside contributors.

![Trust Boundary](image2.png)

## Methodology

The threat modeling follows the *GitHub Threat Modelling Framework*
where at a high level the following questions are addressed:

1. What are we working on?

2. What can go wrong?

3. What are we going to do about it?

4. Did we do a good enough job?

The process starts with system decomposition where it is broken into
components which involves producing a diagram. Then identifying assets,
trust boundaries, threat actors, and existing controls that are in
place. Threat enumeration is next, analyzing each threat and producing
suggested mitigations against those threats.

## Threat actors

  TA-01   A threat actor with Internet access
  
  TA-02   A threat actor who has a GitHub Account

  TA-03   An threat actor who is an [outside
          collaborator][1]

  TA-04   A threat actor who has gained access to an employee's GitHub credentials

  TA-05   A threat actor who has gained access to an employee's Okta session

  TA-06   A threat actor who has gained access to a GitHub token (inc. SSH keys,
   PAT, etc.) which is authenticated against a customer org

  TA-07   A threat actor who has compromised a third-party GitHub application

  TA-08   A threat actor who has exploited a misconfigured or vulnerable GitHub
  Enterprise application

  TA-09   A threat actor who is an insider e.g. a user who makes a mistake, a
  disgruntled employee, or contractor
  
## Threats

  T-01   A threat actor searches public repositories with the goal of
         finding valid secrets e.g. password, access token, API key, etc.
  
  T-02   A private repository is accessed by an unauthorized threat actor

  T-03   A threat actor can change settings in the "Danger Zone",
         unintentionally or maliciously

  T-04   A threat actor modifies or deletes an important branch's commit
         history, unintentionally or maliciously

  T-05   A threat actor submits an unauthorized change

  T-06   A threat actor approves and merges their own pull request (PR)
         to an important branch

  T-07   A threat actor compromises a customer's GitHub repository

  T-08   A threat actor exploits a misconfigured GitHub Workflow or
         Action

## Threat analysis and recommendations

Access controls restrict who can access the repository and what actions
they can perform. This minimizes the attack surface and limits the
potential for unauthorized changes.

Branch protection ensures that certain branches, especially critical
ones like the main production branch, have strict controls in place.
This helps prevent hasty or unauthorized merges.

Authentication measures, especially MFA and strong password policies,
protect user accounts and make it more challenging for unauthorized
actors to gain access in the first place.

Secret Scanning can help proactively identify exposed secrets in the repository,
reducing the risk of unauthorized access.

Enabling automated Secret Scanning Push Protection mechanisms can prevent secrets
from being committed to the repository; blocking before they are exposed.

### T-01 A threat actor searches public repositories with the goal of finding valid secrets e.g. password, access token, API key, etc

The goal of the threat actor is usually to gain unauthorized access to
systems, exfiltrate data, or misuse credentials for malicious purposes.

#### Analysis

1. Impact:

    - Threat actors could gain unauthorized access to customer
        accounts, systems, or resources.

    - Unauthorized access could lead to data breaches, further
        malicious activity within customer systems, financial losses, and
        damage to a customer's reputation.

2. Targets:

    - Secrets like API keys, access tokens, and credentials stored
        within code

    - Configuration files, hard-coded values and documentation may
        inadvertently contain secrets.

3. Attack Vectors:

    - Automated scanning tools and scripts to search for secrets
        within code and the commit history.

    - These secrets may be exposed due to oversight from the person
        committing a change or an inadvertent inclusion in code.

#### Mitigations

1. Education and Awareness:

    - Educate contributors about the importance of not including
        secrets in code and how to safely store and share secrets.

    - Ensure teams are aware of the robust secret management systems
        available to them, e.g. HashiCorp Vault, GitHub
        Action Secrets

2. Security Scanning

    - Deploy automated scanning tools to proactively search for and
        detect exposed secrets

    - If exposed secrets are identified, have a response plan in place
        where the secrets are immediately rotated

3. Secret Policy:

    - Establish and enforce clear security policies and guidelines for
        secret management and access controls.

    - These guidelines should include an overall secret management
        lifecycle, from creation to utilization to rotation and
        revocation.

4. Code Reviews:

    - Include checks for secrets and sensitive information during code
        reviews to catch inadvertent commits / exposure

    - Anything found within a code review should be revoked and
        rotated

### T-02 A private repository is accessed by an unauthorized threat actor

This change can expose close source code, and data to a threat actor who
could publicly expose it or expose it to a limited number of threat
actors e.g. sell it.

#### Analysis

1. Impact:

    - Could expose sensitive proprietary information, proprietary
        algorithms, internal tools, and/or confidential data. This could
        trigger severe financial, legal, and reputational consequences
        for the customer.

2. Targets

    - The customer's GitHub organizations that contain private GitHub
        repositories

    - The customer's user's sessions or credentials

    - Token's that have access to the customer's GitHub organizations

    - Access to another system that would lead to gaining access to
        GitHub e.g. Vault

3. Attack Vectors

    - Social engineering, tools to steal sessions, secret scanning
        tools run against source code repositories, unintentional leaks
        through video walkthroughs or documentation, leaked dumps of
        databases and other systems on the black market and generally
        exposed secrets

    - An employee unintentionally making a repository public
        without understanding the consequences

#### Mitigations

1. Access Controls and Permissions:

    - Only authorized personnel should have the ability to modify
        visibility settings where strong access controls and permissions
        are set for all repositories.

    - Role-based access controls should be in place following the
        principle of least privilege. Limit the number of individuals
        who can modify settings to reduce the likelihood of unauthorized
        or unintentional changes.

2. MFA & Fine-grained tokens:

    - Require MFA for all access to repositories.

    - In the case of bots and programmatically adjusting settings the
        use of fine-grained access tokens should be favored. For the
        majority of these cases they should not have access to adjust
        the visibility settings so if a token was exposed it can be
        revoked by the customer and the scope of the functionality it can
        perform is reduced.

3. Monitor and Audit Settings:

    - Monitor for changes and ensure alerts are in place for any
        changes to visibility settings.

    - Have regular auditing in place against repository settings to
        ensure that the visibility of the repository has not changed.

4. Incident Response Plan:

    - Ensure teams are aware of the ways they can report a security
        incident

5. Education and Training

    - Ensure employees's are educated in the many forms of social
        engineering

    - How to manage secrets

    - Modern attack vectors e.g.
        [Evilginx](https://help.evilginx.com/docs/intro)

### T-03 A threat actor can change settings in the "Danger Zone", unintentionally or maliciously

These actions include

- Change repository visibility

- Disable branch protection rules

- Transfer ownership

- Achieve this repository

- Delete this repository

#### Analysis

1. Impact:

    - Change Repository Visibility:

        - Could expose sensitive proprietary information, proprietary
            algorithms, internal tools, and/or confidential data. This could
            trigger severe financial, legal, and reputational consequences for
            the customer.

        - Changing from public to private could limit community collaboration.

        - Disable Branch Protection Rules:

            - Could allow unauthorized changes to important branches,
                    compromising data integrity and code quality.

        - Transfer Ownership:

            - Could result in the repository being controlled by an
                    unauthorized entity, potentially exposing sensitive
                    proprietary information, proprietary algorithms, internal
                    tools, and/or confidential data. Also reputation damage.

        - Archive the Repository:

            - This would make the repository read-only and could disrupt
                    development and usage.

        - Delete the Repository:

            - There might be a loss of code, version history,
                    documentation, and other project-related data. However, data
                    can be recovered up to [90
                    days](https://docs.github.com/en/repositories/creating-and-managing-repositories/restoring-a-deleted-repository)
                    so a period of distribution to productivity is more likely
                    in the case of deletion.

            - This can disrupt software development, potentially result in
                    financial losses, and damage an organization's reputation.

2. Targets

    - User's sessions or credentials

    - Token's that have access to the customer's GitHub organizations

    - Access to another system that would lead to gaining access to
        GitHub e.g. Vault

3. Attack Vectors

    - Social engineering, tools to steal sessions, secret scanning
        tools run against source code repositories, unintentional leaks
        through video walkthroughs or documentation, leaked dumps of
        databases and other systems on the black market and generally
        exposed secrets

    - An employee unintentionally changing one of these
        settings

    - A machine user unintentionally changing one of these settings

#### Mitigations

1. Define a Policy

    - Have a GitHub Security Best Practice Policy

    - Ensure every GitHub repository can adhere to the policy

2. Access Controls and Permissions:

    - Only authorized personnel should have the ability to modify
        visibility settings where strong access controls and permissions
        are set for all repositories.

    - Role-based access controls should be in place following the
        principle of least privilege. Limit the number of individuals
        who can modify settings to reduce the likelihood of unauthorized
        or unintentional changes.

    - Ensure modification of these setting is not possible through
        automation (at least in most cases) where a human always needs
        to confirm

3. MFA & Fine-grained tokens:

    - Require MFA for all access to repositories.

    - In the case of bots and programmatically adjusting settings the
        use of fine-grained access tokens should be favored. For the
        majority of these cases they should not have access to adjust
        the visibility settings so if a token was exposed it can be
        revoked and the scope of the functionality it can
        perform is reduced.

4. Monitor and Audit Settings:

    - Monitor for changes and ensure alerts are in place for any
        changes to visibility settings.

    - Have regular auditing in place against repository settings to
        ensure that the visibility of the repository has not changed.

5. Incident Response Plan:

    - Ensure teams are aware of the ways they can report a security
        incident

6. Education and Training

    - Ensure employees's are educated in the many forms of social
        engineering

    - How to manage secrets

    - Modern attack vectors e.g.
        [Evilginx](https://help.evilginx.com/docs/intro)

### T-04 A threat actor modifies or deletes an important branch's commit history, unintentionally or maliciously

#### Analysis

1. Impact:

    - Could lead to a failure of data integrity

    - Could lead to disruption of software development

    - Could lead to disruption, downtime for customers, and breaking
        SLAs for cloud production systems

2. Targets

    - Customer's GitHub important branches within both public + private
        repositories

    - Customer's ability to develop and release code

    - Employees's sessions or credentials

    - Token's that have access to the customer's GitHub organizations

    - Access to another system that would lead to gaining access to
        GitHub e.g. Vault

3. Attack Vectors

    - Social engineering, tools to steal sessions, secret scanning
        tools run against source code repositories, unintentional leaks
        through video walkthroughs or documentation, leaked dumps of
        databases and other systems on the black market and generally
        exposed secrets

    - An employee unintentionally overriding the commit
        history of an important branch

    - A misconfiguration issue within the repository or a security
        setting has not been applied

#### Mitigations

- Have a GitHub Security Best Practice Policy

- Ensure every customer's GitHub repository can adhere to the policy

1. Access Controls and Permissions:

    - Only authorized personnel should have the ability to modify
        visibility settings where strong access controls and permissions
        are set for all repositories.

    - Role-based access controls should be in place following the
        principle of least privilege. Limit the number of individuals
        who can modify settings to reduce the likelihood of unauthorized
        or unintentional changes.

    - Ensure modification of these setting is not possible through
        automation (at least in most cases) where a human always needs
        to confirm.

2. MFA & Fine-grained tokens:

    - Require MFA for all access to repositories.

    - In the case of bots and programmatically adjusting settings the
        use of fine-grained access tokens should be favored. For the
        majority of these cases they should not have access to adjust
        the visibility settings so if a token was exposed it can be
        revoked by the customer and the scope of the functionality it can
        perform is reduced.

3. Monitor and Audit Settings:

    - Monitor for changes and ensure alerts are in place for any
        changes to visibility settings.

    - Have regular auditing in place against repository settings to
        ensure that the visibility of the repository has not changed.

4. Incident Response Plan:

    - Ensure teams are aware of the ways they can report a security
        incident

5. Education and Training

    - Ensure employee's are educated in the many forms of social
        engineering

    - How to manage secrets

    - Modern attack vectors e.g.
        [Evilginx](https://help.evilginx.com/docs/intro)

### T-05 A threat actor submits an unauthorized change to an important branch

#### Analysis

1. Impact:

    - Could lead to a failure of data integrity

    - Could lead to disruption of software development

    - Could lead to disruption, downtime for customers, and breaking
        SLAs for cloud production systems

2. Targets

    - Customer's GitHub important branches within both public + private
        repositories

    - Customer's ability to develop and release code

    - Customers's production systems on cloud e.g. Serverless

    - Customer's sessions or credentials

    - Token's that have access to Customer's GitHub organizations

    - Access to another system that would lead to gaining access to
        GitHub e.g. Vault

3. Attack Vectors

    - Social engineering, tools to steal sessions, secret scanning
        tools run against source code repositories, unintentional leaks
        through video walkthroughs or documentation, leaked dumps of
        databases and other systems on the black market and generally
        exposed secrets

    - A customer's employee unintentionally submitting a change

    - A misconfiguration issue within the repository or a security
        setting has not been applied

#### Mitigations

1. Access Controls

    - Role-Based Access: Assigning roles and permissions to users
        based on their responsibilities. Only authorized personnel
        should have elevated privileges (admin, maintain, write) to
        repositories while others may have read-only access in most
        cases.

    - Least Privilege: Implement the principle of least privilege,
        ensuring that users only have access to the specific
        repositories and branches necessary for their tasks.

    - User and Group Management: Regularly review and manage user
        accounts and groups ensuring access is done through groups only.
        Also to revoke access for teams who no longer require it.

    - Outside Collaborators: Should never be added to a repository

    - Audit Access: audit both non-MFA service accounts and Enterprise
        Apps that have access to repositories ensuring the conform least
        privilege.

2. Branch Protection:

    - Require a pull request before merging as to prevent arbitrary
        code changes where someone or a machine can push directly to a
        protected branch. The PR must undergo a code review by an
        employee (preferably 2) before being merged.

    - Require approvals to prevent arbitrary commits reaching a
        protected branch and can prevent unintentional security
        vulnerability being introduced. Ideally this involved 3 people.
        1 person to submit the PR and 2 people to review it.

    - Dismiss stale pull request approvals when new commits are pushed
        to prevent a review approving a PR where the PR has been
        modified after the approval. The review will be dismissed and
        the PR will need re-approval.

    - Require review from Code Owners: Sets ownership and
        accountability for files within the repository where a team will
        need to approve a PR against their files before code can be
        merged into a protected branch.

    - Require approval of the most recent reviewable push: This
        protects against when a reviewer applies some suggestions to the
        code enabling them to approve and merge code without someone
        reviewing those changes.

    - Prevent Allow force pushes

    - Prevent Allow deletions

3. Authentication:

    - Multi-Factor Authentication (MFA): Require MFA for all users
        accessing source code repositories which adds an additional
        layer of security and makes it more difficult for threat actors
        to compromise user accounts.

    - Trust Boundary Authentication: Use authentication mechanisms
        that reside within the customer's trust boundary and avoid any that
        are outside the control of the customer's Org.

    - Non-MFA Service Accounts: Switch from using non-MFA service
        accounts to GitHub Apps which utilize authentication mechanisms
        within the customer's Org trust boundary

### T-06 A threat actor approves and merges their own pull request (PR) to an important branch

#### Analysis

1. Impact:

    - Could lead to a failure of data integrity

    - Could lead to disruption of software development

    - Could lead to disruption, downtime for customers, and breaking
        SLAs for cloud production systems

2. Targets

    - Customer's GitHub important branches within both public + private
        repositories

    - Customer's ability to develop and release code

    - Customer's production systems on cloud e.g. Serverless

    - Customer's sessions or credentials

    - Token's that have access to customer's GitHub organizations

    - Access to another system that would lead to gaining access to
        GitHub e.g. Vault

3. Attack Vectors

    - Social engineering, tools to steal sessions, secret scanning
        tools run against source code repositories, unintentional leaks
        through video walkthroughs or documentation, leaked dumps of
        databases and other systems on the black market and generally
        exposed secrets

    - An employee unintentionally submitting a change

    - A misconfiguration issue within the repository or a security
        setting has not been applied

#### Mitigations

1. Access Controls

    - Role-Based Access: Assigning roles and permissions to users
        based on their responsibilities. Only authorized personnel
        should have elevated privileges (admin, maintain, write) to
        repositories while others may have read-only access in most
        cases.

    - Least Privilege: Implement the principle of least privilege,
        ensuring that users only have access to the specific
        repositories and branches necessary for their tasks.

    - User and Group Management: Regularly review and manage user
        accounts and groups ensuring access is done through groups only.
        Also to revoke access for teams who no longer require it.

    - Outside Collaborators: Should never be added to a repository

    - Audit Access: audit both non-MFA service accounts and Enterprise
        Apps that have access to repositories ensuring the conform least
        privilege.

2. Branch Protection:

    - Require a pull request before merging as to prevent arbitrary
        code changes where someone or a machine can push directly to a
        protected branch. The PR must undergo a code review by an
        employee (preferably 2) before being merged.

    - Require approvals to prevent arbitrary commits reaching a
        protected branch and can prevent unintentional security
        vulnerability being introduced. Ideally this involved 3 people.
        1 person to submit the PR and 2 people to review it.

    - Dismiss stale pull request approvals when new commits are pushed
        to prevent a review approving a PR where the PR has been
        modified after the approval. The review will be dismissed and
        the PR will need re-approval.

    - Require review from Code Owners: Sets ownership and
        accountability for files within the repository where a team will
        need to approve a PR against their files before code can be
        merged into a protected branch.

    - Require approval of the most recent reviewable push: This
        protects against when a reviewer applies some suggestions to the
        code enabling them to approve and merge code without someone
        reviewing those changes.

    - Require signed commits: adds an additional layer of
        authentication for every local commit before being pushed to
        GitHub.

    - Prevent Allow force pushes

    - Prevent Allow deletions

3. Authentication:

    - Multi-Factor Authentication (MFA): Require MFA for all users
        accessing source code repositories which adds an additional
        layer of security and makes it more difficult for threat actors
        to compromise user accounts.

    - Trust Boundary Authentication: Use authentication mechanisms
        that reside within the customer's trust boundary and avoid any that
        are outside the control of the customer's Org.

    - Non-MFA Service Accounts: Switch from using non-MFA service
        accounts to GitHub Apps which utilize authentication mechanisms
        within the customer's Org trust boundary

### T-07 A threat actor compromises a customer's GitHub repository  

The threat actor could gain elevated access (e.g. write or admin) or
exploit a misconfiguration to comprise the repository

#### Analysis

1. Impact:

    - Could expose sensitive proprietary information, proprietary
        algorithms, internal tools, and/or confidential data. This could
        trigger severe financial, legal, and reputational consequences
        for the customer.

    - Could lead to a failure of data integrity

    - Could lead to disruption of software development

    - Could lead to disruption, downtime for customers, and breaking
        SLAs for cloud production systems

2. Targets

    - Customer's GitHub public and private repositories

    - Customer's ability to develop and release code

    - Customer's production systems on cloud e.g. Serverless

    - Customer's sessions or credentials

    - Token's that have access to customer's GitHub organizations

    - Access to another system that would lead to gaining access to
        GitHub e.g. Vault

3. Attack Vectors

    - Social engineering, tools to steal sessions, secret scanning
        tools run against source code repositories, unintentional leaks
        through video walkthroughs or documentation, leaked dumps of
        databases and other systems on the black market and generally
        exposed secrets

    - A misconfiguration issue within the repository or a security
        setting has not been applied

#### Mitigations

- Define a GitHub Security Best Practice Policy

- Ensure every customer's GitHub repository can adhere to the policy

1. Access Controls and Permissions:

    - Only authorized personnel should have the ability to modify
        visibility settings where strong access controls and permissions
        are set for all repositories.

    - Role-based access controls should be in place following the
        principle of least privilege. Limit the number of individuals
        who can modify settings to reduce the likelihood of unauthorized
        or unintentional changes.

    - Ensure modification of these setting is not possible through
        automation (at least in most cases) where a human always needs
        to confirm

2. MFA & Fine-grained tokens:

    - Require MFA for all access to repositories.

    - In the case of bots and programmatically adjusting settings the
        use of fine-grained access tokens should be favored. For the
        majority of these cases they should not have access to adjust
        the visibility settings so if a token was exposed it can be
        revoked by the customer and the scope of the functionality it can
        perform is reduced.

3. Monitor and Audit Settings:

    - Monitor for changes and ensure alerts are in place for any
        changes to visibility settings.

    - Have regular auditing in place against repository settings to
        ensure that the visibility of the repository has not changed.

4. Incident Response Plan:

    - Ensure teams are aware of the ways they can report a security
        incident

5. Education and Training

    - Ensure employees are educated in the many forms of social
        engineering

    - How to securely configure a GitHub repository

### T-08 A threat actor exploits a misconfigured GitHub Workflow or Action

A threat actor could exploit a script injection or echo out secrets

#### Analysis

1. Impact:

    - Access secrets, deployment / release keys, SSH keys, PATs etc.

    - Exfiltrate sensitive information like secrets and circumnavigate
        the secret redaction feature

    - Access the GITHUB_TOKEN

    - Modify the contents of the repository through the GitHub API

    - Possible cross-repository access

2. Targets

    - Customer's GitHub public repositories that contain GitHub
        workflows

    - Sensitive data or secrets within used within the workflow
        including the GITHUB_TOKEN

    - Another customer's GitHub repository (possible if the GITHUB_TOKEN
        from one repo has been given access to another repo)

    - Commit malicious code by exploiting a race condition

3. Attack Vectors

    - Script injection

    - Exploit race condition

    - Through a 3rd-party Action

    - Emerging threats against software supply chain

#### Mitigations

1. Best Practice Documentation

    - Create a set of best practices around GitHub Workflows &
        Actions

2. SAST

    - Employ security static analysis tools to run against Workflow
        code and alert on security issues

3. Security Training

    - Educate developers about security best practices when creating
        Workflows

4. Incident Response Plan

    - Ensure there is a response plan in place if a Workflow is
        compromised / reported by HackerOne

5. Prevent Script Injection

    - Threat input to the Workflow the same way as you would with an
        application - don't trust user input

6. Properly scope access

    - Set default permission for GITHUB_TOKEN

7. Secrets

    - Ensure secrets are being stored and used securely

    - Have a secret management policy that is followed, creation, use,
        revoke, rotate, and delete

8. Control Changes

    - CODEOWNERS for the Workflow files

    - Ensure a PR is required to change Workflows

    - Ensure code reviews are in place when creating Workflows and
        using Actions within the Workflows

    - The code reviews should take into account the best practices

9. Race conditions

    - Use pull_request_review which associates with a particular Git
        SHA When triggering a GitHub Workflow using a comment on a pull
        request

## Seeking further assistance
<!-- The Hugo shortcode below will fully populate this section -->

{{% seeking-further-assistance-details %}}

## Related links
<!-- The Hugo shortcode below will include a subsection that links to GitHub's documentation. -->

{{% related-links-github-docs %}}

### External Resources

- [Linux hypocrite
    commits](https://lore.kernel.org/lkml/202105051005.49BFABCE@keescook/):
    Researcher attempted to intentionally introduce vulnerabilities into
    the Linux kernel via patches on the mailing list.

- [PHP](https://news-web.php.net/php.internals/113838):
    Attacker compromised PHP's self-hosted git server and injected two
    malicious commits.

[1]: https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-outside-collaborators
