# Publishing Well-Architected Content to GitHub Learn

This guide describes the requirements for publishing Well-Architected Framework content to GitHub Learn.

To publish successfully, contributors must follow the required frontmatter, metadata, and structural guidelines outlined below.

## Table of Contents

- [Quick Checklist](#quick-checklist)
- [Frontmatter for all content pages](#frontmatter-for-all-content-pages)
- [Metadata for multi-page sections](#metadata-for-multi-page-sections)
- [Pull request review checklist](#pull-request-review-checklist)

---

## Quick Checklist

All content lives under `content/library/`. Before opening a PR for content review, confirm:

- [ ] The file is in the **correct pillar** or section folder.
- [ ] **Frontmatter** satisfies the nearest `schema.json` (see [Frontmatter for all content pages](#frontmatter-for-all-content-pages)).
- [ ] If the content is part of a multi-page section, the section must include an `index.yml` and `_index.md` (see [Metadata for multi-page sections](#metadata-for-multi-page-sections)).
- [ ] Links between pages use **relative paths** (for example `./overview` or `../application-security/overview`).
- [ ] Images and downloadable assets are stored in the relevant `assets/` folder.
- [ ] File names use **kebab-case**.

---

## Frontmatter for all content pages

Every content page begins with YAML frontmatter fenced by `---`. The nearest `schema.json` in the folder determines which fields are required and their expected types.

### Frontmatter property reference

| Property | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | `string` | Yes in most page schemas | The library root and `overview/release-notes` schemas do not mark it as required. |
| `description` | `string` | Yes at the product root only | Optional in library page schemas. |
| `publishDate` | `string` | No | Set to the date the article is first merged to `main`. Do not change on future revisions. |
| `weight` | `number` | Yes in most page schemas | Controls page ordering within a section. |
| `draft` | `boolean` | No | Keep `false` for normal publication. Set `true` only to intentionally hide a page. |
| `prev` | `string` | No | Path to previous page, for example `library/architecture/design-principles`. |
| `next` | `string` | No | Path to next page, for example `library/architecture/checklist`. |
| `slug` | `string` | No | Optional path segment override. |
| `params.authors` | `array` | No | Array of `{ name, handle }` objects crediting significant contributors. |
| `pillars` | `array` | No | Taxonomy values that make the article discoverable. See [Taxonomies](taxonomies.md). |

> **Info:** Extra property keys are accepted, as current schemas set `additionalProperties: true`. CI validation only checks properties declared in the nearest `schema.json`.

### Example frontmatter for a content page

```yaml
---
title: 'Scaling Git repositories'
publishDate: 2025-03-10
draft: false
weight: 4
prev: library/architecture/recommendations/implementing-polyrepo-engineering
next: library/architecture/recommendations/deploying-actions-runner-controller

params:
  authors:
    - name: 'Mona'
      handle: 'mona'
    - name: 'Hubot'
      handle: 'hubot'

pillars:
  - architecture
  - productivity
---
```

---

## Metadata for multi-page sections

A multi-page section is a folder under `content/library/` that groups related pages (for example, a pillar, a recommendations collection, or a multi-part guide).

### Minimum required metadata files

Each section folder must include, at minimum:

| File | Purpose |
| --- | --- |
| `index.yml` | Declares section title, weight (ordering), and optional slug for navigation. |
| `_index.md` | Section landing page rendered by Hugo. Frontmatter must match the folder schema. |
| `schema.json` | Defines and validates frontmatter requirements for all pages in this folder. |

### `index.yml`

Defines navigation metadata for the section. Most folders require `title` and `weight`:

```yaml
title: Recommendations
weight: 5
slug: recommendations
```

### `_index.md`

The section landing page. Its frontmatter follows the same schema rules as other pages in the folder. Typically includes a `title`, `weight`, and optional `draft` field.

### `schema.json`

Each folder can contain a `schema.json` that declares which frontmatter fields are required and their types. This schema is used for CI validation of all pages in the folder and its subfolders. If a page does not meet the requirements of the nearest `schema.json`, it will fail CI checks.

Example `schema.json`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "title": { "type": "string" },
    "weight": { "type": "number" },
    "draft": { "type": "boolean" }
  },
  "required": ["title", "weight"],
  "additionalProperties": true
}
```

### Example folder structure of a section

```text
content/library/architecture/recommendations/monorepo/
├── _index.md          # Section landing page
├── index.yml          # Section navigation metadata
├── schema.json        # Frontmatter validation for this folder
├── overview.md        # Introductory page
├── implementing-monorepo.md
├── indexing-monorepo.md
└── assets/
    └── diagram.png
```

### To add a new multi-page section

1. Create the folder under the appropriate pillar in `content/library/`.
2. Add an `index.yml` file with `title` and `weight`.
3. Add a `schema.json` file defining required frontmatter.
4. Add an `_index.md` landing page.
5. Add content pages (for example, `overview.md`).
6. Link the new section from parent pages where appropriate.

---

## Pull request review checklist

Before opening a PR, confirm:

- [ ] Page is in the correct Well-Architected section.
- [ ] Frontmatter satisfies the nearest `schema.json`.
- [ ] `index.yml` is present with correct `weight` ordering.
- [ ] Links and shortcodes render correctly after local build (`./tools/server`).
- [ ] Run `./tools/lint` with no errors.
- [ ] No unrelated files were modified.
