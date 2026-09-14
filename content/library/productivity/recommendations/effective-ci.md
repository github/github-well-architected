---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false
title: 'Recommendations for effective continuous integration (CI)'
publishDate: 2026-07-29
weight: 4
params:
  authors: [
    { name: 'Collin McNeese', handle: 'collinmcneese' },
    { name: 'Tiago Pascoal', handle: 'tspascoal' }
    ]

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

Well-designed Continuous Integration (CI) helps developers understand whether a change is safe to merge. It catches problems and provides signal early in the development process and provides enough information to act on the failure.

Whether you are setting up CI for the first time or trying to improve existing pipelines, this guide walks through the patterns that tend to make the biggest difference.

{{< callout type="info" >}}
Assumptions and preconditions:

- Your organization is using or considering GitHub Actions
- You have a basic understanding of YAML and command-line tools
- Your repositories have existing codebases that need CI integration
- You have appropriate permissions to create and modify workflow files
{{< /callout >}}

## Key design strategies and checklist

Use this as a starting point when reviewing an existing workflow or planning a new one.

- [ ] Foundation
  - [ ] Tests are isolated, deterministic, and fast
  - [ ] Flaky tests are tracked and prioritized for fixing
  - [ ] Test execution is organized into clear groups with intentional dependencies
  - [ ] Error messages are clear and actionable
- [ ] Practices
  - [ ] Fast checks gate expensive jobs, and independent jobs run in parallel
  - [ ] Dependencies are cached appropriately
  - [ ] Job summaries and annotations provide rich feedback
  - [ ] Workflows use path filters and concurrency controls
  - [ ] Permissions follow principle of least privilege
  - [ ] Third-party actions are pinned to commit SHAs
  - [ ] Dependabot keeps actions updated
  - [ ] OIDC is used for cloud authentication where possible
- [ ] Advanced
  - [ ] Matrix builds test across required platforms and versions
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

Before CI became common practice, developers often worked in isolation for periods of time. Eventually, everyone's changes had to come together in what could be a painful integration exercise.

CI addresses this by integrating frequently. Each integration runs automated checks and provides feedback quickly. When something breaks, you have a much better chance of knowing which small change caused it.

Understanding CI as fundamentally about **reducing integration risk through rapid feedback** helps you make better decisions about what checks to run and when to run them.

