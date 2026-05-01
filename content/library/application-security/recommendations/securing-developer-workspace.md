---
draft: false
title: 'Securing developer workspace'
publishDate: 2025-12-19
params:
  authors: [
    {name: "Ken Muse", handle: "kenmuse"},
  ]

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - application-security

# The areas of the GitHub adoption journey. Inspiration taken from docs.github.com
areas:
  - security
  - developers
  - getting-started

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
  - developer

# Deployment options for GitHub Enterprise, including Cloud (GHEC), Server (GHES), and Hybrid.
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu
  - github-enterprise-server

# GitHub product functions designed to support every stage of development.
features:
  - codespaces
  - git

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - access-management
  - permissions
  - security-configurations

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - enterprise-support
  - expert-services
  - partners
---

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD025 -->

## Scenario overview

Developer workspaces are where code is written, tested, and packaged before being committed to version control. These environments represent a critical security boundary in the software development lifecycle, as they often have access to sensitive credentials, intellectual property, and production systems. Compromised developer workspaces can lead to supply chain attacks, data breaches, and unauthorized code injection.

This article provides prescriptive guidance for securing developer workspaces.

## Key design strategies and checklist

To secure your developer workspaces, consider the following strategies:

- **Implement strong identity authentication and workspace authorization**. Require multi-factor authentication (MFA) to access services like GitHub or Codespaces. Protect secrets used in development and enforce device compliance through your identity provider to ensure only managed, healthy devices can access organizational resources.
- **Implement workspace isolation**. Use local development containers (dev containers), remote dev containers (such as GitHub Codespaces), or temporary virtual machines (such as Microsoft Dev Box) to isolate development environments from the host system and limit the blast radius of potential security incidents.
- **Implement least privileges**. Run containers as non-root users with restricted capabilities to limit the blast radius of potential security incidents. Images should be based on minimal, trusted base images and should be regularly updated to incorporate security patches.
- **Require signed commits**. Implement commit signing to establish cryptographic proof of authorship and prevent unauthorized code injection. Require users to authenticate signing requests with a strong authentication mechanism.
- **Carefully review and manage third-party dependencies**. Use dependency management tools and services to monitor for vulnerabilities in third-party libraries and packages used in the development environment. Regularly update dependencies to incorporate security patches and improvements.
- **Secure AI-assisted development**. Review AI-generated code, dependencies, and configurations carefully to prevent vulnerabilities and supply chain attacks. Maintain human-in-the-loop controls and stay informed about the evolving AI security landscape.

## Assumptions and preconditions

This article assumes that:

- You have basic understanding of containerization and [development containers](https://docs.github.com/en/enterprise-cloud@latest/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers)
- You understand Git fundamentals and have experience with [commit signing](https://docs.github.com/en/enterprise-cloud@latest/authentication/managing-commit-signature-verification/about-commit-signature-verification)
- Your organization has defined security policies and compliance requirements for development environments
- Developers have appropriate permissions to configure their development environments within organizational constraints

## Recommendations

### Identity authentication and workspace authorization

Developer workspaces must be protected by strong authentication mechanisms that verify the identity of users before granting access. For GitHub Codespaces and similar environments, this begins with proper configuration of your identity provider (IdP) and enforcing the principle of least privilege across all access points.

- **Enable multi-factor authentication (MFA)**. Require MFA for all developers accessing workspaces. This can be enforced at the [GitHub organization settings](https://docs.github.com/en/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-two-factor-authentication-for-your-organization/requiring-two-factor-authentication-in-your-organization) level or through your identity provider.
- **Regular audits**. Periodically review access logs and permissions to identify any unauthorized access attempts or anomalies. Use [audit logs](https://docs.github.com/en/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization) to monitor access patterns and detect suspicious activity.

#### Device compliance enforcement

GitHub does not natively enforce managed versus unmanaged device access — this responsibility is delegated entirely to your Identity Provider (IdP) through **Conditional Access Policies (CAP)**. When a developer authenticates to GitHub, the IdP evaluates whether the device meets your compliance requirements before granting access. If the device becomes non-compliant mid-session, subsequent requests will be blocked — not just at login time.

CAP enforcement requires [Enterprise Managed Users (EMU)](https://docs.github.com/en/enterprise-cloud@latest/admin/identity-and-access-management/understanding-iam-for-enterprises/about-enterprise-managed-users) and OIDC-based single sign-on. It is only supported with **Microsoft Entra ID** — not Okta or other IdPs — and **does not work with SAML**. This is one of the key reasons to prefer OIDC over SAML when device compliance enforcement is a requirement.

With Entra ID CAP configured, you can enforce access based on:

| Condition | What It Checks |
|---|---|
| **Device compliance** | Is the device Intune-compliant? |
| **Device join state** | Is the device Entra ID joined or hybrid joined? |
| **Platform** | Windows, macOS, iOS, Android, Linux |
| **Network location** | Is the user on a trusted/corporate network? |
| **Sign-in risk** | Is the sign-in flagged as risky by Entra ID? |
| **User risk** | Is the user account flagged as compromised? |

Because GitHub has no native mechanism to inspect device state, a layered approach is essential to close remaining gaps:

- **Enforce device compliance via your IdP**. Configure [Entra ID Conditional Access Policies](https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview) to require Intune-compliant or Entra ID-joined devices. When combined with OIDC and EMU, CAP is validated on every GitHub request — web UI, API, Git over HTTPS, and fine-grained PATs — ensuring continuous enforcement rather than point-in-time checks at login.
- **Use an IP allow list as a complementary control**. Configure an [IP allow list](https://docs.github.com/en/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/managing-allowed-ip-addresses-for-your-organization) for your GitHub organization or enterprise to restrict access to known corporate IP ranges. This ensures that developers must be on a managed network (such as a corporate VPN) to reach GitHub, providing an additional enforcement layer independent of the IdP.
- **Manage device configuration with MDM**. Use a Mobile Device Management (MDM) solution such as Microsoft Intune or Jamf to enforce device configuration policies, manage installed applications, and ensure security software is active. MDM policies can also restrict the use of personal GitHub accounts within organizational IDEs and tools.
- **Secure SSH access**. SSH-based Git access is harder to enforce through CAP alone. Complement IdP controls with [SSH certificate authorities](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-git-access-to-your-organizations-repositories/about-ssh-certificate-authorities) to ensure that only devices with organizationally issued certificates can authenticate via SSH. Network-level controls (such as VPN requirements) provide an additional layer.
- **Recognize the limits of device enforcement**. GitHub has no visibility into local code once it has been cloned. Device compliance controls protect access to GitHub itself but cannot govern what happens on the developer's machine after checkout. Complement technical controls with acceptable use policies and endpoint security tooling.

### Implement workspace isolation

Securing local development containers, remote containers, and Codespaces ensures that development environments are isolated from the host system, following the principle of least privilege, and limiting the blast radius of potential security incidents.

#### Development container best practices

- **Use minimal base images**. Start with minimal, well-maintained base images from trusted sources. Review base images for known vulnerabilities and unnecessary packages. Prefer images that are regularly updated and have a small attack surface.
- **Run as non-root user**. Configure the development container to run as a non-root user to limit the impact of potential security vulnerabilities. This prevents privilege escalation attacks and limits the damage that can be done if the container is compromised.
- **Limit Linux capabilities**. Use `runArgs` in the dev container configuration to drop unnecessary Linux capabilities (`--cap-drop=ALL`). Only add back capabilities that are explicitly required for development tasks.
- **Prevent in-container privilege escalation**. Use the `--security-opt=no-new-privileges` option to prevent processes within the container from gaining additional privileges. Prefer images that are built with security in mind and do not require elevated privileges.
- **Avoid exposing the Docker daemon socket**. Do not mount the Docker socket inside development containers, as this can allow privilege escalation to the host system.
- **Limit bind mounted directories**. For local development containers, prefer [isolated container volumes](https://code.visualstudio.com/docs/devcontainers/containers#_quick-start-open-a-git-repository-or-github-pr-in-an-isolated-container-volume) over bind mounts to reduce the risk of sensitive host files being accessed from within the container.
- **Restrict network access**. Limit outbound and inbound network access from the development container to only necessary services and endpoints. This limits lateral movement in case of a compromise.
- **Review dev container features**. [Development container features](https://containers.dev/features) can simplify setup, but may introduce unnecessary dependencies or packages. Features run with elevated privileges during installation, so review them carefully before use.
- **Verify third-party tools and extensions**. Only install trusted extensions and tools within the development container. Review their source code, permissions, and community reputation to ensure they do not introduce security risks.
- **Audit container logs**. Regularly review logs from the development container for suspicious activity or errors that may indicate security issues. If possible, integrate logging with centralized monitoring solutions.
- **Manage secrets securely**. Avoid hardcoding sensitive information such as API keys, passwords, or tokens in the dev container configuration or source code. Prefer OIDC and short-lived tokens to avoid long-lived credentials.

#### Codespaces best practices

In addition to the development container best practices above, Codespaces environments should also follow these additional security recommendations.

- **Leverage Codespaces secrets for sensitive credentials**. Use [Codespaces secrets](https://docs.github.com/en/enterprise-cloud@latest/codespaces/managing-your-codespaces/managing-secrets-for-your-codespaces) to securely store and inject sensitive information into development environments without exposing them in source code or configuration files.
- **Restrict repository permissions**. Restrict [Codespaces token permissions](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-repository-access-for-your-codespaces) to the minimum required for development tasks. Avoid granting broad access to organizational resources.
- **Audit workspace access**. Use [audit logs](https://docs.github.com/en/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization) to monitor Codespaces activity and detect unauthorized access or anomalies.
- **Define Codespaces policies**. Use [Codespaces policies](https://docs.github.com/en/codespaces/managing-codespaces-for-your-organization) to enforce appropriate security restrictions and to prevent developers from creating overly permissive environments:
  - Restrict [allowed base images](https://docs.github.com/en/enterprise-cloud@latest/codespaces/managing-codespaces-for-your-organization/restricting-the-base-image-for-codespaces)
  - Restrict the [idle timeout period](https://docs.github.com/en/enterprise-cloud@latest/codespaces/setting-your-user-preferences/setting-your-timeout-period-for-github-codespaces)
  - Restrict the [available machine types](https://docs.github.com/en/enterprise-cloud@latest/codespaces/managing-codespaces-for-your-organization/restricting-access-to-machine-types)
  - Restrict the allowed port privacy settings to *Org* (authenticated organization members) to avoid exposing development servers publicly.

### Signed commits

[Commit signing](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification) provides cryptographic proof that commits were created by a verified author. This helps detect unauthorized code injection and establishes accountability for code changes.

- **Use signed commits**. Require all developers to sign their commits to ensure authenticity. This makes it easy to validate the origin of code changes and detect unauthorized modifications.
- **Authenticate signing requests**. Ensure that signing keys are protected and that users must authenticate to use them. This prevents malicious actors or scripts from creating unauthorized commits by stealing unprotected signing keys.
- **Enforce commit signing with rulesets**. Use [organization rulesets](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/creating-rulesets-for-repositories-in-your-organization) to require signed commits across all repositories, ensuring consistent enforcement of commit signing policies.

## Third-party dependencies

Third-party dependencies can introduce vulnerabilities into the development environment and the software supply chain. In fact, they are a leading cause of security incidents. It is essential to manage dependencies carefully and keep them up to date.

- **Keep dependencies up to date**. Regularly update third-party libraries and packages to incorporate security patches and improvements. Use dependency management tools, such as [Dependabot](https://docs.github.com/en/enterprise-cloud@latest/code-security/dependabot/working-with-dependabot), to automate dependency updates and security alerts.
- **Eliminate insecure packages**. Remove or replace packages that are no longer maintained or have known security issues. Vulnerabilities on developer machines can provide access to corporate networks and sensitive data.
- **Review all dependencies**. Before adding a new dependency, review its source code, documentation, and community reputation. Look for signs of active maintenance. Avoid packages with excessive permissions or unusual installation scripts.
- **Restrict automatic code execution during package installation**. Configure package managers to block or prompt for confirmation before executing scripts during dependency installation. This prevents malicious packages from executing code on the developer's machine during installation.

### Secure AI-assisted development

AI coding assistants can accelerate development, but they also introduce unique security considerations. The code, dependencies, and configurations they generate require careful review to prevent vulnerabilities and supply chain attacks.

- **Review AI-generated code carefully**. Code generated by AI tools may contain vulnerabilities, insecure patterns, or rely on vulnerable dependencies. Pay special attention to changes in workspace or container configurations, dependency files, and security-sensitive code paths.
- **Review AI-acquired dependencies**. Verify that dependencies suggested or added by AI tools are trusted, up-to-date, and free of known vulnerabilities. Threat actors may publish packages that match common AI-suggested names to intercept installations (dependency confusion attacks).
- **Review instruction files for prompt injection**. Files such as `copilot-instructions.md` or `AGENTS.md` are automatically injected into AI prompts. Review these files carefully to detect malicious instructions that could alter AI behavior or exfiltrate sensitive information.
- **Maintain human-in-the-loop controls**. Avoid automating terminal command or code execution approval without review. Require explicit approval before AI tools can delete files, push code, or access external services.
- **Evaluate Model Context Protocol (MCP) servers and tools**. These servers and tools can provide malicious commands or instructions that compromise security. They may also leak sensitive data through their interfaces. Only use MCP servers from trusted sources and review their behavior carefully.
- **Assess third-party AI models and services**. Third-party models may have been trained on insecure or malicious data, or could be configured to generate insecure code patterns. Review the security posture of AI services before integrating them into your development workflow.
- **Keep the IDE, tools, and extensions up to date**. Security patches and improvements are frequently released. Updates may include security enhancements for discovered vulnerabilities and exploits.
- **Avoid untrusted external content**. Images can contain hidden instructions in metadata or steganographic layers that manipulate LLM behavior. HTML or Markdown content may contain malicious scripts or prompt injection payloads. Be cautious when opening untrusted files in AI-assisted environments.
- **Isolate untrusted repositories and projects**. Untrusted code may contain malicious dependencies, prompts, or configurations that can compromise the development environment. If you must open untrusted code, do so in an isolated environment such as a disposable Codespace or VM.
- **Protect secrets from prompt exposure**. Avoid storing API keys, tokens, or other sensitive information in the workspace. This data may become part of the prompt context, exposing it to tools, extensions, or external AI services.
- **Stay informed about AI security threats**. The security landscape for AI tools and LLMs is rapidly evolving. Follow security blogs, attend webinars, and participate in relevant communities to stay current on emerging threats and mitigations.

## Seeking further assistance

{{% seeking-further-assistance-details %}}

## Related links

{{% related-links-github-docs %}}

Specifically, you may find the following links helpful:

- [About commit signature verification](https://docs.github.com/en/enterprise-cloud@latest/authentication/managing-commit-signature-verification/about-commit-signature-verification)
- [Signing commits](https://docs.github.com/en/enterprise-cloud@latest/authentication/managing-commit-signature-verification/signing-commits)
- [GitHub Codespaces overview](https://docs.github.com/en/enterprise-cloud@latest/codespaces/overview)
- [Introduction to dev containers](https://docs.github.com/en/enterprise-cloud@latest/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers)
- [Managing secrets for your codespaces](https://docs.github.com/en/enterprise-cloud@latest/codespaces/managing-your-codespaces/managing-secrets-for-your-codespaces)
- [About rulesets](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [About Enterprise Managed Users](https://docs.github.com/en/enterprise-cloud@latest/admin/identity-and-access-management/understanding-iam-for-enterprises/about-enterprise-managed-users)
- [About SSH certificate authorities](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-git-access-to-your-organizations-repositories/about-ssh-certificate-authorities)
- [Managing allowed IP addresses for your organization](https://docs.github.com/en/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/managing-allowed-ip-addresses-for-your-organization)
- [Safeguarding VS Code against prompt injections](https://github.blog/security/vulnerability-research/safeguarding-vs-code-against-prompt-injections/)

### External resources

- [How I avoided Shai-Hulud's second coming (Part 1)](https://www.kenmuse.com/blog/how-i-avoided-shai-hulud-second-coming-part-1/)
- [How I avoided Shai-Hulud's second coming (Part 2)](https://www.kenmuse.com/blog/how-i-avoided-shai-hulud-second-coming-part-2/)
- [Microsoft Entra Conditional Access overview](https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview)
