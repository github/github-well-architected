import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

import { includeMarkdownFiles, includeMarkdownInDirectory } from './includeMarkdown.js';

async function createTempDir() {
  const prefix = path.join(os.tmpdir(), 'markdown-includer-');
  return fs.mkdtemp(prefix);
}

async function writeFile(dir, name, content) {
  const filePath = path.join(dir, name);
  await fs.writeFile(filePath, content, 'utf8');
  return filePath;
}

async function readFile(filePath) {
  return fs.readFile(filePath, 'utf8');
}

test('mergeMarkdownFiles replaces include tag with referenced file content', async () => {
  const dir = await createTempDir();

  await writeFile(dir, 'a.md', '# Title A');
  const output = path.join(dir, 'out.md');

  // Template with inner value pointing at the included file (relative path)
  await writeFile(dir, 'out.md', '<includeMarkdown>a.md</includeMarkdown>');

  const didMerge = await includeMarkdownFiles(output);
  assert.equal(didMerge, true);

  const result = await readFile(output);
  assert.equal(result, '# Title A');
});


test('mergeMarkdownFiles does nothing when marker is missing', async () => {
  const dir = await createTempDir();
  const output = path.join(dir, 'out.md');

  await writeFile(dir, 'out.md', 'No markers here');

  const didMerge = await includeMarkdownFiles(output);
  assert.equal(didMerge, false);

  const result = await readFile(output);
  assert.equal(result, 'No markers here');
});


test('mergeMarkdownFiles does nothing when closing tag is missing', async () => {
  const dir = await createTempDir();
  const output = path.join(dir, 'out.md');

  await writeFile(dir, 'out.md', '<includeMarkdown>a.md');

  const didMerge = await includeMarkdownFiles(output);
  assert.equal(didMerge, false);

  const result = await readFile(output);
  assert.equal(result, '<includeMarkdown>a.md');
});


test('mergeMarkdownFiles replaces multiple include tags in order', async () => {
  const dir = await createTempDir();

  await writeFile(dir, 'one.md', '# One');
  await writeFile(dir, 'two.md', '# Two');

  const output = path.join(dir, 'out.md');
  await writeFile(
    dir,
    'out.md',
    'Header\n\n<includeMarkdown>one.md</includeMarkdown>\n\nMiddle\n\n<includeMarkdown>two.md</includeMarkdown>\n\nFooter'
  );

  const didMerge = await includeMarkdownFiles(output);
  assert.equal(didMerge, true);

  const result = await readFile(output);
  assert.equal(
    result,
    'Header\n\n# One\n\nMiddle\n\n# Two\n\nFooter'
  );
});


test('includeMarkdownInDirectory recursively processes markdown files in nested folders', async () => {
  const dir = await createTempDir();
  const nestedDir = path.join(dir, 'nested', 'deeper');
  await fs.mkdir(nestedDir, { recursive: true });

  await writeFile(dir, 'shared.md', '# Shared');
  const rootOutput = await writeFile(dir, 'root.md', 'Top\n<includeMarkdown>shared.md</includeMarkdown>');
  const nestedOutput = await writeFile(
    nestedDir,
    'nested.md',
    'Inner\n<includeMarkdown>../../shared.md</includeMarkdown>'
  );
  const ignoredFile = await writeFile(
    nestedDir,
    'notes.txt',
    '<includeMarkdown>../../shared.md</includeMarkdown>'
  );

  const mergedCount = await includeMarkdownInDirectory(dir);
  assert.equal(mergedCount, 2);

  assert.equal(await readFile(rootOutput), 'Top\n# Shared');
  assert.equal(await readFile(nestedOutput), 'Inner\n# Shared');
  assert.equal(await readFile(ignoredFile), '<includeMarkdown>../../shared.md</includeMarkdown>');
});


test('mergeMarkdownFiles supports absolute include paths', async () => {
  const dir = await createTempDir();
  const includedFile = await writeFile(dir, 'absolute.md', '# Absolute Content');
  const output = await writeFile(
    dir,
    'absolute-out.md',
    `Before\n<includeMarkdown>${includedFile}</includeMarkdown>\nAfter`
  );

  const didMerge = await includeMarkdownFiles(output);
  assert.equal(didMerge, true);
  assert.equal(await readFile(output), 'Before\n# Absolute Content\nAfter');
});


test('mergeMarkdownFiles expands a directory include into markdown file contents', async () => {
  const dir = await createTempDir();
  const docsDir = path.join(dir, 'docs');
  await fs.mkdir(path.join(docsDir, 'nested'), { recursive: true });

  await writeFile(docsDir, 'b.md', '# B');
  await writeFile(docsDir, 'a.md', '# A');
  await writeFile(docsDir, 'ignore.txt', 'ignored');
  await writeFile(path.join(docsDir, 'nested'), 'c.md', '# C');

  const output = await writeFile(
    dir,
    'folder-out.md',
    'Before\n<includeMarkdown>docs</includeMarkdown>\nAfter'
  );

  const didMerge = await includeMarkdownFiles(output);
  assert.equal(didMerge, true);
  assert.equal(await readFile(output), 'Before\n# A\n\n# B\n\n# C\nAfter');
});


test('includeMarkdownInDirectory processes a single markdown file path', async () => {
  const dir = await createTempDir();
  await writeFile(dir, 'single-source.md', '# Single Source');
  const output = await writeFile(
    dir,
    'single-target.md',
    'Start\n<includeMarkdown>single-source.md</includeMarkdown>'
  );

  const mergedCount = await includeMarkdownInDirectory(output);
  assert.equal(mergedCount, 1);
  assert.equal(await readFile(output), 'Start\n# Single Source');
});


test('includeMarkdownInDirectory ignores a non-markdown file path', async () => {
  const dir = await createTempDir();
  const textFile = await writeFile(dir, 'plain.txt', '<includeMarkdown>ignored.md</includeMarkdown>');

  const mergedCount = await includeMarkdownInDirectory(textFile);
  assert.equal(mergedCount, 0);
  assert.equal(await readFile(textFile), '<includeMarkdown>ignored.md</includeMarkdown>');
});
