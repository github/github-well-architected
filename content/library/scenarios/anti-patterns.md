---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
title: Anti-patterns
weight: 1
---

<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->

Understanding and avoiding anti-patterns is crucial for maintaining a healthy GitHub environment. Anti-patterns are common practices that initially seem like good ideas but ultimately can lead to detrimental outcomes and undesired consequences, hindering productivity, collaboration, and the overall success of projects. Here, we outline the most prevalent GitHub anti-patterns.

## Platform Anti-Patterns

### Fragmented Organization Structure

Creating separate GitHub organizations for different teams or projects when a single organization would suffice.

**Why It's an Anti-Pattern**

- Increases overhead of managing permissions, integrations, and policies across organizations.
- Hinders collaboration and visibility among teams.
- Creates silos that limit knowledge sharing and resource utilization.

**How to Avoid**

- Carefully plan the structure of your GitHub presence, considering current and future projects.
- Utilize teams and project boards within a single organization to separate concerns while maintaining oversight.
- Implement a centralized management approach for permissions and policies.

## Planning Anti-Patterns

### Vague Requirements

Working with incomplete or ambiguous specifications that lead to misunderstanding.

**Why It's an Anti-Pattern**

- Results in incorrect implementations or low-quality features.
- Wastes time on clarification or rework.
- Creates frustration among developers and stakeholders.

**How to Avoid**

- Allocate sufficient time for requirement gathering and validation.
- Use issue templates to ensure consistent information collection.
- Break down complex requirements into clearly defined sub-issues.
- Establish clear processes for communicating and managing changing priorities.
- Leverage Copilot to help clarify vague requirements and formalize into testable criteria.
- Add custom instructions to train Copilot on your domain-specific terminology and acceptance criteria.

### Ineffective Work Management

Poorly organized or inconsistently used GitHub Issues and Projects.

**Why It's an Anti-Pattern**

- Leads to disorganized project management and unclear priorities.
- Makes it difficult to track progress and dependencies.
- Misses out on opportunities for collaboration and transparency.

**How to Avoid**

- Use a consistent labeling system, milestones, and projects to organize issues.
- Document and follow standard workflows for issue creation, assignment, and closure.
- Use issue templates and predefined labels, and project automation.
- Encourage active participation and regular updates in issue discussions.
- Link issues to the code changes that address them.

## Development Anti-Patterns

### Poor Commit Practices

Making large, unfocused commits with vague commit messages.

**Why It's an Anti-Pattern**

- Obscures the history and rationale behind changes.
- Hinders the ability to identify and revert problematic changes.
- Complicates code reviews and understanding of changes.

**How to Avoid**

- Make small, atomic commits focused on a single logical change.
- Write clear, descriptive commit messages that explain both what changed and why.
- Follow a consistent commit message format across the organization.

### Inconsistent Branching Strategy

Working directly on the main branch or using inconsistent branching approaches across teams.

**Why It's an Anti-Pattern**

- Leads to unstable main branch and deployment issues.
- Makes it difficult to manage features and bug fixes in parallel.

**How to Avoid**

- Adopt and document a well-defined branching strategy like Git Flow or GitHub Flow.
- Use feature branches consistently for new development and fixes.
- Automate branching strategy enforcement through rulesets.

### Accumulating Technical Debt

Consistently prioritizing new features over addressing existing code quality issues.

**Why It's an Anti-Pattern**

- Code becomes increasingly brittle and difficult to maintain.
- Bug fixes become more complex and time-consuming.
- Introduces growing risk and slows future development.

**How to Avoid**

- Dedicate regular time for addressing technical debt incrementally.
- Include refactoring as part of feature development.
- Use Copilot to assist with code improvement and test creation.
- Create custom instructions for Copilot on code quality criteria, maintainability preferences, and testing standards.
- Measure and track technical debt metrics over time.

### Overengineering

Building unnecessarily complex solutions or adding features without clear value.

**Why It's an Anti-Pattern**

- Increases complexity and potential for bugs.
- Adds unnecessary development effort and maintenance overhead.
- Diverts resources from more valuable work.

**How to Avoid**

- Define and prioritize minimal viable deliverables.
- Focus on solving the current problem rather than anticipating future needs.
- Use regular code reviews to identify and challenge unnecessary complexity.
- Validate new features with real user feedback before investing heavily.
- Utilize Copilot to suggest simpler alternatives when code appears overly complex.
- Add custom instructions to Copilot emphasizing your team's application design principles.

## Collaboration Anti-Patterns

### Bypassing Code Reviews

Merging pull requests without thorough code review or with superficial reviews.

**Why It's an Anti-Pattern**

- Increases the risk of introducing bugs and security vulnerabilities.
- Misses opportunities for knowledge sharing and mentorship.
- Reduces overall code quality and consistency.

**How to Avoid**

