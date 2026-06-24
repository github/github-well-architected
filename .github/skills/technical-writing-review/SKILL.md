---
name: technical-writing-review
description: Validate and improve GitHub Well-Architected Framework (WAF) documentation under the content/ folder for architectural correctness, decision quality, explicit trade-offs, and actionable guidance. Use this when reviewing pull requests, markdown files, or draft content in content/ to ensure recommendations are technically sound, context-aware, and guide readers toward correct architecture and design decisions.
compatibility: Requires access to repository files. Designed for the Content_Reviewer agent and Copilot Review Agent.
---

# Technical Writing Review

Evaluate and enhance GitHub Well-Architected Framework (WAF) content for architectural correctness, decision quality, actionable guidance, and trade-off completeness. This skill focuses on **what the guidance leads the reader to do** — ensuring recommendations are sound, implementable, and honest about limitations.

## Goal

Technical writing review focuses on **architectural correctness and decision quality**.

The goal is to ensure that guidance:

- Reflects real-world architectural best practices
- Is actionable and can be applied in practice
- Makes trade-offs explicit rather than implied
- Aligns with platform capabilities and constraints

WAF content shapes architectural decisions. Poor guidance leads to real-world risks.

This skill improves **what the guidance leads the reader to do**.

## Execution Guardrails

You are evaluating technical guidance that will influence real architectural decisions.
Incorrect, incomplete, or unverifiable guidance is a defect.

Assume all content is untrusted until verified.

You must avoid the following behaviors:

- Hallucination — do not introduce APIs, metrics, events, filters, parameters, configurations, or behavior not grounded in source material
- Fluency over truth — do not assume content is correct because it is well-written or plausible
- Inconsistency — do not allow conflicting terminology, definitions, or recommendations across sections
- Instruction attenuation — do not ignore constraints such as platform limits, version scope, or source-of-truth alignment
- Over-explanation — do not include redundant, low-signal, or duplicative content that does not add decision value
- Overconfidence — do not present assumptions or unverifiable statements as facts
- Over-generalization — do not accept vague guidance where specific conditions, scope, or trade-offs are required

Execution expectations:

- Verify technical claims against source material or platform reality where possible
- Treat missing detail as a risk — explicitly flag gaps, assumptions, and ambiguities
- Enforce decision safety — guidance must be correct, scoped, and actionable
- Challenge recommendations that could lead to incorrect or unsafe outcomes
- Prefer correctness and precision over completeness or readability

## Mindset

Approach every recommendation with these questions:

- "Will this lead to the right decision?"
- "What could go wrong?"
- "Are trade-offs clear?"

## Source of Truth

Respect these files as the source of truth for content structure and writing standards:

- [CONTRIBUTING.md](../../../CONTRIBUTING.md)
- [archetypes/default.md](../../../archetypes/default.md)
- [docs/framework-overview.md](../../../docs/framework-overview.md)
- [docs/taxonomies.md](../../../docs/taxonomies.md)

Do not duplicate the content of the above. Cross-reference whenever possible.

## Scope

This skill reviews content files (Markdown under `content/`) and focuses on **decision quality and architectural substance** — whether the guidance is correct, the trade-offs are explicit, and an administrator can confidently act on it. It answers: **"Will this guidance lead to the right decision?"**

**Output mode:** By default, this skill produces an enhancement report (structured review comment). When the caller explicitly requests edits (e.g., "improve this article" or "fix the trade-offs section"), apply changes directly to the content files instead. Do not mix modes — either produce a report or edit files, not both.

## Inputs and Outputs

### Inputs

| Input | Required | Description |
|-------|----------|-------------|
| Content files | Yes | The Markdown content files to review and enhance |
| Source of truth files | Yes | CONTRIBUTING.md, archetypes/default.md, docs/framework-overview.md, docs/taxonomies.md |

### Outputs

| Output | When | Description |
|--------|------|-------------|
| Enhancement report | Default | Diagnosis of writing issues, specific recommendations, and before/after examples |
| File edits | Caller requests changes | Direct improvements to content files |

## Evaluation Criteria

