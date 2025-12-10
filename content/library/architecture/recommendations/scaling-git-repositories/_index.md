---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false # Set to false when ready to publish
title: 'Scaling Git repositories'
---

As software projects grow in size and complexity, managing Git repositories becomes increasingly challenging.
One common scenario that many teams face is dealing with a monorepo, where all the code for multiple projects is stored in a single repository.
There can also be varying definitions of what constitutes a "monorepository".
While monorepos offer benefits such as simplified dependency management and easier code sharing, they also present unique challenges.
These challenges include longer clone times, increased storage requirements, and more complex CI/CD pipelines.
In the following guides, we will explore various strategies and best practices for scaling Git repositories to handle large codebases efficiently.

- [Exploring repository architecture strategies]({{< relref "repository-architecture-strategy.md" >}})
- [Managing large Git repositories]({{< relref "large-git-repositories.md" >}})
- [When to use Git LFS]({{< relref "when-to-use-git-lfs.md" >}})