- Enforce rulesets requiring meaningful reviews before merging.
- Use Copilot for first pass review and immediate feedback.
- Set up custom instructions for Copilot to identify code patterns that typically require special attention.
- Cultivate a culture that values thorough code quality and constructive feedback.
- Provide guidelines for effective code reviews that focus on both correctness and design.

### Delayed Feedback Cycles

Allowing pull requests to remain open for extended periods without action.

**Why It's an Anti-Pattern**

- Slows iteration cycles as engineers can't adapt quickly.
- Creates merge conflicts as the codebase evolves around stale PRs.
- Reduces developer satisfaction and productivity.

**How to Avoid**

- Integrate automated checks into the PR workflow to provide immediate feedback.
- Set expectations for review turnaround time and enforce them.
- Use Copilot to automate initial code reviews for common issues.
- Add custom instructions to Copilot for common linting and other review criteria.
- Automate checks to reduce manual feedback on code quality issues.
- Implement PR age monitoring and escalation procedures.

## Continuous Integration Anti-Patterns

### Insufficient Test Automation

Relying primarily on manual testing or maintaining inadequate automated test coverage.

**Why It's an Anti-Pattern**

- Allows more bugs to reach production environments.
- Creates a testing bottleneck that slows releases.
- Makes refactoring riskier due to lack of safety net.

**How to Avoid**

- Build automated test suites at all levels as applicable and feasible.
- Include test coverage metrics in code quality gates.
- Use Copilot to help write and maintain tests.
- Create custom instructions for Copilot on your testing strategy, preferred frameworks, and code quality criteria.
- Use Copilot to suggest test cases based on code functionality and edge cases.

### Neglecting Application Security Measures

Overlooking security measures like secret management, dependency updates, and access controls.

**Why It's an Anti-Pattern**

- Exposes projects to security risks and vulnerabilities.
- Can lead to data breaches and compliance issues.
- Creates technical debt that becomes increasingly difficult and costly to address.

**How to Avoid**

- Use GitHub Secrets for sensitive information management.
- Enable Dependabot for automated dependency updates.
- Enforce two-factor authentication and regular access permission reviews.
- Implement security configurations to enforce security guardrails consistently across repositories.
- Use Copilot to scan for and identify security vulnerabilities in code during development.
- Add custom instructions to Copilot specifying your organization's security practices.

## Continuous Deployment Anti-Patterns

### Large Releases

Accumulating many changes and deploying high-risk large batch releases.

**Why It's an Anti-Pattern**

- Makes bugs and regressions harder to detect, isolate, and fix.
- Increases the impact of deployment failures.
- Slows release cycles, and delays value delivery to users.

**How to Avoid**

- Implement a continuous delivery approach with smaller, more frequent releases.
- Use feature flags to separate deployment from feature activation.
- Build a robust automated testing suite to validate changes.
- Establish a safe deployment strategy with canary releases or gradual rollouts.

### Manual Deployment Processes

Relying on human intervention for deployment.

**Why It's an Anti-Pattern**

- Introduces inconsistencies and human error in production.
- Creates bottlenecks that slow delivery.
- Reduces team scalability as deployment knowledge becomes concentrated.

**How to Avoid**

- Automate the entire deployment pipeline from code commit to production.
- Implement approval gates within the automated process where human judgment is required.
- Document any remaining manual processes thoroughly.

By organizing anti-patterns into these clear categories and addressing their distinct aspects, teams can more systematically improve their GitHub practices.

## Application Security Anti-Patterns

### Detecting PII with secret scanning custom patterns

Using GitHub secret scanning custom patterns to detect Personally Identifiable Information (PII) such as social security numbers, dates of birth, or government-issued identifiers in source code.

**Why It's an Anti-Pattern**

- Secret scanning is designed for credentials and tokens that can be revoked and rotated. PII such as social security numbers and dates of birth is permanent and cannot be rotated.
- When secret scanning detects a value, the alert stores and displays it so reviewers can assess the finding. Alerts cannot be deleted — only dismissed. Once PII triggers an alert, the sensitive data is permanently embedded in the alert record. This creates a second, unmanageable copy of the very data the organization intended to protect.
- Storing PII in non-deletable alert records creates compliance exposure under frameworks like GDPR (right to erasure), CCPA (right to deletion), HIPAA (disposal requirements), and PCI DSS (secure deletion mandates).

**How to Avoid**

- Keep secret scanning custom patterns focused on their intended purpose: detecting organization-specific credentials, API keys, and tokens that follow the detect-revoke-rotate lifecycle.
- Use purpose-built data loss prevention (DLP) tooling to detect PII in code. DLP tools support redaction, quarantine, and deletion capabilities that align with regulatory requirements.
- Deploy DLP tooling as pre-commit hooks to prevent PII from entering the repository in the first place.
- Audit existing custom patterns for any PII detection rules and remove them. When deleting a custom pattern entirely, the option to delete the existing alerts is provided.
- Document an organizational policy that explicitly defines which tools handle which data types: secret scanning for credentials, DLP tooling for PII.
