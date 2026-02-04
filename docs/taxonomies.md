# Taxonomies

The taxonomies are structural aspects of the framework that are used to categorize content in the GitHub Well-Architected Framework. They further refine content curation for different personas, use cases, and industry types.

Use the following labels (typically in the front matter) to describe Content Library articles. Then, using Hugo's [Taxonomies](https://gohugo.io/content-management/taxonomies/), the site will organize content based on those labels. Taxonomies are defined in the `hugo.yaml` configuration file.

---

## Using Taxonomies in Front Matter

When creating a new Content Library article, include relevant taxonomies in the front matter. An example of typical article:

```yaml
---
title: 'Your Article Title'
draft: false
publishDate: 2025-12-05

params:
  author:
    name: Your Name
    handle: yourhandle

# Add all relevant taxonomies
pillars:
  - productivity
  - collaboration

areas:
  - ci-cd-and-devops
  - collaborative-coding

personas:
  - developer
  - administrator

platform:
  - github-enterprise-cloud

features:
  - github-actions
  - copilot

components:
  - code-scanning
  - branch-rulesets
---
```

> [!TIP]
> Include all taxonomies that apply to your article. This helps readers discover your content through different navigation paths on the website.

---

## Categories

```yaml
# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - productivity
  - collaboration
  - application-security
  - governance
  - architecture

# The areas of the GitHub adoption journey. Inspiration taken from docs.github.com
areas:
  - agent-and-extensions
  - ci-cd-and-devops
  - client-apps
  - collaborative-coding
  - community
  - context-engineering
  - developers
  - enterprise-and-teams
  - getting-started
  - project-management
  - security

# Classifications of industries who may be at different stages of the customer journey.
verticals:
  - automotive
  - finance
  - gaming
  - government
  - information-technology
  - manufacturing
  - media
  - professional-service
  - retail
  - smb-corporate
  - mid-market

# Individuals in key roles on the customer journey, typically consisting of one or more administrators and the end-user community.
personas:
  - administrator
  - customer-internal-support
  - developer
  - end-user
  - project-manager
  - sales

# Deployment options for GitHub Enterprise, including Cloud (GHEC), Server (GHES), and Hybrid.
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu
  - github-enterprise-server

# GitHub product functions designed to support every stage of development.
features:
  - codespaces
  - copilot
  - copilot-cli
  - git
  - github-actions
  - github-advanced-security
  - github-apps
  - github-cli
  - github-desktop
  - github-discussions
  - github-mobile
  - github-marketplace
  - github-pages
  - github-packages
  - github-projects
  - github-releases
  - issues-and-pull-requests
  - repositories

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - audit-log
  - actions-oidc
  - actions-runners
  - billing-and-cost-centers
  - branch-rulesets
  - caches-and-artifacts
  - chatmode
  - coding-agents
  - code-review-automation
  - code-scanning
  - context-engineering
  - copilot-autofix
  - copilot-business
  - copilot-chat
  - copilot-enterprise
  - copilot-spaces
  - custom-instructions
  - dependabot-and-dependency-review
  - deployment-and-environments
  - git-lfs
  - governance-and-policy
  - graph-api
  - insights-and-metrics
  - limits
  - mcp-and-extensions
  - migration
  - performance-engineering
  - prompt-engineering
  - push-rulesets
  - repository-custom-properties
  - repository-rulesets # to be deprecated
  - rest-api
  - review-agents
  - secret-protection
  - secret-scanning
  - security-campaigns
  - security-configurations
  - sso-saml
  - sso-oidc
  - webhooks

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - certifications
  - community-team
  - customer-success-architect
  - customer-success-manager
  - engineering-and-product
  - enterprise-support
  - expert-services
  - fast-track
  - microsoft
  - partners
  - product-marketing
```

---

## Definitions

It is important to make sure to speak the same language, so here are some definitions of the taxonomies above:

### Administrator

The main technical point of contact who is responsible for the implementation and maintenance of the business application.

### Areas

Framing the areas of the GitHub adoption journey. Inspiration taken from [GitHub Docs](https://docs.github.com).

### Audience

The person/persona viewing the content or interacting with the tool.

### Components

Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.

### Consequences

Certain decisions around GitHub Platform deployment will have trade offs. Consequences are a way to describe them.

### Platform Support

The team for providing first-level support for typical GitHub platform service inquiries.

### End user

The named person(s) who have user accounts on the GitHub platform and frequently interact with its features and components.

### Features

GitHub product functions designed to support every stage of development.

### Personas

Individuals in key roles on the adoption journey, typically consisting of one or more administrators and the end-user community.

### Pillars

Classifications of the framework to drive key concepts, design principles, and architectural best practices.

### Platform

Deployment options for GitHub Enterprise, including Cloud (GHEC), Server (GHES), and Hybrid. GHEC includes both Standard, Managed Users, and Data Residency.

### Verticals

Classifications of industries who may be at different stages of the adoption journey.

---

## Further Information

For more details on how Hugo taxonomies work, see the [Hugo Taxonomies documentation](https://gohugo.io/content-management/taxonomies/).

For guidance on writing Content Library articles, see the [CONTRIBUTING.md](../.github/CONTRIBUTING.md) file.
