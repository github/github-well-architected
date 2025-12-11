---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
title: Measuring Impact for GenAI Adoption
weight: 3
publishDate: 2025-04-24
params:
  authors: [{ name: 'Kitty Chiu', handle: 'kittychiu' }]

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - best-practice
  - performance-engineering

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - expert-services
  - partners
  - customer-success-architect
  - customer-success-manager
  - fast-track
---

<!-- markdownlint-disable MD024 -->

Generative AI (GenAI) tools like GitHub Copilot deliver multi-dimensional value across productivity metrics, collaboration effectiveness, and application security posture. This document provides a structured, data-driven measurement framework to quantify ROI and demonstrate business value throughout your implementation journey.

## Phased Impact Model

Organizations should establish a comprehensive measurement strategy that captures value at three distinct phases:

1. **Onboard Metrics**: Assess deployment effectiveness and user access
2. **Adoption Metrics**: Evaluate usage patterns and feature utilization
3. **Success Metrics**: Quantify tangible business outcomes and ROI

## Phase 1: Onboard Metrics

**Key Question: Are users properly provisioned with enterprise-managed GenAI tools?**

Effective implementation requires that users receive appropriate access to GenAI tools governed by enterprise guardrails. Track metrics such as license activation rate and onboarding completion.

For Copilot,
[GitHub Enterprise settings](https://docs.github.com/en/enterprise-cloud@latest/copilot/managing-copilot/managing-copilot-for-your-enterprise/managing-policies-and-features-for-copilot-in-your-enterprise)
helps Copilot stay compliant with organizational policies, and the
[User Management REST API](https://docs.github.com/en/rest/copilot/copilot-user-management?apiVersion=2022-11-28)
provides quantitative tracking of license activations.

**Implementation Control Checklist:**

- License entitlement management processes defined
- Infrastructure security protocols assessed
- Information retention & data protection policies reviewed
- Reliability & safety mechanisms reviewed
- OSS compliance requirements satisfied

## Phase 2: Adoption Metrics

**Key Question: Are users actively engaging with the GenAI tool as expected?**

Track feature utilization and engagement patterns through both qualitative and quantitative methods to build a comprehensive view of adoption trends and potential barriers. Using both approaches provides a balanced perspective that captures both subjective experiences and objective usage data.

**Qualitative Measurement:**
We measure by asking for users' direct feedback on GenAI impact on their professional efficiency. This may come in the form of focus sessions, 1:1s, structured questionnaires or polls, and incorporating into existing [developer experience surveys](https://github.com/github/copilot-survey-engine).

**Quantitative Measurement:**
Track feature utilization and engagement patterns to identify adoption trends and potential barriers. For Copilot, the [Metrics REST API](https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28) provides detailed insights on usage patterns, allowing organizations to monitor and analyze adoption pattern:

- Code suggestion and acceptance rate
- IDE-specific usage
- Utilization of different LLM models
- Knowledge discovery, acquisition, and generation through interactive events (chat, copy, acceptance, etc)
- Usage trends over time to determine if adoption is accelerating or plateauing

Segment adoption metrics by organization and teams to identify areas requiring additional support or training.

## Phase 3: Success Metrics

**Key Question: How is the GenAI tool enabling organizations to create measurable business value?**

As users integrate GenAI features into their workflows, measure tangible business outcomes with a balanced framework. This validates the organization-specific success criteria of the GenAI tooling investment.

GitHub has a point-of-view detailed in the [four engineering system success zones](../../productivity/recommendations/engineering-system-metrics).

**Measurement Approach:** Track where teams are positioned on the [J-curve of change](https://www.david-viney.me/post/the-j-curve-of-change), focusing on identifying the inflection point where productivity gains materialize.

## Common Impact Scenarios

Common business challenges where Copilot may assist:

1. **Quality Enhancement** - test coverage & reliability, bug defect reduction, code quality & maintainability

2. **Developer Productivity** - task completion time, code review quality, onboarding time

3. **Security Posture** - vulnerability detection & resolution, secure coding adoption, dependency upgrade

4. **Innovation Acceleration** - feature development time, prototype speed

## Seeking further assistance

<!-- The Hugo shortcode below will fully populate this section -->

{{% seeking-further-assistance-details %}}

## References & next steps

<!-- The Hugo shortcode below will include a subsection that links to GitHub's documentation. -->

{{% related-links-github-docs %}}

<!-- ### External Resources -->

<!-- Optionally add any external resources that are related to your article or that could provide additional information or context for your readers.
This could include links to tutorials, blog posts, or other articles. -->

Read more about measuring GenAI impact in the [Engineering System Success Playbook](https://resources.github.com/engineering-system-success-playbook/).
