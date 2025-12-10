---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false
title: 'Scaling GitHub Actions Reusability in the Enterprise'
publishDate: 2025-04-10
params:
  authors: [{ name: 'Suleiman Suleiman', handle: 'ssulei7' }]

pillars:
  - Collaboration
  - Productivity

areas:
  - Innersourcing
  - Continuous Delivery
  - Continuous Integration

verticals:
  - Finance
  - Retail

personas:
  - DevOps Champion
  - Security Team
  - Developer

platform:
  - GitHub Enterprise Cloud (GHEC)
  - GitHub Enterprise Server (GHES)

features:
  - github-actions

components:
  - Reusable Workflow Templates
  - Composite Actions
  - Custom Actions
  - Branch Rulesets

github:
  - CODEOWNERS
  - Dependabot
---

<!-- This disables the linting rule for long line length -->
<!-- markdownlint-disable MD013 -->

<!-- This disables the linting rule for multiple top-level headers -->
<!-- markdownlint-disable MD025 -->

<!--
See our CONTRIBUTING doc for submission details and additional writing style guidelines: https://github.com/github/github-well-architected-internal/blob/main/.github/CONTRIBUTING.md
-->

## Scenario overview

As organizations scale their use of GitHub Actions, managing the reusability of workflows and actions across multiple teams becomes increasingly challenging. Without a centralized system, developers may struggle to locate shared resources, leading to duplication of effort, inconsistent practices, and a lack of visibility into the available tools and solutions. This lack of cohesion hinders collaboration and slows down development cycles.

The consequences of this fragmentation often manifest as:

- Inconsistent security controls across different repositories
- Redundant implementation of similar CI/CD patterns
- Difficulty in enforcing organizational standards
- Inefficient knowledge sharing between teams
- Increased maintenance burden when updates are needed across multiple repositories

To address these challenges, this solution proposes scaling the reusability of workflows, custom actions, and composite actions across the enterprise. It introduces the concept of creating a dedicated organization to host shared workflows and actions, and offers best practices for managing and contributing to these resources. This organization acts like an internal "marketplace," enabling teams to discover and reuse existing workflows and actions, or contribute their own. By applying inner sourcing principles, this marketplace will facilitate seamless collaboration, improve the discoverability of actions, and foster a culture of shared ownership across teams. The goal is to streamline the adoption of best practices and accelerate development by maximizing the reuse of workflows and actions throughout the enterprise.

Successful implementation of this approach can lead to:

- Up to 40% reduction in CI/CD configuration time
- Faster onboarding of new projects and team members
- Consistent application of security and compliance controls
- Improved governance through centralized oversight
- More resilient delivery pipelines with standardized error handling

## Key design strategies and checklist

The following strategic approaches form the foundation for successfully scaling GitHub Actions reusability across an enterprise environment:

1. **Understanding common use cases across the enterprise:** Conduct a comprehensive analysis of workflow patterns and technical requirements to identify high-impact reuse opportunities.

2. **Create a dedicated GitHub organization for shared resources:** Establish a centralized hub that serves as your internal marketplace for discovering and contributing to reusable components.

3. **Define robust contribution guidelines and best practices:** Develop clear standards for code quality, documentation, and validation to maintain consistency and reliability.

4. **Implement standardized naming conventions:** Create intuitive, descriptive naming patterns that improve discoverability and indicate functional purpose.

5. **Educate and enable teams:** Provide comprehensive documentation, training, and support to drive adoption and proper implementation.

6. **Maintain through regular reviews:** Conduct periodic assessments to ensure resources remain relevant, secure, and aligned with evolving organizational needs.

This strategic framework provides a structured approach to implementing and maintaining a scalable, enterprise-wide system for GitHub Actions reusability.

## Assumptions and preconditions

Before implementing this solution, ensure the following preconditions are met to maximize success:

- **GitHub as primary development platform:** Development teams already use GitHub for day-to-day collaboration, so creating a shared organization, repository, etc. requires minimal additional tooling.

- **Executive sponsorship:** Organizational leadership or an appointed working group endorses a move toward centralized governance of shared workflows. This ensures buy-in from critical stakeholders and removes potential organizational barriers.

- **Git workflow familiarity:** Contributors are familiar with GitHub Flow or a similar branching strategy, easing their adoption of a single source-of-truth repository for all templates.