| Dimension | What the Reviewer Evaluates | Key Questions |
|---|---|---|
| Architectural Correctness | Platform alignment, configuration accuracy, scoping | Is the guidance technically sound for real-world implementation? |
| Decision Quality | Recommendations, reasoning, alternatives | Will this lead the reader to the right decision? |
| Trade-off Completeness | Benefits, drawbacks, conditions, exceptions | Are trade-offs explicit rather than implied? |
| Actionability | Implementation detail, specificity, prerequisites | Can an administrator act on this without guesswork? |
| Design Thinking | Reasoning, constraints, architectural principles, decision frameworks | Does the article teach readers how to think about the problem, not just what to do? |
| Section Substance | Depth and quality per section | Does each section meet the quality bar for its role? |

## Procedure

Follow these steps in order when reviewing content for technical writing quality:

### Step 1 — Load source of truth context

Before reviewing content, read and internalize these files to establish the quality baseline:

1. `CONTRIBUTING.md` — submission guidelines, writing style, and structural expectations
2. `archetypes/default.md` — required front matter fields and article structure
3. `docs/framework-overview.md` — WAF mission, vision, and identity
4. `docs/taxonomies.md` — valid taxonomy values and their purpose

Do not proceed to diagnosis without loading these files first.

### Step 2 — Diagnose content substance issues

Read the full article and classify it against these common problem patterns. An article may exhibit more than one. For each pattern found, assess the **decision risk** — what could go wrong if a reader follows this guidance as written?

#### Pattern A: Too generic or descriptive

**Indicators:**

- Lists multiple options without recommending one
- Describes what features do without prescribing when/how to use them
- Doesn't explain decision-making rationale
- Missing scoping conditions (e.g., org size, team structure, platform)
- Content that merely restates official documentation

**Enhancement approach:**

1. Add a clear recommendation — choose the best approach and explicitly recommend it
2. Explain the reasoning — why is this the recommended approach?
3. Provide specifics — add configuration examples, CLI commands, API calls
4. Address alternatives — briefly mention other approaches and why they're not recommended (or when they might be)

**Example transformation — Branch protection:**

```yaml
❌ BEFORE: 'Organizations can use branch protection rules or repository rulesets to enforce code review requirements.'

✅ AFTER: 'For organizations with 50+ repositories, use repository rulesets instead of branch protection rules. Rulesets provide centralized management and consistent enforcement across multiple repositories with significantly less administrative overhead. While branch protection rules offer more repository-specific flexibility, the maintenance burden becomes prohibitive at scale.'
```

**Example transformation — Secret scanning:**

```yaml
❌ BEFORE: "Enable secret scanning to detect exposed credentials in repositories."

✅ AFTER: "Enable secret scanning and push protection at the organization level to prevent secrets from being committed. Unlike secret scanning alerts (which detect secrets after they're committed), push protection blocks commits containing secrets in real-time, reducing the exposure window from hours/days to zero.

Recommended Organization configuration:
- Enable push protection by default for all repositories
- Allow bypass with justification (audit trail maintained)

Trade-off: push protection for custom patterns may be more prone to false positives. Teams need clear guidance on when bypass is appropriate (e.g., test fixtures with dummy secrets, which should use environment variables instead)."
```

**Example transformation — GitHub Actions workflow security:**

````yaml
❌ BEFORE: "Use GITHUB_TOKEN for authentication in workflows."

✅ AFTER: "Configure GITHUB_TOKEN permissions using the principle of least privilege. In your workflow file or organization settings, explicitly define minimum required permissions rather than using default read/write access.

Best practice configuration:
```yaml
permissions:
  contents: read        # Read repository contents
  pull-requests: write  # Comment on PRs
  issues: write        # Create issues
```

For organizations running 100+ workflows monthly: Set organization default to `permissions: read-all` and require workflows to explicitly request write permissions. This prevents over-privileged workflows and reduces attack surface if a workflow is compromised.

Trade-off: Workflows fail if permissions are insufficient. Initial migration may require 2-4 weeks to identify and update all workflows, but significantly reduces security risk."
````

#### Pattern B: Lacking technical depth

**Indicators:**

