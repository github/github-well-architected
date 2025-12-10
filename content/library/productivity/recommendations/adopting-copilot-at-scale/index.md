---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false   # Set to false when ready to publish
title: 'Adopting GitHub Copilot at Scale'
publishDate: 2024-07-22
params:
  authors: [
    {name: "Greg Mohler", handle: "callmegreg"},
  ]

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - productivity

# The areas of the GitHub adoption journey. Inspiration taken from docs.github.com
areas:
  - collaborative-coding
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
  - audit-log
  - policies
  - teams
  - enterprise-settings
  - organization-settings
  - repository-settings

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - enterprise-support
  - expert-services
  - partners
---

<!-- This disables the linting rule for multiple top-level headers -->
<!-- markdownlint-disable MD025 -->

## Scenario overview

Congratulations, you made the decision to adopt GitHub Copilot! But now what? Rolling out any technology to thousands of users can be a daunting task. After all, adopting GitHub Copilot doesn't just mean a new tool, it means a new way of working.

A few key strategies can help you maximize the benefits from your investment in GitHub Copilot, leading to a more productive and fulfilled team.

## Key design strategies and checklist

1. Create a plan that includes the weeks leading up to and weeks following your GitHub Copilot launch
2. Use multiple communication channels and repeat the message often
3. Attain executive sponsorship and support
4. Prepare for both instructor-led and on-demand GitHub Copilot enablement
5. Build an internal GitHub Copilot community
6. Measure GitHub Copilot adoption, activity, and impact
7. Continuously gather feedback and improve your GitHub Copilot program

## Assumptions and preconditions

