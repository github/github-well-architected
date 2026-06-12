# Markdown Includer

This utility replaces `<includeMarkdown>...</includeMarkdown>` tags in markdown files with the contents of the referenced markdown files. You can point the include tag at either a single markdown file or a folder. When the tag points at a folder, the tool reads all `.md` files under that folder recursively, sorts them by path, and inserts their contents separated by blank lines.

## Run the script

From this directory, pass a file or a folder path:

```sh
node includeMarkdown.js ./tests
```

Or with the npm script:

```sh
npm run merge -- ./tests
```

## Run the tests

```sh
npm test
```

## Packaging

This tool is packaged as a small Node.js CLI module.

- The package configuration lives in [src/markdown-includer/package.json](../../../src/markdown-includer/package.json)
- It uses ESM via the `"type": "module"` setting
- The CLI command is exposed through the `bin` entry as `markdown-includer`
- The npm scripts provide shortcuts for running the merge command and the test suite

## Example include tag

```md
<includeMarkdown>mdwithtext1.md</includeMarkdown>
<includeMarkdown>mdwithtext2.md</includeMarkdown>
```

You can also include a folder:

```md
<includeMarkdown>testing3/mdmultiple</includeMarkdown>
```

That folder include expands all markdown files in the folder tree in path-sorted order.