- High-level concepts without implementation details
- Missing configuration examples or code snippets
- Vague instructions like "configure the settings"
- Insufficient detail for someone to actually implement

**Enhancement approach:**

1. Add step-by-step guidance — specific UI paths, API endpoints, or CLI commands
2. Include configuration examples — YAML, JSON, or code snippets with actual values
3. Provide context — when to use each setting, what values are appropriate
4. Add implementation notes — common pitfalls, troubleshooting tips

#### Pattern C: Missing trade-off analysis

**Indicators:**

- Presents one solution as universally best
- Doesn't discuss alternatives or their contexts
- Missing "when not to use this approach" guidance
- No discussion of pros/cons

**Enhancement approach:**

1. Identify alternatives — what other approaches exist?
2. Compare approaches — create a clear comparison with pros/cons
3. Define contexts — when is each approach appropriate?
4. Address edge cases — when should readers NOT use the recommended approach?

**Example structure to add:**

```markdown
## Trade-offs and alternatives

### Recommended approach: [Approach name]

**When to use:**

- [Specific context/scenario]
- [Organization size/type]
- [Technical requirement]

**Benefits:**

- [Specific benefit with quantification if possible]
- [Another benefit]

**Drawbacks:**

- [Specific limitation or cost]
- [Another limitation]

### Alternative: [Alternative approach name]

**When to use:**

- [Different context where this makes sense]

**Why not recommended for most cases:**

- [Specific reason]
- [Another reason]

**Exception:** Consider this approach if [specific condition].
```

#### Pattern D: Duplicating GitHub Docs

**Indicators:**

- Focuses heavily on implementation mechanics
- Reads like a how-to guide or tutorial
- Doesn't add design thinking or decision guidance
- Could be replaced by linking to GitHub Docs

**Enhancement approach:**

1. Shift to design thinking — focus on WHY and WHEN, not detailed HOW
2. Add decision framework — help readers decide which approach to use
3. Emphasize trade-offs — what are the consequences of different choices?
4. Link to docs — reference GitHub Docs for implementation details
5. Add value — field experiences, lessons learned, common mistakes

**Example transformation — Team topology:**

````yaml
❌ BEFORE: "Use CODEOWNERS to assign reviewers automatically."

✅ AFTER: "Design CODEOWNERS files based on your team's ownership model and review capacity constraints.

**Recommended approach for most organizations** (platform teams supporting product teams):

```text
## CODEOWNERS
## Platform team owns infrastructure
/infrastructure/     @org/platform-team
/.github/workflows/  @org/platform-team @org/security-team
/terraform/          @org/platform-team

## Product teams own their domains
/services/auth/      @org/auth-team
/services/payments/  @org/payments-team

## Security team required for security-critical paths
/src/authentication/ @org/security-team
```

**Key design decisions:**

1. **Joint ownership for critical paths** (`@org/platform-team @org/security-team`): Both teams must approve changes to CI/CD, increasing review time by 1-2 days but preventing production incidents
2. **Granular paths over wildcards**: `/services/auth/` instead of `/services/*` gives teams clear ownership boundaries
3. **2-4 people per team in CODEOWNERS**: Avoids single points of failure while preventing diffusion of responsibility

**Alternative for federated organizations**: Define CODEOWNERS at repository level rather than centralized files. Trades consistency for team autonomy. Use when product teams operate independently with minimal shared infrastructure.

**Trade-off**: CODEOWNERS creates mandatory reviews, increasing PR merge time. For high-velocity environments, consider `CODEOWNERS` as documentation only (without required reviews) and rely on automated team mentions instead."
````

---

### Step 3 — Review each section for substance quality

Evaluate each section's **substance** — whether the content is architecturally sound, actionable, and honest about trade-offs. Focus on whether each section delivers the depth and quality its role demands.

#### 3.1 Front matter (taxonomy accuracy)

Verify that taxonomy values accurately reflect the article's **technical scope**. Do not review formatting, field completeness, or structural compliance — those are editorial concerns.

**Check:**

