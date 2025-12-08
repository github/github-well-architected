---
draft: false # Set to false when ready to publish
title: 'Prioritizing Security Alert Remediation'
publishDate: 2025-08-05
params:
  authors:
    [
      { name: 'Greg Mohler', handle: 'callmegreg' },
      { name: 'Tom Horton', handle: 'thomasphorton' },
    ]

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
  - repository-custom-properties
  - repository-rulesets

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - security-campaigns
  - code-scanning
  - secret-scanning
  - dependabot
  - copilot-autofix
  - access-management
  - audit-log

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - enterprise-support
  - expert-services
  - partners
---

<!-- This disables the linting rule for multiple top-level headers -->
<!-- markdownlint-disable MD025 -->
<!-- markdownlint-disable MD013 -->

<!--
See our CONTRIBUTING doc for submission details and additional writing style guidelines: https://github.com/github/github-well-architected-internal/blob/main/.github/CONTRIBUTING.md
-->

## Scenario overview

<!-- Provide a brief overview of the scenario that your article will cover. Be as generic, yet opinionated, as possible. -->

Security teams are often swamped with alerts, making it tough to figure out what really matters. This flood of notifications, or "alert sprawl," can make it hard to fix the most important issues, leading to potential security gaps and wasted effort. Knowing which alerts to tackle first is key to spending your team's time wisely.

GitHub offers a lot of built-in information to help you sort through your security alerts. When you combine this with details from your own internal systems, you get a much clearer picture of an alert’s potential impact. Plus, setting up focused security campaigns can help your teams understand exactly which alerts they need to address and when, prioritizing effort on the right set of work.

## Key design strategies

<!-- This section should discuss the key design strategies that your proposed solution employs. This could include architectural patterns, coding practices,
and other strategic decisions that were made during the design of the solution.

The checklist should provide a list of key steps or considerations that should be followed when implementing the solution. This could include things like
"Ensure all code is properly commented", "Write tests for all new functionality", "Verify the associated teams and resources", etc. -->

The recommended approach for prioritizing security alerts employs several key strategies:

**Step 1: Understand GitHub Alert Metadata**: Begin by leveraging GitHub's comprehensive built-in metadata (severity, CWE, EPSS scores, validity, etc.) to establish a foundational understanding of alert context and potential impact. This native information provides immediate insights into vulnerability characteristics and exploitability.

**Step 2: Supplement with Organizational Context**: Enhance GitHub's metadata by adding custom properties to repositories to capture details about the applications and services that those repositories support, such as business criticality, internet exposure, compliance requirements, and user count. This dual-layer approach provides a more nuanced understanding of actual risk and impact within your specific environment.

**Step 3: Target High-Priority Alerts with Security Campaigns**: Use the enriched metadata to create focused, time-bound security campaigns that target the highest-priority alerts. This structured approach ensures accountability, clear deadlines, and measurable progress toward risk reduction goals while directing teams to focus on the most important vulnerabilities first.

## Assumptions and preconditions

<!-- List any assumptions or preconditions that your article is based on. Be as generic, yet opinionated, as possible. -->

These recommendations assume that you have the following:

- GitHub Enterprise Cloud (GHEC)
- [Code Security](https://github.com/security/advanced-security/code-security), [Secret Protection](https://github.com/security/advanced-security/secret-protection), and/or [Dependabot](https://github.com/security/advanced-security/software-supply-chain) enabled and configured for your repositories

## Recommended approach

<!-- Describe the recommended GitHub Platform deployment that your article will propose. This will typically zoom in on GitHub Platform products, features, and technologies you would prescribe. -->

### Step 1: Understand GitHub Alert Metadata

When you're trying to figure out which security alerts need your immediate attention, GitHub gives you a head start. GitHub security alerts come with a lot of metadata that help you quickly understand the context and potential impact, making it easier to decide what to fix first. Let's look at the specific fields that are available for different types of security alerts.

#### Code Security

For alerts related to your code, like those found by GitHub Advanced Security's CodeQL, several key pieces of information can help you prioritize:

- **Severity**: GitHub assigns a severity level (Critical, High, Medium, Low) to each alert, giving you a quick sense of its potential impact. Critical and High severity alerts are a great place to start when cleaning up security tech debt.
- **CWE (Common Weakness Enumeration)**: Each alert is also tied to a CWE ID. This is a common way to categorize software weaknesses. Knowing the specific CWE helps you understand the type of vulnerability and often points to well-known attack patterns, informing your remediation strategy. If you have controls in place, like a web application firewall, protecting against a certain class of vulnerability, you might consider it a secondary concern to the vulnerabilities without mitigations.
- **Copilot Autofix Support**: Some code scanning alerts can suggest a fix directly using GitHub Copilot. If an alert has [Copilot Autofix](https://docs.github.com/en/enterprise-cloud@latest/code-security/code-scanning/managing-code-scanning-alerts/responsible-use-autofix-code-scanning#about-copilot-autofix-for-code-scanning) support, it means the fix might be just a click away. Prioritizing these can lead to quick wins, freeing up your team's time for more complex issues.

#### Secret Protection

Finding exposed secrets in your code, like API keys or database connection strings, is incredibly important. GitHub Secret scanning helps catch these. When you're dealing with these alerts, here's what to look for to decide what to fix first:

- **Validity**: Has the secret actually been confirmed as _active_? Or on the other hand, has it been confirmed _inactive_? If GitHub confirms a secret is still valid, that's a high-priority item you'll want to address right away because it means it could still be used by an attacker. On the contrary, inactive alerts should be deprioritized over the alerts with unknown validity.
- **Provider Patterns vs. Non-Provider Patterns**: GitHub's Secret scanning solution identifies secrets using different patterns. "Provider patterns" are for secrets issued by specific providers (like AWS, OpenAI, or Atlassian), where GitHub often has a direct relationship. Alerts for these partner patterns are generally more urgent because they represent directly usable credentials. Non-provider patterns might be for more generic secrets and keys, like an RSA private key, where there isn’t a direct tie to where that key is used. While still important, a secret from a known partner is typically a higher immediate risk.

#### Dependabot

Keeping your project's dependencies up to date is crucial for security. Dependabot helps by finding vulnerabilities in the libraries and packages your code relies on. When you're sifting through Dependabot alerts, these details can help you prioritize:

- **Severity**: Just like with code scanning, Dependabot assigns a severity (Critical, High, Medium, Low) to each vulnerability. This gives you an immediate sense of potential impact.
- **EPSS (Exploit Prediction Scoring System)**: This is a really helpful score that tells you how likely a vulnerability is to be exploited in the wild. A higher EPSS score means it's more probable that attackers are actively trying to use this weakness, making it a priority to fix.
- **Relationship (Direct vs. Transitive)**: Dependabot alerts you if the vulnerable package is something you directly included in your project (a "direct" dependency) or if it's something brought in by another one of your dependencies (a "transitive" dependency). Direct vulnerabilities are often simpler to fix and might be a higher priority because you have more direct control over them. Transitive dependencies likely require action from the parent’s maintainer in order to upgrade to a secure version.
- **Scope (Runtime vs. Development)**: Where is this vulnerable dependency being used? If it's used to run unit tests in your CI workflow, it might not pose an immediate threat to your live application. However, if it's used in production code, it's a much higher risk and should be addressed urgently.
- **Patch availability**: Dependabot will tell you if a fix or a newer version of the vulnerable package is already available. If there's a patch ready to go, that makes remediation both easier and faster, so you might prioritize these fixes to quickly reduce risk.

### Step 2: Supplement with Organizational Context

While GitHub provides a wealth of metadata to help prioritize security alerts, organizations often possess additional context within their internal systems that can further refine risk assessments. By integrating this unique organizational data, security teams can gain an even more precise understanding of an alert's true impact and prioritize remediation efforts more effectively.

These additional values can be seamlessly added to repositories as [Custom Properties](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/managing-custom-properties-for-repositories-in-your-organization) within GitHub. This allows you to combine GitHub's built-in alert metadata with your organization's specific insights. Common examples of custom properties that can significantly enhance alert prioritization include:

- **Internet facing**: Knowing whether the application it supports is publicly accessible can dramatically elevate the priority of a security alert. An internet-facing vulnerability has a much higher potential for exploitation than one in an internal-only system.
- **Regulatory compliance**: If a repository or its associated application falls under specific regulatory compliance mandates (e.g., GDPR, HIPAA, PCI DSS), alerts related to these systems might carry a higher urgency due to potential legal or financial repercussions.
- **Business criticality**: Assigning a business criticality level (e.g., Mission-Critical, High, Medium, Low) to a repository helps direct resources to issues that could impact the most vital business functions. A security flaw in a revenue-generating application should typically be addressed before one in a less critical internal tool.
- **Number of application users**: The number of users an application serves can be a strong indicator of potential impact. A vulnerability affecting an application with millions of users presents a much larger risk surface than one with a handful of users.

By leveraging custom properties, organizations can create a tailored risk prioritization framework that aligns with their unique operational context and strategic objectives.

### Step 3: Target High-Priority Alerts with Security Campaigns

{{< callout type="info" >}}
Security campaigns are currently available in GitHub Enterprise Cloud for code scanning and secret scanning alerts.
{{< /callout >}}

Once you've enriched your environment with both GitHub-provided metadata and your organization's custom properties, the next crucial step is to effectively act on this information. Security campaigns provide a powerful mechanism to target specific subsets of alerts, ensuring that the right teams are focusing on the most important issues with clear deadlines.

By leveraging the comprehensive metadata now associated with your alerts, you can create highly granular campaigns. For example, a recommended campaign could target remediation of all **Critical** severity code scanning alerts that have **Copilot Autofix** support, or all **valid** secret scanning alerts from provider patterns, in addition to any custom property values that signify importance, within the next **30 days**.

The true power of security campaigns lies in their ability to inform downstream users (developers, DevOps teams, and security engineers) of precisely which alerts they should prioritize and by when. When a security campaign is initiated, it will:

- Create a [dedicated dashboard](https://docs.github.com/en/enterprise-cloud@latest/code-security/code-scanning/managing-code-scanning-alerts/fixing-alerts-in-security-campaign#viewing-alerts-in-a-security-campaign) that surfaces only the alerts relevant to that campaign, reducing noise and improving focus.
- Automate [notifications](https://docs.github.com/en/enterprise-cloud@latest/code-security/securing-your-organization/fixing-security-alerts-at-scale/creating-managing-security-campaigns#how-developers-know-a-security-campaign-has-started) to the responsible teams or individuals, ensuring accountability.
- Establish [clear deadlines](https://docs.github.com/en/enterprise-cloud@latest/code-security/securing-your-organization/fixing-security-alerts-at-scale/creating-managing-security-campaigns#how-developers-know-a-security-campaign-has-started) or service level objectives (SLOs) for remediation, driving timely action.
- Provide a [centralized tracking mechanism](https://docs.github.com/en/enterprise-cloud@latest/code-security/securing-your-organization/fixing-security-alerts-at-scale/tracking-security-campaigns#tracking-campaigns-across-your-organization) for the progress of the campaign, allowing security leadership to monitor overall risk reduction.

By implementing security campaigns informed by a rich tapestry of metadata, organizations can move beyond reactive alert triage to proactive and targeted remediation efforts. This structured approach ensures that the highest-risk vulnerabilities are addressed first.

## Additional solution detail and trade-offs to consider

<!-- Write more detail about the solution and articulate opinionated prescriptions, trade-offs, or consequences of either the deployment, the assumptions, or the desired goals. Be as generic, yet opinionated, as possible. -->

### Custom Property Management Overhead

Implementing comprehensive custom properties requires ongoing maintenance and governance. Organizations must establish clear ownership and processes for keeping metadata current, especially for dynamic properties like "internet facing" status or user counts. Outdated metadata can lead to misplaced priorities and ineffective campaigns. Organizations should plan for scalable governance processes and consider automation for property management and campaign creation.

### Alert Fatigue vs. Precision

While this approach reduces noise by prioritizing high-impact alerts, there's a risk of creating "priority fatigue" where teams become desensitized to campaign notifications. Organizations should carefully balance campaign frequency and scope to maintain team engagement while avoiding over-communication.

### Resource Allocation Decisions

Focusing heavily on automated fixes (Copilot Autofix) and direct dependencies may create blind spots around complex vulnerabilities that require manual remediation. Teams should resist the temptation to only address "easy wins" and ensure adequate resources are allocated to challenging but critical issues.

### Security Campaign Limitations

Currently, security campaigns are only available for code scanning and secret scanning alerts in GitHub Enterprise Cloud. Organizations using GitHub Enterprise Server or needing similar capabilities for Dependabot alerts will need to implement alternative tracking and notification mechanisms.

## Seeking further assistance

<!-- The Hugo shortcode below will fully populate this section -->

{{% seeking-further-assistance-details %}}

## Related links

<!-- The Hugo shortcode below will include a subsection that links to GitHub's documentation. -->

{{% related-links-github-docs %}}

<!-- ### External Resources -->

<!-- Optionally add any external resources that are related to your article or that could provide additional information or context for your readers.
This could include links to tutorials, blog posts, or other articles. -->
