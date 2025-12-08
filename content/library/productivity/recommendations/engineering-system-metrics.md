---
draft: false # Set to false when ready to publish
title: 'Engineering System Metrics'
publishDate: 2025-04-24
params:
  # Add and remove authors as needed. Please reserve authorship for significant contributions, not edits and feedback.
  authors: [{ name: 'Kitty Chiu', handle: 'kittychiu' }]

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - productivity

# The areas of the GitHub adoption journey. Inspiration taken from docs.github.com
areas:
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
  - energy
  - telecommunications
  - hospitality
  - professional-services

# Individuals in key roles on the customer journey, typically consisting of one or more administrators and the end-user community.
personas:
  - administrator
  - developer

# Deployment options for GitHub Enterprise, including Cloud (GHEC), Server (GHES), and Hybrid.
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu
  - github-enterprise-server

# GitHub product functions designed to support every stage of development.
features:
  - copilot

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - best-practice

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - expert-services
  - partners
  - customer-success-architect
  - fast-track
---

<!-- This disables the linting rule for multiple top-level headers -->
<!-- markdownlint-disable MD025 -->

## Recommendation overview

How well your DevSecOps system performs goes beyond merely measuring the outputs of individual developers
(e.g. lines of code) and systems (e.g. number of workflow runs). You need to seek clarity on your system's
leading and lagging indicators, so that your working focus is on the leading indicators that provide
early signals and enable steering of the downstream impacts.

[Engineering System Success](../../design-principles/#design-for-engineering-system-success) goes beyond
engineering excellence - it focuses on optimization. Success is to work altogether with a foundation
of quality, velocity, and developer happiness, to drive improvements in desired business outcomes.

## Key design strategies and checklist

- Are the performance metrics balanced, encompassing the people, process, and technology aspects of the engineering system?
- Have you tailored the performance metrics to your specific organization/team needs?
- Are the performance metrics balanced between leading and lagging indicators to enable early signals, learning, and interventions?
- Are the performance metrics supported by both qualitative and quantitative data?
- Are the data collected reliable, and the collection process and cadence consistent?
- Are the performance metrics considered for possible gamification and incentive misalignment?

## Assumptions and preconditions

This recommendation recognises the leading DevEx and DevOps metrics frameworks like [SPACE](https://queue.acm.org/detail.cfm?id=3454124),
[DevEx](https://queue.acm.org/detail.cfm?id=3595878), [DX Core 4](https://getdx.com/research/measuring-developer-productivity-with-the-dx-core-4/),
and [DORA](https://dora.dev/).

## Four zones and twelve metrics

### Four zones of engineering system success

Taking a layered approach, _Business Outcomes_ sits at the top, supported by foundations of _Quality_, _Velocity_, and _Developer Happiness_:

- **Business outcomes**: Ship code that enables the business to innovate and meet their strategic objectives with increasing efficiency.
- **Quality**: Ship secure, reliable, and easily maintainable code.
- **Velocity**: Ship regularly and at a pace that can help you meet business needs.
- **Developer happiness**: Developers are enabled to do their best work and experience satisfaction.

### Twelve primary metrics

For each zone, there are three suggested downstream metrics to improve engineering performance, as shown in the table below.

| Quality                                    | Velocity                        | Developer happiness                       | Business outcomes                                                       |
| ------------------------------------------ | ------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| Change failure rate                        | (Median) Lead time              | (Median) Flow state experience            | (Percentage) AI leverage                                                |
| (Median) Failed deployment recovery time   | Deployment frequency            | (Median) Engineering tooling satisfaction | (Percentage) Engineering expenses to revenue                            |
| (Median) Code security and maintainability | (Mean) PRs merged per developer | (Median) Copilot satisfaction             | (Percentage) Feature engineering expenses to total engineering expenses |

{{< callout type="note" >}}
Each organization's context can differ and may prefer different downstream metrics.
{{< /callout >}}

## Additional solution detail and trade-offs to consider

### Data integration

The calculation of the twelve metrics should align with your specific workflows, tech stack, and tools. It is
important to understand your teams' workflows to determine which data to use from GitHub or other data
sources in your engineering system. Data integration from systems like ITSM tools or incident management
platforms may be required for metrics such as lead time or recovery time. Work with business owners to
define key metrics like "production failure" and "in production" to ensure consistency.

### Qualitative and quantitative data

Metrics like tooling satisfaction or change failure rate can may be complimented with developer surveys,
offering valuable insights without adding complexity. Surveys are particularly useful for organizations
still developing DevEx or DevOps metrics. Leaders should balance the effort and benefits of telemetry-based
measurement versus qualitative feedback.

### Companion metrics for insight

You may employ companion metrics to provide context to these primary metrics, offering insights to the
performance. For example, pairing lead time with change failure rate ensures shorter lead times reflect real
improvements rather than rushed deployments. Striking the right balance is key — too many metrics can dilute
focus, while too few risk misinterpretation. Individual teams should tailor companion metrics to their
workflows, ensuring a holistic view of the engineering system is captured.

### Metrics are interdependent

These four zones are a form of companion metric-thinking by highlighting their interdependence. Improvements
in one zone should complement others, avoiding trade-offs that undermine overall success. This balanced
approach fosters sustainable engineering system performance aligned with business goals.

### Balance cost and benefits of measurement

Strike a pragmatic balance between measurement effort and benefits by implementing critical metrics first,
leveraging existing data sources, automating collection pipelines, and regularly evaluating each metric's
relevancy. Remain cautious about potential suboptimization or gaming behaviors for incentive rather than
actual engineering system success.

## Seeking further assistance

<!-- The Hugo shortcode below will fully populate this section -->

{{% seeking-further-assistance-details %}}

## Related links

<!-- The Hugo shortcode below will include a subsection that links to GitHub's documentation. -->

{{% related-links-github-docs %}}

<!-- ### External Resources -->

<!-- Optionally add any external resources that are related to your article or that could provide additional information or context for your readers.
This could include links to tutorials, blog posts, or other articles. -->

Explore further on four zones and twelve metrics in the [Engineering System Success Playbook](https://resources.github.com/engineering-system-success-playbook/).