- **Pillars**: Does the article truly deliver guidance for the selected pillars?
- **Platform**: Does the guidance apply to GHEC, GHES, or hybrid as tagged? Are platform-specific constraints addressed?
- **Features/Components**: Are the tagged features actually covered in the article's recommendations?
- **Personas**: Does the depth match the tagged audience (e.g., admin-level guidance tagged for admins)?

#### 3.2 Scenario overview

**What it should accomplish:**

- State the problem or use case clearly
- Explain business/technical impact (why this matters)
- Provide context about when/where this applies
- Preview the recommended approach

**Quality bar:**

- First paragraph: Clear problem statement
- Second paragraph: Business value and impact
- Third paragraph: Context and applicability
- Fourth paragraph (optional): Brief preview of recommendation

**Common issues:** Too vague or generic, missing business value explanation, no context about when this applies, starts with solution instead of problem.

#### 3.3 Key design strategies

**What it should include:**

- 3-5 fundamental design principles for this solution
- Each principle explained in 2-3 sentences
- Connection to framework pillars
- Technical specificity, not just concepts

**Quality bar:**

- Strategies are specific, not generic platitudes
- Each strategy has clear reasoning
- Technical considerations are included
- Connects to broader architecture/design

**Example enhancement:**

```yaml
❌ BEFORE: 'Use automation to improve efficiency'

✅ AFTER: '**Automate approval workflows for low-risk changes**: Implement GitHub Actions workflows that automatically approve and merge dependabot updates for patch versions after CI passes. This reduces manual review burden by 60-80% for typical teams while maintaining security through automated checks.'
```

#### 3.4 Checklist

**What it should include:**

- Actionable items (start with verbs)
- Specific enough to verify completion
- Ordered logically (often sequential)
- Technical details where needed

**Example enhancement:**