1. [GitHub Enterprise Cloud (GHEC)](https://docs.github.com/en/enterprise-cloud@latest/admin/overview/about-github-enterprise-cloud)
2. Either GitHub Copilot Enterprise or GitHub Copilot Business ([GitHub Copilot plans](https://github.com/features/copilot/plans))

## Recommended deployment

### Plan your GitHub Copilot launch

It's important to plan your GitHub Copilot launch carefully. Ensure that your plan has a dedicated individual accountable for its execution and includes elements related to technical administration, learning & development, and communication.

An example GitHub Copilot launch plan should include the following minimum elements:

#### Pre-launch

- Set up [GitHub Copilot policies](https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-copilot-in-your-enterprise) for your Enterprise and/or Organization(s)
- Establish a user onboarding process that enables self-service access to GitHub Copilot to reduce manual overhead
- Communicate the launch date of GitHub Copilot to your organization
- Create a channel of communication for technical challenges and feedback
- Define time-bound Key Performance Indicators (KPIs) for GitHub Copilot adoption and activity metrics
- Idenitfy a set of GitHub Copilot Champions to help drive adoption and provide feedback

#### Launch week (week 0)

- Communicate the opportunity, benefits, and availability of GitHub Copilot to your organization
- Provide on-demand [training](https://learn.microsoft.com/en-us/training/modules/introduction-to-github-copilot/) and [resources](https://docs.github.com/en/enterprise-cloud@latest/copilot/quickstart) for users to get started with GitHub Copilot

#### Post-launch (weeks 1-4)

- Deploy an internal GitHub Copilot community (or "Expert Hub") to share best practices, success stories, and helpful resources
- Hold a series of instructor-led GitHub Copilot enablement sessions, including workshops, hackathons, and webinars
- Send reminder emails, messages, and newsletters to encourage GitHub Copilot adoption

#### Post-launch (weeks 5-8)

- Monitor GitHub Copilot adoption and activity metrics
- Develop a GitHub Copilot reporting mechanism to track KPIs and derive meaningful insights about GitHub Copilot by using the [Copilot Usage API](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage?apiVersion=2022-11-28) and [Copilot User Management API](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-user-management?apiVersion=2022-11-28)
- Build on your GitHub Copilot Expert Hub with advanced training and resources specific to your organization
- Gather feedback from users and iterate on your GitHub Copilot program

### Communicate early and often

Communication is key to a successful GitHub Copilot rollout. Use multiple channels to communicate the benefits of GitHub Copilot to your organization, including email, chat, internal documentation forums, town halls, and newsletters. Repeat the message often to ensure that users are aware of the opportunity and benefits of GitHub Copilot.

### Executive sponsorship

Driving GitHub Copilot adoption is most effective when backed with executive sponsorship and support. Engage with your organization's leadership to secure their buy-in for your GitHub Copilot program. Executive sponsorship will help drive awareness, adoption, and accountability for GitHub Copilot usage across your organization.

### Prepare instructor-led and on-demand GitHub Copilot enablement

Instructor-led training is invaluable as it allows users to ask questions and receive immediate feedback as they are learning about GitHub Copilot. Instructor-led training can be delivered through interactive workshops, guided hackathons, and large-format webinars.

However, it is impractical to expect every user across large organizations to be able to join a live session. On-demand resources, like internal documentation, training modules, and video tutorials, can help users get started with GitHub Copilot at their own pace.

GitHub offers many free resources to help users get started with GitHub Copilot:

- [GitHub Copilot Fundamentals Course via Microsoft Learn](https://learn.microsoft.com/en-us/training/paths/copilot/)
- [GitHub Copilot Learning Pathway](https://resources.github.com/learn/pathways/copilot/essentials/essentials-of-github-copilot/)
- [GitHub Copilot Youtube Playlist](https://www.youtube.com/playlist?list=PL0lo9MOBetEHEHi9h0k_lPn0XZdEeYZDS)
- [GitHub Copilot Blog Posts](https://github.blog/?s=copilot)
- [GitHub Copilot Quickstart Documentation](https://docs.github.com/en/enterprise-cloud@latest/copilot/quickstart)

To best prepare your existing team and future hires, consider offering a mix of instructor-led and on-demand Copilot enablement resources.

### Build an internal GitHub Copilot community (or "Expert Hub")

Building an internal GitHub Copilot community can help users share best practices, success stories, and helpful resources. An internal GitHub Copilot community can also help users connect with others who are using GitHub Copilot in similar ways, and can provide a forum for users to ask questions and share feedback.

A devoted GitHub repository or organization, along with GitHub native features like [GitHub Discussions](https://docs.github.com/en/enterprise-cloud@latest/discussions/quickstart), can be used to denote answers to frequently asked questions, foster collaboration, and collect innovative ideas from your GitHub Copilot community.

Be sure to include other helpful resources for your GitHub Copilot community, such as:

- Guidance on how to procure a GitHub Copilot license
- On-demand training resources
- GitHub Copilot documentation
- A feedback channel to your GitHub administration team

### Measure GitHub Copilot adoption, activity, and impact

At its core, GitHub Copilot saves users time while coding. In order for GitHub Copilot to drive downstream impacts, the time saved needs to be spent towards a business objective (e.g. improving velocity, improving quality, learning & development, etc.).

See the article [Measuring Impact for GenAI Adoption](../../../scenarios/measuring-genai-impact) for a detailed, tiered approach to measuring Copilot's impact.

### Continuously gather feedback and improve your GitHub Copilot program

Use surveys, focus groups, and feedback channels to collect feedback from users about their GitHub Copilot experience. Analyze this feedback to identify areas for improvement and make data-driven decisions to maximize the benefits of GitHub Copilot for your organization.

## Additional solution detail and trade-offs to consider

### Assigning licenses

GitHub Copilot licenses can be assigned in a few different ways, each with their own benefits and trade-offs. You can assign licenses to:

1) All individuals in an organization
2) Specific individuals in an organization
3) Specific teams in an organization
4) Specific teams in an enterprise

While assigning licenses out of a single organization can simplify license management, it restricts the granularity of Copilot telemetry data from the [Copilot Usage API endpoint for organizations](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-organization-members).
If you would like to track GitHub Copilot usage across your GitHub Organizations, consider assigning licenses to specific teams or individuals in those organizations.

<!-- PLACEHOLDER FOR COPILOT USAGE API ENDPOINT FOR TEAMS TRADE-OFFS -->

{{< callout type="info" >}}
When a user receives a seat from multiple organizations in the same enterprise, GitHub takes care of deduplicating these seats before billing for the user.
{{< /callout >}}

### Setting up a self-serve process for licenses

When you've enabled GitHub Copilot in an organization or enterprise, you can set up a self-serve workflow to allow users to request licenses.
This allows you to allocate licenses to people who want them, and means people can get started with Copilot quickly.
For examples of license automation, see [Setting up a self-serve process for GitHub Copilot licenses](https://docs.github.com/en/enterprise-cloud@latest/copilot/tutorials/roll-out-at-scale/assign-licenses/set-up-self-serve-licenses) and [Reminding inactive users to use their GitHub Copilot license](https://docs.github.com/en/enterprise-cloud@latest/copilot/tutorials/roll-out-at-scale/assign-licenses/remind-inactive-users).

### Automating license revocation

While automation can help manage costs associated with stale GitHub Copilot licenses, it can also lead to unintended consequences. For example, if licenses are revoked after a short window of inactivity, active users may be disrupted by their license revocation after spending some time on non-coding tasks.
To avoid this, consider implementing a process that notifies users before their license is revoked, giving them time to renew it.

## Seeking further assistance
<!-- The Hugo shortcode below will fully populate this section -->

{{% seeking-further-assistance-details %}}

## Related links

<!-- The Hugo shortcode below will include a subsection that links to GitHub's documentation. -->

{{% related-links-github-docs %}}

<!-- ### External Resources -->

<!-- Optionally add any external resources that are related to your article or that could provide additional information or context for your readers.
This could include links to tutorials, blog posts, or other articles. -->
