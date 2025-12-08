---
draft: false # Set to false when ready to publish
title: 'Managing large Git Repositories'
publishDate: 2024-09-03
params:
  authors: [{ name: 'Steffen Hiller', handle: 'steffen' }]

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - architecture

# The areas of the GitHub adoption journey. Inspiration taken from docs.github.com
areas:
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
  - end-user

# Deployment options for GitHub Enterprise, including Cloud (GHEC), Server (GHES), and Hybrid.
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu
  - github-enterprise-server

# GitHub product functions designed to support every stage of development.
features:
  - repositories

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - best-practice

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - enterprise-support
  - expert-services
  - partners
---

<!-- This disables the linting rule for heading levels should only increment by one level at a time -->
<!-- markdownlint-disable MD001 -->

<!-- This disables the linting rule for long line lengths -->
<!-- markdownlint-disable MD013 -->

<!-- This disables the linting rule for multiple headings with the same content -->
<!-- markdownlint-disable MD024 -->

<!-- This disables the linting rule for multiple top-level headers -->
<!-- markdownlint-disable MD025 -->

<!--
See our CONTRIBUTING doc for submission details and additional writing style guidelines: https://github.com/github/github-well-architected-internal/blob/main/.github/CONTRIBUTING.md
-->

## Scenario overview

<!-- Provide a brief overview of the scenario that your article will cover. Be as generic, yet opinionated, as possible. -->

A company has been working on an application for several years. Over time, the repository has grown to an enormous size due to extensive code additions, large binary files, and a rich history of commits.

### Key Challenges

1. **Performance Issues**
   - **Cloning and Fetching**: New developers joining the team face significant delays when cloning the repository for the first time, sometimes taking hours. Similarly, fetching updates and pulling changes become increasingly slow, impacting productivity.
   - **Local Operations**: Operations like `git status`, `git log`, and `git diff` become sluggish, causing frustration among developers as even simple commands take longer to execute.
   - **Repository Health**: The repository falls into an unhealthy state due to slow or failing maintenance and degrades overall performance, disrupting the development process.

2. **Storage Constraints**
   - **Disk Space**: The large repository consumes significant disk space, leading to increased costs for storage infrastructure.
   - **Backup and Restore**: Regular backups of the repository take longer and consume more storage, complicating disaster recovery efforts.

3. **Network Throughput**
   - **Data Transfer**: High data transfer volumes strain the network, especially for remote teams, leading to slower internet speeds and higher costs for data transfer.
   - **Service Quality**: Slow connections result in data transfers failing, further slowing development.

4. **Repository Management**
   - **History Bloat**: The extensive commit history, including large binary files and outdated dependencies, makes the repository bloated and difficult to manage.
   - **Complexity**: Managing branches and merges becomes more complex and error-prone, especially when dealing with a large number of files and changes.

5. **Collaboration Challenges**
   - **Merge Conflicts**: The likelihood of merge conflicts increases with the size of the repository, causing delays and requiring more time for conflict resolution.
   - **Code Review**: Code reviews become more challenging as larger changesets take more time to review, and the context can be harder to understand.

6. **Continuous Integration (CI) Pipeline**
   - **Build Times**: The CI pipeline experiences longer build and test times due to the sheer size of the repository, slowing down the feedback loop for developers.
   - **Resource Utilization**: More resources are needed to process builds and tests, leading to increased costs and potential bottlenecks in the pipeline.

## Key design strategies

<!-- This section should discuss the key design strategies that your proposed solution employs. This could include architectural patterns, coding practices,
and other strategic decisions that were made during the design of the solution. -->

This section defines the key design strategies that a company could employ to improve the experience of managing large software projects in Git:

### 1. **Modularity and Decomposition**

- **Repository Splitting**: Breaking down a monolithic repository into smaller, more manageable microservices or components. This reduces the overall size and complexity of each repository, making them easier to manage and work with. This strategy will have the greatest impact on reducing repository size, improving performance, and minimizing the risk of the repository entering an unhealthy state.

### 2. **Efficient Storage Management**

