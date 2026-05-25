---
draft: false
title: 'Expanding the context of Enterprise Custom Agents'
publishDate: 2026-03-11
params:
  # Add and remove authors as needed. Please reserve authorship for significant contributions, not edits and feedback.
  authors: [ { name: 'Anthony Grutta', handle: 'antgrutta' } ]

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - architecture

# The areas of the GitHub adoption journey. Inspiration taken from docs.github.com
areas:
  - developers
  - enterprise-and-teams

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

# Deployment options for GitHub Enterprise, including Cloud (GHEC), Server (GHES), and Hybrid.
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu

# GitHub product functions designed to support every stage of development.
features:
  - copilot

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - coding-agents
  - mcp

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - customer-success-architect
  - customer-success-manager
  - enterprise-support
  - expert-services
  - fast-track
---

<!-- This disables the linting rule for multiple top-level headers -->
<!-- markdownlint-disable MD025 -->

<!--
See our CONTRIBUTING doc for submission details and additional writing style guidelines: https://github.com/github/github-well-architected-internal/blob/main/.github/CONTRIBUTING.md
-->

## Scenario overview

GitHub Enterprise Custom Agents enable organizations to create specialized coding agents tailored to their development workflows, coding standards, and internal processes. These agents are configured at the enterprise level and defined by markdown files stored in the `.github-private` repository of a configured organization, providing context and instructions to guide the Copilot Coding Agent's behavior.

However, the defining markdown file has a **30,000 character limit**, which can be restrictive when providing comprehensive context for complex enterprise environments. When a custom agent is invoked through the GitHub UI, only this singular markdown file is passed as context—all other files in the repository remain inaccessible to the agent during execution.

This limitation becomes particularly challenging for organizations that need to provide extensive guidance on coding patterns, architectural standards, security requirements, and compliance policies. The challenge is further complicated by authentication and access control requirements, especially in GitHub Enterprise Cloud with Managed Users (EMU) and Data Residency environments where secure access to private repositories is essential.

This article provides a prescriptive approach to expanding the available context beyond the single markdown file by leveraging the Model Context Protocol (MCP) and GitHub's built-in MCP server.

## Key design strategies and checklist

### Design strategies

**Centralized knowledge management.** Store additional context files in a structured knowledge directory within the `.github-private` repository. This keeps all custom agent resources in a single, version-controlled location that administrators can manage through standard Git workflows.

**Dynamic context loading.** Instruct custom agents to fetch additional context files at runtime using the GitHub MCP server. This approach allows agents to access expanded context without hitting the single-file character limit, and enables updates to knowledge files without modifying the agent definition.

**Per-repository authentication.** Configure repository-specific access credentials using Copilot environment secrets. This provides fine-grained control over which repositories can access expanded context while maintaining security boundaries.

**Structured content organization.** Organize knowledge files by domain, topic, or concern (e.g., security policies, Docker patterns, CI/CD best practices). This modular approach makes it easier to maintain and update specific areas of guidance as organizational standards evolve.

### Implementation checklist

- [ ] Create a `knowledge` directory in the `.github-private` repository
- [ ] Organize knowledge files using descriptive filenames and subdirectories
- [ ] Update custom agent markdown to include instructions for fetching knowledge files
- [ ] Generate a Personal Access Token (PAT) with `repo` scope for the `.github-private` repository
- [ ] Configure the `copilot` environment in target repositories
- [ ] Add the `COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN` secret to each repository environment
- [ ] Test the agent to verify it successfully fetches and uses expanded context
- [ ] Document the knowledge file structure and maintenance procedures for your team

## Assumptions and preconditions

Before implementing this solution, the following must be in place:

- **GitHub Enterprise Custom Agents enabled.** Your organization has [GitHub Enterprise Custom Agents](https://docs.github.com/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents) configured and the `.github-private` repository created.
- **Model Context Protocol (MCP) configured.** The [Model Context Protocol](https://docs.github.com/enterprise-cloud@latest/copilot/concepts/agents/coding-agent/mcp-and-coding-agent) is enabled in your GitHub Enterprise settings, providing access to the GitHub MCP server.
- **Administrative access.** You have admin access to the `.github-private` repository and permissions to configure environment secrets in target repositories.
- **GitHub Enterprise Cloud.** This solution is designed for GitHub Enterprise Cloud, including EMU and Data Residency environments. It leverages features specific to these platforms.
- **Understanding of custom agents.** Team members responsible for implementing this solution understand how custom agents are defined and invoked.

## Recommended deployment

### Step 1: Create a knowledge directory structure

Create a dedicated `knowledge` directory in the `.github-private` repository to store additional context files. Organize files by domain or topic to make them easier to maintain and reference.

```text
.github-private/
├── agents/
│   ├── security-reviewer.md
│   ├── architecture-advisor.md
│   └── ci-cd-expert.md
└── knowledge/
    ├── security/
    │   ├── secure-coding-standards.md
    │   ├── authentication-patterns.md
    │   └── vulnerability-remediation.md
    ├── architecture/
    │   ├── microservices-patterns.md
    │   ├── api-design-guidelines.md
    │   └── database-standards.md
    └── ci-cd/
        ├── github-actions-best-practices.md
        ├── deployment-workflows.md
        └── container-security.md
```

Use markdown files (`.md`) for textual content as they are easy to edit, version control, and render in GitHub's UI for team review.

### Step 2: Author knowledge files

Create focused knowledge files that contain specific guidance, patterns, or standards. Keep each file focused on a single topic or concern to make them easier to maintain and reuse across multiple custom agents.

**Example: `knowledge/ci-cd/github-actions-best-practices.md`**

```markdown
# GitHub Actions best practices

## Workflow security

- Always pin actions to full commit SHAs rather than tags or branches
- Use OIDC for authentication instead of storing long-lived credentials
- Apply least-privilege permissions using the `permissions` key
- Enable required workflows for critical security and compliance checks

## Performance optimization

- Use caching for dependencies (npm, pip, Maven, etc.)
- Run jobs in parallel when possible using the `needs` strategy
- Use self-hosted runners for builds that require specific infrastructure
- Implement conditional job execution with `if` statements

## Maintainability

- Extract reusable logic into composite actions
- Document all workflow inputs and outputs
- Use workflow templates for common patterns
- Version workflow files alongside application code
```

### Step 3: Update custom agent instructions

Modify the custom agent markdown file to include explicit instructions for fetching knowledge files using the GitHub MCP server. The GitHub MCP server is automatically available when Enterprise Custom Agents are enabled and handles authentication using the configured credentials.

**Example: `agents/ci-cd-expert.md`**

```markdown
# CI/CD Expert Agent

You are a specialized agent that provides guidance on GitHub Actions workflows, deployment strategies, and continuous integration best practices for this organization.

## Critical startup procedures

Before providing any recommendations or assistance, you MUST fetch all required knowledge resources from the organization's knowledge base.

### Required knowledge resources

Use the GitHub MCP server to fetch the following files from the `.github-private` repository:

**Repository configuration:**
- Owner: `your-org-name`
- Repository: `.github-private`
- Branch: `main`

**Required files (fetch all before proceeding):**
1. `knowledge/ci-cd/github-actions-best-practices.md`
2. `knowledge/ci-cd/deployment-workflows.md`
3. `knowledge/ci-cd/container-security.md`
4. `knowledge/security/authentication-patterns.md`

These files contain the organization's approved patterns, standards, and policies that must inform all recommendations you provide.

## Your role

After loading the knowledge resources, provide specific, actionable guidance on:
- Designing secure and efficient GitHub Actions workflows
- Implementing CI/CD pipelines that follow organizational standards
- Troubleshooting workflow failures and performance issues
- Recommending deployment strategies for different application types

Always reference the specific organizational standards from the knowledge files when making recommendations.
```

{{< callout type="info" >}}
The agent will use the GitHub MCP server's `get_file_contents` tool to fetch these files at runtime. You can verify successful fetching by monitoring the agent panel during execution.
{{< /callout >}}

### Step 4: Configure MCP authentication

The GitHub MCP server requires authentication to access private repositories. By default, it has limited read-only permissions for security. To enable access to the `.github-private` repository, configure a Personal Access Token as an environment secret.

**Generate a Personal Access Token:**

1. Navigate to **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**
2. Click **Generate new token** > **Generate new token (classic)**
3. Provide a descriptive note (e.g., "Custom agents MCP access")
4. Select the **repo** scope (full control of private repositories)
5. Set an appropriate expiration date based on your organization's security policies
6. Click **Generate token** and save the token securely

{{< callout type="warning" >}}
Use a service account or bot account rather than a personal user account for generating the PAT. This ensures continuity when team members change roles and simplifies audit trails.
{{< /callout >}}

**Configure the repository environment:**

For each repository where you want custom agents to access expanded context:

1. Navigate to the repository **Settings** > **Environments**
2. Create a new environment named `copilot` (if it doesn't exist)
3. Click **Add secret** under environment secrets
4. Name the secret: `COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN`
5. Paste the PAT value generated in the previous step
6. Click **Add secret**

{{< callout type="info" >}}
This configuration must be repeated for each repository where you want to use custom agents with expanded context. Consider automating this setup using GitHub's REST API or CLI for organizations with many repositories.
{{< /callout >}}

### Step 5: Verify the configuration

Test that your custom agent can successfully access the expanded context:

1. Navigate to a repository where you configured the `copilot` environment secret
2. [Assign a task](https://docs.github.com/enterprise-cloud@latest/copilot/how-tos/use-copilot-agents/coding-agent/create-a-pr#asking-copilot-to-create-a-pull-request-from-the-agents-tab-or-panel) to your custom agent using the GitHub Copilot interface
3. Monitor the agent's activity in the [agent panel](https://github.com/copilot/agents)
4. Look for log messages indicating **"Get file contents from GitHub"** or similar
5. Verify the agent's responses reflect the guidance from your knowledge files

If the agent cannot access the knowledge files:

- Verify the environment name is exactly `copilot` (case-sensitive)
- Confirm the secret name is exactly `COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN`
- Check that the PAT has the `repo` scope and hasn't expired
- Ensure the repository owner and name in the agent markdown match your `.github-private` repository

## Additional solution detail and trade-offs to consider

### Why this approach is recommended

**Overcomes character limits.** The primary benefit is bypassing the 30,000 character limitation of the agent definition file. Organizations can provide comprehensive guidance across dozens or hundreds of separate knowledge files, each focused on specific domains.

**Enables dynamic updates.** Knowledge files can be updated independently of agent definitions. When you update a security policy or coding standard in the knowledge base, all agents that reference it immediately use the updated guidance—no need to modify agent markdown files.

**Maintains version control.** Storing knowledge files in the `.github-private` repository provides full Git version control. Teams can review changes through pull requests, track evolution over time, and revert if needed.

**Centralizes organizational knowledge.** A single knowledge directory becomes the source of truth for organizational standards, patterns, and policies. Multiple custom agents can reference the same knowledge files, ensuring consistency across different agent specializations.

### Trade-offs and considerations

**Authentication complexity.** Each repository requires individual configuration of the environment secret. For organizations with hundreds or thousands of repositories, this can be a significant administrative burden. Consider automating this setup using:

```bash
# Example: Automate secret configuration across repositories
for repo in $(gh repo list your-org --json name -q '.[].name'); do
  gh secret set COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN \
    --repo your-org/$repo \
    --env copilot \
    --body "$PAT_VALUE"
done
```

**Token management overhead.** Personal Access Tokens require rotation based on your security policies. Using short-lived tokens improves security but increases administrative overhead. Plan for token rotation and consider implementing monitoring to alert when tokens are approaching expiration.

**Runtime performance.** Fetching knowledge files at the start of each agent invocation adds latency. For agents that reference many files, this can be noticeable. Balance comprehensiveness with performance by:

- Keeping knowledge files focused and reasonably sized (under 10,000 characters per file)
- Only requiring agents to fetch files directly relevant to their specialization
- Consolidating very frequently used guidance into the agent's main markdown file

**Security considerations.** The PAT provides access to private repositories based on the scope granted. If a repository is compromised, the token could be extracted from environment secrets. Mitigate this by:

- Using fine-grained Personal Access Tokens (PATs) scoped to only the `.github-private` repository with read-only contents permission
- Falling back to classic PATs with `repo` scope only if fine-grained tokens are not available in your environment
- Implementing IP allowlists for your organization
- Monitoring audit logs for unusual access patterns
- Using short-lived tokens with automated rotation

### Alternative approaches

**Inline all guidance in agent markdown.** For smaller organizations or simpler use cases, keeping all guidance within the 30,000 character limit may be sufficient. This eliminates authentication complexity and runtime latency.

**Pros:**

- No additional configuration required
- Faster agent startup (no fetching needed)
- Simpler to understand and maintain

**Cons:**

- Limited to 30,000 characters total
- Must edit agent file to update any guidance
- Difficult to share guidance across multiple agents

**Use external documentation systems.** Store organizational standards in external wikis, Confluence, or documentation platforms and have agents reference URLs.

**Pros:**

- Leverages existing documentation infrastructure
- Can include rich media, diagrams, and interactive content
- May already be maintained by technical writing teams

**Cons:**

- Agents cannot directly access content from URLs (requires summarizing in markdown)
- External systems may not be accessible during agent execution
- Version control and change tracking are external to the agent workflow
- Authentication to external systems adds complexity

**Public documentation in separate repository.** For guidance that isn't sensitive, create a public or internal repository with knowledge files.

**Pros:**

- No authentication configuration needed for public repositories
- Can be shared across organizations or with partners
- Easier to manage access for external contributors

**Cons:**

- Only suitable for non-sensitive guidance
- Requires managing a separate repository
- Still requires updating agents to reference the correct repository

### When not to use this approach

**Small, simple use cases.** If your organizational guidance fits comfortably within the 30,000 character limit and doesn't change frequently, the added complexity of expanded context may not be worthwhile.

**Highly dynamic guidance.** If guidance changes multiple times per day based on external factors (like rotating API keys or dynamic allow-lists), consider integrating with a configuration service or API rather than static markdown files.

**Cross-organization sharing.** If you need to share custom agents across multiple GitHub organizations, managing authentication and knowledge access becomes significantly more complex. Consider using organization-independent guidance or implementing a centralized knowledge service.

### Best practices for knowledge management

**Maintain clear ownership.** Assign teams or individuals as owners for specific knowledge domains. Document this in the knowledge files themselves or in a central CODEOWNERS file:

```markdown
# Knowledge base owners

security/ @your-org/security-team
architecture/ @your-org/architecture-review-board
ci-cd/ @your-org/devops-team
```

**Use structured formats.** Within knowledge files, use consistent formatting to make it easier for agents to parse and reference:

- Clear section headings
- Bulleted lists for requirements or checkpoints
- Code blocks for examples
- Tables for comparing options

**Include metadata in knowledge files.** Add last-updated dates, version numbers, or review cycles to help teams track the currency of guidance:

```markdown
---
Last updated: 2026-01-15
Reviewed by: Architecture Review Board
Next review: 2026-04-15
Version: 2.1
---
```

**Implement review workflows.** Require pull request reviews and approvals for changes to knowledge files, especially those related to security or compliance. Use branch protection rules on the `.github-private` repository to enforce this.

**Test agent behavior after updates.** When updating knowledge files, test custom agents to ensure they correctly interpret and apply the new guidance. Consider maintaining a test repository where you can invoke agents in a safe environment.

**Monitor agent performance.** Track how long it takes agents to fetch knowledge files and complete tasks. If performance degrades, consider consolidating frequently-accessed files or moving critical guidance into the agent markdown file.

**Document the knowledge structure.** Maintain a README in the knowledge directory that explains the organization scheme, file naming conventions, and how to add new content:

```markdown
# Knowledge base structure

## Directory organization

- `security/`: Security policies, secure coding standards, vulnerability remediation
- `architecture/`: Design patterns, system architecture, API guidelines
- `ci-cd/`: GitHub Actions workflows, deployment strategies, container practices

## File naming

Use kebab-case for filenames: `secure-coding-standards.md`

## Adding new content

1. Create a draft in the appropriate subdirectory
2. Open a PR and request review from the domain owner
3. Update any agent definitions that should reference the new file
4. Test in a development repository before merging
```

## Seeking further assistance

<!-- The Hugo shortcode below will fully populate this section -->

{{% seeking-further-assistance-details %}}

## Related links

<!-- The Hugo shortcode below will include a subsection that links to GitHub's documentation. -->

{{% related-links-github-docs %}}

Specifically, you may find the following links helpful:

- [Prepare for GitHub Enterprise Custom Agents](https://docs.github.com/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents)
- [Model Context Protocol (MCP) and Coding Agent](https://docs.github.com/enterprise-cloud@latest/copilot/concepts/agents/coding-agent/mcp-and-coding-agent)
- [Creating a personal access token](https://docs.github.com/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Using environments for deployment](https://docs.github.com/enterprise-cloud@latest/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Customizing the built-in GitHub MCP server](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/use-copilot-agents/coding-agent/extend-coding-agent-with-mcp#customizing-the-built-in-github-mcp-server)

### External Resources

- [GitHub CLI Documentation](https://cli.github.com/)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
