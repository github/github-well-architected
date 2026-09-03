---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false
title: 'Recommendations for effective continuous integration (CI)'
publishDate: 2026-07-29
weight: 4
params:
  authors: [{ name: 'Collin McNeese', handle: 'collinmcneese' }]

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - productivity
  - collaboration

# The areas of the GitHub adoption journey. Inspiration taken from docs.github.com
areas:
  - ci-cd-and-devops
  - developers

# Individuals in key roles on the customer journey, typically consisting of one or more administrators and the end-user community.
personas:
  - administrator
  - developer

# GitHub product functions designed to support every stage of development.
features:
  - github-actions

---

<!-- This disables the linting rule for multiple top-level headers -->
<!-- markdownlint-disable MD025 -->

## Recommendation overview

Continuous Integration (CI) is a core practice in software development, yet many teams struggle with builds that take too long, fail unexpectedly, or provide unclear feedback. Fighting CI to get a green build should not be the norm. Well-designed CI pipelines help developers ship confidently and quickly.

Whether you're just starting with CI or looking to optimize existing pipelines, this guide will help you build workflows that developers find reliable and efficient.

{{< callout type="info" >}}
Assumptions and preconditions:

- Your organization is using or considering GitHub Actions
- You have a basic understanding of YAML and command-line tools
- Your repositories have existing codebases that need CI integration
- You have appropriate permissions to create and modify workflow files
{{< /callout >}}

## Key design strategies and checklist

- [ ] Foundation
  - [ ] Tests are isolated, deterministic, and fast
  - [ ] Flaky tests are tracked and prioritized for fixing
  - [ ] Test suite follows the testing pyramid
  - [ ] Error messages are clear and actionable
- [ ] Practices
  - [ ] Jobs are ordered from fastest to slowest
  - [ ] Dependencies are cached appropriately
  - [ ] Parallelization and sequential ordering of jobs is considered
  - [ ] Job summaries and annotations provide rich feedback
  - [ ] Workflows use path filters and concurrency controls
  - [ ] Permissions follow principle of least privilege
  - [ ] Third-party actions are pinned to commit SHAs
  - [ ] Dependabot keeps actions updated
  - [ ] OIDC is used for cloud authentication where possible
- [ ] Advanced
  - [ ] Matrix builds test across required platforms/versions
  - [ ] The runtime environment is customized to avoid repeated setup steps
  - [ ] Reusable workflows standardize patterns across repositories
  - [ ] Workflow templates provide approved starting points
  - [ ] Monorepo builds only test affected packages
  - [ ] Runner groups segment workloads appropriately
  - [ ] Environment protection rules govern deployments
  - [ ] CI metrics are tracked (duration, flake rate, queue time)

## Part 1: Foundation - CI and testing concepts

Before writing a single workflow file, understanding the principles behind effective CI will reduce debugging time and frustration. These concepts apply regardless of which CI platform you use.

### What is continuous integration, really?

Before CI became common practice, developers worked in isolation for days or weeks, then faced a painful "integration day" when everyone's changes collided. Bugs found at that point were expensive to fix: the code was no longer fresh in anyone's mind, changes interacted in unexpected ways, and root-causing a failure meant digging through days of commits.

CI addresses this by integrating frequently, ideally with every commit. Each integration runs automated checks that provide rapid feedback, so when something breaks, you know exactly which small change caused it. This shifts the discovery of problems from "days later when everything is tangled together" to "minutes later when you're still thinking about that code."

Understanding CI as fundamentally about **reducing integration risk through rapid feedback** helps you make better decisions about what checks to run and when to run them. Every CI decision should be evaluated against this principle: does this help catch problems earlier and with less effort?

