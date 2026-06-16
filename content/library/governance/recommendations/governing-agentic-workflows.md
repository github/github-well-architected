---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT

draft: false # Set to false when ready to publish

title: 'Governing agentic workflows with gh-aw and APM'
publishDate: 2026-06-01
params:
  authors:
    [
      { name: 'Alex De Michieli', handle: 'alexdemichieli' },
    ]

pillars:
  - governance

areas:
  - agent-and-extensions
  - security

verticals:
  - finance
  - government
  - information-technology
  - professional-service

personas:
  - administrator
  - developer

platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu

features:
  - copilot
  - github-actions

components:
  - coding-agents
  - review-agents
  - copilot-skill
  - governance-and-policy
  - push-rulesets

github:
  - enterprise-support
  - customer-success-architect
  - expert-services
---

<!-- markdownlint-disable MD025 -->
<!-- markdownlint-disable MD013 -->

## Scenario overview

Regulated enterprises want AI agents to perform useful work inside their repositories (code review, security scanning, documentation generation) but cannot adopt them without governance guarantees that match what they already require for code dependencies: pinned versions, supply chain scanning, allowlists, sandboxed execution, and auditable runs.

[GitHub Agentic Workflows (gh-aw)](https://github.github.com/gh-aw/) is a framework that lets teams define AI agent automation as markdown files and compile them into deterministic GitHub Actions workflows. The agent runs inside a sandboxed container, interacts with the repository through tools, and produces outputs that are validated before any write action occurs.

The existing [Governing agents in GitHub Enterprise]({{< relref "governing-agents.md" >}}) article covers enterprise Copilot policies, model restrictions, audit logging, and MCP governance. This article covers a complementary layer: how **gh-aw** provides a sandboxed runtime that separates the LLM from write permissions, and how the **[Agent Package Manager (APM)](https://microsoft.github.io/apm/)** adds dependency governance for agent skills and prompts.

Together, these tools address three adoption blockers in regulated environments:

1. **The prompt/skill supply chain is uncontrolled.** Skills are markdown in arbitrary repos. No versioning, no SHA pinning, no allow/deny lists, no scanning for prompt-injection payloads hiding in Unicode.
2. **The agent is an untrusted execution environment.** The LLM consumes attacker-controlled inputs: PR diffs, issue bodies, fetched URLs, and commit messages. Any of these can contain prompt injection payloads that the model may interpret as instructions. If the agent holds write tokens, a successful injection means pushed code or exfiltrated secrets.
3. **No audit or reproducibility story.** Compliance asks "show me exactly what ran, with what permissions, against what input, on what date." Ad-hoc scripts calling the Copilot API typically cannot provide immutable run logs, input and version snapshots, permission context, or execution identity and timestamps in a reviewable format.

The core design principle behind gh-aw is capability separation: **the component that can be tricked (the LLM) holds no write permissions, and the component that can write is deterministic and only acts on validated output.** Skills are pinned to exact SHAs and restricted by org-level policy, and the entire run is a standard Actions workflow with full audit log coverage.

To understand how that separation is enforced at runtime, let's look at the pipeline that gh-aw compiles.

## gh-aw runtime architecture

gh-aw compiles a markdown prompt file into a deterministic GitHub Actions workflow (`.lock.yml`) with a 5-job pipeline that enforces capability separation:

```mermaid
flowchart TD
    A[activation] --> B[agent]
    B --> C[detection]
    C --> D[safe_outputs]
    D --> E[conclusion]

    style A fill:#e8f4fd,stroke:#0969da
    style B fill:#fff3cd,stroke:#9a6700
    style C fill:#fde8e8,stroke:#cf222e
    style D fill:#e6ffec,stroke:#1a7f37
    style E fill:#f6f8fa,stroke:#656d76
```

| Job | Purpose | Permissions |
|-----|---------|-------------|
| **activation** | Validates lockfile integrity (hash check), confirms user membership (write access required), validates auth credentials | Read-only |
| **agent** | Runs the LLM inside an Agentic Workflows Firewall (AWF) sandbox (Docker container) with network firewall. Reads repo, calls Copilot API for inference, executes tools. All outbound traffic filtered to an allowlist. | Read-only, no write tokens |
| **detection** | Inspects agent output for policy violations. Security gate between the agent and write actions. | Read-only |
| **safe_outputs** | Receives validated agent output. Posts comments, creates PRs, updates issues. Permissions scoped per output type. | Scoped write |
| **conclusion** | Final status reporting and cleanup. | Read-only |

The activation job is the first thing that runs, and before it lets the agent do anything, it needs to verify who is calling and how they authenticated.

### Authentication modes

gh-aw supports two auth paths:

1. **PAT path:** A fine-grained personal access token with Copilot permissions, stored as a `COPILOT_GITHUB_TOKEN` secret. Straightforward to set up, works across environments.
2. **`copilot-requests` path:** Uses the Actions-provided `GITHUB_TOKEN` (`github.token`) with a `copilot-requests: write` workflow permission. Ephemeral, no stored secret, scoped to the workflow run.

The `copilot-requests` path is preferred for production because it eliminates long-lived secrets and ties billing to the org rather than an individual.

Once authenticated, the agent job starts inside a sandboxed container. The next layer of protection is the network firewall that controls what the agent can reach.

### AWF sandbox network firewall

The agent job runs inside a Docker container with a strict outbound allowlist:

- Copilot API (inference endpoint)
- github.com (repo content)
- Package registries (npm, PyPI, Ubuntu mirrors)
- SSL/OCSP endpoints

This allowlist is compiled into the lockfile by gh-aw. Custom allowlist entries are not yet supported (see [Known gaps](#known-gaps-and-roadmap)).

The runtime architecture handles isolation and sandboxing, but it does not answer a different question: how do you control which skills the agent is allowed to use in the first place? That is where APM comes in.

## APM governance layer

APM treats agent skills as packages with the same governance primitives that enterprises require for code dependencies:

### Dependency pinning and content scanning

```yaml
# apm.lock.yaml
packages:
  - name: org/security-review-skill
    version: 1.2.0
    commit: a8f3b2c...
    integrity: sha256-...
```

Every skill is pinned to an exact commit SHA, and `apm install` generates a lockfile that makes builds reproducible. There is no drift between what was reviewed and what actually runs. At install time, APM also scans skill content for hidden Unicode threats like homoglyphs, bidirectional override characters, and zero-width joiners that could inject invisible instructions into agent prompts.

Pinning and scanning protect individual repos, but most regulated enterprises also need a way to control which skills are available across the entire org.

### Org-level policy (`apm-policy.yml`)

Placed in the org's `.github` repository, this policy file controls which packages any repo in the org can consume:

```yaml
# .github/apm-policy.yml
name: "Org agent governance"
version: "1.0.0"
enforcement: block
dependencies:
  allow:
    - "org/approved-security-skills/*"
    - "org/approved-review-skills/*"
  deny:
    - "*"  # deny everything not explicitly allowed
  require_pinned_constraint: true
```

Policy inheritance works at three levels: enterprise, org, repo. Inheritance is tighten-only: child policies can narrow allowlists, add deny entries, and escalate enforcement, but they cannot relax constraints set by a parent.

Some enterprises go further and require that all package downloads route through a corporate scanning proxy rather than pulling directly from GitHub.

### Artifactory proxy for air-gapped environments

For enterprises that require all dependencies to route through a corporate scanning pipeline:

```bash
export PROXY_REGISTRY_URL=https://artifactory.example.com/artifactory/github
export PROXY_REGISTRY_TOKEN=<token>
export PROXY_REGISTRY_ONLY=1  # blocks direct GitHub access
```

With `PROXY_REGISTRY_ONLY=1`, APM refuses to download packages directly from GitHub. Everything routes through the proxy. The lockfile records the proxy host for reproducibility.

So far, APM controls which skills a repo can use and how they are fetched. But there is one more attack surface: even an approved skill can be undermined if repo-level configuration can override its instructions at runtime.

## The isolation pattern

When APM imports a skill in **isolated mode**, the agent sees only the skill's packaged instructions. Without isolation, the agent's system prompt is assembled from the skill's instructions plus any repo-level config files (`.github/copilot-instructions.md`, `AGENTS.md`, custom instructions). That means a compromised or misconfigured repo-level config could override security review criteria, inject additional tool calls, or modify the skill's persona definitions without the skill publisher's knowledge.

Isolated mode closes that door. The skill publisher controls what the agent is told to do, and the org policy controls which skills are allowed.

In a gh-aw workflow file:

```yaml
imports:
  - uses: shared/apm.md
    with:
      packages:
        - org/security-review-skill@1.2.0
      isolated: true
```

The combination of isolation + lockfile + org policy gives platform teams a complete answer to "how do we know what instructions the agent followed?"

That said, gh-aw and APM are still maturing. There are a few areas where the governance story has gaps that platform teams should be aware of.

## Known gaps and roadmap

Three capabilities are not yet fully available:

1. **Sandbox allowlist customization.** The AWF container's network firewall allowlist is compiled by gh-aw and cannot be extended by the consumer. Enterprises that need agents to reach internal APIs (e.g., internal documentation servers, proprietary scanning tools) currently have no path. This has been surfaced to the gh-aw team.

2. **Centralized runner group enforcement.** Organizations cannot yet mandate that all agentic workflows run on a specific runner group (e.g., hardened, isolated runners in a specific region). Individual workflows can specify `runs-on`, but there is no org-level override. This has been surfaced to the gh-aw team.

3. **Self-hosted runner support (ARC with Docker-in-Docker).** Support for Actions Runner Controller with Docker-in-Docker sidecar configurations is actively stabilizing. The AWF sandbox relies on bind mounts and container networking that behave differently when the Docker daemon runs in a separate filesystem from the runner. Platform teams using ARC/DinD should validate their runner architecture against current gh-aw pre-releases before production rollout.

All three are expected to be addressable as gh-aw matures.

With those caveats in mind, here is a practical checklist for teams ready to adopt this pattern today.

## Checklist for platform teams

### Prerequisites

- [ ] GitHub Enterprise Cloud (EMU recommended for regulated environments)
- [ ] GitHub Actions enabled with appropriate runner infrastructure
- [ ] [APM CLI installed](https://microsoft.github.io/apm/quickstart/) on developer machines and CI
- [ ] [gh-aw extension installed](https://github.com/github/gh-aw) (`gh extension install github/gh-aw`)

### Governance setup

- [ ] `apm-policy.yml` published in the org's `.github` repository with allowlist of approved skill packages
- [ ] Skill packages hosted in internal or org-owned repositories with branch protection
- [ ] Lockfiles (`apm.lock.yaml`) committed to consuming repos and protected by rulesets
- [ ] Artifactory proxy configured if corporate scanning pipeline is required (`PROXY_REGISTRY_ONLY=1`)
- [ ] Content scanning enabled for all skill package installations

### Runtime security

- [ ] gh-aw workflows compiled and lockfiles validated (hash integrity check in activation job)
- [ ] Skills imported in isolated mode to prevent repo-level config contamination
- [ ] Auth mode selected: `copilot-requests` (preferred) or PAT with rotation policy
- [ ] PAT secrets (if used) scoped to minimum required permissions
- [ ] Runner groups designated for agentic workloads (manual `runs-on` until org-level enforcement ships)

### Observability

- [ ] Audit log streaming enabled, capturing agentic workflow events
- [ ] Workflow run retention configured for compliance requirements
- [ ] Detection job output monitored for policy violation patterns
- [ ] Alerting configured for failed activation jobs (lockfile tampering indicator)

## References

- [APM documentation](https://microsoft.github.io/apm/)
- [APM Governance Guide](https://microsoft.github.io/apm/enterprise/governance-guide/) (detailed policy spec, enforcement points, bypass contract)
- [APM + gh-aw integration guide](https://microsoft.github.io/apm/integrations/gh-aw/) (the `shared/apm.md` import pattern)
- [APM review panel reference implementation](https://github.com/microsoft/apm/tree/main/.github/skills/apm-review-panel) (credit: Daniel Meppiel)
- [gh-aw documentation](https://github.github.com/gh-aw/)

## Seeking further assistance

{{% seeking-further-assistance-details %}}

## Related links

{{% related-links-github-docs %}}

### Related articles in this framework

- [Governing agents in GitHub Enterprise]({{< relref "governing-agents.md" >}}) — enterprise Copilot policies, model restrictions, audit logging, and MCP governance
- [GitHub Enterprise Policies & Best Practices]({{< relref "governance-policies-best-practices" >}}) — rulesets, CODEOWNERS, commit signing, audit log streaming
- [Application Security Checklist]({{< relref "/library/application-security/checklist" >}}) — foundational code security practices that agent governance builds on

### External resources

- [APM documentation](https://microsoft.github.io/apm/)
- [APM Governance Guide](https://microsoft.github.io/apm/enterprise/governance-guide/)
- [gh-aw documentation](https://github.github.com/gh-aw/)
