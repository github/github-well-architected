---
draft: false
title: 'Defending against dependency supply chain attacks'
publishDate: 2025-12-10
params:
  authors: [
    {name: "Ken Muse", handle: "kenmuse"},
    {name: "Josh Johanning", handle: "joshjohanning"},
  ]

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - application-security

# The areas of the GitHub adoption journey. Inspiration taken from docs.github.com
areas:
  - security
  - ci-cd-and-devops
  - developers

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
  - github-advanced-security
  - github-actions

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - dependabot-and-dependency-review
  - code-scanning
  - secret-scanning
  - actions-workflows

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - enterprise-support
  - expert-services
  - partners
---

## Scenario overview

Modern software development relies heavily on dependencies - third-party packages, libraries, and modules that accelerate development but also introduce security risks. Supply chain attacks targeting dependencies have become increasingly sophisticated, with malicious actors using techniques like typosquatting, package confusion, package hijacking, account takeovers, and injecting malicious code into legitimate packages.

One example is [Shai-Hulud](https://socket.dev/blog/ongoing-supply-chain-attack-targets-crowdstrike-npm-packages), a self-replicating worm that infiltrated the npm ecosystem via compromised maintainer accounts, injecting malicious post-install scripts into popular JavaScript packages. The malware also stole credentials, injected backdoors, and attempted to destroy the user's home directory.

Managing dependency threats requires a defense-in-depth strategy. No single control is perfect. Even registry-level protections like package cooldown periods (waiting periods after unpublishing before names can be re-registered) aren't sufficient against determined attackers. Layering multiple defenses creates a more robust security posture. This article provides opinionated guidance on implementing practical security measures that have been field-tested against real-world attacks like Shai-Hulud.

## Key design strategies

Layered defenses reduce single points of failure by using multiple controls that reinforce each other - each covers gaps the others leave, so together they form a complete defense. Implement these core strategies:

1. **Disable package lifecycle scripts by default**: Package managers execute scripts automatically during installation (`preinstall`, `postinstall`, etc.). These scripts can run arbitrary code on your system before you've reviewed the package contents. Disabling them by default prevents the most common attack vector.
2. **Use dev containers for isolation**: Development containers provide strong isolation between host machine and project environment. Even if malicious code executes, it can't access the actual home directory, SSH keys, or cloud credentials. GitHub Codespaces and Windows 365 provide managed environments with isolation built in.
3. **Require signed commits with user interaction**: Cryptographic commit signing with biometric or password authentication prevents malicious scripts from creating commits without your knowledge. This blocks multi-stage attacks that modify your codebase.
4. **Enforce repository rulesets**: Require pull requests and status checks for all changes to protected branches. This creates a checkpoint where automated security scans catch malicious code before it reaches your default branch.
5. **Establish trusted publishing and verification**: Implement OIDC-based trusted publishing to eliminate long-lived tokens, and validate package attestations when consuming dependencies to verify they come from trusted sources.
6. **Monitor and respond continuously**: Automate vulnerability detection with Dependabot, dependency review, code scanning, and secret scanning. Tune alerts to reduce fatigue and establish response runbooks.

**Implementation checklist:**

- [ ] Configure package managers to disable lifecycle scripts by default
- [ ] Always use lockfiles for ecosystems that support them to ensure deterministic builds
- [ ] Use dev containers for development, especially for untrusted code
- [ ] Enable commit signing with user interaction (passphrase, biometric, or hardware key)
- [ ] Configure repository rulesets requiring pull requests and status checks
- [ ] Enable Dependabot alerts and security updates for all repositories
- [ ] Configure dependency review action as a required status check on pull requests
- [ ] Enable code scanning with CodeQL or third-party tools; block merges on high-severity findings using rulesets
- [ ] Enable secret scanning with push protection; verify that partner patterns are enabled and custom patterns are defined for organization-specific secrets
- [ ] Use trusted publishing with OIDC for any packages you maintain
- [ ] Publish packages with provenance attestations (e.g., npm publish --provenance)
- [ ] Verify package attestations for dependencies using npm audit signatures in CI/CD
- [ ] Configure Dependabot auto-triage rules to reduce alert fatigue
- [ ] Create incident response runbooks for different alert severity levels
- [ ] Document security exceptions and keep lockfiles current

## Assumptions and preconditions

This guidance assumes:

- **Package ecosystem**: This guidance uses npm or Yarn for JavaScript/TypeScript projects as examples. Similar principles apply to other ecosystems (pip, Maven, NuGet), but specific configurations differ.
- **GitHub repository**: You have administrative access to configure repository settings, rulesets, and GitHub Actions workflows.
- **Dependabot and GitHub Advanced Security features**: This guidance uses Dependabot, dependency review, code scanning, and secret protection. Feature availability varies by GitHub plan.
- **Development environment**: You can configure your local development environment or are using GitHub Codespaces/dev containers.
- **CI/CD with GitHub Actions**: Your build and deployment pipelines use GitHub Actions. Adapt the workflow examples if using other CI/CD systems.

## Recommended deployment

### Layer 1: Disable package lifecycle scripts

The most effective defense against supply chain attacks is to disable automatic execution of package lifecycle scripts. Since these attacks exploit lifecycle scripts to gain initial access, this configuration blocks them completely.

{{< callout type="warning" >}}
Package lifecycle scripts run with the same permissions as your user account. They have access to your files, environment variables, SSH keys, cloud credentials, and more. A compromised package can do serious damage before you even realize something is wrong.
{{< /callout >}}

#### For npm

Create or update your `.npmrc` file in your home directory or project root:

```ini
ignore-scripts=true
save-exact=true
```

The `ignore-scripts=true` setting tells npm to skip all lifecycle scripts during installation. The `save-exact=true` setting ensures npm saves exact versions (not version ranges) in your `package.json`, preventing unexpected updates to newer versions that might contain malicious code.

{{< callout type="info" >}}
**Project root vs. home directory**: Placing `.npmrc` in the project root (committed to the repository) ensures all contributors and CI systems use the same secure configuration. This provides consistent protection across the team without relying on individual developer setups.
{{< /callout >}}

The `.npmrc` approach is recommended because it applies automatically, so you can't forget to add the flag. For one-off commands or environments where you can't modify the config, pass `--ignore-scripts` directly:

```bash
npm ci --ignore-scripts
npm install --ignore-scripts
```

When you need to run scripts for a specific package:

```bash
npm rebuild <package-name>
```

#### For Yarn (v2+)

Create or update your `.yarnrc.yml` file:

```yaml
enableScripts: false
enableImmutableInstalls: true
defaultSemverRangePrefix: ""
```

The `enableImmutableInstalls: true` setting prevents Yarn from modifying your lockfile during install, catching unexpected dependency changes that might indicate tampering.

When a legitimate package needs lifecycle scripts (like building native modules), opt in explicitly in your `package.json`:

```json
{
  "dependenciesMeta": {
    "esbuild": {
      "built": true
    }
  }
}
```

{{< callout type="info" >}}
Consider adding your `.npmrc` and `.yarnrc.yml` configurations to a [dotfiles repository](https://docs.github.com/en/codespaces/setting-your-user-preferences/personalizing-github-codespaces-for-your-account#dotfiles) to ensure secure defaults follow you across local machines, cloud environments, and GitHub Codespaces.
{{< /callout >}}

#### For GitHub Actions workflows

Configure your workflows to install dependencies with lifecycle scripts disabled:

```yaml
- name: Install dependencies
  run: npm ci --ignore-scripts

- name: Build application
  run: npm run build
```

{{< callout type="info" >}}
**For high-security environments:** Organizations accepting pull requests from external contributors or with strict compliance requirements can use [larger hosted runners](https://docs.github.com/enterprise-cloud@latest/actions/using-github-hosted-runners/about-larger-runners/about-larger-runners) with custom images that include system-level `.npmrc` and `.yarnrc.yml` files. This enforces script disabling at the runner level, providing defense-in-depth even if workflow configuration is bypassed.
{{< /callout >}}

#### When to allow lifecycle scripts

Some legitimate packages require lifecycle scripts (such as `node-gyp` for native extensions). When you encounter these:

1. Review the package source code to understand what the scripts do
2. Verify the package publisher is trustworthy
3. Document the exception in your security policy
4. Enable scripts selectively using `npm rebuild <package-name>` after installation
5. Monitor for changes in subsequent versions

### Layer 2: Use dev containers for isolation

Even with package scripts disabled, [dev containers](https://containers.dev) provide an additional security boundary. You can run dev containers locally with Docker, or use [GitHub Codespaces](https://docs.github.com/enterprise-cloud@latest/codespaces) for a fully managed dev container environment. Cloud PCs like [Windows 365](https://www.microsoft.com/en-us/windows-365) can also provide isolation from your primary machine, though they require manual Docker and dev container setup.

By isolating development in a separate environment, malicious scripts can only access the environment's ephemeral home directory, not your actual files, credentials, or SSH keys. This is exactly the kind of damage the Shai-Hulud attack attempted, destroying home directories when secrets couldn't be found.

#### Dev container security benefits

- **Limited host access**: The container only accesses directories you explicitly mount
- **Port visibility**: Any attempts to open network ports surface as notifications
- **Credential scoping**: In Codespaces, Git credentials are automatically scoped to defined repositories
- **Ephemeral environment**: Destroying the container home directory has no lasting impact

#### Configure non-root users in VS Code

Ensure your dev container runs as a non-root user:

```json
{
  "image": "mcr.microsoft.com/devcontainers/base:noble",
  "containerUser": "vscode"
}
```

For additional hardening, consider removing `sudo` privileges from the container user.

### Layer 3: Require signed commits

One subtle risk in supply chain attacks is that malicious code might commit changes to your repository as part of a multi-stage attack. By requiring signed commits with user interaction, you block attempts to create commits without your knowledge.

#### Configure commit signing

[Configure commit signing using a GPG, SSH, or S/MIME key](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits). For maximum protection against automated attacks, use a signing method that requires user interaction. Examples include using a passphrase-protected key, biometric authentication, or a hardware security key.

{{< callout type="info" >}}
**Why user interaction matters:** The key defense here isn't just the cryptographic signature - it's the human verification step. A malicious script running on your machine can access your signing key, but it can't press your fingerprint to the sensor or type your passphrase. This human-in-the-loop requirement is what blocks automated attacks from creating commits on your behalf.
{{< /callout >}}

Commit signing can be enforced via repository rulesets. See [Layer 4: Enforce repository rulesets](#layer-4-enforce-repository-rulesets) for configuration details.

GitHub provides [additional documentation on configuring commit signing](https://docs.github.com/enterprise-cloud@latest/authentication/managing-commit-signature-verification/signing-commits).

### Layer 4: Enforce repository rulesets

This defense layer happens at the repository level. Rulesets ensure that no code reaches your default branch without going through review and automated security checks.

#### Configure rulesets

Create a ruleset for your default branch:

1. Navigate to **Settings** → **Rules** → **Rulesets**
2. Add a new ruleset targeting your default branch
3. Examples of [protection rules](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets) to configure:
   - Require pull requests before merging
   - Require signed commits
   - Require status checks to pass (including security scans)
   - Require at least one approver (preferably two for critical repositories)
   - Require re-review when new commits are pushed
   - Require review from someone other than the last pusher
   - Require code scanning results
   - Do not allow bypassing of pull request requirements

### Layer 5: Establish trusted publishing and verification

Build trust across the supply chain by establishing cryptographic provenance for packages. This layer works both directions: publishers create trustworthy artifacts, and consumers verify them.

#### For package publishers: Configure trusted publishing

[Trusted publishing](https://docs.npmjs.com/trusted-publishers) removes the need to manage long-lived API tokens in your build systems. Instead, your CI/CD pipeline attests the build artifacts and uses OIDC to authenticate directly with package registries. This achieves [SLSA Build Level 3](https://slsa.dev/spec/v1.0/levels#build-l3) security and enables code-to-cloud traceability, and eliminates the risk of stolen tokens being used to publish malicious versions.

For packages you maintain:

1. Link your GitHub repository as a trusted publisher in your package registry settings (npm, PyPI, RubyGems, etc.)
2. Update your release workflow to use [OIDC authentication](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments) instead of long-lived tokens
3. Publish with provenance attestations (e.g., `npm publish --provenance`) to create cryptographic proof on the specific commit of the source repository
4. Create [linked artifact storage records](https://docs.github.com/enterprise-cloud@latest/code-security/concepts/supply-chain-security/linked-artifacts) with the [`actions/attest`](https://github.com/actions/attest) action

#### For package consumers: Validate package attestations

[Package attestations](https://docs.npmjs.com/viewing-package-provenance) provide cryptographic proof of a package's provenance, verifying it was built from specific source code through a verified build process. When consuming packages, validate that they come from trusted publishers.

For packages you depend on:

1. Use `npm audit signatures` to verify packages have valid attestations and signatures, identifying the source repository and commit
2. Integrate attestation validation into your CI/CD pipeline for continuous verification
3. Prioritize dependencies published with attestations in your dependency selection decisions

{{< callout type="info" >}}
Yarn does not yet support a command for validating package attestations. There is an [open issue](https://github.com/yarnpkg/berry/issues/6487) tracking this feature request.
{{< /callout >}}

### Layer 6: Monitor and respond continuously

Automate vulnerability detection and establish processes for responding to security alerts. The goal is visibility into your dependency risk without overwhelming your team with noise.

#### Configure automated scanning

Build a comprehensive automated detection system that catches vulnerabilities at multiple stages:

**Dependency vulnerabilities:**

Enable [Dependabot security updates](https://docs.github.com/enterprise-cloud@latest/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates) to automatically detect vulnerabilities and create pull requests for updates. Consider grouping patch updates for expedited review, assigning security team reviewers, and scheduling daily scans. Use [auto-triage rules](https://docs.github.com/enterprise-cloud@latest/code-security/dependabot/dependabot-auto-triage-rules/about-dependabot-auto-triage-rules) to reduce alert fatigue by automatically dismissing low-risk alerts or alerts for dependencies that don't affect your usage. For comprehensive guidance on managing security alerts at scale, see [Prioritizing security alert remediation](../prioritizing-alerts/).

Add the [dependency review action](https://github.com/actions/dependency-review-action) to your pull request workflows and require it as a status check to prevent potential vulnerabilities from being introduced. Configure it to fail on high-severity vulnerabilities, block problematic licenses, and warn on low [OpenSSF Scorecard](https://securityscorecards.dev/) scores.

**Code vulnerabilities and secrets:**

Enable [code scanning](https://docs.github.com/enterprise-cloud@latest/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning) to detect vulnerabilities and coding errors in your source code. Configure CodeQL or third-party tools to run on pull requests and block merges when issues are found.

Enable [secret scanning](https://docs.github.com/enterprise-cloud@latest/code-security/secret-scanning/introduction/about-secret-scanning) to detect accidentally committed credentials. Configure push protection to prevent secrets from being pushed in the first place, and establish a response runbook for when alerts are triggered.

**Prioritize alerts with production context:**

If you track your builds as [linked artifacts](https://docs.github.com/enterprise-cloud@latest/code-security/concepts/supply-chain-security/linked-artifacts) with deployment records, you can filter Dependabot and code scanning alerts based on what's actually deployed in production. Use filters like `has:deployment` and `runtime-risk` alongside EPSS and CVSS scores to [focus remediation on vulnerabilities that pose real risk](https://docs.github.com/enterprise-cloud@latest/code-security/tutorials/secure-your-organization/prioritize-alerts-in-production-code) to your running systems.

#### Review dependency updates systematically

Beyond automated tooling, establish a human review process for evaluating dependency changes:

{{< callout type="warning" >}}
Avoid auto-merging dependency updates without human review. Compromised maintainer accounts often push malicious code as patch releases specifically because they receive less scrutiny. Automated tests won't catch intentional backdoors.
{{< /callout >}}

1. **Review changelogs and release notes**: Before approving any dependency update, check the changelog for breaking changes, security fixes, and new features. Understand what you're bringing into your codebase.
2. **Verify maintainer identity**: Check the maintainer's identity and history. Look for recent ownership transfers, new maintainers, or changes in publishing patterns—all potential indicators of account compromise.
3. **Inspect the diff**: Review the actual code changes between versions, especially for dependencies with broad access to your system.
4. **Don't trust semver for security decisions**: Semantic versioning indicates *intended* API compatibility, not security risk. A "patch" release can contain arbitrary code changes. Attackers specifically target patch releases because organizations often fast-track them with less scrutiny.
5. **Group updates for efficient review**: Instead of reviewing updates one-by-one, batch dependency updates into scheduled review sessions. This allows focused attention without creating bottlenecks.
6. **Document decisions**: Record why specific versions were approved or rejected. This creates an audit trail and helps future reviewers.

## Trade-offs and considerations

### Balancing security with development velocity

The most secure approach (reviewing every dependency change manually and disabling all automation) is impractical for most organizations. The key is finding the right balance:

**For high-security environments:**

- Disable lifecycle scripts with no exceptions except for explicitly approved packages
- Require manual review of all dependency updates
- Validate package attestations and block on missing attestations
- Use allow-lists of approved dependencies
- Mirror packages through private registries (GitHub Packages, Artifactory, Nexus) for additional approval controls

**For balanced security:**

- Disable lifecycle scripts by default with documented exceptions
- Require human review for all dependency updates (batch for efficiency, not reduced scrutiny)
- Validate attestations when available but don't block on absence
- Use dependency review action and code scanning as automated safety nets

### Common challenges

- **Packages requiring lifecycle scripts**: Some packages (like `node-gyp` for native extensions) legitimately need scripts. Create a documented exception list and use `npm rebuild <package>` selectively after installation.
- **Alert fatigue**: Dependabot can generate many alerts. Use [auto-triage rules](https://docs.github.com/enterprise-cloud@latest/code-security/dependabot/dependabot-auto-triage-rules/about-dependabot-auto-triage-rules) to dismiss low-risk alerts and prioritize what matters.
- **Transitive dependencies**: You don't control dependencies of your dependencies. Use `npm audit`, Dependabot, dependency review, and code scanning to gain visibility. Consider replacing direct dependencies that bring in vulnerable transitives.
- **Attestations not universally available**: Not all packages support attestations yet. Use attestation availability as one factor in dependency selection and gradually work toward full coverage.
- **Keeping lockfiles current**: Lockfiles prevent unexpected updates but can become stale. Regularly update dependencies through Dependabot or scheduled audits to ensure security patches aren't missed while maintaining reproducible builds.
- **Breaking changes in security updates**: Security updates sometimes include breaking changes that require code modifications. Establish separate processes for security updates (expedited) vs. feature updates (standard review), and allocate time for security debt remediation.
- **Workflow security risks**: The `pull_request_target` trigger runs with elevated permissions and access to secrets, even for pull requests from forks. Prefer the regular `pull_request` trigger, define least-privilege workflow permissions, and enable [CodeQL workflow analysis](https://docs.github.com/enterprise-cloud@latest/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning) to detect vulnerabilities.

## Seeking further assistance

{{% seeking-further-assistance-details %}}

## Related links

{{% related-links-github-docs %}}

Specifically, you may find the following links helpful:

- [About Dependabot security updates](https://docs.github.com/enterprise-cloud@latest/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates)
- [About dependency review](https://docs.github.com/enterprise-cloud@latest/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review)
- [Signing commits](https://docs.github.com/enterprise-cloud@latest/authentication/managing-commit-signature-verification/signing-commits)
- [About rulesets](https://docs.github.com/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [npm trusted publishers](https://docs.npmjs.com/trusted-publishers)
- [Verifying npm package provenance](https://docs.npmjs.com/viewing-package-provenance)
- [Using artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations)
- [About supply chain security](https://docs.github.com/enterprise-cloud@latest/code-security/supply-chain-security/understanding-your-software-supply-chain/about-supply-chain-security)
- [Our plan for a more secure npm supply chain](https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/) - GitHub's response to the Shai-Hulud attack
- [The second half of software supply chain security on GitHub](https://github.blog/security/supply-chain-security/the-second-half-of-software-supply-chain-security-on-github/) - Build provenance and artifact attestations
- [Securing the open source supply chain: The essential role of CVEs](https://github.blog/security/supply-chain-security/securing-the-open-source-supply-chain-the-essential-role-of-cves/) - Understanding vulnerability data and automation

### External resources

- [How I Avoided Shai-Hulud's Second Coming (Part 1)](https://www.kenmuse.com/blog/how-i-avoided-shai-hulud-second-coming-part-1/) - Detailed walkthrough of disabling lifecycle scripts and using dev containers
- [How I Avoided Shai-Hulud's Second Coming (Part 2)](https://www.kenmuse.com/blog/how-i-avoided-shai-hulud-second-coming-part-2/) - Signed commits and repository configuration
- [SLSA Framework](https://slsa.dev/) - Supply-chain Levels for Software Artifacts
- [OpenSSF Scorecard](https://securityscorecards.dev/) - Security health metrics for open source
