---
draft: false
title: "Implementing the NIST SSDF with GitHub"
publishDate: 2026-01-20
params:
  authors: [
    {name: "Greg Mohler", handle: "CallMeGreg"},
  ]

pillars:
  - application-security
  - governance
  - productivity
  - collaboration

areas:
  - ci-cd-and-devops
  - collaborative-coding
  - developers
  - enterprise-and-teams
  - security

verticals:
  - finance
  - government
  - information-technology

personas:
  - administrator
  - customer-internal-support
  - developer
  - project-manager

platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu
  - github-enterprise-server

features:
  - codespaces
  - github-advanced-security
  - github-actions
  - issues-and-pull-requests
  - repositories

components:
  - audit-log
  - actions-oidc
  - code-review-automation
  - code-scanning
  - dependabot-and-dependency-review
  - governance-and-policy
  - push-rulesets
  - repository-custom-properties
  - repository-rulesets
  - secret-scanning
  - security-configurations
  - sso-saml
  - sso-oidc

github:
  - customer-success-architect
  - enterprise-support
  - expert-services
---

<!-- markdownlint-disable MD025 -->
<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD029 -->
<!-- markdownlint-disable MD007 -->

## Scenario overview

The [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) (SSDF) provides a comprehensive set of practices for developing secure software throughout the software development lifecycle. Organizations subject to regulatory requirements, government contracts, or those seeking to implement industry-leading security practices often need to demonstrate compliance with the SSDF.

This guide provides actionable recommendations for how GitHub Enterprise customers can leverage GitHub features and integrations to meet SSDF requirements. Each practice is categorized as:

- **GitHub-native**: Can be implemented using built-in GitHub features
- **GitHub Integration**: Requires integration with external tools or services
- **Out of scope**: Relates to organizational processes or policies outside of GitHub's technical capabilities

For organizations implementing the SSDF, GitHub provides a strong foundation across multiple practice areas including source code management, secure CI/CD pipelines, vulnerability detection, and supply chain security. This guide helps you understand which GitHub features to enable, how to configure them, and what additional integrations may be needed to achieve comprehensive SSDF compliance.

The full NIST SSDF v1.1 specification is available at: <a href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf">NIST SP 800-218</a>

## Key design strategies and checklist

### Design strategies

**Leverage GitHub-native security features**: GitHub provides extensive built-in capabilities for secure software development, including code scanning, secret scanning, Dependabot, and branch protection. Maximize use of these features before adding external integrations.

**Implement defense in depth**: Use multiple layers of security controls including repository permissions, branch protection rules, required status checks, code review requirements, and security scanning. No single control should be the only barrier to introducing vulnerabilities.

**Automate security checks in CI/CD**: Integrate security scanning, dependency checking, and policy enforcement directly into GitHub Actions workflows. Automated checks provide consistent enforcement and reduce human error.

