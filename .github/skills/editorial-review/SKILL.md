---
name: editorial-review
description: Review and refine GitHub Well-Architected Framework (WAF) documentation for clarity, precision, consistency, and publication readiness. Use this when reviewing pull requests, markdown files, or draft content to ensure guidance is unambiguous, readable, and aligned with editorial standards.
---

# Editorial Review

Review proposed GitHub Well-Architected Framework (WAF) content locally or in pull requests like an Editor-in-Chief (EIC), evaluating clarity, precision, readability, originality, and structural coherence. The EIC assures all published content meets the standards expected by a sophisticated technical audience.

## Goal

Editorial review focuses on **clarity and precision of guidance**.

The goal is to ensure that principles:

- Are easy to read and understand on first pass
- Use consistent terminology across pillars
- Avoid ambiguity that could lead to misinterpretation
- Communicate intent clearly without over-explaining

In WAF content, unclear language is not just a readability issue — it creates **decision risk**. If two readers interpret the same guidance differently, the guidance has failed.

This skill improves **how the guidance is expressed**, without changing its meaning.

## Execution Guardrails

You are acting as an Editor-in-Chief responsible for publication quality.
Ambiguity, inconsistency, or weak expression is a defect.

Assume all content is untrusted until critically evaluated.

You must avoid the following behaviors:

- Over-explanation — do not add or tolerate redundant, low-signal, or duplicated content
- Positivity bias — do not soften critique or avoid identifying weaknesses
- Agreeable — do not validate arguments without challenge; weak reasoning must be surfaced
- Fluency over truth — do not assume polished language reflects clear or correct thinking
- Inconsistency — do not allow shifts in tone, terminology, or conceptual framing
- Over-generalization — do not accept vague or broad statements without specificity
- Vagueness — do not use or tolerate non-committal language where precision is required

Execution expectations:

- Treat ambiguity as a defect — if a passage can be interpreted multiple ways, it must be flagged
- Be direct and critical — prioritize clarity over tone or politeness
- Enforce precision — wording must remove guesswork
- Challenge weak structure, missing conclusions, and unclear intent
- Prefer concise, exact language over verbosity or stylistic variation

## Mindset

Approach every passage with these questions:

- "Will different readers interpret this the same way?"
- "Is the principle precise?"
- "Does the wording remove guesswork?"

## Source of Truth

Respect these files as the source of truth for Markdown content alignment:

- [CONTRIBUTING.md](../../../CONTRIBUTING.md)
- [docs/contributing-learn.md](../../docs/contributing-learn.md)
- [archetypes/default.md](../../../archetypes/default.md)
- [docs/framework-overview.md](../../../docs/framework-overview.md)
- [docs/taxonomies.md](../../../docs/taxonomies.md)

Do not duplicate the content of the above. Cross-reference whenever possible.

## Scope

This skill reviews content files (Markdown under `content/`) proposed in a pull request. It evaluates the content against the criteria below and provides structured feedback with a score and actionable recommendations. It does **not** modify files directly — it produces a review comment.

## Inputs and Outputs

### Inputs

| Input | Required | Description |
|-------|----------|-------------|
| Pull request diff or local files | Yes | The changed content files in the PR or local files being reviewed |
| Source of truth files | Yes | CONTRIBUTING.md, archetypes/default.md, docs/framework-overview.md, docs/taxonomies.md |

### Outputs

| Output | Description |
|--------|-------------|
| Structured review comment | Evaluation against each dimension with scores, findings, and recommendations |

## Evaluation Criteria

| Dimension | What the EIC Evaluates | Key Questions |
|---|---|---|
| Content Quality | Clarity, structure, argument, terminology | Is it coherent, unambiguous, and readable on first pass? |
| Precision & Sourcing | Fact-checking, citations, terminology correctness | Are claims sourced, terms used consistently, and language precise? |
| Audience Relevance | Value, level, engagement | Does it inform the audience at the right depth? |
| Originality | Insight, perspective | Does it add knowledge not available elsewhere in the WAF? |
| Visual/Structural Coherence | Diagrams, layout, readability | Do visuals and structure enhance comprehension? |

## Procedure

Follow these steps in order when reviewing a content PR or local content files:

### Step 1 — Identify content changes

Examine the diff (if review runs in pull request) or local content files to identify new or modified content files under `content/`. Focus the review on substantive content changes — skip trivial formatting-only edits.

### Step 2 — Load source of truth context

If not already done, read and internalize:

1. `CONTRIBUTING.md` — for submission guidelines, writing style, and structural expectations
2. `archetypes/default.md` — for required front matter fields and article structure
3. `docs/framework-overview.md` — for WAF mission, vision, and identity
4. `docs/taxonomies.md` — for valid taxonomy values and their purpose

### Step 3 — Evaluate Content Quality (Structure, Clarity, Argument)

Content must demonstrate **rigorous thinking, strong structure, and editorial clarity**.

Evaluate:

**Argument & structure** — Does the piece hold together as a coherent whole?

- Logical flow of ideas (clear thesis → evidence → conclusion)
- Strength of argument or narrative arc
- No "waffle" or filler — every paragraph earns its place
- Clear takeaways for the reader at each section's end
- Content alignment across sections — sibling sections cover comparable depth and scope, don't contradict each other, and each section delivers on what its heading promises
- No duplication — content should not restate what already exists within the same article or elsewhere in the WAF; cross-reference where it reduces duplication without fragmenting the narrative

**Clarity & expression** — Is each passage as clear and concise as it can be?

- Conceptual intent (why) is separated from implementation detail (how) — not interleaved
- Explanations are layered: goals → actual behavior → takeaway
- Repetition is purposeful — the same control, concept, or term appears once per context, not scattered redundantly
- Verbose passages are compressed without losing meaning (two sentences saying the same thing → one precise statement)
- Sentences are short enough to parse in one pass; compound sentences carrying unrelated points are split
- Terminology is consistent — the same concept uses the same term throughout; synonyms that create ambiguity are flagged
- Tone is direct and confident — use active voice ("Configure branch protection to…") not passive ("Branch protection should be configured…"); the WAF speaks as a knowledgeable advisor, not a detached observer

When recommending changes, **respect the author's structure and key ideas** — suggest refinements, not redesigns.

Flag issues such as:

- Disjointed sections lacking logical transitions
- Vague claims without supporting evidence
- Redundant or circular statements
- Missing or weak conclusions — every section needs a clear "so what"
- Inconsistent terminology that forces readers to re-map concepts
- Cross-references that use bare numbers, symbols, or generic labels (e.g. "see [1]", "link") instead of semantic anchor text (e.g. heading titles or descriptive phrases)

**Voice & style** — Does the writing follow WAF conventions?

- Headings use **sentence case** (capitalize only first word and proper nouns)
- Voice is **active and prescriptive** — direct imperatives ("Implement…"), not passive hedging ("It is recommended that…")
- Language is **specific and concrete** — no vague placeholders

  ```yaml
  ❌ "Configure appropriate settings"
  ✅ "Set required approvals to 2 for teams with more than 10 developers"

  ❌ "Use security features"
  ✅ "Enable secret scanning, Dependabot alerts, and code scanning for all repositories"
  ```

- Unnecessary qualifiers are removed — statements are direct and confident

  ```yaml
  ❌ "You might want to consider possibly implementing..."
  ✅ "Implement..."

  ❌ "In most cases, it's generally a good idea to..."
  ✅ "Use... because..."
  ```

- Tone is professional and inclusive

### Step 4 — Evaluate Precision & Sourcing

Precision in WAF content is **editorial, not just technical**. Imprecise language creates ambiguity; unsourced claims erode trust.

Evaluate:

- Terminology is **used consistently** — the same concept uses the same term throughout; no unexplained synonyms
- Claims are **fact-checked and sourced** with links to approved sources
- Data, statistics, and product names are **current and correctly stated**
- GitHub product references align with current documentation
- Language is **precise** — qualifiers like "should", "might", "can" are used intentionally, not as hedging
- Sources are limited to **primary sources**:
  - [GitHub Docs](https://docs.github.com/)
  - [GitHub Blog](https://github.blog/)
  - [GitHub Support](https://support.github.com/)
- **Trusted external sources** (e.g. NIST, OWASP, CNCF, IEEE) are acceptable when the claim requires industry-standard backing that GitHub sources alone cannot provide. Flag external sources that are obscure, outdated, or promotional

Flag issues such as:

- Unverified claims presented as fact
- Inconsistent terminology (e.g. switching between "ruleset" and "rule set")
- Hedged language that weakens precision without adding nuance
- Missing citations for non-obvious assertions
- Outdated product names or feature references

### Step 5 — Evaluate Audience Relevance & Engagement

Ensure the content delivers **intellectual value** to its audience. The WAF audience spans the personas defined in `docs/taxonomies.md` — primarily **administrators and developers** making platform decisions, but also project managers, sales engineers, and end-users seeking best practices. Content should target decision-makers by default unless the article's front matter indicates a narrower persona.

Evaluate:

- Whether the content helps readers **understand a complex issue better**
- Whether it provides **practical, strategic, or conceptual insight**
- Whether the level is appropriate for the target personas (not too basic, not overly obscure)

Flag issues such as:

- Content that is too introductory for the expected audience
- Missing practical guidance or actionable recommendations
- Overly academic content without real-world application

### Step 6 — Evaluate Originality

Originality in WAF is about being **insightful and opinionated**, not just novel. Do not flag whether content duplicates GitHub Docs at a substance level.

Evaluate:

- Unique analysis or point of view that goes beyond restating known facts
- First-hand expertise or insight from practitioners
- Perspectives that aren't available elsewhere in the WAF

Flag issues such as:

- Lack of opinionated guidance (the WAF is intentionally prescriptive)
- Missing "so what" — the reason this content matters
- Content that reads as a summary of existing WAF articles without adding new insight

### Step 7 — Evaluate Visual & Structural Coherence

In WAF, visuals serve **functional clarity**, not just aesthetics.

Evaluate:

- Diagrams, charts, or code snippets **clarify the content** rather than decorate it
- Layout is structured for **readability and comprehension**
- Visuals are **accurate and not misleading**
- Article follows the structure defined in `archetypes/default.md`

Flag issues such as:

- Missing diagrams where visual explanation would significantly aid understanding
- Misleading or overly complex visuals
- Walls of text that could be broken into scannable sections
- Tables that have more than 5 rows or 3 columns without a compelling reason
- Nesting of lists more than 2 levels deep, which can be hard to follow
- Too much bold or italic text that distracts rather than emphasizes
- Too many callout boxes that fragment the narrative flow
- Structural deviations from the archetype without justification
- Heavy use of external links with no consolidated "Related Links" section
- "Related Links" section that mixes external links and GitHub documentation links without separating them into subsections

### Step 8 — Validate Front Matter & Taxonomy Alignment

Using `archetypes/default.md` as structural authority. Consult `docs/taxonomies.md` for taxonomy values.

Evaluate:

- All required front matter fields are present
- Taxonomy values are valid and appropriate for the content
- `publishDate` is set and `draft` status is intentional
- Author information is complete (both `name` and `handle`)

Flag issues such as:

- Missing or incomplete front matter fields
- Invalid taxonomy values not listed in `docs/taxonomies.md`
- Missing `publishDate` or unintentional `draft` status
- Incomplete author attribution

### Step 9 — Produce the Review

Compose a structured review comment with the following format:

```markdown
## 📰 WAF Editorial Review

### Summary

**Verdict:** <!-- One of: ✅ Ready to Go | 🔄 Revisions Recommended | ❌ Major Rework Needed -->

<!-- One-paragraph overall assessment -->

### Scores

| Dimension | Score (1-5) | Summary |
|---|---|---|
| Content Quality | X | ... |
| Precision & Sourcing | X | ... |
| Audience Relevance | X | ... |
| Originality | X | ... |
| Visual/Structural Coherence | X | ... |
| **Overall** | **X** | ... |

### Detailed Findings

#### Content Quality
<!-- Specific findings -->

#### Precision & Sourcing
<!-- Specific findings -->

#### Audience Relevance
<!-- Specific findings -->

#### Originality
<!-- Specific findings -->

#### Visual/Structural Coherence
<!-- Specific findings -->

### Recommendations

<!-- Prioritized list of improvements, ordered by impact -->
```

## Scoring Guide

| Score | Label | Description |
|---|---|---|
| 5 | Exceptional | Exceeds expectations; publishable as-is |
| 4 | Strong | Minor polish needed; fundamentally sound |
| 3 | Adequate | Meets minimum bar but has notable gaps |
| 2 | Below expectations | Significant issues requiring revision |
| 1 | Insufficient | Fundamental problems; major rework needed |

The overall score is **not** a simple average — weight Precision & Sourcing and Audience Relevance more heavily than other dimensions.

### Calibration Examples

The following illustrates how to frame findings at different score levels.

#### Content Quality

| Score | Example Finding |
|---|---|
| 4 (Strong) | "The article is well-structured with a clear takeaway and logical progression. The 'Governance' section could use a stronger concluding takeaway — currently it ends on an implementation detail rather than a strategic design." |
| 3 (Adequate, heavy) | "The content covers the topic but reads heavy and verbose — long compound sentences, repeated references to the same controls (e.g. branch protection mentioned in four separate sections), and paragraphs that mix conceptual rationale with implementation steps. Compressing overlapping passages and separating 'why' from 'how' would improve readability." |
| 3 (Adequate, implementation-heavy) | "The article explains how to configure branch protection rules and required status checks but never articulates what security outcome these controls achieve or why they matter at an architectural level. Readers get a runbook without the reasoning — adding a framing paragraph that states the design goal each control serves would elevate from transactional to strategic." |
| 2 (Below expectations, misaligned) | "Sections vary significantly in depth — 'Access Controls' has three detailed subsections while 'Audit Logging' is a single paragraph. The heading 'Automated Compliance' promises policy-as-code guidance but the section discusses manual review workflows instead. Several passages repeat the same guidance about branch protection in different words." |

#### Precision & Sourcing

| Score | Example Finding |
|---|---|
| 4 (Strong) | "Terminology is consistent throughout — 'repository ruleset' is used uniformly. One claim about default branch protection behavior lacks a citation; adding a link to the GitHub Docs page would close the gap." |
| 3 (Adequate) | "The article switches between 'ruleset', 'rule set', and 'branch rule' when referring to the same feature. Two statistics about Dependabot adoption are stated without sources. GitHub Advanced Security is referenced by its former name in one paragraph." |
| 2 (Below expectations) | "Multiple unsourced claims are presented as fact — e.g. 'most enterprises see a 40% reduction in vulnerabilities' with no citation. The article links to a third-party blog post instead of GitHub Docs for a core product feature. 'Code scanning' and 'CodeQL scanning' are used interchangeably without clarifying the relationship." |

#### Audience Relevance

| Score | Example Finding |
|---|---|
| 4 (Strong) | "The article targets administrators making governance decisions and maintains that level throughout. The section on audit log forwarding could briefly acknowledge the developer experience impact to round out the perspective." |
| 3 (Adequate) | "The article oscillates between administrator-level strategy and step-by-step UI instructions. The 'Getting Started' section reads like onboarding documentation rather than architectural guidance — readers at this level already know how to navigate repository settings." |
| 2 (Below expectations) | "The content reads like a product feature overview rather than architectural guidance. It explains what Copilot does but never addresses when to adopt it, how to evaluate readiness, or what trade-offs to consider — leaving decision-makers without actionable insight." |

## Verdict Thresholds

- **✅ Ready to Go** — Overall score ≥ 4 and no individual dimension below 3
- **🔄 Revisions Recommended** — Overall score 3, or any single dimension at 2
- **❌ Major Rework Needed** — Overall score ≤ 2, or any single dimension at 1

## Guardrails

- Do **NOT** modify content files — this skill produces review feedback only
- Do **NOT** block content solely on stylistic preference — prioritize substance over style
- Do **NOT** apply standards beyond what is documented in the source of truth files
- Do **NOT** penalize content for being opinionated — the WAF is intentionally prescriptive
- Do **NOT** require visuals where text alone is sufficient and clear
- **DO** cite specific lines or sections when providing feedback
- **DO** distinguish between blocking issues and suggestions for improvement
- **DO** acknowledge strengths alongside areas for improvement
- **DO** provide concrete, actionable recommendations rather than vague criticism