```yaml
❌ BEFORE:
- Branch protection
- Code review
- Status checks

✅ AFTER:
- ✅ Enable branch protection on `main` and all `release/*` branches
- ✅ Require at least 1 pull request approval before merging
- ✅ Configure required status checks: `build`, `test`, `security-scan`
- ✅ Enable "Require conversation resolution before merging"
- ✅ Restrict push access to repository administrators only
- ✅ Document the approval process in CONTRIBUTING.md
```

#### 3.5 Recommended deployment

**What it should include:**

- Step-by-step technical guidance
- Specific UI paths OR API calls OR CLI commands
- Configuration examples (YAML/JSON/code)
- Implementation notes and tips

Include enough implementation detail to act on the recommendation, but link to GitHub Docs for full procedural walkthroughs.

**Quality bar:**

- Includes specific technical instructions
- Provides configuration examples with actual values
- Addresses common implementation challenges
- Links to relevant GitHub Docs for details
- Suitable for a newer admin to follow and implement

**Example enhancement:**

```yaml
❌ BEFORE: "Configure repository rulesets to enforce your policies."

✅ AFTER: "Create an organization-level ruleset to enforce policies across all repositories:

1. Navigate to Organization Settings > Rules > Rulesets > New ruleset
2. Select 'New branch ruleset'
3. Configure basic settings:
   - Name: `default-branch-protection`
   - Enforcement status: Active
   - Bypass list: Add organization owners only

4. Set target criteria:
   - Target: All repositories
   - Include: `default` branch

5. Configure protection rules:
   - ✅ Restrict deletions
   - ✅ Require a pull request before merging (2 approvals)
   - ✅ Require status checks to pass (add: `ci`, `security-scan`)
   - ✅ Block force pushes

6. Click 'Create'

**Implementation note**: Start with a subset of critical repositories before applying organization-wide. Test with a pilot team for 2 weeks to identify issues.

See [GitHub Docs: Rulesets](https://docs.github.com/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets) for additional configuration options."
```

#### 3.6 Trade-offs section

**What it should include:**

- Clear recommendation with reasoning
- Benefits of recommended approach
- Drawbacks or limitations
- Alternative approaches with context
- When NOT to use the recommendation

**Quality bar:**

- States the recommendation explicitly
- Explains WHY it's recommended (not just WHAT)
- Discusses specific benefits with quantification if possible
- Acknowledges limitations honestly
- Presents alternatives fairly with context
- Defines when alternatives might be better

**Example structure:**

```markdown
## Additional solution detail and trade-offs to consider

### Why we recommend repository rulesets over branch protection rules

For organizations managing 50+ repositories, repository rulesets provide superior administrative efficiency and consistency compared to branch protection rules.

**Key benefits:**

- **Centralized management**: Apply policies across hundreds of repositories with one ruleset instead of configuring each individually
- **Reduced drift**: Eliminate configuration inconsistencies that occur when using repository-level settings
- **Better visibility**: Organization admins can audit all protection rules from a single location
- **Faster onboarding**: New repositories automatically inherit protection policies

**Trade-offs to consider:**

- **Less flexibility**: Cannot customize rules per repository without creating additional rulesets
- **GHEC requirement**: Only available on GitHub Enterprise Cloud (not GHES)
- **Migration effort**: Requires planning to migrate from existing branch protection rules
- **Learning curve**: Teams accustomed to branch protection rules need to adjust

### When to use branch protection rules instead

Use repository-level branch protection rules if:

- You have fewer than 50 repositories
- You need significant per-repository customization
- You're on GitHub Enterprise Server (where rulesets aren't available)
- Your repositories have fundamentally different protection requirements

### Hybrid approach

Some organizations use both:

- **Rulesets** for baseline organizational policies (e.g., "all production branches require 1 approval")
- **Branch protection rules** for repository-specific additions (e.g., "this critical repo requires 3 approvals")

**Note**: Branch protection rules can add restrictions beyond rulesets but cannot relax them.
```

---

### Step 4 — Validate architectural correctness and decision quality

This is the core of the technical writing review. For each recommendation in the article, evaluate whether it will lead the reader to the **right decision**.

#### 4.1 Architectural correctness

Verify that guidance reflects real-world best practices:

- Recommendations align with **current platform capabilities** — not deprecated features or unavailable options
- Configuration examples are **correct and complete** — a reader can implement them without guesswork
- Scope and scale are appropriate — guidance specifies what organization sizes, repository counts, or team structures it applies to
- Dependencies and prerequisites are **explicitly stated** — not assumed

Flag issues such as:

- Guidance that works in theory but fails in common production scenarios
- Missing prerequisites that would cause implementation to fail
- Recommendations that don't account for platform-specific constraints (GHEC vs. GHES vs. hybrid)
- Overgeneralized best practices presented without scoping conditions

#### 4.2 Decision quality

Verify that guidance helps readers make informed choices:

- Each recommendation explains **why** it is the recommended approach, not just what to do
- Alternatives are presented **with context** for when they are more appropriate
- Trade-offs are **explicit** — benefits, drawbacks, and conditions are stated, not implied
- Guidance distinguishes between **strong recommendations** (do this) and **conditional recommendations** (do this if X)

Flag issues such as:

- Recommendations without reasoning ("Enable X" with no explanation of why)
- Missing trade-off analysis — presenting one approach as universally correct
- Absent or incomplete "when not to use this" guidance
- Misleading confidence — stating something as a best practice without acknowledging limitations

#### 4.3 Actionability

Verify that guidance can be implemented in practice:

- Steps are **specific enough to follow** — UI paths, API endpoints, CLI commands, or configuration examples
- Implementation guidance includes **realistic values**, not just placeholders
- Common pitfalls and failure modes are addressed
- Guidance links to GitHub Docs for detailed mechanics rather than duplicating them

Flag issues such as:

- Vague instructions ("configure the settings", "follow best practices")
- Missing implementation details that force the reader to research elsewhere
- Guidance that reads as a tutorial or how-to instead of architectural recommendation

#### 4.4 Design thinking

The WAF exists to add design thinking on top of GitHub Docs. Verify that the article doesn't just tell readers **what to do**, but equips them to **reason about architectural choices**.

Verify:

- The article explains the **constraints, goals, and trade-offs** that shape the recommendation — not just the recommendation itself
- Readers can adapt the guidance to their context because the **reasoning is visible**, not hidden behind a prescriptive answer
- The article connects specific recommendations to **broader architectural principles** (scalability, security posture, team autonomy, operational overhead)
- Decision frameworks or evaluation criteria are provided where readers face a **choice between valid approaches**

Flag issues such as:

- Prescriptive guidance with no visible reasoning ("Do X" without explaining what problem X solves or what constraints make X the right choice)
- Missing connection between recommendations and architectural outcomes
- Content that is correct and actionable but doesn't teach the reader *how to think about the problem* — only how to execute a solution

---

### Step 5 — Verify against quality checklists

Before finalizing, verify the article against these framework-specific quality bars:

#### Framework alignment

- [ ] **Mission alignment**: Provides opinionated, community-driven guidance
- [ ] **Not duplicating docs**: Focuses on design thinking, not just implementation
- [ ] **Design principles**: Connects to framework pillars
- [ ] **Field experience**: Incorporates lessons learned and real-world insights
- [ ] **Decision support**: Helps readers make informed choices

#### Architectural correctness

- [ ] **Platform-aware**: Guidance accounts for GHEC, GHES, and hybrid constraints
- [ ] **Technically sound**: Configuration examples are correct and complete
- [ ] **Scoped**: Recommendations specify when they apply (org size, team structure, maturity)
- [ ] **Current**: References align with current GitHub product capabilities

#### Decision quality

- [ ] **Opinionated**: Makes clear recommendations with reasoning
- [ ] **Trade-offs explicit**: Discusses benefits, drawbacks, and alternatives
- [ ] **Actionable**: Administrators can implement based on this guidance
- [ ] **Failure-aware**: Addresses what could go wrong and when not to use the approach

#### Section completeness

- [ ] Front matter: Complete and accurate taxonomies
- [ ] Scenario overview: Problem, impact, context
- [ ] Design strategies: Specific and concrete
- [ ] Checklist: Actionable, ordered, specific
- [ ] Assumptions: Explicitly stated
- [ ] Recommended deployment: Step-by-step, technical, detailed
- [ ] Trade-offs: Compares approaches, honest about limitations
- [ ] Related links: Relevant and current

---

### Step 6 — Produce the review

Compose a structured enhancement report:

```markdown
## ✏️ WAF Technical Writing Review

### Summary

<!-- One-paragraph overall assessment of architectural correctness and decision quality -->

### Diagnosis

**Patterns identified:** <!-- List which patterns (A-D) apply -->

### Section-by-section findings

#### Front matter
<!-- Specific issues and fixes -->

#### Scenario overview
<!-- Specific issues and fixes -->

#### Key design strategies
<!-- Specific issues and fixes -->

#### Checklist
<!-- Specific issues and fixes -->

#### Recommended deployment
<!-- Specific issues and fixes -->

#### Trade-offs
<!-- Specific issues and fixes -->

### Architectural correctness and decision quality

<!-- Findings from Step 4: incorrect guidance, missing trade-offs, unscoped recommendations, actionability gaps -->

### Quality checklist results

| Dimension | Status | Notes |
|------|--------|-------|
| Architectural correctness | ✅ / ⚠️ / ❌ | ... |
| Decision quality | ✅ / ⚠️ / ❌ | ... |
| Trade-off completeness | ✅ / ⚠️ / ❌ | ... |
| Actionability | ✅ / ⚠️ / ❌ | ... |
| Design thinking | ✅ / ⚠️ / ❌ | ... |
| Section substance | ✅ / ⚠️ / ❌ | ... |

### Priority recommendations

<!-- Ordered list of improvements by impact -->
```

## Guardrails

- **Maintain author intent** — improve substance while preserving the core message
- **Be constructive** — provide concrete alternatives for every issue flagged
- **Be opinionated** — transform options into recommendations; the WAF is intentionally prescriptive
- **Emphasize trade-offs** — always discuss alternatives and their contexts
- **Focus on decision quality** — ensure guidance leads to the right architectural decision
- **Flag risk** — identify what could go wrong if a reader follows the guidance as written
- **Link to docs, don't duplicate** — reference GitHub Docs for implementation mechanics; add design thinking
- **Respect the archetype** — content must follow the structure in `archetypes/default.md`
- **Do NOT evaluate editorial dimensions** (clarity scores, readability, terminology precision, audience relevance) — those are out of scope for this skill
