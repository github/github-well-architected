#!/usr/bin/env node

/**
 * One-time script to reduce relative link depth by one level.
 * Converts Hugo-depth links to prod-depth links in source content.
 *
 * ../../foo → ../foo
 * ../foo    → ./foo
 */

import { promises as fs } from 'fs';
import path from 'path';

function reduceRelativeUrl(url) {
  if (!url || url.startsWith('/') || url.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(url)) {
    return url;
  }

  const hashIndex = url.indexOf('#');
  const pathPart = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const fragment = hashIndex >= 0 ? url.slice(hashIndex) : '';

  if (!pathPart) return url;

  if (pathPart.startsWith('../../')) {
    return '../' + pathPart.slice(6) + fragment;
  }
  if (pathPart.startsWith('../')) {
    return './' + pathPart.slice(3) + fragment;
  }

  return url;
}

function processLine(line) {
  if (line.trimStart().startsWith('<!--')) return line;

  // Markdown links (not images)
  line = line.replace(/(?<!!)\[([^\]]*)\]\(([^)]+)\)/g, (match, text, urlPart) => {
    const titleMatch = urlPart.match(/^(\S+?)(\s+["'][^"']*["'])?\s*$/);
    if (!titleMatch) return match;
    const url = titleMatch[1];
    const title = titleMatch[2] || '';
    const adjusted = reduceRelativeUrl(url);
    if (adjusted === url) return match;
    return `[${text}](${adjusted}${title})`;
  });

  // Shortcode link="url"
  line = line.replace(/(link=")([^"]*?)(")/g, (_m, pre, url, post) => {
    return pre + reduceRelativeUrl(url) + post;
  });

  return line;
}

function processContent(content) {
  const lines = content.split('\n');
  let inFM = false, fmDone = false, inCode = false, dashes = 0;

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trimStart();
    if (!fmDone && t === '---') {
      dashes++;
      if (dashes === 1) { inFM = true; continue; }
      if (dashes === 2) { inFM = false; fmDone = true; continue; }
    }
    if (inFM) continue;
    if (t.startsWith('```')) { inCode = !inCode; continue; }
    if (inCode) continue;

    lines[i] = processLine(lines[i]);
  }

  return lines.join('\n');
}

async function findMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...await findMarkdownFiles(p));
    else if (e.isFile() && e.name.endsWith('.md')) files.push(p);
  }
  return files;
}

const dir = process.argv[2] || 'content/library';
const files = await findMarkdownFiles(dir);
let count = 0;

for (const f of files) {
  const orig = await fs.readFile(f, 'utf8');
  const adj = processContent(orig);
  if (adj !== orig) {
    await fs.writeFile(f, adj, 'utf8');
    count++;
    console.log('Reduced: ' + path.relative(dir, f));
  }
}

console.log(`\nTotal: ${count} files changed`);
