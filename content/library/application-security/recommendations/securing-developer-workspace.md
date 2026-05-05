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

Developer workspaces are where code is written, tested, and packaged before being committed to version control. These environments represent a critical security boundary in the software development lifecycle. A compromised developer workspace can lead to unauthorized access to source code, injection of malicious code, exposure of credentials, and supply chain attacks that affect downstream systems and users. Attacks in these environments can also target systems and services that developers interact with, such as cloud platforms and APIs. Remember that securing these environments is about minimizing the attack surface and reducing risk, not preventing trusted developers from being productive.

This article provides prescriptive guidance for securing developer workspaces.

## Key design strategies and checklist

To secure your developer workspaces, consider the following strategies:

- **Implement strong identity authentication and workspace authorization**. Require multi-factor authentication (MFA) to access services like GitHub or Codespaces. Protect secrets used in development environments with secure storage solutions.
- **Implement workspace isolation**. Use local development containers (dev containers), remote dev containers (such as GitHub Codespaces), or temporary virtual machines (such as Microsoft Dev Box) to create consistent, isolated development environments that separate the development toolchain from the host system.
- **Implement least privileges**. Run containers as non-root users with restricted capabilities to limit the blast radius of potential security incidents. Images should be based on minimal, trusted base images and configured to prevent privilege escalation. Access to Git and other services should use the minimal possible privileges.
- **Require signed commits**. Implement commit signing to establish cryptographic proof of authorship and prevent unauthorized code injection. Require users to authenticate signing requests with a strong password or biometrics to ensure that commits can only be made by the developer.
- **Carefully review and manage third-party dependencies**. Use dependency management tools and services to monitor for vulnerabilities in third-party libraries and packages used in the development environment. Restrict packages from automatically updating without review. Block packages from executing code by default during installation/restore.
- **Secure AI-assisted development**. Review AI-generated code, dependencies, and configurations carefully to prevent vulnerabilities and supply chain attacks. Maintain human-in-the-loop controls and limit the tools and extensions that AI assistants can access.

## Assumptions and preconditions

This article assumes that:

- You have basic understanding of containerization and [development containers](https://docs.github.com/en/enterprise-cloud@latest/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers)
- You understand Git fundamentals and have experience with [commit signing](https://docs.github.com/en/enterprise-cloud@latest/authentication/managing-commit-signature-verification/about-commit-signature-verification)
- Your organization has defined security policies and compliance requirements for development environments
- Developers have appropriate permissions to configure their development environments within organizational constraints

## Recommendations

### Identity authentication and workspace authorization

Developer workspaces must be protected by strong authentication mechanisms that verify the identity of users before granting access. For GitHub Codespaces and similar environments, this begins with proper authentication to GitHub itself.

- **Enable multi-factor authentication (MFA)**. Require MFA for all developers accessing workspaces. This can be enforced at the [GitHub organization settings](https://docs.github.com/en/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-two-factor-authentication-for-your-organization/requiring-two-factor-authentication-in-your-organization) or through an identity provider to ensure a consistent security posture.
- **Regular audits**. Periodically review access logs and permissions to identify any unauthorized access attempts or anomalies. Use [audit logs](https://docs.github.com/en/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization) to monitor access patterns.

### Implement workspace isolation

Securing local development containers, remote containers, and Codespaces ensures that development environments are isolated from the host system, following the principle of least privilege, and limit the attack surface. While specific configurations may vary based on project requirements, the following best practices should be considered when creating dev container configurations.

#### Development container best practices

- **Use minimal base images**. Start with minimal, well-maintained base images from trusted sources. Review base images for known vulnerabilities and unnecessary packages. Prefer images that are regularly maintained, provide provenance attestation, and are signed. Containers should be scanned for vulnerabilities as part of the build process.
- **Run as non-root user**. Configure the development container to run as a non-root user to limit the impact of potential security vulnerabilities. This prevents privilege escalation attacks and limits access to host resources. Specify the `containerUser` explicitly to ensure the user account for the container.
- **Limit Linux capabilities**. Use `runArgs` in the dev container configuration to drop unnecessary Linux capabilities (`--cap-drop=ALL`). Only add back capabilities that are explicitly required for development tasks or feature installation (such as `"capAdd": ["CHOWN"]` or `--cap-add=CHOWN` ). Avoid the use of `privileged` mode.
- **Prevent in-container privilege escalation**. Use the `--security-opt=no-new-privileges` option to prevent processes within the container from gaining additional privileges. Prefer images that are configured to prevent the user from escalating privileges using `sudo` or similar tools.
- **Avoid exposing the Docker daemon socket**. Do not mount the Docker socket inside development containers, as this can allow privilege escalation to the host system.
- **Limit bind mounted directories**. For local development containers, prefer [isolated container volumes](https://code.visualstudio.com/docs/devcontainers/containers#_quick-start-open-a-git-repository-or-github-pr-in-an-isolated-container-volume) to store source code instead of bind mounts. This reduces the risk of exposing sensitive host files to the container, prevents the container from modifying host files, and improve performance. Prefer to avoid bind mounts which can expose host files to the container; when this is not possible, mounting the required resources as read-only.
- **Restrict network access**. Limit outbound and inbound network access from the development container to only necessary services and endpoints. This limits lateral movement in case of a compromise.
- **Review dev container features**. [Development container features](https://containers.dev/features) can simplify setup, but may introduce unnecessary dependencies or packages. Features run with elevated privileges during installation, so only include features that are necessary for the development environment.
- **Verify third-party tools and extensions**. Only install trusted extensions and tools within the development container. Review their source code, permissions, and community reputation to ensure they do not introduce vulnerabilities. Verify the publishers. Prefer trusted toolchains from official sources.
- **Audit container logs**. Regularly review logs from the development container for suspicious activity or errors that may indicate security issues. If possible, integrate logging with centralized monitoring solutions.
- **Manage secrets securely**. Avoid hardcoding sensitive information such as API keys, passwords, or tokens in the dev container configuration or source code. Prefer OIDC and short-lived tokens to avoid storing long-lived credentials in the developer workspace. When storing secrets locally, use secure secret management solutions that require periodic re-authentication for access. Encrypt secrets when they are not actively in use. Minimize secrets exposed by environment variables or stored in unencrypted files.

#### Codespaces best practices

In addition to the development container best practices above, Codespaces environments should also follow these additional security recommendations.

- **Leverage Codespaces secrets for sensitive credentials**. Use [Codespaces secrets](https://docs.github.com/en/enterprise-cloud@latest/codespaces/managing-your-codespaces/managing-secrets-for-your-codespaces) to securely store credentials needed during development. These secrets are encrypted and only available to the workspace at runtime, preventing exposure in configuration files or code. To prevent malicious access to secrets stored in the environment, consider adding an additional layer of encryption or using a secrets management tool that requires explicit access. Be aware that organization- and repository-level Codespaces secrets are accessible to anyone with permission to create a Codespace for that repository or within that organization.
- **Restrict repository permissions**. Restrict [Codespaces token permissions](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-repository-access-for-your-codespaces) to the minimum necessary for development tasks. Prefer limiting access to `contents: write` for editable repositories, and `contents: read` for repositories that do not require write access. Avoid using wildcards (`*`) to grant access to all repositories.
- **Audit workspace access**. Use [audit logs](https://docs.github.com/en/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization) to monitor when Codespaces are created, accessed, or deleted. Look for anomalous patterns that might indicate compromised credentials.
- **Define Codespaces policies**. Use [Codespaces policies](https://docs.github.com/en/codespaces/managing-codespaces-for-your-organization) to enforce appropriate security restrictions and to prevent unexpected billing charges. This includes:
  - Restrict [allowed base images](https://docs.github.com/en/enterprise-cloud@latest/codespaces/managing-codespaces-for-your-organization/restricting-the-base-image-for-codespaces)
  - Restrict the [idle timeout period](https://docs.github.com/en/enterprise-cloud@latest/codespaces/setting-your-user-preferences/setting-your-timeout-period-for-github-codespaces)
  - Restrict the [available machine types](https://docs.github.com/en/enterprise-cloud@latest/codespaces/managing-codespaces-for-your-organization/restricting-access-to-machine-types)
  - Restrict the allowed port privacy settings to *Org* (authenticated organization members) to avoid exposing development servers publicly.

### Signed commits

[Commit signing](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification) provides cryptographic proof that commits were created by a verified author and have not been tampered with. This is essential for maintaining code integrity and establishing trust in the software supply chain. GitHub supports GPG, SSH, and S/MIME X.509 certificates for commit signing.

- **Use signed commits**. Require all developers to sign their commits to ensure authenticity. This makes it easy to validate the origin of code changes and detect unauthorized modifications.
- **Authenticate signing requests**. Ensure that signing keys are protected and that users must authenticate to use them. This prevents malicious actors or scripts from creating unauthorized commits by preventing automated signing without user consent. Agents should be configured to use short timeouts, log all access, and require biometric approval. Consider SSH keys stored in hardware tokens or devices that require physical touch when not using development containers or cloud services.
- **Enforce commit signing with rulesets**. Use [organization rulesets](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/creating-rulesets-for-repositories-in-your-organization) to require signed commits on protected branches. This prevents unsigned commits from being merged into critical branches.

## Third-party dependencies

Third-party dependencies can introduce vulnerabilities into the development environment and the software supply chain. In fact, they are a leading cause of security incidents. It is essential to manage these dependencies carefully to minimize risk. This means reviewing and securing dependencies coming from package managers (like npm, PyPI, Maven, and NuGet), registries (which provide OCI images, Helm charts, and dev container features), OS-level packages (like apt, yum, and apk), and other sources.

- **Keep dependencies up to date**. Regularly update third-party libraries and packages to incorporate security patches and improvements. Use dependency management tools, such as [Dependabot](https://docs.github.com/en/enterprise-cloud@latest/code-security/getting-started/dependabot-quickstart-guide), to automatically check for updates and vulnerabilities. When a new version is released, review the changelog for security-related fixes before updating. Prefer manual updates over automatic updates to ensure that changes are reviewed. Avoid mutable references.
- **Eliminate insecure packages**. Remove or replace packages that are no longer maintained or have known security issues. Vulnerabilities on developer machines can provide access to corporate networks, source code, and other sensitive resources. Use tools like Dependabot to identify and remediate vulnerable and outdated dependencies. Remember that multiple low- and medium-severity vulnerabilities will create a larger attack surface, creating new high- and critical-severity vulnerabilities; avoid accumulating these over time.
- **Review all dependencies**. Before adding a new dependency, review its source code, documentation, and community reputation. Look for signs of active maintenance. Avoid packages with excessive permissions or those that execute code during installation without explicit user consent. Continuously review existing dependencies for security risks and remove any that are unnecessary.
- **Restrict automatic code execution during package installation**. Configure package managers to block or prompt for confirmation before executing scripts during dependency installation. This prevents malicious code from running without developer awareness. For example, configure `ignore-scripts=true` in an `.npmrc` file to prevent `npm` from running lifecycle scripts by default. Placing this configuration in the project ensures that this setting applies to everyone that works with the code. In addition, creating this file at the user level (`$HOME/.npmrc` or `%USERPROFILE%\.npmrc`) ensures that you do not automatically run scripts when you restore a project that lacks this configuration. An easy way to apply user-level personalization is to use a [dotfiles](https://dotfiles.github.io/) repository to configure your development machine, [local dev containers](https://code.visualstudio.com/docs/devcontainers/containers#_personalizing-with-dotfile-repositories), or [Codespaces](https://docs.github.com/en/codespaces/setting-your-user-preferences/personalizing-github-codespaces-for-your-account#dotfiles). This ensures that your preferred settings are automatically and consistently applied to each development environment.

### Secure AI-assisted development

AI coding assistants can accelerate development, but they also introduce unique security considerations. The code, dependencies, and configurations they generate require careful review to prevent vulnerabilities and supply chain attacks. Additionally, the tools and extensions that power AI assistants may themselves introduce security risks.

- **Review AI-generated code carefully**. Code generated by AI tools may contain vulnerabilities, insecure patterns, or rely on vulnerable dependencies. Pay special attention to changes in workspace or pipeline configurations, which can introduce broader risks. Be aware that comments in code can be used to hide malicious instructions.
- **Review AI-acquired dependencies**. Verify that dependencies suggested or added by AI tools are trusted, up-to-date, and free of known vulnerabilities. Threat actors may publish packages that match commonly hallucinated package names, tricking developers into installing malicious code.
- **Review instruction files for prompt injection**. Files such as `copilot-instructions.md` or `AGENTS.md` are automatically injected into AI prompts. Review these files carefully to detect malicious instructions that could manipulate AI behavior. Configuration files, such as `settings.json` can be used to alter security settings or remove human-in-the-loop controls.
- **Maintain human-in-the-loop controls**. Avoid automating terminal command or code execution approval without review. Require explicit approval before AI tools can delete files, push code, or access remote repositories. Constraining automated behavior implements the principle of least privilege.
- **Evaluate Model Context Protocol (MCP) servers and tools**. These servers and tools can provide malicious commands or instructions that compromise security. They may also leak sensitive data through their API calls. Use only trusted tools and limit the number of active tools to reduce attack surface and preserve context.
- **Assess third-party AI models and services**. Third-party models may have been trained on insecure or malicious data, or could be configured to generate insecure code patterns. Review the security posture of any third-party AI tools or services used in the development environment, as they may leak sensitive data.
- **Keep the IDE, tools, and extensions up to date**. Security patches and improvements are frequently released. Updates may include security enhancements for discovered vulnerabilities and exploits.
- **Avoid untrusted external content**. Images can contain hidden instructions in metadata or steganographic layers that manipulate LLM behavior. HTML or Markdown content may contain malicious scripts, instructions, or links. Fetching external content may also leak sensitive data.
- **Isolate untrusted repositories and projects**. Untrusted code may contain malicious dependencies, prompts, or configurations that can compromise the development environment. If you must open untrusted code, use an isolated environment and enable [Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust) features in VS Code to restrict permissions and capabilities.
- **Protect secrets from prompt exposure**. Avoid storing API keys, tokens, or other sensitive information in the workspace. This data may become part of the prompt context, exposing it to tools, external services, and the LLM. Use secure secret management solutions to store and access sensitive data.
- **Stay informed about AI security threats**. The security landscape for AI tools and LLMs is rapidly evolving. Follow security blogs, attend webinars, and participate in relevant communities to stay current on new vulnerabilities and mitigation strategies.

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
- [Safeguarding VS Code against prompt injections](https://github.blog/security/vulnerability-research/safeguarding-vs-code-against-prompt-injections/)

### External resources

- [How I avoided Shai-Hulud's second coming (Part 1)](https://www.kenmuse.com/blog/how-i-avoided-shai-hulud-second-coming-part-1/)
- [How I avoided Shai-Hulud's second coming (Part 2)](https://www.kenmuse.com/blog/how-i-avoided-shai-hulud-second-coming-part-2/)
