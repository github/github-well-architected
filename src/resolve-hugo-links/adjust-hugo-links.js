#!/usr/bin/env node

/**
 * adjust-hugo-links.js
 *
 * Transforms relative links in Markdown files so they resolve correctly
 * when Hugo serves pages with trailing-slash URLs.
 *
 * Problem:
 *   Production serves pages WITHOUT trailing slashes (e.g. /library/overview/release-notes).
 *   Hugo serves pages WITH trailing slashes (e.g. /library/overview/release-notes/).
 *   Browsers resolve relative links from the "base directory" of the URL.
 *   A trailing slash means the last segment IS the directory, shifting resolution one level deeper.
 *   This causes every relative link to land one level too shallow on production
 *   (or one level too deep on Hugo, depending on perspective).
 *
 * Solution:
 *   Source Markdown (content/) has links authored for production depth.
 *   This script adds one "../" to every relative link in content-processed/
 *   so Hugo resolves them to the correct target.
 *
 * Usage:
 *   node script/adjust-hugo-links.js <directory>
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

/**
 * Add one level of ../ to a relative URL.
 * Returns the URL unchanged if it's absolute, external, or anchor-only.
 */
function adjustRelativeUrl(url) {
  if (
    !url ||
    url.startsWith('/') ||
    url.startsWith('#') ||
    /^[a-z][a-z0-9+.-]*:/i.test(url)
  ) {
    return url;
  }

  // Separate path from fragment
  const hashIndex = url.indexOf('#');
  const pathPart = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const fragment = hashIndex >= 0 ? url.slice(hashIndex) : '';

  if (!pathPart) return url; // anchor-only

  // ./foo → ../foo
  if (pathPart.startsWith('./')) {
    return '../' + pathPart.slice(2) + fragment;
  }

  // ../foo → ../../foo  (and deeper)
  // bare relative → ../bare
  return '../' + pathPart + fragment;
}

/**
 * Process a single line of Markdown, adjusting relative links.
 * Handles both standard Markdown links and Hugo shortcode link= attributes.
 */
function adjustLinksInLine(line) {
  // Skip lines that are entirely inline code or HTML comments
  if (line.trimStart().startsWith('<!--')) return line;

  // Markdown links: [text](url) and [text](url "title")
  // Negative lookbehind for ! to skip image links ![alt](url)
  line = line.replace(/(?<!!)\[([^\]]*)\]\(([^)]+)\)/g, (match, text, urlPart) => {
    // Separate URL from optional title
    const titleMatch = urlPart.match(/^(\S+?)(\s+["'][^"']*["'])?\s*$/);
    if (!titleMatch) return match;

    const url = titleMatch[1];
    const title = titleMatch[2] || '';

    const adjusted = adjustRelativeUrl(url);
    if (adjusted === url) return match;

    return `[${text}](${adjusted}${title})`;
  });

  // Hugo shortcode link="url"
  line = line.replace(/(link=")([^"]*?)(")/g, (_match, pre, url, post) => {
    const adjusted = adjustRelativeUrl(url);
    return `${pre}${adjusted}${post}`;
  });

  return line;
}

/**
 * Process a Markdown file's content, adjusting all relative links.
 * Preserves frontmatter and skips fenced code blocks.
 */
function adjustLinksInContent(content) {
  const lines = content.split('\n');
  let inFrontmatter = false;
  let frontmatterDone = false;
  let inCodeBlock = false;
  let dashCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trimStart();

    // Track YAML frontmatter (--- delimited)
    if (!frontmatterDone && trimmed === '---') {
      dashCount++;
      if (dashCount === 1) {
        inFrontmatter = true;
        continue;
      }
      if (dashCount === 2) {
        inFrontmatter = false;
        frontmatterDone = true;
        continue;
      }
    }
    if (inFrontmatter) continue;

    // Track fenced code blocks
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Adjust links in this line
    lines[i] = adjustLinksInLine(lines[i]);
  }

  return lines.join('\n');
}

/**
 * Recursively find all Markdown files in a directory.
 */
async function findMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findMarkdownFiles(fullPath));
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.md') {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node script/adjust-hugo-links.js <directory>');
    process.exit(1);
  }

  const targetDir = path.resolve(args[0]);
  const files = await findMarkdownFiles(targetDir);
  let adjustedCount = 0;

  for (const file of files) {
    const original = await fs.readFile(file, 'utf8');
    const adjusted = adjustLinksInContent(original);

    if (adjusted !== original) {
      await fs.writeFile(file, adjusted, 'utf8');
      adjustedCount++;
      console.log(`Adjusted links in ${path.relative(targetDir, file)}`);
    }
  }

  console.log(`\nProcessed ${files.length} file(s), adjusted ${adjustedCount}`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