- **Using Git LFS**: Using Git Large File Storage (LFS) to manage large files outside of the Git repository will help keep the repository size mangeable and improve performance for standard Git operations. Moving files to LFS after they have already been committed to the repository will require rewriting history. See [When to use Git LFS](/library/architecture/recommendations/scaling-git-repositories/when-to-use-git-lfs/).
- **Managing Old Data**: A well-maintained repository not only improves collaboration but also reduces potential workload on Git servers. Cleaning up stale pull requests and removing or archiving obsolete branches and tags helps streamline the repository and minimize storage usage. Consistently maintaining a tidy repository will keep the size manageable and reduce the likelihood of performance issues.

### 3. **History and Version Control Optimization**

- **History Rewriting**: Utilizing tools like [`git-sizer`](https://github.com/github/git-sizer) or [`git-filter-repo`](https://github.com/newren/git-filter-repo) to remove large, unnecessary files from the repository history, which helps in reducing repository size and improving performance.
- **.gitignore Optimization**: Place `.gitignore` rules in the deepest possible directories to reduce evaluation overhead, significantly improving performance of client-side commands such as `git status`.

### 4. **Improved Cloning and Fetching Mechanisms**

- **Shallow Clones**: Encouraging the use of shallow clones (`git clone --depth=1`) or partial clones ([`git clone --filter=blob:none` or `--filter=blob:limit=<size>`](https://git-scm.com/docs/git-rev-list#Documentation/git-rev-list.txt---filterltfilter-specgt)) to minimize the amount of data cloned, which speeds up the initial setup for new developers and reduces bandwidth usage.
- **Shallow Directory Structure**: Deeply-nested directory structures increase the number of tree and blob objects created over time, which can lead to repository bloat and reduce the efficiency of object packing and delta compression during Git operations.
- **Fetch Often**: The further the client and server drift from one another, the longer each push will take. Fetching regularly can reduce the time it takes to complete a push.

### 5. **Enhanced CI/CD Pipeline Efficiency**

- **Optimized CI/CD**: Caching a repository can improve CI/CD performance by avoiding redundant work across jobs and pipeline runs. This can be achieved using a local repository mirror or the repository cache feature in GitHub Enterprise Server. Additional strategies - such as shallow or sparse checkouts, parallel builds, and incremental builds - will also reduce build times. These optimizations are especially important in large CI/CD environments, where simultaneous pipeline executions can create a "thundering herd" effect on GitHub resources.

### 6. **Resource and Cost Management**

- **Network Bandwidth Optimization**: Reducing the amount of data transferred by leveraging techniques like shallow cloning and Git LFS, which lowers the strain on network resources and associated costs.
- **Disk Space Management**: Using efficient storage solutions and archiving old data to free up disk space and reduce storage costs.

### 7. **Improved Collaboration and Workflow**

- **Merge Conflict Reduction**: By splitting repositories and optimizing history, the likelihood of merge conflicts can be reduced, streamlining the collaboration process.
- **Simplified Code Reviews**: Smaller, more focused repositories lead to more manageable changesets, making code reviews quicker and more effective.
- **Batch Merges**: Group of merge requests to the same targeted for batch processing to reduce delays due to conflicts and stale branch in merging.

### 8. **Incremental Adoption and Migration**

- **Gradual Implementation**: Encouraging a phased approach to implementing these solutions, allowing teams to adapt to changes progressively without disrupting ongoing development activities.

### 9. **Scalability and Flexibility**

- **Scalable Repository Management**: Designing repository structures and workflows that can scale with the growth of the codebase and the team, ensuring long-term manageability and flexibility.

By employing these design strategies, companies can effectively manage large Git repositories, leading to improved performance, reduced costs, and enhanced developer productivity.

## Implementation Checklist

<!-- The checklist should provide a list of key steps or considerations that should be followed when implementing the solution. This could include things like
"Ensure all code is properly commented", "Write tests for all new functionality", "Verify the associated teams and resources", etc. -->

Here are the key steps and considerations to follow when implementing proposed solutions to manage a very large Git repository effectively:

#### 1. **Assessment and Planning**

- **Evaluate Repository Size and Structure**: Conduct an assessment of the current repository size, structure, and content to understand the scope of the problem.
- **Identify Problem Areas**: Determine specific issues such as large files, extensive history, and complex branching strategies that need addressing.
- **Set Objectives**: Define clear objectives for what you want to achieve, such as reducing repository size, improving performance, or streamlining workflows.

#### 2. **Repository Splitting**

- **Identify Modular Components**: Identify logical components or services within the monolithic repository that can be separated.
- **Plan the Split**: Develop a detailed plan for how and when to split the repository, considering dependencies and integration points.
- **Execute the Split**: Use tools and strategies like Git Submodules or Monorepos to manage the split efficiently.

#### 3. **Implement Git LFS**

- **Identify Large Files**: Use Git commands or tools to identify large files within the repository that can be moved to Git LFS.
- **Configure Git LFS**: Install and configure Git LFS for your repository and track the identified large files.
- **Migrate Large Files**: Migrate existing large files to Git LFS and ensure all team members have updated their local configurations.

#### 4. **History Rewriting**

- **Select Rewriting Tools**: Choose appropriate tools like [`git-sizer`](https://github.com/github/git-sizer) or [`git-filter-repo`](https://github.com/newren/git-filter-repo) to clean the repository history.
- **Plan History Rewriting**: Develop a strategy for rewriting history that minimizes disruptions, such as scheduling during off-peak hours.
- **Backup the Repository**: Create a backup of the repository before performing any history rewriting operations.
- **Execute History Rewriting**: Perform the history rewriting and verify the integrity of the repository post-rewrite.

#### 5. **Optimize Cloning and Fetching**

- **Promote Shallow Clones**: Encourage the use of shallow clones (`git clone --depth=1`) for new developers or in CI environments.
- **Document Cloning Strategies**: Provide clear documentation and guidelines for using shallow clones and other efficient cloning strategies.
- **Promote Partial Clone**: Encourage the use of partial clone (`git sparse-checkout`) to checkout a subset of files needed.

#### 6. **Archiving Old Data**

- **Identify Obsolete Branches and Tags**: Regularly review and identify branches and tags that are no longer needed.
- **Archive and Remove**: Archive important but obsolete branches and tags to an external storage if necessary and remove them from the main repository.

#### 7. **Optimize CI/CD Pipelines**

- **Analyze Build and Test Times**: Evaluate the current CI/CD pipeline to identify bottlenecks and inefficiencies.
- **Implement Parallel Builds**: Configure the CI/CD system to run parallel builds and tests to reduce overall pipeline time.
- **Utilize Caching**: Implement caching mechanisms to reuse build artifacts and dependencies, speeding up the CI/CD process.

#### 8. **Resource Management**

- **Monitor Disk Usage**: Regularly monitor disk usage on both local machines and central servers to manage storage effectively.
- **Optimize Backup Processes**: Ensure that backup processes are efficient and do not consume excessive resources or time.

#### 9. **Enhance Collaboration**

- **Train Developers**: Provide training and documentation to developers on best practices for managing large repositories, handling merge conflicts, and using new tools like Git LFS.
- **Streamline Code Reviews**: Implement tools and processes to simplify and speed up code reviews, especially for large changesets.

#### 10. **Gradual Implementation**

- **Phased Rollout**: Implement changes gradually to allow teams to adapt and to minimize disruptions.
- **Gather Feedback**: Continuously gather feedback from developers and stakeholders to refine and improve the strategies.

#### 11. **Continuous Monitoring and Improvement**

- **Regular Audits**: Conduct regular audits of the repository to identify new issues and areas for improvement.
- **Update Strategies**: Stay updated with the latest Git tools and best practices, and incorporate them into your workflow as necessary. Organizations using patterns that result in large repositories should periodically evaluate whether the approach continues to meet their needs and adjust as necessary based on scale and performance.

By following these steps and considerations, companies can effectively manage large Git repositories, leading to improved performance, reduced costs, and enhanced developer productivity.

## Assumptions

<!-- List any assumptions or preconditions that your article is based on. Be as generic, yet opinionated, as possible. -->

1. **Company Size and Development Practices**
   - The company is mid-sized to large, with a substantial number of developers contributing to the codebase.
   - The development team follows standard version control practices using Git for managing their codebase.
   - There is a centralized repository that all developers clone, pull, and push to regularly.

2. **Repository Characteristics**
   - The repository is significantly large, containing a mix of code, binaries, and extensive commit history.
   - The repository may include a monolithic application or a complex project that has grown over several years.
   - The repository is actively maintained and frequently updated by multiple contributors.

3. **Current Challenges**
   - Developers are experiencing performance issues with Git operations such as cloning, fetching, and pushing.
   - The repository is consuming excessive disk space on local machines and central servers.
   - The CI/CD pipeline is slow due to long build and test times.
   - Network bandwidth is strained due to large data transfers, particularly affecting remote teams.
   - Merge conflicts and complex branching strategies are causing collaboration challenges.
   - Repository performance degrades due to failing maintenance.

4. **Technical Environment**
   - The company has the necessary technical infrastructure to support Git LFS and other proposed tools and strategies.
   - There is access to modern CI/CD tools that can be configured to optimize build and test processes.
   - Developers have a basic to intermediate understanding of Git commands and workflows.

5. **Change Management**
   - The company is open to adopting new tools and practices to improve repository management.
   - There is support from management for initiatives aimed at improving developer productivity and reducing operational costs.
   - Developers are willing to adapt to new workflows and processes as part of the improvement efforts.

6. **Backup and Recovery**
   - There are existing backup and recovery mechanisms in place to protect against data loss during the implementation of new strategies.
   - The company values data integrity and has protocols for verifying the integrity of the repository after significant changes.

7. **Scalability and Future Growth**
   - The company anticipates continued growth of the codebase and is looking for scalable solutions to manage the repository effectively.
   - There is an understanding that the proposed strategies are not one-time fixes but require ongoing maintenance and monitoring.

8. **Tool Availability and Integration**
   - The company has access to necessary tools and plugins, such as Git LFS, [`git-sizer`](https://github.com/github/git-sizer), [`git-filter-repo`](https://github.com/newren/git-filter-repo), and CI/CD systems.
   - The tools and strategies proposed can be integrated into the current development workflow with minimal disruption.

By basing the article on these assumptions and preconditions, the proposed solutions are framed within a realistic context that many mid-sized to large software development companies can relate to and implement effectively.

## Recommended Deployment

<!-- Describe the recommended GitHub Platform deployment that your article will propose. This will typically zoom in on GitHub Platform products, features, and technologies you would prescribe. -->

To effectively manage and optimize a very large Git repository, the proposed GitHub Platform deployment should leverage a combination of GitHub products, features, and technologies. This deployment aims to enhance performance, streamline workflows, and improve collaboration.

#### 1. **GitHub Repository Management**

- **Monorepo Strategy**: For projects that benefit from being in a single repository, use a monorepo approach with proper sub-directory organization. For projects that can be modularized, consider splitting into multiple repositories while using GitHub Organizations to manage them.
- **Git LFS (Large File Storage)**: Enable Git LFS to handle large binary files, reducing the size of the repository and improving performance. Track and migrate existing large files to Git LFS.

#### 2. **GitHub Actions (CI/CD)**

- **Automated Workflows**: Implement GitHub Actions to automate CI/CD pipelines. Use workflows to run builds, tests, and deployments in parallel, optimizing for speed and efficiency.
- **Caching**: Utilize caching in GitHub Actions to store dependencies and build artifacts, significantly reducing build times.
- **Matrix Builds**: Use matrix builds to test multiple configurations simultaneously, ensuring broad compatibility and reducing overall test time.

#### 3. **GitHub Code Scanning and Security**

- **CodeQL**: Integrate CodeQL for advanced code scanning and security analysis. Regularly scan the codebase for vulnerabilities and ensure compliance with security standards.
- **Dependabot**: Enable Dependabot to automatically scan for and update vulnerable dependencies, keeping the codebase secure and up-to-date.

#### 4. **GitHub Advanced Security**

- **Secret Scanning**: Use GitHub's secret scanning feature to detect and prevent the inclusion of sensitive information in the repository.
- **Security Policies**: Define and enforce security policies within the repository to ensure best practices are followed by all contributors.

#### 5. **GitHub Packages**

- **Package Management**: Use GitHub Packages to manage and distribute project dependencies. This integration ensures that package management is seamless and secure, reducing dependency on external registries.

#### 6. **Collaboration and Code Review**

- **Pull Requests**: Leverage pull requests for code review and collaboration. Use required reviews and status checks to ensure code quality before merging.
- **Branch Protection Rules**: Implement branch protection rules to enforce workflows, requiring status checks, and reviews before changes can be merged.
- **GitHub Discussions**: Use GitHub Discussions for team communication and knowledge sharing directly within the repository context.
- **Merge Queue**: Set the queue size and implement Merge Queue to batch pull requests for busy branches.

#### 7. **Documentation and Support**

- **GitHub Pages**: Host project documentation using GitHub Pages, making it easily accessible to all team members and contributors.
- **README, CONTRIBUTING and Wikis**: Maintain comprehensive README, CONTRIBUTING files and wikis to provide guidance on repository usage, development workflows, and best practices.

#### 8. **Backup and Archiving**

- **Repository Backups**: Regularly backup the repository to an external storage solution to ensure data integrity and availability.
- **Archiving**: Archive obsolete branches and tags to reduce clutter and streamline the repository.

## Seeking further assistance

<!-- Provide information on how readers can seek further assistance if they have questions or need help implementing your proposed solution. This typically leads
towards GitHub Services/Support and our Partner community. -->

If you have questions or need help implementing the proposed repository architecture solution on GitHub, there are several resources and support options available to assist you:

#### 1. **GitHub Support**

- **GitHub Support Portal**: Visit the [GitHub Support Portal](https://support.github.com) for a comprehensive collection of articles, tutorials, and guides on using GitHub features and services.
- **GitHub Community Forum**: Join the [GitHub Community Forum](https://github.community) to ask questions, share knowledge, and connect with other GitHub users. It's a great place to get advice and solutions from experienced developers.
- **GitHub Support Ticket**: If you need direct assistance from GitHub’s support team, you can submit a ticket through the [GitHub Support Portal](https://support.github.com). Various support plans are available, including free, premium, and enterprise options, depending on your needs.

#### 2. **GitHub Expert Services**

- **Consulting Services**: GitHub Expert Services offers expert consulting to help you optimize your GitHub workflows, implement best practices, and ensure successful deployment of your repository architecture strategy. Learn more about these services at [GitHub Expert Services](https://services.github.com).
- **Training and Workshops**: GitHub provides training sessions and workshops to help your team get up to speed with GitHub tools and features. These can be customized to address specific needs and use cases. Learn more about these services at [GitHub Expert Services](https://services.github.com).

#### 3. **GitHub Partner Community**

- **GitHub Verified Partners**: Work with verified GitHub partners who specialize in various aspects of software development, including DevOps, CI/CD, and code quality. These partners can provide tailored solutions and services to help you implement your repository architecture strategy effectively. Explore the list of partners at [GitHub Partners](https://partners.github.com).

#### 4. **Online Resources and Communities**

- **Developer Documentation**: The [GitHub Developer Documentation](https://docs.github.com) provides detailed technical documentation and API references for advanced users who want to build custom integrations and automate workflows.
- **Stack Overflow**: Participate in discussions and seek advice on [Stack Overflow](https://stackoverflow.com) by using the `github` tag. The community of developers on this platform can be a valuable resource for troubleshooting and best practices.

#### 5. **Local and Virtual Meetups**

- **GitHub Events**: Attend GitHub-hosted events such as GitHub Universe, GitHub Satellite, and local meetups to network with other developers, learn from experts, and stay updated on the latest GitHub features and trends. Check out upcoming events at [GitHub Events](https://github.com/events).

By leveraging these resources and support options, you can gain the knowledge and assistance needed to successfully implement and optimize your repository architecture strategy on GitHub.

## Related links

<!-- This section should provide links to any resources that are related to your article or that could provide additional information or context for your readers.
This could include links to official public documentation, tutorials, blog posts, GitHub Community discussion posts, or other articles. -->

- [Maintaining a Monorepo](https://monorepo-book.github.io/)