This aligns directly with the [Design for Feedback](../design-principles#design-for-feedback) principle. Feedback is only valuable when it arrives quickly enough to act on. CI is one of the most important feedback mechanisms in software development, and its effectiveness depends on how fast and clear that feedback is.

### Fail fast

The fail-fast philosophy structures your pipeline so that the checks most likely to fail, and fastest to run, execute first. Linting catches typos in seconds. Type checking catches interface mismatches in a few more. Only after these quick sanity checks pass should you invest time in compilation and testing.

| Approach | Pipeline order | Time to failure |
| ---------- | ---------------- | ----------------- |
| ❌ **Anti-pattern** | Install deps (2m) → Build (5m) → Test (10m) → Lint (30s) | 17 minutes to learn about a typo |
| ✅ **Fail-fast** | Lint (30s) → Install deps (2m) → Build (5m) → Test (10m) | 30 seconds to learn about a typo |

**Fast feedback also keeps developers in flow.** When feedback arrives quickly, developers can fix the issue while still mentally engaged with the code.

{{< callout type="info" >}}
**Run validation locally first**: Encourage developers to run lint and type checks locally before pushing, where possible. This catches errors even faster than CI and reduces wait time for feedback.
{{< /callout >}}

### Designing tests that support fast feedback

CI is only as good as the tests it runs. A sophisticated pipeline running a poorly designed test suite will still frustrate developers, just with more elaborate infrastructure.

- **Isolated tests** don't depend on execution order or shared state. When tests share a database and one test forgets to clean up, the next test mysteriously fails even though the code is correct. Isolated tests can also run in parallel, significantly reducing total test time.
- **Deterministic tests** always produce the same result for the same code. Flaky tests (tests that sometimes pass and sometimes fail without code changes) are arguably worse than no tests at all. They train developers to ignore failures and retry until green, which means real failures get ignored too. When you see a flaky test, treat it as a high-priority bug.
- **Fast tests** get run. Slow tests get skipped. A unit test that takes 500ms might seem acceptable, but multiply that by 1,000 tests and your suite takes 8 minutes. Strive for milliseconds per unit test, and reserve slower tests for when they're truly necessary.
- **Clear test names** serve as documentation. When `test_user_creation` fails, you're stuck reading the test code. When `test_creating_user_without_email_returns_400_error` fails, you already know what's broken.

Common sources of test flakiness include:

| Source | What happens | Solution |
| --- | --- | --- |
| Time-dependent assertions | "5 seconds from now" varies between runs | Use frozen clocks or time mocking libraries |
| Race conditions | Async operations complete unpredictably | Use proper synchronization primitives, avoid arbitrary sleeps |
| External service calls | Network issues, rate limits, outages | Mock external services in unit tests |
| Shared mutable state | Previous test pollutes next test's data | Reset state in setup/teardown, use database transactions |
| File system assumptions | Paths differ across operating systems | Use temp directories, normalize paths |

### The testing flow

The testing pyramid helps you think about how to balance different types of tests for maximum effectiveness with reasonable cost.

```text
       /\          E2E (few, slow, high confidence)
      /  \
     /----\        Integration (some, moderate speed)
    /      \
   /--------\      Unit (many, fast, focused)
  /          \
```

- **Unit tests** exercise individual functions or classes in isolation with all dependencies mocked. They run fast and pinpoint failures precisely. When a unit test fails, you know exactly which function broke. Their speed and precision make them ideal for running on every commit.
- **Integration tests** verify that multiple components work together correctly. They might use a real database or call actual service endpoints. This realism catches issues that mocking would hide, but it costs time and failures can be less precise because more code is involved.
- **End-to-end tests** simulate real user workflows through the actual UI. They catch problems that only manifest when all the pieces come together, but they're slow (browser automation, real services, network latency), expensive to maintain (brittle when UI changes), and vague when they fail (the whole application is involved). Reserve them for critical user journeys and run them less frequently.

The pyramid is wide at the bottom because you want many fast, precise tests catching most issues early, with fewer slow, broad tests providing confidence that everything integrates correctly. The exact proportions depend on your application. An API with no UI might have a flatter pyramid, but the principle holds to prefer faster, more focused tests when possible.

### Feedback that helps developers learn

A CI status that simply shows ✅ or ❌ forces developers to dig through logs hunting for clues. Effective CI feedback tells developers what failed, why it failed, and ideally how to fix it.

Consider the difference between these two experiences:

- **Scenario A**: CI shows ❌. Developer clicks through pages of logs, searches for "error," finds a cryptic stack trace, spends more time understanding the failure.
- **Scenario B**: CI shows ❌ with a summary: "Test `UserService.createUser` failed: Expected status 201 but got 400. Request body was missing required field 'email'. See line 45 of user.test.js."

This connects to broader organizational learning. Teams that treat CI as a source of learning rather than just a gate to pass through tend to improve faster. See [Design for Continuous Learning](../design-principles#design-for-continuous-learning) for more on building learning into your engineering culture.

## Part 2: Practices - GitHub Actions fundamentals

With a solid conceptual foundation, let's apply these principles using GitHub Actions. This section covers the essential patterns every team should understand.

CI is fundamentally about automation to replace manual, error-prone processes with consistent, repeatable workflows. As you implement these practices, keep the [Design for Automation](../design-principles#design-for-automation) principle in mind.

{{< callout type="info" >}}
**New to GitHub Actions?** Check out the [GitHub Actions learning paths](https://learn.github.com/learning?product=GitHub+Actions&contentType=Learning+path) on GitHub Learn for hands-on, structured learning.
{{< /callout >}}

### Workflow structure and dependencies

A GitHub Actions workflow consists of one or more **jobs**, each containing a sequence of **steps**. By default, jobs run in parallel on separate runners. This is great for speed, but it means your expensive 10-minute test job starts immediately even if a 30-second lint job is about to fail.

The `needs` keyword creates dependencies between jobs, implementing the fail-fast philosophy at the workflow level. A job won't start until all jobs it `needs` have completed successfully.

```yaml
name: CI

on:
  pull_request:
    branches:
    - main

permissions:
  contents: read

jobs:
  # Stage 1: Fast validation
  # Linting and type checking catch common errors almost instantly.
  # If a developer forgot a semicolon, they'll know in 30 seconds.
  lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - name: Setup Node.js
        uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v6
        with:
          node-version: '24'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  # Stage 2: Build and Test
  # Only runs if linting passes - no point compiling code with syntax errors.
  build:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - name: Setup Node.js
        uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v6
        with:
          node-version: '24'
      - run: npm ci
      - name: Build
        run: npm run build
      - name: Test
        run: npm test
```

**Sequential ordering trades some average-case speed for avoiding wasted runs.** Lint, build, and test execute one after another rather than simultaneously. For a team with a high first-attempt success rate, parallel execution might be faster on average. But for teams where early-stage failures are common (new projects, rapid development, less experienced contributors), fail-fast prevents wasted compute and reduces feedback time for the common case.

{{< callout type="info" >}}
**Parallel steps within a job**: Actions supports running steps concurrently inside a single job using `background`, `wait`, `wait-all`, `cancel`, and `parallel` keywords. This doesn't replace the `needs`-based fail-fast pattern above, but it's a useful option when steps within one job (starting a database, warming a cache, running two independent scripts) don't depend on each other and don't need separate runners.
{{< /callout >}}

### Caching dependencies

Each GitHub-hosted job starts on a fresh virtual machine, while self-hosted runners may retain state between jobs unless you clean them. Without caching on ephemeral runners, you'd re-download every dependency for every run. This could mean gigabytes of packages, multiple times per hour, across dozens of developers. Caching stores downloaded packages between runs, reducing repeated download time.

For complete caching syntax and options, see [Caching dependencies to speed up workflows](https://docs.github.com/enterprise-cloud@latest/actions/using-workflows/caching-dependencies-to-speed-up-workflows).

The setup actions for most languages include built-in caching that handles the details automatically:

```yaml
- uses: actions/setup-python@v7
  with:
    python-version: '3.13'
    cache: 'pip' # caching pip dependencies
```

This works well because the action hashes your dependency file or lockfile to generate the cache key. When that file changes, the key changes and the action creates a fresh cache. When it is stable, later runs can restore the existing download cache.

For more control (caching build outputs, using complex cache keys, or caching paths the setup actions don't know about), use the `actions/cache` action directly. The key concepts are:

- **`key`**: Uniquely identifies the cache, typically using `hashFiles()` on lockfiles
- **`restore-keys`**: Fallback prefixes for partial cache matches when exact key isn't found
- **`path`**: Directories to cache

See the [actions/cache documentation](https://github.com/actions/cache) for full syntax and examples.

### Providing rich feedback

GitHub Actions offers several mechanisms beyond log output to make failures clear and actionable. For complete syntax, see [Workflow commands for GitHub Actions](https://docs.github.com/enterprise-cloud@latest/actions/reference/workflows-and-actions/workflow-commands).

- **Job summaries** render Markdown in the Actions UI, perfect for test results, coverage reports, or build metrics. Write Markdown content to `$GITHUB_STEP_SUMMARY` and it appears at the top of the workflow run.
- **Annotations** highlight specific files and lines in the PR diff, so developers see the problem exactly where it occurs. Use the `::error file={path},line={line}::` or `::warning` workflow commands, or upload SARIF files from linters for automatic annotation.
- **Log grouping** organizes verbose output into collapsible sections using `::group::` and `::endgroup::` commands. When installation logs span 500 lines, grouping keeps them out of the way while still accessible for debugging.

### Optimizing trigger conditions

Not every change needs every check. Running the full test suite when someone fixes a typo in the README wastes compute time and delays feedback for changes that actually matter.

For complete trigger syntax, see [Events that trigger workflows](https://docs.github.com/enterprise-cloud@latest/actions/reference/workflows-and-actions/events-that-trigger-workflows).

- **Path filters** let you skip workflows when only certain files change. Use `paths` to include specific paths, or `paths-ignore` to exclude them (like `**.md` or `docs/**`). If a filtered workflow is configured as a required status check, a skipped run leaves the check pending and blocks merging; keep required workflows unfiltered or use an always-running required check.
- **Concurrency controls** cancel outdated workflow runs when new commits arrive. Set a `concurrency` group based on workflow and branch, with `cancel-in-progress: true`. If a developer pushes three commits in quick succession, only the latest one runs—no wasted resources on superseded commits.

### Security fundamentals

CI pipelines often have elevated permissions: access to secrets, ability to publish packages, and authority to deploy to production. This makes them attractive targets and means security mistakes can have serious consequences.

For comprehensive guidance on securing your CI/CD pipelines, see [Securing GitHub Actions Workflows](../../application-security/recommendations/actions-security), which covers authentication, repository rules, least privilege, and supply chain protection in depth.

#### Minimal permissions

Minimal permissions limit the blast radius of compromised workflows. The `GITHUB_TOKEN` defaults are inherited from enterprise, organization, and repository settings and can be permissive or restricted. Explicitly declaring the permissions a workflow needs ensures it can't do more than intended:

```yaml
permissions:
  contents: read
  pull-requests: write
```

#### Pinned action versions

Pinned action versions add an additional protection layer against supply chain attacks. Pinning to a specific commit SHA (not just a version tag) ensures you're running exactly the code you reviewed:

```yaml
steps:
  # Pinned to specific commit, not just the v7 tag
  uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
```

#### Keeping actions updated with Dependabot

While pinning provides security, you still need to update actions regularly to receive security patches and improvements. [Dependabot can automatically create pull requests](https://docs.github.com/enterprise-cloud@latest/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot) when new versions of actions are available, letting you review and merge updates on your schedule rather than running outdated code indefinitely.

Enable Dependabot for GitHub Actions by adding a `.github/dependabot.yml` file:

```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

This creates a sustainable balance: you get the security of pinned versions while still receiving timely updates through a controlled review process.

#### Using OpenID Connect instead of long-lived secrets

Long-lived credentials stored as secrets create ongoing risk. If a secret is exposed, attackers can use it until someone notices and rotates it. [OpenID Connect (OIDC)](https://docs.github.com/enterprise-cloud@latest/actions/security-guides/security-hardening-for-github-actions#using-openid-connect-to-access-cloud-resources) provides a better approach for cloud authentication.

With OIDC, workflows request short-lived tokens directly from your cloud provider (AWS, Azure, GCP, and others). These tokens expire quickly (often within an hour), and no permanent credentials are stored in GitHub. The cloud provider verifies that the request came from a specific repository, branch, or environment before issuing the token.

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write  # Required for OIDC
      contents: read
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: aws-actions/configure-aws-credentials@e6de054238d6b7531b4efff3b6587d9aade6a06c # v6.2.3
        with:
          role-to-assume: arn:aws:iam::123456789012:role/my-github-actions-role
          aws-region: us-east-1
      # No AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY needed
      - run: aws s3 sync ./dist s3://my-bucket
```

OIDC eliminates secret rotation burden, reduces exposure window if workflows are compromised, and provides better audit trails since each token request is logged by the cloud provider.

## Part 3: Advanced - Scaling and optimization

Once you've mastered the fundamentals, these advanced patterns help you scale CI across large codebases, multiple platforms, and complex build requirements.

### Matrix builds

Many projects need to test across multiple versions, like Node 20, 22, and 24, or Ubuntu, macOS, and Windows. Running these sequentially would multiply your build time by the number of configurations. Matrix builds run them in parallel, testing all configurations in roughly the time of the slowest one.

For complete matrix syntax, see [Using a matrix for your jobs](https://docs.github.com/enterprise-cloud@latest/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations).

Key matrix concepts:

- **Matrix variables**: Define arrays of values (versions, operating systems) that create job combinations
- **`exclude`**: Skip specific combinations that aren't needed (e.g., skip Windows + Node 18 if it rarely catches unique issues)
- **`include`**: Add specific combinations with extra properties (e.g., experimental Node.js 23 on Ubuntu only)
- **`fail-fast`**: When `true`, cancels all matrix jobs if one fails (default behavior)

For large test suites, **sharding** distributes tests across multiple parallel runners. Many test frameworks support sharding natively or through plugins—check your framework's documentation for the specific flag (e.g., Jest uses `--shard`, Playwright uses `--shard`). Use a matrix with shard numbers (`[1, 2, 3, 4]`) and pass the shard index to your test runner.

### Customizing the runtime environment

Sometimes you need a specific database version, a particular system library, or an exact reproduction of your production environment. Other times the environment is fine, but you're repeating the same lengthy setup—installing system libraries, compilers, or browser dependencies—on every single run. In these cases, consider customizing the runtime environment itself.

- **Container jobs** give you full control over the execution environment and are the most portable option, working on any GitHub-hosted or self-hosted runner that supports containers. Specify `container: name:tag` on a job to run all steps inside that container image. For frequently used setups, build a Docker image with your dependencies pre-installed and publish it to GitHub Container Registry to avoid repeated installation time. Service containers spin up dependencies under `services:`. Use the service name as the hostname from a container job; from a job running directly on the runner, publish the required ports and connect through `localhost`. See [Running jobs in a container](https://docs.github.com/enterprise-cloud@latest/actions/how-tos/write-workflows/choose-where-workflows-run/run-jobs-in-a-container) and [Using containerized services](https://docs.github.com/enterprise-cloud@latest/actions/tutorials/use-containerized-services).
- **Custom images for GitHub-hosted runners** bake your dependencies directly into the runner. Use this when you want the speed of a pre-built environment without the overhead of starting a container on top of the runner. See [Using custom images for GitHub-hosted runners](https://docs.github.com/enterprise-cloud@latest/actions/how-tos/manage-runners/larger-runners/use-custom-images).

Each trades setup complexity for faster, more consistent CI runs, based on whether you're using GitHub-hosted or self-hosted runners, and how portable the environment needs to be.

### Reusable workflows and workflow templates

As organizations grow, the same CI patterns appear in dozens of repositories. Copy-pasting workflow files works initially, but updates can become operational overhead. Fix a bug or improve performance in one place, and you need to manually propagate it everywhere.

**[Workflow templates](https://docs.github.com/actions/how-tos/write-workflows/use-workflow-templates)** provide starting points for repositories. Create each workflow file and its matching `.properties.json` metadata file in your organization's `.github` repository under `.github/workflow-templates/`; eligible repositories then show the template in the Actions tab when developers create workflows. Used templates are copied into each repository, so teams can customize them for their specific needs.

Templates work well for:

- Establishing consistent starting points across repositories
- Providing approved patterns that teams can adapt
- Reducing time to first workflow for new projects

**[Reusable workflows](https://docs.github.com/enterprise-cloud@latest/actions/using-workflows/reusing-workflows)** let you define a workflow once and call it from other workflows. Unlike templates, reusable workflows are referenced rather than copied. Callers that use a branch receive future changes automatically, while callers pinned to a tag or commit SHA remain on that version until their reference is updated.

This aligns with [Design for Integration](../design-principles#design-for-integration) to establish standards and eliminate silos across teams and repositories.

Key concepts for reusable workflows:

- **Define** a reusable workflow with the `workflow_call` trigger in a central repository
- **Declare inputs and secrets** the caller can pass to customize behavior
- **Call** the workflow using `uses: org/repo/.github/workflows/workflow.yml@ref`
- **Version with tags** (`@v1`, `@v2`) to control when repositories adopt breaking changes

For more on scaling reusable patterns across your organization, see [Scaling Actions Reusability](../../collaboration/recommendations/scaling-actions-reusability).

### Composite actions

While reusable workflows encapsulate entire jobs, composite actions encapsulate sequences of steps. They're ideal for repeated setup logic that multiple jobs need—like setting up a language runtime, installing dependencies, and configuring caching.

For complete syntax, see [Creating a composite action](https://docs.github.com/enterprise-cloud@latest/actions/tutorials/create-actions/create-a-composite-action).

Key concepts:

- Create an `action.yml` file with `runs.using: 'composite'`
- Define `inputs` for customizable parameters
- List steps just like in a workflow (each `run` step must specify `shell`)
- Reference from workflows using `uses: ./.github/actions/your-action` (local) or `uses: org/repo/path@ref` (remote)

Composite actions are ideal for standardizing setup across multiple jobs in a workflow or across repositories.

### Monorepo strategies

Monorepos (single repositories containing multiple packages or applications) can present a scaling challenge with CI. Running all tests for every change is wasteful when most changes only affect one package.

For broader guidance on monorepo design and governance, see [Monorepos](../../scenarios/monorepos). This section focuses specifically on CI strategies.

There are two primary approaches to selective testing in monorepos:

- **Workflow-level path filters** use the native `paths` trigger to run a workflow only when matching files change. This is simple and requires no additional tooling, but each filter controls the entire workflow rather than individual jobs:

  ```yaml
  name: Frontend CI
  on:
    push:
      paths:
        - 'packages/frontend/**'
        - 'packages/shared/**'  # Include shared dependencies
  ```

- **Job-level change detection** uses git commands or scripts to determine which packages changed, then conditionally runs jobs. This provides more flexibility for complex dependency graphs but requires more setup. You can use `git diff` to compare against the base branch and set job outputs based on which paths have changes.

#### Key design considerations

- **Include shared dependencies**: If `packages/shared` changes, all packages that depend on it should be tested
- **Understand your dependency graph**: Changes to a utility package may affect many downstream packages
- **Balance granularity with complexity**: More fine-grained filtering saves compute but increases workflow maintenance

### Self-hosted runners and runner groups

GitHub-hosted runners work well for most workloads, but some situations call for self-hosted runners, such as for internal network access where [private networking options](https://docs.github.com/actions/concepts/runners/private-networking) are not feasible, specialized hardware needs, or strict internal compliance requirements.

#### Runner groups for workload segmentation

[Runner groups](https://docs.github.com/enterprise-cloud@latest/actions/hosting-your-own-runners/managing-self-hosted-runners/managing-access-to-self-hosted-runners-using-groups) provide granular control over which repositories and workflows can use specific runners. This enables:

- **Workload isolation**: Separate runners for production deployments vs. PR checks
- **Cost allocation**: Track usage by team or project
- **Security boundaries**: Restrict sensitive runners to specific repositories
- **Resource optimization**: Dedicate high-memory runners to builds that need them

Define runner groups at the organization or enterprise level, then reference them in workflows:

```yaml
jobs:
  build:
    runs-on:
      group: production-runners
      labels:
      - self-hosted
      - linux
      - x64
```

#### Operational considerations

Self-hosted runners require ongoing maintenance for operating system updates, runner software updates, security patching, and capacity planning. For many teams, GitHub-hosted runners are the right default, with self-hosted runners reserved for specific requirements that can't be met otherwise.

For Kubernetes-based scaling of self-hosted runners, see [Deploying Actions Runner Controller](../../architecture/recommendations/deploying-actions-runner-controller), which covers architecture decisions, scaling strategies, and operational considerations.

### Environment protection rules

As CI workflows mature, they often expand to include deployment steps. [Environment protection rules](https://docs.github.com/enterprise-cloud@latest/actions/deployment/targeting-different-environments/using-environments-for-deployment) provide guardrails for deployments without slowing down CI.

Environments let you:

- **Require reviewers** before deploying to production
- **Restrict branches** that can deploy (only `main`, or only tags matching `v*`)
- **Add wait timers** for staged rollouts
- **Scope secrets** to specific environments (production credentials only available in production environment)
- **Define custom protection rules** using deployment protection rules

```yaml
jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.example.com
    steps:
      - uses: actions/checkout@v7
      # Deployment steps...
```

Environment protection rules create a natural boundary between CI (which should be fast and automatic) and CD (which may require approval or additional controls). This separation lets you optimize CI for speed while maintaining appropriate governance for deployments.

{{< callout type="info" >}}
**Environments without deployments**: Jobs can reference an environment purely to scope secrets and variables, without recording a deployment or requiring an environment URL. Set `deployment: false` when you want environment-scoped configuration for a job (like a CI job that needs staging credentials) without it showing up in your deployment history.
{{< /callout >}}

## Measuring CI effectiveness

Tracking metrics helps you identify problems before they become painful and demonstrate the value of CI investments. For a comprehensive framework on engineering metrics, see [Engineering System Metrics](engineering-system-metrics), which covers the broader context of measuring developer productivity and system health.

| Metric | What it tells you | Warning signs |
| --- | --- | --- |
| P50/P95 workflow duration | How long developers typically wait | Steady increase over time |
| Flake rate | How often failures are noise vs. signal | Sustained increase or frequent reruns |
| Queue time | Whether you have enough runner capacity | Sustained growth or breach of the team's queue-time SLO |
| First-attempt success rate | How often code passes on first push | Sustained decline from the team's baseline |
| Time to first feedback | How quickly developers learn about problems | Breach of the team's feedback-time SLO |

These metrics connect to the broader [Design for Engineering System Success](../design-principles#design-for-engineering-system-success) principle, which emphasizes balancing quality, velocity, developer happiness, and business outcomes.

## Related articles in the Well-Architected Framework

This article connects to several other topics in the framework:

### Productivity pillar

- [Engineering System Metrics](engineering-system-metrics) - Measuring the health of your engineering systems, including CI
- [Design for Automation](../design-principles#design-for-automation) - Foundational principles for automating development workflows
- [Design for Feedback](../design-principles#design-for-feedback) - Creating effective feedback loops for continuous improvement

### Application Security pillar

- [Securing GitHub Actions Workflows](../../application-security/recommendations/actions-security) - In-depth security guidance for CI/CD pipelines
- [Prioritizing Security Alert Remediation](../../application-security/recommendations/prioritizing-alerts) - Managing security alerts from CI scanning tools
- [Enforce GitHub Advanced Security at Scale](../../application-security/recommendations/enforce-ghas-at-scale) - Integrating security scanning into CI workflows

### Architecture pillar

- [Deploying Actions Runner Controller](../../architecture/recommendations/deploying-actions-runner-controller) - Kubernetes-based self-hosted runner infrastructure

### Collaboration pillar

- [Applying DevOps Methodology](../../collaboration/recommendations/applying-devops-methodology) - Broader context for CI within DevOps practices
- [Scaling Actions Reusability](../../collaboration/recommendations/scaling-actions-reusability) - Enterprise patterns for reusable workflows and actions

## Seeking further assistance

{{% seeking-further-assistance-details %}}

## Related links

{{% related-links-github-docs %}}

### External resources

- [GitHub Actions documentation](https://docs.github.com/enterprise-cloud@latest/actions)
- [Workflow syntax reference](https://docs.github.com/enterprise-cloud@latest/actions/using-workflows/workflow-syntax-for-github-actions)
- [Events that trigger workflows](https://docs.github.com/enterprise-cloud@latest/actions/using-workflows/events-that-trigger-workflows)
- [Using a matrix for your jobs](https://docs.github.com/enterprise-cloud@latest/actions/using-jobs/using-a-matrix-for-your-jobs)
- [Running jobs in a container](https://docs.github.com/enterprise-cloud@latest/actions/using-jobs/running-jobs-in-a-container)
- [Using containerized services](https://docs.github.com/enterprise-cloud@latest/actions/using-containerized-services)
- [Using custom images for GitHub-hosted runners](https://docs.github.com/enterprise-cloud@latest/actions/how-tos/manage-runners/larger-runners/use-custom-images)
- [Caching dependencies to speed up workflows](https://docs.github.com/enterprise-cloud@latest/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [Reusing workflows](https://docs.github.com/enterprise-cloud@latest/actions/using-workflows/reusing-workflows)
- [Creating workflow templates for your organization](https://docs.github.com/enterprise-cloud@latest/actions/using-workflows/creating-workflow-templates-for-your-organization)
- [Creating a composite action](https://docs.github.com/enterprise-cloud@latest/actions/creating-actions/creating-a-composite-action)
- [Security hardening for GitHub Actions](https://docs.github.com/enterprise-cloud@latest/actions/security-guides/security-hardening-for-github-actions)