This aligns directly with the [Design for Feedback](../design-principles#design-for-feedback) principle. Feedback helps more often when it arrives quickly enough to be acted upon. CI is one of the most important feedback mechanisms in software development, and its value depends on both speed and clarity.

### Fail fast

The fail-fast approach puts the checks most likely to fail, and fastest to run, at the front of the pipeline.

Linting and type checking can typically run very fast, so only after those checks pass should the workflow spend time compiling code and running a larger test suite.

| Approach | Pipeline order | Time to failure |
| ---------- | ---------------- | ----------------- |
| ❌ **Anti-pattern** | Install dependencies (2m) → Build (5m) → Test (10m) → Lint (30s) | 17 minutes to learn about a typo |
| ✅ **Fail-fast** | Lint (30s) → Install dependencies (2m) → Build (5m) → Test (10m) | 30 seconds to learn about a typo |

Fast feedback also helps developers stay in the flow. When feedback arrives quickly, they can fix the issue while the relevant code is still fresh in their mind.

{{< callout type="info" >}}
**Run validation locally first**: Encourage developers to run lint and type checks locally before pushing, where possible. This catches errors even faster than CI and reduces wait time for feedback.
{{< /callout >}}

### Designing tests that support fast feedback

CI is only as useful as the tests it runs. An advanced pipeline running a poorly designed test suite can still frustrate developers, just with more infrastructure around the problem.

- **Isolated tests** do not depend on execution order or shared state. If tests share a database and one test forgets to clean up, the next test can fail even though the code is correct. Isolated tests can also run in parallel, which can reduce total test time.
- **Deterministic tests** produce the same result for the same code. Flaky tests are arguably worse than no tests because they train developers to ignore failures and retry until the build is green. When you see a flaky test, treat it as a high-priority bug.
- **Clear test names** serve as documentation. When `test_user_creation` fails, someone still has to read the test to understand what went wrong. When `test_creating_user_without_email_returns_400_error` fails, the starting point is much clearer.

Common sources of test flakiness include:

| Source | What happens | Solution |
| --- | --- | --- |
| Time-dependent assertions | "5 seconds from now" varies between runs | Use frozen clocks or time mocking libraries |
| Race conditions | Async operations complete unpredictably | Use proper synchronization primitives and avoid arbitrary sleeps |
| External service calls | Network issues, rate limits, or outages affect the result | Mock external services when the network call is not what the test verifies |
| Shared mutable state | A previous test pollutes the next test's data | Reset state in setup and teardown, or use database transactions |
| File system assumptions | Paths differ across operating systems | Use temporary directories and normalize paths |

### Feedback that helps developers learn

A CI status that only shows ✅ or ❌ forces developers to dig through logs looking for clues. Effective CI feedback should tell developers what failed, why it failed, and ideally where they should start fixing it.

Consider the difference between these two experiences:

- **Scenario A**: CI shows ❌. The developer clicks through pages of logs, searches for "error," finds a cryptic stack trace, and spends more time understanding the failure than fixing it.
- **Scenario B**: CI shows ❌ with a summary: "Test `UserService.createUser` failed. Expected status 201 but received 400 because the request body was missing the required field `email`. See line 45 of `user.test.js`."

The second result is much more useful. It reduces the amount of investigation required before someone can act.

This connects to broader organizational learning. Teams that treat CI as a source of learning, rather than just a gate to pass through, tend to improve faster. See [Design for Continuous Learning](../design-principles#design-for-continuous-learning) for more on building learning into your engineering culture.

## Part 2: Practices - GitHub Actions fundamentals

CI is fundamentally about using automation to replace manual, error-prone processes with consistent and repeatable workflows. As you implement these practices using GitHub Actions, keep the [Design for Automation](../design-principles#design-for-automation) principle in mind.

{{< callout type="info" >}}
**New to GitHub Actions?** Check out the [GitHub Actions learning paths](https://learn.github.com/courses?product=GitHub+Actions&contentType=Learning+path) on GitHub Learn for hands-on, structured learning.
{{< /callout >}}

### Structuring jobs for fast feedback

A GitHub Actions workflow consists of one or more **jobs**, and each job contains a sequence of **steps**. Steps run sequentially by default but can also run in parallel within a job and share its runner, jobs run in parallel on separate runners but users declare job dependencies to control the job execution graph.

Translating the fail-fast approach from Part 1 does not mean placing every job in a single sequence. Instead, use a fast, high-signal job to gate expensive work, then let independent jobs run in parallel after that gate passes, where needed.

The `needs` keyword makes a job wait for one or more other jobs to complete successfully. Use it only where the dependency avoids meaningful wasted work or where a job genuinely requires output from another job.

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

  # Stage 2: Independent jobs fan out after fast validation succeeds.
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

  test:
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
      - name: Test
        run: npm test
```

> [!NOTE]
> The above logic is for example purposes only to show dependency sequencing.  This specific logic would be likely be much better run in fewer jobs, reducing the overhead for this configuration.

In this example, `lint` is the only sequential gate. The `build` and `test` jobs wait for it, then run independently because they do not depend on any other job.

This structure trades some successful-run latency for avoiding wasted work when validation fails. If early failures are uncommon, running independent jobs immediately, or even reducing the number of jobs to include more steps, may provide faster results.

Use workflow duration, time to first feedback, and compute consumption to decide where the trade-off is worthwhile. When one job needs to fan out across operating systems, runtime versions, or test shards, combine this structure with [matrix builds](#matrix-builds).

### Caching dependencies

Each GitHub-hosted job starts on a fresh virtual machine. Self-hosted runners may retain state between jobs unless you clean them. Without caching on ephemeral runners, every job downloads every dependency again.

Caching stores downloaded packages between runs and reduces repeated download time. For complete caching syntax and options, see [Caching dependencies to speed up workflows](https://docs.github.com/enterprise-cloud@latest/actions/using-workflows/caching-dependencies-to-speed-up-workflows).

The setup actions for most languages include built-in caching:

```yaml
- uses: actions/setup-python@v7
  with:
    python-version: '3.13'
    cache: 'pip' # caching pip dependencies
```

This works well because the action hashes your dependency file or lockfile to generate the cache key. When that file changes, the key changes and the action creates a fresh cache. When the file is stable, later runs can restore the existing download cache.

For more control, such as caching build outputs or using cache keys that the setup actions do not know about, use the `actions/cache` action directly.

The main concepts are:

- **`key`**: Uniquely identifies the cache, typically using `hashFiles()` on lockfiles
- **`restore-keys`**: Provides fallback prefixes for partial cache matches when an exact key is not found
- **`path`**: Identifies the directories to cache

See the [actions/cache documentation](https://github.com/actions/cache) for the complete syntax and examples.

Caching is useful, but it is worth checking the actual timings. A cache that is difficult to invalidate, or takes longer to restore than downloading the dependencies, may not be helping much.

### Providing rich feedback

GitHub Actions can provide detailed information for investigating a workflow run or surfacing context for reviewing a change. While there are many ways to provide feedback, this section focuses on **workflow command output** and **pull request comments** as primary mechanisms.

#### Workflow command output

GitHub Actions provides several mechanisms beyond standard log output to make failures easier to understand.

- [**Job summaries**](https://docs.github.com/actions/reference/workflows-and-actions/workflow-commands#adding-a-job-summary) render Markdown in the Actions UI. They work well for test results, coverage reports, and build metrics. Write Markdown content to `$GITHUB_STEP_SUMMARY` and it appears on the workflow run page.
- [**Annotations**](https://docs.github.com/actions/reference/workflows-and-actions/workflow-commands#example-creating-an-annotation-for-an-error) highlight specific files and lines in the pull request diff. Use the `::error file={path},line={line}::` or `::warning` workflow commands, or upload SARIF files from linters for automatic annotations.
- [**Log grouping**](https://docs.github.com/actions/reference/workflows-and-actions/workflow-commands#grouping-log-lines) organizes verbose output into collapsible sections using `::group::` and `::endgroup::`. When installation logs span many lines, grouping keeps them out of the way while keeping them available for debugging.

#### Pull request comments

Create [pull request comments](https://docs.github.com/enterprise-cloud@latest/rest/issues/comments#create-an-issue-comment) via the REST API from an Actions run to provide results that reviewers should see in the context of the pull request. These types of comments may be for steps they might need to take based on the job outcome, information from the job which would be relevant to their review, or other context that is useful outside the workflow run itself.

For example, a workflow can use the GitHub CLI to post rich test results:

```yaml
jobs:
  comment:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - name: Test suite
        id: test-suite
        run: |
          echo "Running test suite..."
          # Replace the following line with your actual test command, using output to set the result
          echo "result=CI results: 128 tests passed. Coverage increased to 85% (+2%)." >> $GITHUB_OUTPUT
      - name: Post test result
        run: |
          gh api "repos/${GH_REPO}/issues/${PR_NUMBER}/comments" \
            --method POST \
            -f body="$BODY"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GH_REPO: ${{ github.repository }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          BODY: ${{ steps.test-suite.outputs.result }}
```

> [!TIP]
> Use automated comments selectively to avoid overwhelming the pull request conversation.

### Optimizing trigger conditions

Not every change needs every check. Running the full test suite because someone fixed a typo in the README wastes compute and delays feedback for changes that actually matter.

For complete trigger syntax, see [Events that trigger workflows](https://docs.github.com/enterprise-cloud@latest/actions/reference/workflows-and-actions/events-that-trigger-workflows).

- **Path filters** let you skip workflows when only certain files change. Use `paths` to include specific paths, or `paths-ignore` to exclude paths such as `**.md` or `docs/**`.

  It is important to note that if a filtered workflow is configured as a required status check, a skipped run leaves the check pending and can block merging. Keep workflows with required checks unfiltered, or use an always-running required check.

- **Concurrency controls** cancel outdated workflow runs when new commits arrive. Set a `concurrency` group based on the workflow and branch, with `cancel-in-progress: true`.

  If a developer pushes multiple commits in quick succession, only the latest one needs to run in some cases. The previous runs are already testing code that is no longer current.

### Security fundamentals

CI pipelines often have elevated permissions which may access secrets, publish packages, or deploy to production, making them attractive targets and increasing the potential impact of security mistakes.

[Securing GitHub Actions Workflows](../../application-security/recommendations/actions-security) is a dedicated resource for this area, covering topics like least-privilege `GITHUB_TOKEN` permissions, pinning and updating third-party actions, OIDC authentication, and guarding against other supply chain risks.

## Part 3: Advanced - Scaling and optimization

Once the fundamentals are working well, these patterns can help with larger codebases, multiple platforms, and more complex build requirements.

### Matrix builds

Many projects need to test across several variable data points, such as runtime versions or operating systems. Running those configurations sequentially multiplies the build time by the number of configurations. Matrix builds run the combinations in parallel, so the total duration is closer to the slowest individual job.

For complete matrix syntax, see [Using a matrix for your jobs](https://docs.github.com/enterprise-cloud@latest/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations).

Matrix builds control how one job fans out across configurations, while `needs` controls when that job can start. A matrix job can depend on the same fast validation gate described in [Structuring jobs for fast feedback](#structuring-jobs-for-fast-feedback), and each generated job will wait for that gate.

For large test suites, **sharding** distributes tests across multiple parallel runners. Many test frameworks support sharding natively or through plugins. Check the documentation for your framework for the exact configuration.

{{< callout type="info" >}}
**Parallel steps within a job**: Actions supports running steps concurrently inside a single job using `background`, `wait`, `wait-all`, `cancel`, and `parallel` keywords. This does not replace job-level parallelism or `needs`-based orchestration, but it can be useful when steps share a runner and do not depend on each other.
{{< /callout >}}

### Customizing the runtime environment

Sometimes a workflow needs a specific database version, system library, compiler, or production-like environment.

Other times, the environment is fine, but the workflow repeats the same lengthy setup on every run. Installing system libraries, compilers, or browser dependencies over and over adds time and creates more opportunities for inconsistent results.

In those cases, it may be worth customizing the runtime environment itself.

- **Container jobs** give you control over the execution environment and are a portable option. Specify `container: name:tag` on a job to run all steps inside that container image. For frequently used setups, build a Docker image with dependencies pre-installed and publish it to GitHub Container Registry. Service containers can start dependencies under `services:`.

  Use the service name as the hostname from a container job. From a job running directly on the runner, publish the required ports and connect through `localhost`.

  See [Running jobs in a container](https://docs.github.com/enterprise-cloud@latest/actions/how-tos/write-workflows/choose-where-workflows-run/run-jobs-in-a-container) and [Using containerized services](https://docs.github.com/enterprise-cloud@latest/actions/tutorials/use-containerized-services).

- **Custom images for GitHub-hosted runners** bake dependencies directly into the runner. Use this when you want the speed of a pre-built environment without starting a container on top of the runner.

  See [Using custom images for GitHub-hosted runners](https://docs.github.com/enterprise-cloud@latest/actions/how-tos/manage-runners/larger-runners/use-custom-images).

Each option trades setup complexity for faster and more consistent CI runs. The right choice depends on whether you are using GitHub-hosted or self-hosted runners, how portable the environment needs to be, and how often the setup is repeated.

### Reusable workflows and workflow templates

As organizations grow, the same CI patterns can be repeated in dozens of repositories. Copying workflow files works at first, but updates can eventually become operational overhead.

[Workflow templates](https://docs.github.com/actions/how-tos/write-workflows/use-workflow-templates) provide starting points for repositories. Create each workflow file and its matching `.properties.json` metadata file in your organization's `.github` repository under `.github/workflow-templates/`.

Eligible repositories then show the template in the Actions tab when developers create workflows, creating an easy method to have the templates copied into each repository, so teams can customize them for their specific needs.

Templates work well for:

- Establishing consistent starting points across repositories
- Providing approved patterns that teams can adapt
- Reducing time to first workflow for new projects

[Reusable workflows](https://docs.github.com/enterprise-cloud@latest/actions/using-workflows/reusing-workflows) let you define a workflow once and call it from other workflows.

Unlike templates, reusable workflows are referenced rather than copied. Callers that use a branch receive future changes automatically. Callers pinned to a tag or commit id remain on that version until the reference is updated.

This aligns with [Design for Integration](../design-principles#design-for-integration) by establishing standards across repositories without requiring every team to maintain its own version of the same workflow.

Key concepts for reusable workflows include:

- **Define** a reusable workflow with the `workflow_call` trigger in a central repository
- **Declare inputs and secrets** that the caller can pass to customize behavior
- **Call** the workflow using `uses: org/repo/.github/workflows/workflow.yml@ref`
- **Version with tags** such as `@v1` and `@v2` to control when repositories adopt breaking changes

For more on scaling reusable patterns across your organization, see [Scaling Actions Reusability](../../collaboration/recommendations/scaling-actions-reusability).

### Composite actions

Where reusable workflows encapsulate entire jobs, composite actions encapsulate sequences of steps.

They are useful for repeated setup logic that several jobs need, such as setting up a language runtime, installing dependencies, and configuring caching.

- Create an `action.yml` file with `runs.using: 'composite'`
- Define `inputs` for customizable parameters
- List steps just like in a workflow. Each `run` step must specify `shell`
- Reference the action from workflows using `uses: ./.github/actions/your-action` for a local action, or `uses: org/repo/path@ref` for a remote action

Composite actions are a good fit when you need to standardize setup across multiple jobs in one workflow or across several repositories.

> [!NOTE]
> [YAML anchors and aliases](https://docs.github.com/actions/reference/workflows-and-actions/reusing-workflow-configurations#yaml-anchors-and-aliases) also provide a mechanism for reusing configuration within a workflow file. Unlike composite actions, they do not support reuse across multiple workflow files or repositories.

For complete syntax, see [Creating a composite action](https://docs.github.com/enterprise-cloud@latest/actions/tutorials/create-actions/create-a-composite-action).

### Monorepo strategies

Monorepos contain multiple packages or applications in a single repository. They can create a scaling problem for CI because running every test for every change is usually unnecessary.

For broader guidance on monorepo design and governance, see [Monorepos](../../scenarios/monorepos). This section focuses specifically on CI strategies.

There are two primary approaches to selective testing in monorepos.

- **Workflow-level path filters** use the native `paths` trigger to run a workflow only when matching files change. This is simple and does not require additional tooling, but each filter controls the entire workflow rather than individual jobs.

  ```yaml
  name: Frontend CI
  on:
    push:
      paths:
        - 'packages/frontend/**'
        - 'packages/shared/**'  # Include shared dependencies
  ```

- **Job-level change detection** uses git commands or scripts to determine which packages changed, then conditionally runs jobs. This provides more flexibility for complex dependency graphs but requires additional setup.

  You can use `git diff` to compare against the base branch and set job outputs based on which paths have changed.

#### Key design considerations

- **Include shared dependencies**: If `packages/shared` changes, all packages that depend on it should be tested
- **Understand your dependency graph**: A change to a utility package may affect many downstream packages
- **Balance granularity with complexity**: More fine-grained filtering saves compute but increases workflow maintenance

Path filtering can be very useful, but it is worth being careful about what the filter means. Skipping unrelated work is good. Skipping a package that depends on a changed shared library is less good.

### Self-hosted runners and runner groups

GitHub-hosted runners work well for most workloads, but some situations call for self-hosted runners, such as for internal network access where [private networking options](https://docs.github.com/actions/concepts/runners/private-networking) are not feasible, specialized hardware needs, or strict internal compliance requirements.

#### Runner groups for workload segmentation

[Runner groups](https://docs.github.com/enterprise-cloud@latest/actions/hosting-your-own-runners/managing-self-hosted-runners/managing-access-to-self-hosted-runners-using-groups) provide granular control over which repositories and workflows can use specific runners.

This enables:

- **Workload isolation**: Separate runners for production deployments and pull request checks
- **Security boundaries**: Restrict sensitive runners to specific repositories
- **Resource optimization**: Restrict runners with different resource capabilities, such as CPU, disk, or memory, to builds and repositories that need them

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

As CI workflows mature, they often expand to include deployment steps. [Environment protection rules](https://docs.github.com/enterprise-cloud@latest/actions/deployment/targeting-different-environments/using-environments-for-deployment) can help to provide guardrails for deployments.

Environments let you:

- **Require reviewers** before deploying to production
- **Restrict branches** that can deploy, such as only `main` or tags matching `v*`
- **Add wait timers** for staged rollouts
- **Scope secrets** to specific environments
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

Environment protection rules create a useful boundary between CI and CD. CI should generally be fast and automatic. Deployments may require approval or additional controls.

Keeping those concerns separate lets you optimize CI for speed while maintaining appropriate governance for deployment changes.

{{< callout type="info" >}}
**Environments without deployments**: Jobs can reference an environment purely to scope secrets and variables, without recording a deployment or requiring an environment URL. Set `deployment: false` when you want environment-scoped configuration for a job, such as a CI job that needs staging credentials, without showing it in your deployment history.
{{< /callout >}}

## Measuring CI effectiveness

Tracking metrics helps identify problems before they become painful. It also gives teams a way to understand whether changes to the CI system are actually helping.

For a broader framework on engineering metrics, see [Engineering System Metrics](engineering-system-metrics).

| Metric | What it tells you | Warning signs |
| --- | --- | --- |
| P50/P95 workflow duration | How long developers typically wait | Steady increase over time |
| Flake rate | How often failures are noise instead of signal | Sustained increase or frequent reruns |
| Queue time | Whether there is enough runner capacity | Sustained growth or a breach of the team's queue-time SLO |
| First-attempt success rate | How often code passes on the first push | Sustained decline from the team's baseline |
| Time to first feedback | How quickly developers learn about problems | Breach of the team's feedback-time SLO |

The numbers should help you decide what to improve next, but be careful to observe them in isolation. A longer workflow is not automatically a bad workflow if it is testing something important, while a short workflow is not especially useful if developers do not trust the result.

These metrics connect to the broader [Design for Engineering System Success](../design-principles#design-for-engineering-system-success) principle, which emphasizes balancing quality, velocity, developer happiness, and business outcomes.

## Related articles in the Well-Architected Framework

This article connects to several other topics in the framework.

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
