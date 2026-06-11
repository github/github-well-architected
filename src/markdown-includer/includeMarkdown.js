import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Check whether the output file already exists.
 */
export async function mainMarkdownExists(mainMarkdown) {
  try {
    await fs.access(mainMarkdown);
    return true;
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}

/**
 * Merge a single Markdown file into the template at outputPath.
 * The template must contain <includeMarkdown>relative/or/absolute/path.md</includeMarkdown>.
 * If sourceDir is provided, reads from source based on relative path and writes to output.
 */
export async function includeMarkdownFiles(outputPath, sourceBaseDir = null, outputBaseDir = null) {
  const marker = '<includeMarkdown>';
  const endMarker = '</includeMarkdown>';

  // Determine read path and output path
  let readPath = outputPath;
  if (sourceBaseDir && outputBaseDir) {
    // Compute relative path within output directory
    const relPath = path.relative(outputBaseDir, outputPath);
    readPath = path.resolve(sourceBaseDir, relPath);
  }

  // Only add markdown when the marker is present. If there's no
  // existing file or the marker is missing, leave the file unchanged.
  const exists = await mainMarkdownExists(readPath);
  if (!exists) {
    console.log(`File ${readPath} does not exist`);
    return false;
  }

  let existing = await fs.readFile(readPath, 'utf8');
  if (!existing.includes(marker)) {
    console.log(`No ${marker} marker found in ${readPath}`);
    return false;
  }

  console.log(`Found ${marker} marker in ${readPath}`);
  let current = existing;
  let didMerge = false;
  let searchFrom = 0;

  while (true) {
    const startIndex = current.indexOf(marker, searchFrom);
    if (startIndex === -1) {
      break;
    }

    const endIndex = current.indexOf(endMarker, startIndex + marker.length);
    if (endIndex === -1) {
      console.log(`No closing ${endMarker} marker found in ${readPath}`);
      break;
    }

    const inner = current.slice(startIndex + marker.length, endIndex).trim();
    console.log(`Inner value between ${marker} and ${endMarker} in ${readPath}: ${inner}`);

    const includePath = path.resolve(path.dirname(readPath), inner);
    const includedContent = await getIncludedMarkdownContent(includePath, sourceBaseDir, outputBaseDir, readPath);
    const before = current.slice(0, startIndex);
    const after = current.slice(endIndex + endMarker.length);
    current = `${before}${includedContent}${after}`;
    didMerge = true;
    searchFrom = before.length + includedContent.length;
  }

  if (!didMerge) {
    return false;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, current, 'utf8');
  return true;
}

async function getIncludedMarkdownContent(targetPath, sourceBaseDir = null, outputBaseDir = null, contextReadPath = null) {
  // Adjust targetPath if we're reading from source base
  let readPath = targetPath;
  if (sourceBaseDir && outputBaseDir && contextReadPath) {
    // The targetPath is computed from readPath (source), so we can use it as-is
    readPath = targetPath;
  }

  const stats = await fs.stat(readPath);

  if (stats.isFile()) {
    return fs.readFile(readPath, 'utf8');
  }

  if (!stats.isDirectory()) {
    return '';
  }

  const markdownFiles = (await getMarkdownFiles(readPath)).sort((left, right) => left.localeCompare(right));
  const contents = await Promise.all(markdownFiles.map((markdownFile) => fs.readFile(markdownFile, 'utf8')));
  return contents.join('\n\n');
}

async function getMarkdownFiles(targetPath) {
  const stats = await fs.stat(targetPath);

  if (stats.isFile()) {
    return path.extname(targetPath).toLowerCase() === '.md' ? [targetPath] : [];
  }

  if (!stats.isDirectory()) {
    return [];
  }

  const entries = await fs.readdir(targetPath, { withFileTypes: true });
  const markdownFiles = [];

  for (const entry of entries) {
    const fullPath = path.join(targetPath, entry.name);

    if (entry.isDirectory()) {
      markdownFiles.push(...await getMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.md') {
      markdownFiles.push(fullPath);
    }
  }

  return markdownFiles;
}

export async function includeMarkdownInDirectory(sourcePath, outputPath = null) {
  const sourceDir = outputPath ? sourcePath : null;
  const workDir = outputPath || sourcePath;

  // Resolve to absolute paths for proper path resolution
  const sourceAbsolute = path.resolve(sourceDir || workDir);
  const outputAbsolute = path.resolve(workDir);

  // If outputPath is specified, copy the directory structure first
  if (outputPath) {
    console.log(`Copying ${sourcePath} to ${outputPath}...`);
    await copyDirectory(sourcePath, outputPath);
  }

  const markdownFiles = await getMarkdownFiles(workDir);
  let mergedCount = 0;

  for (const markdownFile of markdownFiles) {
    const didMerge = await includeMarkdownFiles(markdownFile, sourceAbsolute, outputAbsolute);
    if (didMerge) {
      console.log(`Merged content into ${markdownFile}`);
      mergedCount += 1;
    }
  }

  return mergedCount;
}

async function copyDirectory(source, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destPath);
    } else {
      await fs.copyFile(sourcePath, destPath);
    }
  }
}

async function main(argv) {
  const args = argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: node includeMarkdown.js <source-path> [output-path]');
    console.error('  If output-path is provided, source is copied and processed there');
    console.error('  If output-path is omitted, source is processed in-place');
    process.exit(1);
  }

  // Resolve paths from current working directory before we change it
  const sourcePathArg = path.resolve(args[0]);
  const outputPathArg = args[1] ? path.resolve(args[1]) : null;

  try {
    const mergedCount = await includeMarkdownInDirectory(sourcePathArg, outputPathArg);
    console.log(`Processed ${mergedCount} markdown file(s)`);
  } catch (err) {
    console.error('Error merging markdown files:', err);
    process.exit(1);
  }
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  main(process.argv);
}
