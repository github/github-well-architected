<!-- markdownlint-disable MD032 -->
<!-- markdownlint-disable MD034 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD041 -->

[![CI for PR](https://github.com/github/github-well-architected/actions/workflows/pr-check.yml/badge.svg)](https://github.com/github/github-well-architected/actions/workflows/pr-check.yml)
[![CI for GitHub Review](https://github.com/github/github-well-architected/actions/workflows/deploy-merged-pr.yml/badge.svg)](https://github.com/github/github-well-architected/actions/workflows/deploy-merged-pr.yml)
[![CodeQL](https://github.com/github/github-well-architected/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/github/github-well-architected/actions/workflows/github-code-scanning/codeql)

![GH-WAF-Banner](https://user-images.githubusercontent.com/13181456/213116450-422a10b9-7f4e-485b-a027-48b0c33f94ee.png)

## Welcome

This repository maintains the static site for the [GitHub Well-Architected Framework](https://wellarchitected.github.com) and its Content Library. The site provides opinionated, community-driven guidance for adopting and deploying the GitHub platform effectively.

**Quick links:**

- 🌐 [View the site](https://wellarchitected.github.com)
- 💬 [Discussions](https://github.com/github/github-well-architected/discussions)
- 📖 [Contributing Guide](CONTRIBUTING.md)

[🎬 Watch the Teaser video](https://github.com/user-attachments/assets/51fc5744-a61b-4119-8892-bd93b1c26fe8)

---

## Quick start

Get started contributing to the GitHub Well-Architected Framework in three steps:

### 1. Start with GitHub Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/github/github-well-architected)

### 2. Create a new article

Choose a pillar: `productivity`, `collaboration`, `application-security`, `governance`, or `architecture`

```bash
hugo new content library/{PILLAR}/recommendations/{ARTICLE-NAME}.md
```

### 3. View the site

```bash
tools/server
```

Open the site when prompted in Codespaces.

---

## Documentation

For public information about the framework, see the [docs/README](docs/README.md) and directory:

- **[Framework Overview](docs/framework-overview.md)**: Mission, vision, objectives, pillars, and design principles
- **[Taxonomies](docs/taxonomies.md)**: Complete reference for categorizing Content Library articles

---

## Development

We recommend using GitHub Codespaces for the seamless contribution experience. If you prefer to set up your environment locally, follow the instructions below.

### Prerequisites

Before you can run this project locally, you need:

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- [Hugo](https://gohugo.io/getting-started/installing/)

### Setup

Clone this repository (if using HTTPS):

```bash
git clone https://github.com/github/github-well-architected.git
```

Initialize your workspace:

```bash
tools/setup
```

### Running locally

To run the site locally, use the following command:

```bash
export SITE_URL=http://localhost:1313/
tools/server
```

This script starts the Hugo development server and automatically opens the site in your default browser at `http://localhost:1313/`.

- The server watches for changes and reloads the site automatically.
- If you need to specify a different port, set the `PORT` environment variable before running the script:

  ```bash
  PORT=8080 tools/server
  ```

- For troubleshooting, check the terminal output for errors or logs.

### Testing

Set the site URL for tests:

```bash
export SITE_URL=http://localhost:1313/
```

Run all tests:

```bash
tools/test
```

Run only functional tests:

```bash
tools/test --functional
```

Run linter:

```bash
tools/lint
```

Review test output for errors and address any failures before submitting changes.

For more detailed development instructions, including GitHub Codespaces setup, see the [Contributing Guide](CONTRIBUTING.md).

---

## License

This project is licensed under the terms of the MIT open source license. Please refer to the [LICENSE](./LICENSE) file for the full terms.

## Special thanks

Thanks to these [wonderful contributors](docs/contributors.md), as well as authors in Issues and Discussions for their contributions to the success of the GitHub Well-Architected Framework.

![Contributors](docs/contributors-montage.png)
