---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
title: Monorepos
weight: 3
---

The common definition of a monorepo is that it combines multiple projects or components into a single shared repository.
However, it can often depend on the context.
The monorepo approach can simplify code sharing and dependency management, but it also introduces new considerations around scalability, security, and developer workflows.
By aligning monorepo decisions with GitHub Well-Architected recommendations, teams can realize significant collaboration benefits while maintaining a robust, well-governed environment.

## Monorepo fundamentals

- **Unified Codebase:** Multiple teams can collaborate in one (or fewer) repositories
- **Collaboration:** Considerations around tooling, shared libraries, and uniform coding guidelines can drive code quality and promote reuse across projects, however, trade-offs exist
- **Complexity Trade-Offs:** Larger codebases can lead to more resource-intensive CI/CD pipelines and trickier git operations, requiring thoughtful governance and automation

## Key considerations

When planning for a monorepo, begin by mapping out how code and teams will be structured.
Aligning repository organization with logical projects, team boundaries, and release cadences prevents confusion and ensures efficient collaboration.
Build and testing processes can become resource-intensive as your monorepo grows, so carefully crafted continuous
integration and delivery workflows (i.e. matrix builds, labeled pull requests, subdirectory-based triggers, etc) help maintain quick feedback cycles and avoid bottlenecks.

Governance becomes increasingly important in a large unified codebase.
Permissions should be assigned with precision, ensuring that only appropriate teams or individuals can modify high-impact areas or workflows.
Similarly, well-defined branch protection and review policies can keep code quality high while avoiding disruptions across multiple projects.
Consolidating everything into one repository also necessitates a robust approach to dependency and version management.
While centrally shared libraries reduce duplication, any incompatible changes or upgrades can propagate widely, so adopting clear
versioning strategies or isolating packages under dedicated folders can provide a safety net. It is possible to also inadvertently
increase aspects like clone time if the repository grows too large, so a plan on this scenario is key.

## References & next steps

- [Scaling Git Repositories](/library/architecture/recommendations/scaling-git-repositories)
  - [Exploring repository architecture strategy](/library/architecture/recommendations/scaling-git-repositories/repository-architecture-strategy)
  - [Managing large Git Repositories](/library/architecture/recommendations/scaling-git-repositories/large-git-repositories)
  - [When to use Git LFS](/library/architecture/recommendations/scaling-git-repositories/when-to-use-git-lfs)
- [Monorepo Book](https://monorepo-book.github.io)