- **Existing Actions usage:** Teams are already using GitHub Actions for CI/CD and have basic familiarity with workflows, which reduces the learning curve for adopting centralized resources.

- **Cross-team collaboration channels:** Communication pathways exist for teams to discuss and coordinate on shared resources, such as Slack channels, Teams channels, discussion forums, etc.

- **Permissions management strategy:** A clear approach exists for managing permissions and access control to the centralized organization, balancing security with the need for broad contribution.

## Recommended deployment

### 1. Understanding common use cases across the enterprise

Before creating a dedicated organization for shared workflows and actions, it’s crucial to understand the common use cases across your enterprise. Doing so not only helps you identify the most impactful workflows and actions to centralize, but also ensures that the dedicated organization will meet the majority of teams’ needs. You might ask, “What exactly qualifies as a common use case?” Here are some examples:

- Review technical stacks and identify language-specific needs to determine which workflows offer the most value
- Identify common patterns across teams such as testing and release pipelines that could be standardized
- Catalog essential security checks needed across projects (DAST, SAST, dependency scanning)
- Evaluate deployment approaches (container-based, cloud platforms) that would benefit from standardization
- Group these identified workflows into logical shared templates to promote consistent practices
- Centralize implementation to streamline repository hygiene and simplify updates across teams

A recommended first step is to gather data around your organization. It can be especially helpful to build an initial report showing the overall language footprint within your enterprise. This can be done quickly by using the GitHub REST API or leveraging tools like the GitHub CLI.