**Establish clear governance boundaries**: Use organization-level policies, repository rulesets, and custom properties to enforce security requirements consistently across repositories. Centralized governance reduces administrative overhead and ensures consistent application of security practices. For more detailed recommendations around repository rulesets and custom properties, see [Managing Repositories at Scale](https://wellarchitected.github.com/library/governance/recommendations/managing-repositories-at-scale/).

**Maintain comprehensive audit trails**: Enable and preserve audit logs, workflow run histories, and security alert data. These artifacts provide evidence of security practices and support incident response and compliance reporting.

### Implementation checklist

- [ ] Configure organization-level security policies and settings
- [ ] Implement repository rulesets on all default branches
- [ ] Require code review approval before merging changes
- [ ] Enable secret scanning and push protection
- [ ] Enable Dependabot alerts and security updates
- [ ] Enable and configure code scanning to detect vulnerable coding patterns
- [ ] Perform dynamic/runtime security testing for executable code
- [ ] Use secure CI/CD build environments with least privilege permissions
- [ ] Configure required status checks for security scans in CI/CD
- [ ] Authenticate between CI/CD and cloud providers using OpenID Connect (OIDC)
- [ ] Implement role-based access control using teams and custom roles
- [ ] Enable SAML SSO or OIDC for user authentication to repositories
- [ ] Configure audit log streaming to a SIEM or log management system
- [ ] Establish processes for vulnerability triage and remediation
- [ ] Generate and maintain SBOMs for software releases
- [ ] Implement artifact attestations for build provenance
- [ ] Document security requirements in GitHub Issues or Projects
- [ ] Create security policies and incident response procedures
- [ ] Provide security training for developers and administrators
- [ ] Perform threat modeling and design reviews for critical applications

## Assumptions and preconditions

This implementation guide assumes:

- **GitHub Enterprise deployment**: Your organization uses GitHub Enterprise Cloud (GHEC) or GitHub Enterprise Server (GHES).

- **Administrative access**: You have organization owner or administrator privileges to configure organization-level security settings, policies, and integrations.

- **Advanced Security licensing**: For private repositories, GitHub Advanced Security licenses are available to enable code scanning, secret scanning, and dependency review features.

- **CI/CD pipeline adoption**: Your organization uses or plans to use GitHub Actions or integrated CI/CD tools for build and deployment automation.

- **Identity provider integration**: Your organization has an identity provider (IdP) that can integrate with GitHub for SSO via SAML or OIDC.

- **Security team involvement**: Security professionals are engaged in defining requirements, reviewing architecture, and managing vulnerability response processes.

- **Commitment to secure development**: Leadership supports allocating time and resources to implement security practices throughout the SDLC.

## Recommended deployment

This section provides GitHub-specific implementation guidance for each NIST SSDF practice. Practices are organized by the framework's practice groups:

- Prepare the Organization (PO)
- Protect the Software (PS)
- Produce Well-Secured Software (PW)
- Respond to Vulnerabilities (RV)

### Prepare the Organization (PO)

#### PO.1: Define security requirements for software development

**Summary**: Establish and maintain security requirements for both development infrastructure and the software being developed.

**GitHub implementation scope**: *GitHub-native*

**Implementation details**:

Use GitHub Issues and Projects to document, track, and maintain security requirements.

1. Create a security requirements repository to centralize documentation
2. Use GitHub Issues to document individual security requirements with labels for categorization (e.g., `requirement:infrastructure`, `requirement:software`, `requirement:compliance`)
3. Create GitHub Projects boards to track requirement status and reviews
4. Use issue templates to standardize requirement documentation format
5. Enable Discussions for stakeholder input on evolving requirements
6. Link requirements to implementation work items for traceability

{{< callout type="info" >}}
Create a [template project board](https://docs.github.com/enterprise-cloud@latest/issues/planning-and-tracking-with-projects/managing-your-project/managing-project-templates-in-your-organization) for security requirements or use the [copy project](https://docs.github.com/enterprise-cloud@latest/issues/planning-and-tracking-with-projects/creating-projects/copying-an-existing-project) feature to quickly set up boards for new projects or teams.
{{< /callout >}}

**Configuration example**:

```yaml
# .github/ISSUE_TEMPLATE/security-requirement.yml
name: Security Requirement
description: Document a security requirement for software development
title: "[REQ]: "
labels: ["security-requirement"]
body:
  - type: dropdown
    id: category
    attributes:
      label: Requirement Category
      options:
        - Infrastructure Security
        - Software Security
        - Process & Policy
        - Compliance & Regulatory
  - type: textarea
    id: description
    attributes:
      label: Requirement Description
      description: Detailed description of the security requirement
    validations:
      required: true
  - type: textarea
    id: rationale
    attributes:
      label: Rationale
      description: Why this requirement is necessary
  - type: dropdown
    id: priority
    attributes:
      label: Priority
      options:
        - Critical
        - High
        - Medium
        - Low
```

#### PO.2: Implement roles and responsibilities

**Summary**: Define and assign security-related roles across the software development lifecycle, provide training, and obtain management commitment.

**GitHub implementation scope**: *GitHub-native* for role definition and assignment; *Out of scope* for training programs and management commitment processes

**Implementation details**:

Use GitHub's built-in role-based access control features.

1. **Organization roles**: Assign organization-level roles (Owner, Member) based on responsibilities, keeping the number of organization owners limited but more than one
2. **Team structure**: Create teams that align with SDLC roles (e.g., `security-champions`, `code-reviewers`, `release-managers`)
3. **Repository roles**: Use built-in repository roles (Admin, Maintain, Write, Triage, Read) or create custom repository roles
4. **CODEOWNERS file**: Define code owners and required reviewers using a [CODEOWNERS](https://docs.github.com/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) file
5. **Security managers role**: Use the security manager role to grant security teams visibility across the organization

{{< callout type="info" >}}
Training programs and management commitment should be managed outside GitHub through your organization's learning management and communication systems.
{{< /callout >}}

#### PO.3: Implement supporting toolchains

**Summary**: Use automation tools throughout the SDLC to improve security, and configure them to generate artifacts demonstrating security practices.

**GitHub implementation scope**: *GitHub Integration*

**Implementation details**:

Combine GitHub-native security features with Actions-based automation.

**Enable organization-wide security features**:

1. **Security configurations**: Use GitHub's [security configurations](https://docs.github.com/enterprise-cloud@latest/code-security/concepts/security-at-scale/about-security-configurations) feature to enable, enforce, and set as default the following security features across all repositories:
   - **Secret scanning and push protection**: Prevent credential exposure by detecting and blocking secrets before they are committed
   - **Code scanning**: Automated SAST scanning using CodeQL to detect vulnerable coding patterns
   - **Dependabot alerts and security updates**: Automatically detect and remediate vulnerable dependencies

   Security configurations provide centralized management and enforcement, reducing administrative overhead while ensuring comprehensive coverage across your repositories. For detailed guidance on creating and applying security configurations, refer to the [GitHub documentation](https://docs.github.com/enterprise-cloud@latest/code-security/how-tos/secure-at-scale/configure-enterprise-security/establish-complete-coverage/creating-a-custom-security-configuration-for-your-enterprise).

2. **Immutable releases**: Prevent modifications to published releases
   - Enable immutable releases on repositories to ensure release artifacts cannot be altered after publication
   - This provides assurance that distributed software matches the original release

3. **Artifact attestations**: Sign artifacts during build and validate provenance before consumption
   - Use GitHub's artifact attestation feature to cryptographically sign build artifacts
   - Enable consumers to verify artifact provenance and integrity using `gh attestation verify`
   - Implements supply chain security best practices aligned with the [SLSA framework](https://slsa.dev/)

#### PO.4: Define and use criteria for software security checks

**Summary**: Establish criteria for evaluating software security and track compliance throughout the SDLC.

**GitHub implementation scope**: *GitHub-native*

**Implementation details**:

Use GitHub repository rulesets to define and enforce software security policies.

1. **Repository rulesets**: Create organization-level rulesets to monitor and enforce security requirements, monitoring any bypass activity
2. **Require code scanning results**: In your rulesets, define the security alert severity that should block pull request merges
3. **Status checks**: Use required status checks to enforce any additional criteria such as linters, unit tests, or custom security checks

For more detailed examples of repository rulesets, see [Rulesets Best Practices](https://wellarchitected.github.com/library/governance/recommendations/managing-repositories-at-scale/rulesets-best-practices/).

#### PO.5: Implement and maintain secure environments

**Summary**: Protect development, build, test, and distribution environments from compromise.

**GitHub implementation scope**: *GitHub Integration*

**Implementation details**:

Use GitHub Actions environments and secure runner practices.

1. **GitHub Actions OIDC**: Use OIDC tokens instead of long-lived credentials for cloud access
2. **GitHub-hosted runners**: Use GitHub-hosted runners for CI/CD to leverage ephemeral, secure build environments
3. **Environments**: Use GitHub Actions [environments](https://docs.github.com/enterprise-cloud@latest/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) with protection rules for deployment stages
4. **Repository visibility**: Default new repositories to private visibility

**Environment protection rules**:

```yaml
# Configure production environment protection
Environment: production
Protection rules:
- Required reviewers: release-managers team
- Wait timer: 30 minutes
- Deployment branches: Only protected branches (main, release/*)
- Environment secrets: Use scoped secrets with minimal permissions
```

Leverage GitHub-hosted runners for most CI/CD workloads to benefit from automatic updates, security patches, and isolation. If self-hosted runners are necessary, follow these best practices:

- Run self-hosted runners on ephemeral VMs or containers
- Use separate runner groups for different security zones
- Restrict runner group access to specific repositories or organizations
- Never use self-hosted runners for public repositories
- Monitor audit logs for runner activity

### Protect the Software (PS)

#### PS.1: Protect all forms of code from unauthorized access and tampering

**Summary**: Restrict access to source code, executables, and configuration-as-code based on the principle of least privilege.

**GitHub implementation scope**: *GitHub Integration*

**Implementation details**:

Combine GitHub-native access controls with your identity provider.

1. **Authentication**: Require SAML SSO or OIDC for access to your GitHub environment

    - Start by integrating your identity provider (IdP) with GitHub using either [SAML SSO](https://docs.github.com/enterprise-cloud@latest/admin/managing-iam/using-saml-for-enterprise-iam/configuring-saml-single-sign-on-for-your-enterprise) or [OIDC SSO](https://docs.github.com/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/configuring-oidc-for-enterprise-managed-users).
    - Prefer GitHub Enterprise Cloud with [Enterprise Managed Users](https://docs.github.com/enterprise-cloud@latest/admin/concepts/identity-and-access-management/enterprise-managed-users) (EMU) when you need centralized lifecycle management (provisioning, deprovisioning, and stronger governance boundaries) enforced by the IdP.
    - Turn on [required 2FA for the enterprise](https://docs.github.com/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-security-settings-in-your-enterprise#requiring-two-factor-authentication-for-organizations-in-your-enterprise) (or enforce MFA at the IdP if you use EMU).
    - Decide whether to allow a grace period for enrollment. Keep it short, communicate early, and remove access for users who do not comply.
    - Use audit logs to monitor MFA and sign-in related events and to verify that enforcement is working as intended.

2. **IP allow lists**: Restrict access to GitHub from approved IP ranges

    - Configure an enterprise [IP allow list](https://docs.github.com/enterprise-cloud@latest/admin/configuring-settings/hardening-security-for-your-enterprise/restricting-network-traffic-to-your-enterprise-with-an-ip-allow-list) for web and API access to reduce exposure from untrusted networks.
    - Maintain a change-controlled process for adding and removing IP ranges (including temporary allowances for incident response).
    - If you plan to restrict CI/CD traffic by IP, validate compatibility with your runner model (e.g. GitHub-hosted runners).

3. **Repository permissions**: Use team-based access control with least privilege

    - Set conservative organization defaults (for example, base permission set to no access) and grant access through teams instead of direct user-to-repo permissions.
    - Use role separation: keep organization owners limited, use repository admins sparingly, and grant broad visibility to security teams through the [security manager](https://docs.github.com/enterprise-cloud@latest/organizations/managing-peoples-access-to-your-organization-with-roles/managing-security-managers-in-your-organization) role.
    - Align access control design with your roles and responsibilities model in PO.2 to keep permissions understandable and auditable.

4. **Repository rulesets**: Prevent direct commits to protected branches

    - Create organization-level rulesets that apply to all repositories (or to targeted repo sets using custom properties) and protect default branches and release branches.
    - Use rulesets to block high-risk operations such as force pushes and branch deletion, and to require pull requests for changes.
    - For deeper guidance on using rulesets as your policy engine (including monitoring bypass activity), see PO.4. For rulesets that enforce code scanning and dependency review, see PW.5.

5. **Required reviews**: Mandate code owner review for all changes

    - Require pull requests before merge and configure minimum approvals, dismissal of stale approvals, and “require review from code owners”.
    - Maintain a CODEOWNERS file for security-sensitive paths (authentication, authorization, cryptography, payments, and the `.github` directory) to guarantee subject matter review.
    - For a complete example of review-focused ruleset configuration, see PW.7.

6. **Push rulesets**: Use push rulesets to further restrict changes to sensitive file paths

    - Add a push ruleset to prevent or tightly control direct pushes to sensitive paths, such as `.github/workflows/**`, `CODEOWNERS`, IaC directories, and security policy files.
    - Use these rulesets to enforce “changes must flow through pull requests” for specific files even when other parts of the repository allow direct pushes.
    - Keep bypass permissions limited and review bypass events regularly.

7. **Use commit signing**: Configure commit signing using a GPG, SSH, or S/MIME key

    - Standardize on a signing method that supports user interaction (passphrase prompts, biometrics, or hardware-backed keys) and document the supported options for developers.
    - Provide an onboarding path for developers to [configure signing keys](https://docs.github.com/enterprise-cloud@latest/authentication/managing-commit-signature-verification/about-commit-signature-verification) and validate verification status in pull requests.

    {{< callout type="info" >}}
    **Why user interaction matters**: The key defense here isn’t just the cryptographic signature - it’s the human verification step. A malicious script running on your machine can access your signing key, but it can’t press your fingerprint to the sensor or type your passphrase. This human-in-the-loop requirement is what blocks automated attacks from creating commits on your behalf.
    {{< /callout >}}

#### PS.2: Provide a mechanism for verifying software release integrity

**Summary**: Enable software acquirers to verify that releases are legitimate and untampered.

**GitHub implementation scope**: *GitHub Integration*

**Implementation details**:

Use artifact attestations to enable build provenance verification.

1. **Artifact attestations**: Generate cryptographic attestations for build artifacts using GitHub's [artifact attestation](https://docs.github.com/enterprise-cloud@latest/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations) feature
2. **Immutable releases**: Leverage GitHub's [immutable releases](https://docs.github.com/enterprise-cloud@latest/code-security/supply-chain-security/understanding-your-software-supply-chain/immutable-releases) feature to prevent post-release modifications

**Artifact attestation workflow**:

```yaml
name: Build and Attest Container Image
on:
  push:
    tags:
      - 'v*'

permissions:
  contents: read
  id-token: write
  attestations: write

jobs:
  build-and-attest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: myorg/myapp
          tags: |
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build and push
        id: push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

      - name: Generate artifact attestation
        uses: actions/attest-build-provenance@v3
        with:
          subject-name: myorg/myapp
          subject-digest: ${{ steps.push.outputs.digest }}
          push-to-registry: true
```

**Verification for consumers**:

```bash
# Verify container image attestation using the GitHub CLI
gh attestation verify oci://myorg/myapp:v1.0.0 --owner my-org
```

#### PS.3: Archive and protect each software release

**Summary**: Preserve release artifacts and provenance data to support vulnerability analysis and incident response.

**GitHub implementation scope**: *GitHub Integration*

**Implementation details**:

1. **GitHub Releases**: Create immutable releases for each version
2. **Release artifacts**: Attach binaries, containers, and other artifacts
3. **Tag protection**: Protect release tags from deletion or modification using [tag rulesets](https://docs.github.com/enterprise-cloud@latest/organizations/managing-organization-settings/creating-rulesets-for-repositories-in-your-organization#creating-a-branch-or-tag-ruleset)
4. **SBOM generation**: Generate and attach SBOMs to releases

**SBOM generation workflow**:

```yaml
name: Generate SBOM
on:
  push:
    tags:
      - 'v*'

permissions:
  id-token: write
  attestations: write
  contents: read

jobs:
  build-and-generate-sbom:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      # Build steps for your software would go here

      - name: Generate SBOM
        uses: anchore/sbom-action@v0
        with:
          format: spdx-json
          output-file: sbom.spdx.json

      - name: Attest SBOM
        uses: actions/attest-sbom@v3
        with:
          subject-path: '${{ github.workspace }}'
          sbom-path: 'sbom.spdx.json'
```

### Produce Well-Secured Software (PW)

#### PW.1: Design software to meet security requirements and mitigate security risks

**Summary**: Use risk modeling to identify security requirements and design decisions.

**GitHub implementation scope**: *GitHub-native* for documentation and tracking; *Out of scope* for threat modeling tools and methodologies

**Implementation details**:

Document threat models and security decisions in GitHub.

1. Use GitHub Issues to track security requirements derived from threat modeling
2. Use GitHub Projects to manage security risk mitigation efforts
3. Link security design decisions to implementation pull requests

{{< callout type="info" >}}
Threat modeling tools and methodologies should be selected based on organizational preferences. Results can be documented in GitHub.
{{< /callout >}}

#### PW.2: Review the software design to verify compliance with security requirements

**Summary**: Have qualified reviewers confirm that software design meets security requirements.

**GitHub implementation scope**: *GitHub-native*

**Implementation details**: Use GitHub Projects to track security requirements and verify design compliance.

1. **Link security requirements to design reviews**: Reference security requirement issues (from PO.1)
2. **Security team project access**: Grant security teams read/write access to project boards tracking security requirements
3. **Design compliance verification**: Security team reviews project boards to ensure all in-scope requirements are addressed in the design
4. **Status tracking**: Reviewers validate designs and comment their approval or required changes in the related issue

#### PW.3: Verify third-party software complies with security requirements

{{< callout type="info" >}}
PW.3 has been replaced by PO.1 and PW.4 in NIST SSDF v1.1
{{< /callout >}}

#### PW.4: Reuse existing, well-secured software when feasible

**Summary**: Use vetted libraries and components instead of reimplementing functionality.

**GitHub implementation scope**: *GitHub-native*

**Implementation details**:

Use GitHub policies and dependency management features to enforce secure software reuse.

1. **GitHub Actions policies**: Set [enterprise policies](https://docs.github.com/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise#policies) to only allow actions created by GitHub, verified Marketplace creators, or those that have been explicitly approved. Navigate to Enterprise Policies > Actions > Policies > and configure:

    - [ ] Allow all actions and reusable workflows
    - [ ] Allow enterprise actions and reusable workflows
    - [x] Allow enterprise, and select non-enterprise, actions and reusable workflows
      - [x] Allow actions created by GitHub
      - [x] Allow actions by Marketplace verified creators
      - [x] Allow or block specified actions and reusable workflows
        - actions/*
        - github/*
        - docker/*
        - [etc...]

2. **OIDC for cloud access**: Enforce authentication to cloud providers through [Actions OIDC](https://docs.github.com/enterprise-cloud@latest/actions/concepts/security/openid-connect), restricting access with a [trust condition](https://docs.github.com/enterprise-cloud@latest/actions/how-tos/secure-your-work/security-harden-deployments/oidc-with-reusable-workflows) that includes the `job_workflow_ref` variable. This prevents repositories from configuring cloud access directly and ensures consistent security controls. Store the cloud provider secrets (client ID, tenant ID, subscription ID) as organization secrets so they can be inherited by the caller workflows. Example reusable workflow for Azure access:

    ```yaml
    # .github/workflows/reusable-azure-deploy.yml in your .github repository
    name: Reusable Azure Deployment
    on:
      workflow_call:
        inputs:
          environment:
            required: true
            type: string
            description: 'Target environment (dev, staging, prod)'
          azure-region:
            required: true
            type: string
            description: 'Azure region for deployment'
        secrets:
          azure-client-id:
            required: true
            description: 'Azure client ID for OIDC authentication'
          azure-tenant-id:
            required: true
            description: 'Azure tenant ID for OIDC authentication'
          azure-subscription-id:
            required: true
            description: 'Azure subscription ID for deployment'

    permissions:
      id-token: write
      contents: read

    jobs:
      deploy:
        runs-on: ubuntu-latest
        environment: ${{ inputs.environment }}
        steps:
          - uses: actions/checkout@v5

          - name: Azure Login using OIDC
            uses: azure/login@v2
            with:
              client-id: ${{ secrets.azure-client-id }}
              tenant-id: ${{ secrets.azure-tenant-id }}
              subscription-id: ${{ secrets.azure-subscription-id }}

          # Deployment steps would follow
          - name: Deploy to Azure
            run: |
              echo "Deploying to ${{ inputs.environment }} in ${{ inputs.azure-region }}"
              # Add your deployment commands here
    ```

    Consumer repositories call this workflow instead of configuring cloud access directly:

    ```yaml
    # In a repository's .github/workflows/deploy.yml
    name: Deploy to Azure
    on:
      push:
        branches: [main]

    jobs:
      deploy:
        uses: my-org/.github/.github/workflows/reusable-azure-deploy.yml@main
        with:
          environment: production
          azure-region: eastus
        secrets:
          azure-client-id: ${{ secrets.AZURE_CLIENT_ID }}
          azure-tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          azure-subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
    ```

    Benefits of centralized OIDC workflows:

    - No long-lived cloud credentials stored in GitHub secrets
    - Consistent security controls across all cloud deployments
    - Centralized audit trail of cloud access
    - Simplified credential rotation and revocation
    - Reduced blast radius if a repository is compromised

3. **Dependabot alerts**: Enable Dependabot [alerts](https://docs.github.com/enterprise-cloud@latest/code-security/dependabot/dependabot-alerts/about-dependabot-alerts) and automated [security updates](https://docs.github.com/enterprise-cloud@latest/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates) for known vulnerabilities in dependencies.

4. **Dependency review**: Use the [dependency review](https://github.com/actions/dependency-review-action) action to block new vulnerable dependencies and open-source software with non-compliant licenses. Refer to the example workflow file in section PW.5.

#### PW.5: Create source code by adhering to secure coding practices

**Summary**: Follow secure coding standards to minimize vulnerabilities.

**GitHub implementation scope**: *GitHub-native*

**Implementation details**:

Use security configurations to enable and enforce security scanning, then use repository rulesets to prevent vulnerable code from being merged.

1. **Security configurations**: Refer to section PO.3 for detailed guidance on using GitHub's [security configurations](https://docs.github.com/enterprise-cloud@latest/code-security/how-tos/secure-at-scale/configure-enterprise-security/establish-complete-coverage/creating-a-custom-security-configuration-for-your-enterprise) to enable and enforce code scanning, secret scanning, and Dependabot across all repositories.

2. **Repository rulesets for code scanning enforcement**: Use [repository rulesets](https://docs.github.com/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) to require code scanning results before code is merged. Configure the severity threshold for code scanning results that will fail a status check and block PRs from merging. This prevents net-new vulnerabilities from being introduced unless an authorized user intentionally bypasses the requirement. All bypass activity is captured by GitHub's audit log and reviewable in the ruleset insights tab, providing visibility for emergency deployments.

   Example repository ruleset configuration:

   - [x] Require code scanning results
     - Tool: `CodeQL`
     - Security alerts: `High or higher`
     - Alerts: `Error` (blocks merge)

   This configuration ensures that pull requests introducing high or critical severity vulnerabilities cannot be merged without explicit bypass authorization, which is logged and auditable.

3. **Repository rulesets for dependency review**: Enforce a required workflow that includes [Dependency Review](https://docs.github.com/enterprise-cloud@latest/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review), which catches and blocks PR merges when changes introduce net-new vulnerable dependencies or add dependencies with restricted licenses. Configure dependency review as a required workflow in your repository rulesets to ensure consistent enforcement.

   Example dependency review workflow:

   ```yaml
   name: Dependency Review
   on: [pull_request]

   permissions:
     contents: read
     pull-requests: write

   jobs:
     dependency-review:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout code
           uses: actions/checkout@v5

         - name: Dependency Review
           uses: actions/dependency-review-action@v4
           with:
             # Block pull requests with vulnerabilities at moderate severity or higher
             fail-on-severity: moderate
             # Block dependencies with incompatible licenses
             deny-licenses: GPL-2.0, GPL-3.0, LGPL-2.0, LGPL-3.0, AGPL-3.0
             # Post detailed summary in PR comments
             comment-summary-in-pr: always
   ```

4. **Secret scanning push protection**: Always aim to enable secret scanning push protection organization-wide. When first establishing new secret scanning custom patterns, allow bypass to soft-block developers while you analyze the frequency and use cases for false positives and refine your patterns. Once patterns are validated, consider removing bypass permissions for critical repositories. Push protection prevents secrets from ever entering the repository history, which is more secure than detection after commit.

#### PW.6: Configure the compilation, interpreter, and build processes to improve executable security

**Summary**: Ensure build processes use secure tools and configurations in highly controlled environments.

**GitHub implementation scope**: *GitHub-native*

**Implementation details**:

Use GitHub-hosted runners to provide secure, ephemeral build environments with up-to-date software.

1. **GitHub-hosted runners**: Use GitHub-hosted runners for all CI/CD workflows to leverage:
   - Automatically updated operating systems and build tools
   - Ephemeral environments that are destroyed after each job
   - Isolation between builds preventing cross-contamination
   - Consistent, hardened base images maintained by GitHub

2. **Runner image selection**: Choose appropriate runner images based on your build requirements:
   - `ubuntu-latest`, `windows-latest`, `macos-latest` for standard builds
   - Larger runner sizes (`ubuntu-latest-4-core`, `ubuntu-latest-8-core`) for resource-intensive builds
   - Runner images are updated weekly with security patches and toolchain updates

3. **Workflow security configurations**:
   - Use pinned action versions with commit SHAs for supply chain security
   - Minimize workflow permissions using the `permissions` key
   - Avoid using self-hosted runners unless absolutely necessary for specialized hardware or network requirements

{{< callout type="info" >}}
GitHub-hosted runners provide a secure-by-default build environment. If self-hosted runners are required, run them on ephemeral VMs or containers, use separate runner groups for different security zones, and never use them for public repositories.
{{< /callout >}}

#### PW.7: Review and/or analyze human-readable code to identify vulnerabilities

**Summary**: Use manual and automated code review to find security issues.

**GitHub implementation scope**: *GitHub-native*

**Implementation details**:

Use repository rulesets to enforce pull request requirements and code review processes, combined with automated and manual security reviews.

1. **Repository rulesets for pull request requirements**: Refer to the repository ruleset guidance in section PW.5 for code scanning enforcement. Additionally, configure repository rulesets to require pull requests before merging to default and protected branches:

   - [x] Require pull request before merging
     - [x] Required approving reviews: 1 (or more, depending on your risk tolerance)
     - [x] Dismiss stale pull request approvals when new commits are pushed
     - [x] Require review from Code Owners
     - [x] Require approval of the most recent reviewable push

   Use [CODEOWNERS](https://docs.github.com/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) files to identify and automatically tag required reviewers for security-sensitive code paths. This ensures that changes to critical areas (authentication, authorization, cryptography, payment processing, and the `.github` directory) are always reviewed by security champions or lead developers.

2. **Automated code scanning**: Enable CodeQL or other SAST tools for automated security analysis. Require code scanning results in your repository rulesets to ensure all pull requests are scanned before merging.

3. **Code review suggestions**: Use review comments to propose fixes directly in the pull request. Reviewers can suggest specific code changes that address concerns, and authors can apply them with a single click.

4. **Copilot code review**: Automatically request [Copilot code review](https://docs.github.com/enterprise-cloud@latest/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui) with [custom instructions](https://docs.github.com/enterprise-cloud@latest/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui#customizing-copilots-reviews-with-custom-instructions) that emphasize security to automate initial security review.

**Complete repository ruleset example for PW.7**:

- [x] Require pull request before merging
  - [x] Required approving reviews: 1
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require review from Code Owners
  - [x] Require approval of the most recent reviewable push

- [x] Require code scanning results
  - [x] CodeQL - Security alerts: `High or higher`, Alerts: `Error`

- [x] Automatically request Copilot code review

#### PW.8: Test executable code to identify vulnerabilities

**Summary**: Use dynamic testing, fuzzing, and other runtime analysis to find security issues.

**GitHub implementation scope**: *GitHub Integration*

**Implementation details**:

Integrate testing tools into GitHub Actions and upload SARIF results to GitHub code scanning.

1. **DAST integration**: Run dynamic application security testing on test deployments using Actions workflows
2. **Container scanning**: Scan container images for vulnerabilities using third-party Actions (e.g., Trivy)
3. **Penetration testing**: Document penetration testing findings in GitHub Issues

**Example container scanning workflow**:

```yaml
name: Container Security Scan
on:
  push:
    branches: [main]
  pull_request:

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Build container image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Run Trivy scanner
        uses: aquasecurity/trivy-action@b6643a29fecd7f34b3597bc6acb0a98b03d33ff8 # v0.33.1
        with:
          image-ref: 'myapp:${{ github.sha }}'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'
```

#### PW.9: Configure software to use secure settings by default

**Summary**: Verify that released software has secure default configurations.

**GitHub implementation scope**: *Out of scope*

### Respond to Vulnerabilities (RV)

#### RV.1: Identify and confirm vulnerabilities on an ongoing basis

**Summary**: Continuously monitor for new vulnerabilities in software and dependencies.

**GitHub implementation scope**: *GitHub-native*

**Implementation details**:

1. **Security Overview**: Use the multi-level [Security Overview](https://docs.github.com/enterprise-cloud@latest/code-security/security-overview/about-security-overview) dashboard to monitor vulnerability status:
   - **Enterprise level**: Aggregate security posture across all organizations
   - **Organization level**: View alert trends, coverage gaps, and enablement status across repositories
   - **Repository level**: Detailed alert status and remediation progress

2. **Audit log streaming**: Stream [audit log events](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise) to your SIEM for long-term retention, correlation with other security events, and compliance reporting.

3. **Webhooks for automated response**: Configure [webhooks](https://docs.github.com/enterprise-cloud@latest/webhooks/about-webhooks) to automatically respond to security alert events.

#### RV.2: Assess, prioritize, and remediate vulnerabilities

**Summary**: Triage and fix identified vulnerabilities based on risk.

**GitHub implementation scope**: *GitHub-native*

**Implementation details**:

1. **Security alerts**: Review and triage alerts in the Security tab
2. **Dependabot security updates**: Automatically generate PRs for dependency updates
3. **Repository custom properties**: Use [custom properties](https://docs.github.com/enterprise-cloud@latest/organizations/managing-organization-settings/managing-custom-properties-for-repositories-in-your-organization) to classify repositories by business criticality, enabling risk-based prioritization of alerts
4. **Security campaigns**: Use [security campaigns](https://docs.github.com/enterprise-cloud@latest/code-security/securing-your-organization/tracking-security-work-across-your-organization/about-security-campaigns) to prioritize and coordinate remediation of specific alert types across repositories
5. **Copilot Autofix**: Use [Copilot Autofix](https://docs.github.com/enterprise-cloud@latest/code-security/code-scanning/managing-code-scanning-alerts/about-autofix-for-codeql-code-scanning) to automatically generate fix suggestions for vulnerabilities identified by CodeQL

{{< callout type="info" >}}
For more detailed guidance per alert type, refer to [Prioritizing Security Alert Remediation](https://wellarchitected.github.com/library/application-security/recommendations/prioritizing-alerts/).
{{< /callout >}}

#### RV.3: Analyze vulnerabilities to identify their root causes

**Summary**: Perform root cause analysis to prevent similar vulnerabilities.

**GitHub implementation scope**: *GitHub-native*

**Implementation details**:

1. Use GitHub Issues to document root cause analysis
2. Link related vulnerabilities using issue references
3. Create post-mortem templates for security incidents
4. Track systemic issues in Projects
5. Use Discussions for collaborative analysis

**Root cause analysis template**:

```markdown
## Vulnerability Root Cause Analysis

**Vulnerability ID**: CVE-YYYY-XXXXX or GHSA-XXXXX
**Date Identified**: YYYY-MM-DD
**Severity**: Critical/High/Medium/Low

### Summary
Brief description of the vulnerability.

### Root Cause
What underlying issue allowed this vulnerability to exist?

### Contributing Factors
- Development process gaps
- Tool/automation gaps
- Training gaps
- Design/architecture issues

### Similar Issues
- Link to related vulnerabilities
- Common patterns identified

### Preventive Actions
- [ ] Process improvements
- [ ] Tool/automation enhancements
- [ ] Training updates
- [ ] Architecture changes
- [ ] Code scanning rules

### Lessons Learned
Key takeaways to prevent recurrence.
```

## Additional solution detail and trade-offs to consider

### Implementation approach

**Phased rollout**: Implementing NIST SSDF compliance across an organization is a significant undertaking. Consider a phased approach:

1. **Phase 1 - Foundation**: Enable core security features (SSO, MFA, audit logging)
2. **Phase 2 - Detection**: Activate scanning capabilities (code scanning, secret scanning, Dependabot)
3. **Phase 3 - Enforcement**: Implement rulesets, required workflows, and automated policy enforcement
4. **Phase 4 - Optimization**: Fine-tune configurations, develop custom queries, and streamline processes

**Pilot programs**: Start with a subset of critical repositories (5-10 repositories) or teams to validate configurations and workflows before organization-wide rollout. Successful pilots typically run 4-6 weeks and identify ~80% of edge cases and configuration issues before broader deployment.

**Lessons learned from field deployments**:

- Communicate early and often with development teams about upcoming changes
- Provide self-service documentation and troubleshooting guides
- Establish clear escalation paths for security exceptions
- Celebrate quick wins and security improvements to build momentum

### GitHub Enterprise Cloud vs. Server

**GitHub Enterprise Cloud** provides the most comprehensive feature set for SSDF compliance.

**GitHub Enterprise Server** supports most SSDF practices but may lag behind Cloud in feature availability. Organizations with air-gapped or on-premises requirements should evaluate feature parity for their GHES version.

**GitHub Enterprise Cloud with Enterprise Managed Users (EMU)** provides enhanced security and governance for organizations requiring strict control over identity and access management.

### Tool integration trade-offs

**GitHub-native vs. third-party tools**: GitHub Advanced Security provides comprehensive scanning capabilities that integrate seamlessly with the platform. However, organizations may need to supplement with specialized tools for:

- Interactive application security testing (IAST)
- Runtime application self-protection (RASP)
- Dynamic application security testing (DAST)
- Container scanning
- Threat modeling

**Integration approach**: When integrating external tools:

- Use GitHub Actions for orchestration
- Upload code scanning results to GitHub Security tab using SARIF format
- Implement tools as required status checks

### Automation boundaries

**What to automate**: Security scanning, dependency updates, policy enforcement, artifact generation, and basic triage should be fully automated to ensure consistency and reduce human error.

**What requires human judgment**: Security design reviews, risk acceptance decisions, root cause analysis, and security exceptions require human expertise and should not be fully automated.

### Audit and compliance considerations

**Evidence generation**: GitHub provides extensive audit trails through:

- Audit log API and streaming
- Workflow run histories and artifacts
- Security alert histories
- Git commit history
- Release artifacts and attestations

**Retention requirements**: Configure audit log streaming to a SIEM or log management system for long-term retention that exceeds GitHub's default retention periods.

**Third-party audits**: GitHub's audit capabilities and artifact generation features provide evidence for SOC 2, FedRAMP, and other compliance audits. Ensure your configuration generates the specific artifacts required by your auditors.

### Performance and scalability

**Code scanning impact**: CodeQL and other SAST tools can increase CI/CD pipeline duration. Optimize by:

- Parallelizing scans across languages
- Caching build dependencies
- Using larger runners for resource-intensive scans

**Large organization scaling**: Organizations with thousands of repositories should:

- Use organization-level rulesets instead of per-repository configuration
- Leverage security configurations for consistent settings across repositories
- Use required workflows to enforce security scans
- Implement repository custom properties for targeted policy application

### Common implementation challenges

**Developer experience**: Security controls can be perceived as friction. Address this by:

- Providing clear documentation and training
- Automating fix suggestions (Copilot Autofix, Dependabot PRs)
- Establishing reasonable response SLAs
- Creating fast feedback loops
- Offering self-service exception processes for legitimate use cases

**False positive management**: Scanning tools can generate false positives. Mitigate by:

- Documenting alert dismissal rationales
- Regularly reviewing dismissed alert reasons

**Legacy code challenges**: Existing codebases may have numerous security findings. Approach with:

- Risk-based prioritization focusing on high-severity issues
- Gradual remediation tied to normal development work
- Clear separation of new vs. legacy code expectations
- Baseline establishment with improvement targets

### Cost considerations

**Actions minutes**: Security scanning consumes Actions minutes. Manage costs through:

- Using larger runners for faster execution
- Optimizing scan frequency
- Leveraging caching

**External tool costs**: Third-party integrations may have separate licensing costs. Evaluate whether GitHub-native features can meet requirements before adding external tools.

## Seeking further assistance

{{% seeking-further-assistance-details %}}

## Related links

{{% related-links-github-docs %}}

### External resources

- [NIST SP 800-218: Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)
- [Supply-chain Levels for Software Artifacts (SLSA)](https://slsa.dev/)