For example, you can use the [gh-language](https://github.com/CallMeGreg/gh-language) GitHub CLI extension to get a breakdown of language frequency across your organization. This extension simplifies the process by providing a concise summary of the languages used in your repositories.

To use the extension, follow these steps:

1. Install the GitHub CLI if you haven't already. See the [installation instructions](https://cli.github.com/).
2. Install the `gh-language` extension:

   ```bash
   gh extension install CallMeGreg/gh-language
   ```

3. Run the extension to analyze your organization's repositories:

   ```bash
   gh language trend --org <your-org-name> --repo-limit <number-of-repos-in-your-org>
   ```

The output will provide a detailed breakdown of the languages used across your organization's repositories, by year the repo was created, helping you identify the most prevalent languages as well as recent trends. This insight can guide your efforts to centralize workflows and actions that align with your organization's needs.

{{< callout type="info" >}}
For more details on the `gh-language` extension, including additional options and usage examples, visit the [GitHub repository](https://github.com/CallMeGreg/gh-language).
{{< /callout >}}

Once you have compiled a list of all languages used in your enterprise, identify which ones are most prevalent. This analysis will reveal your organization's language footprint and guide you toward the most valuable workflows and actions to centralize. When evaluating this data, consider these key metrics:

- Number of repositories using each language
- Types of workflows associated with each language
- Potential challenges in language-specific workflows
- Common tools and libraries used in different languages

With these insights, you can now determine which actions or workflows will have the greatest impact across your teams. This understanding will guide you in prioritizing the development and centralization of workflows that will benefit the largest number of teams, ensuring that your efforts are focused on the most critical areas.

### 2. Create a dedicated GitHub organization to host shared workflows and actions

Establishing a dedicated GitHub organization for shared workflows and actions provides a centralized location for teams to discover, contribute, and manage reusable resources. This organization acts as a hub for collaboration and ensures that workflows and actions are easily accessible to all teams.

#### Organization Structure and Setup

1. **Organization Creation and Naming**
   - Choose a name that clearly identifies the organization's purpose (e.g., "acme-shared-actions")
   - Configure appropriate organization settings, including security features like 2FA requirements
   - Define an organizational README.md that explains the purpose and how to navigate the resources

2. **Repository Structure**
   - Create repositories based on functional categories:
     - `security-workflows`: For security scanning, vulnerability assessments, and compliance checks
     - `deployment-workflows`: For various deployment patterns (Kubernetes, cloud providers, etc.)
     - `build-workflows`: For language-specific build processes
     - `testing-workflows`: For unit, integration, and end-to-end testing workflows
     - `utility-actions`: For reusable utility actions that can be composed into larger workflows

3. **Governance and Access Control**
   - Create dedicated teams with appropriate permissions:
     - `actions-admins`: Organization administrators who manage settings and permissions
     - `actions-maintainers`: Contributors who can approve PRs and manage repositories
     - `actions-contributors`: Regular contributors who submit PRs but cannot merge directly
     - `actions-users`: Read-only access for teams that only need to use the workflows

   {{< callout type="note" >}}
   For most organizations, the `actions-users` team may be unnecessary since GitHub Actions composite actions and reusable workflows only need to be visible (internal or public) to be consumed. If your repositories are set to "internal" visibility, any authenticated user in your enterprise can already use these workflows without needing explicit team membership. Consider this team only if you need to provide access to private repositories or track usage more granularly.
   {{< /callout >}}

4. **Infrastructure and CI/CD Setup**

- Set up branch rulesets to enforce code review and CI checks
  {{< callout type="info" >}}
  GitHub branch rulesets provide more flexible and powerful options for protecting branches than the legacy branch protection rules. For detailed implementation instructions, refer to the [GitHub documentation on branch rulesets](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets).
  {{< /callout >}}
  Key ruleset configurations to consider:
  - Require status checks to pass before merging
  - Require pull request reviews before merging
  - Require signed commits
  - Block force pushes
  - Restrict who can delete the branch
  - Require reviews from code owners

- Implement CODEOWNERS files to ensure the right experts review changes:

  ```plaintext
  # Example CODEOWNERS file
  /security-workflows/ @security-team
  /deployment-workflows/ @platform-team
  /build-workflows/java/ @java-team
  ```

- Enable Dependabot for dependency management with appropriate configurations:

  ```yaml
  # Example dependabot.yml
  version: 2
  updates:
    - package-ecosystem: 'github-actions'
      directory: '/'
      schedule:
        interval: 'weekly'
      assignees:
        - 'security-team'
  ```

  {{< callout type="info" >}}
  For a complete reference on Dependabot configuration options, including advanced settings like version constraints, commit message formatting, and custom labels, refer to the [GitHub Dependabot configuration documentation](https://docs.github.com/en/enterprise-cloud@latest/code-security/dependabot/working-with-dependabot/dependabot-options-reference).
  {{< /callout >}}

1. **Discoverability Features**
   - Create an index repository that catalogs all available workflows and actions
   - Implement GitHub Topics for better categorization and searchability
   - Set up GitHub Pages to host comprehensive documentation
   - Configure custom repository properties to enhance filtering and discovery

   {{< callout type="info" >}}
   Custom repository properties allow you to define organization-specific metadata that can be used for filtering repositories in the repository search interface. For detailed implementation instructions, refer to the [GitHub documentation on custom properties](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/managing-custom-properties-for-repositories-in-your-organization).
   {{< /callout >}}

   Example custom properties to consider:

   | Property Name | Type     | Options/Description                             |
   | ------------- | -------- | ----------------------------------------------- |
   | Language      | Dropdown | JavaScript, Python, Java, .NET, Ruby, Go        |
   | Category      | Dropdown | Security, Build, Test, Deploy, Release, Utility |
   | Compliance    | Dropdown | SOC2, PCI-DSS, HIPAA, GDPR, None                |
   | Maturity      | Dropdown | Alpha, Beta, GA, Deprecated                     |
   | Platform      | Dropdown | AWS, Azure, GCP, On-Premise, Multi-Cloud        |

By implementing this structured approach, you'll create a well-organized, governed central repository of workflows and actions that teams can trust and easily navigate.

### 3. Define contribution guidelines and best practices for adding new workflows and actions

To maintain the quality and consistency of shared workflows and actions, it is essential to establish clear contribution guidelines and best practices. A robust contribution framework ensures that all shared resources meet organizational standards and provide value to teams across the enterprise.

#### Documentation Requirements

Create a standardized documentation template that contributors must follow when submitting new workflows or actions. This template should be included in your organization's contribution guidelines and enforced during the review process.

A comprehensive documentation template should include the following key sections:

1. **Basic Information**
   - Workflow name and description
   - Purpose and problem it solves

2. **Configuration Details**
   - Input parameters (name, description, required status, default values)
   - Output parameters (name, description)
   - Example usage with sample code

3. **Ownership Information**
   - Maintainers (teams or individuals responsible)
   - Version history tracking changes

4. **Lifecycle Management**
   - Versioning strategy (semantic versioning recommended)
     - Consider whether related workflows should be versioned together or separately
     - When workflows are tightly coupled or frequently used together, coordinating their releases can simplify version management for consumers
     - Separate versioning provides more flexibility but requires careful tracking of compatibility between interrelated workflows
   - Deprecation process and timeline
   - Maintenance responsibilities and SLAs

The template should enforce consistent documentation practices across all shared workflows and actions, making it easier for users to understand and properly implement them in their projects.

By implementing these comprehensive contribution guidelines, you ensure that your shared workflows and actions remain high-quality, well-documented, and maintainable throughout their lifecycle.

### 4. Define and document naming conventions for actions and templates

Consistent naming conventions are crucial for improving the discoverability and usability of shared workflows and actions. Well-designed naming patterns provide immediate context about a workflow's purpose, scope, and compatibility.

#### Naming Pattern Structure

Adopt a consistent structure for all shared resources:

```plaintext
[category]-[function]-[scope]-[language/platform]
```

For example:

- `sec-scan-repo-js`: A security scanning workflow for JavaScript repositories
- `build-package-lib-dotnet`: A workflow for building .NET libraries
- `deploy-app-aks-node`: A deployment workflow for Node.js applications to Azure Kubernetes Service

#### Category Prefixes

Standardize prefixes to indicate the primary function:

| Prefix     | Purpose                          | Examples                                   |
| ---------- | -------------------------------- | ------------------------------------------ |
| `sec-`     | Security scanning and compliance | `sec-scan-sast`, `sec-compliance-hipaa`    |
| `build-`   | Build processes                  | `build-app-java`, `build-lib-python`       |
| `test-`    | Testing workflows                | `test-unit-java`, `test-e2e-browser`       |
| `deploy-`  | Deployment processes             | `deploy-app-azure`, `deploy-function-aws`  |
| `release-` | Release management               | `release-tag-npm`, `release-publish-maven` |
| `util-`    | Utility actions                  | `util-cache-deps`, `util-notify-slack`     |

#### Version Indicators

Include version indicators in references to support multiple concurrent versions:

- Tag-based references: `organization/repository/workflow.yml@v1.2.3`
- Major version references: `organization/repository/workflow.yml@v1`
- SHA-based references for immutable links: `organization/repository/workflow.yml@5f41d5`

#### Naming Best Practices

1. **Be specific and unambiguous:** Avoid generic names like "build" or "deploy" without additional context.

2. **Keep names reasonably short:** Balance descriptiveness with usability – names should be comprehensive but not unwieldy.

3. **Use consistent terminology:** Create and maintain a glossary of approved terms to ensure consistency.

4. **Avoid team or project names:** Focus on function rather than origin to promote reuse across the organization.

5. **Include platform specifics when relevant:** If a workflow is specific to a platform or service, include that information in the name.

#### Example Naming Schema

```plaintext
Repository: security-workflows
  ├── sec-scan-dependencies.yml    # Generic dependency scanning
  ├── sec-scan-dependencies-npm.yml # NPM-specific dependency scanning
  ├── sec-scan-sast-java.yml      # Java static analysis
  ├── sec-scan-sast-dotnet.yml    # .NET static analysis
  └── sec-compliance-report.yml   # Generic compliance reporting

Repository: deployment-workflows
  ├── deploy-app-azure-web.yml    # Azure Web App deployment
  ├── deploy-app-aws-ecs.yml      # AWS ECS deployment
  ├── deploy-app-gcp-cloudrun.yml # GCP Cloud Run deployment
  └── deploy-static-gh-pages.yml  # GitHub Pages deployment
```

By implementing these standardized naming conventions, you make it significantly easier for teams to discover, understand, and appropriately use shared resources, increasing adoption and consistency across your organization.

### 5. Educate teams on how to reference centralized workflows in their repositories

To maximize the adoption of centralized workflows / actions, it is essential to create a comprehensive education and enablement program. This ensures teams understand both how to use shared resources and the value they provide.

#### Documentation and Reference Materials

1. **Comprehensive User Guide**
   - Create a central documentation site using GitHub Pages
   - Include searchable catalogs of available workflows and actions
   - Provide detailed integration instructions with copy-paste examples

2. **Quick Start Templates**
   - Create repository templates that already include references to common workflows
   - Provide ".github" directory templates that teams can copy into their repositories
   - Include example configuration files with inline documentation

3. **Reference Examples**

   ```yaml
   # Example of referencing a reusable workflow
   name: Build and Test

   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]

   jobs:
     build:
       uses: acme-shared-actions/build-workflows/.github/workflows/build-java-maven.yml@v2
       with:
         java-version: '17'
         run-tests: true
       secrets:
         maven-repo-token: ${{ secrets.MAVEN_REPO_TOKEN }}
   ```

#### Training and Support Channels

1. **Structured Learning Path**
   - Create a series of progressive tutorials from basic to advanced usage
   - Record short video demonstrations for visual learners
   - Develop interactive labs where teams can practice implementation

2. **Office Hours and Support**
   - Schedule regular office hours where experts are available for questions
   - Create a dedicated Slack/Teams channel for workflow-related support
   - Implement a "buddy system" pairing experienced users with new adopters

3. **Champions Program**
   - Identify and train champions within each team or department
   - Provide these champions with advanced training and early access to new workflows
   - Recognize and reward contributions to increase motivation

#### Adoption Metrics and Incentives

1. **Usage Tracking**
   - Implement telemetry in shared workflows to track usage patterns
   - Create dashboards showing adoption rates across teams
   - Use metrics to identify teams that may need additional support

2. **Recognition System**
   - Highlight teams with high adoption rates in company communications
   - Create a leaderboard for workflow contributions and usage
   - Share success stories and case studies from early adopters

3. **Feedback Loop**
   - Create a simple mechanism to collect user feedback
   - Regularly survey teams about their experience
   - Use feedback to continuously improve documentation and workflows

By implementing a comprehensive education and enablement strategy, you can accelerate adoption and ensure teams are using shared workflows effectively and consistently across the organization.

### 6. Schedule quarterly reviews of the dedicated actions organization

Regular reviews of the dedicated Actions organization are essential to ensure that shared workflows and actions remain relevant, effective, and aligned with organizational goals. Implementing a structured review process ensures continuous improvement and adaptation to changing needs.

#### Review Components and Schedule

Create a quarterly review cadence with the following components:

| Timeline | Activity             | Participants           | Outputs                                         |
| -------- | -------------------- | ---------------------- | ----------------------------------------------- |
| Week 1   | Data Collection      | Platform Team          | Usage metrics, adoption rates, issue analysis   |
| Week 2   | Stakeholder Feedback | Team Representatives   | Feedback summary, pain points, feature requests |
| Week 3   | Technical Assessment | Subject Matter Experts | Security assessments, performance analysis      |
| Week 4   | Planning and Roadmap | Working Group          | Updated roadmap, prioritized improvements       |

#### Metrics and Analysis

Focus on collecting and analyzing these key metrics:

1. **Usage Statistics**
   - Track workflow runs by repository and team
   - Measure adoption rates across the organization
   - Identify usage patterns and trends over time
   - Monitor performance metrics like execution time and success rates

2. **Quality Indicators**
   - Track issues reported against shared workflows
   - Analyze failure rates and common failure points
   - Monitor security vulnerabilities in dependencies
   - Evaluate test coverage and reliability

3. **Developer Experience**
   - Gather feedback on usability and documentation quality
   - Measure time spent troubleshooting workflow issues
   - Track support requests and recurring questions
   - Assess learning curve for new teams adopting workflows

#### Review Process Implementation

1. **Pre-Review Preparation**
   - Generate usage reports from GitHub API data
   - Distribute surveys to team representatives
   - Compile a list of open issues and enhancement requests
   - Prepare a summary of industry trends and best practices

2. **Collaborative Review Session**
   - Present usage data and key findings
   - Facilitate discussion on pain points and opportunities
   - Prioritize improvements based on impact and effort
   - Assign ownership for action items

3. **Post-Review Actions**
   - Document decisions and update roadmap
   - Communicate changes to all stakeholders
   - Schedule implementation of high-priority improvements
   - Set benchmarks for the next quarterly review

#### Continuous Improvement Cycle

Establish a feedback loop that translates insights into tangible improvements:

```plaintext
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Collect Data  │────>│  Analyze &    │────>│  Prioritize   │
│ and Feedback  │     │  Identify Gaps│     │  Improvements │
└───────────────┘     └───────────────┘     └───────────────┘
       ▲                                            │
       │                                            │
       │                                            ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Measure      │<────│  Implement    │<────│   Create      │
│  Results      │     │  Changes      │     │   Action Plan │
└───────────────┘     └───────────────┘     └───────────────┘
```

By implementing this comprehensive review process, you ensure that your shared workflows and actions continuously evolve to meet the changing needs of your organization, maintain high quality standards, and deliver increasing value over time.

## Additional solution detail and trade-offs to consider

When implementing centralized workflows and actions, organizations must carefully consider several trade-offs and balance competing concerns to achieve optimal results.

### Benefits and Advantages

1. **Efficiency Gains**
   - Reduces duplication of effort across teams by 30-50%
   - Accelerates onboarding of new projects by providing ready-to-use workflows
   - Enables faster responses to security vulnerabilities by updating shared components

2. **Quality and Consistency**
   - Establishes organization-wide standards for CI/CD practices
   - Ensures consistent application of security and compliance controls
   - Reduces errors through thoroughly tested and validated workflows

3. **Knowledge Sharing**
   - Facilitates cross-team learning and collaboration
   - Creates a repository of organizational knowledge and best practices
   - Enables specialists to share expertise across project boundaries

### Challenges and Mitigations

1. **Governance Challenges**

   | Challenge                                   | Impact                                                 | Mitigation Strategy                                                         |
   | ------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- |
   | Overly restrictive governance               | Slow adoption, frustration                             | Tiered access model with different levels of review based on impact         |
   | Too little oversight                        | Quality issues, security risks                         | Automated validation combined with human review for critical components     |
   | Balancing customization vs. standardization | Either rigid standards or inconsistent implementations | Create configurable workflows with reasonable defaults but flexible options |

2. **Scaling Considerations**
   - **Resource Bottlenecks:** As the central organization grows, maintainers may become overwhelmed. Establish a federated model where trusted teams have greater autonomy.
   - **Performance Impact:** Shared workflows may have different performance characteristics across teams. Include performance testing and optimization in the review process.
   - **Version Proliferation:** Multiple versions may coexist, requiring clear migration paths. Create automated tools to assist with version upgrades.

3. **Cultural and Organizational Considerations**
   - **"Not Invented Here" Resistance:** Teams may prefer their own solutions. Address by involving teams in the development process and highlighting tangible benefits.
   - **Ownership Concerns:** Questions about who "owns" shared resources. Establish clear accountability with shared responsibility models.
   - **Change Management:** Teams may resist changes to familiar workflows. Provide adequate notice, documentation, and support during transitions.

### Implementation Strategies

Consider these progressive implementation approaches:

1. **Start Small and Expand**
   - Begin with 2-3 high-impact, widely applicable workflows
   - Gather metrics and success stories before expanding
   - Use early wins to build momentum and organizational buy-in

2. **Opt-In vs. Mandatory Adoption**
   - Consider starting with voluntary adoption by teams
   - Gradually make critical security or compliance workflows mandatory
   - Allow reasonable exceptions with documented justification

3. **Federation vs. Centralization Balance**
   - Highly regulated components (security, compliance) → More centralized
   - Team-specific optimizations → More federated
   - Consider a hub-and-spoke model where central templates can be extended

priate mitigation strategies, you can maximize the benefits of centralized workflows while minimizing potential drawbacks.

## Seeking further assistance

{{% seeking-further-assistance-details %}}

## Related links

{{% related-links-github-docs %}}

### Additional Resources

- [GitHub Actions: Reusing workflows](https://docs.github.com/en/enterprise-cloud@latest/actions/sharing-automations/reusing-workflows) - Official documentation on workflow reusability
- [Creating composite actions](https://docs.github.com/en/enterprise-cloud@latest/actions/creating-actions/creating-a-composite-action) - Guide on building composite actions
- [Innersource principles for shared workflows](https://resources.github.com/innersource/fundamentals/) - GitHub's guide to innersource practices
- [Security best practices for GitHub Actions](https://docs.github.com/en/enterprise-cloud@latest/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions) - Essential security considerations
