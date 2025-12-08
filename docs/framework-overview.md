# GitHub Well-Architected Framework Overview

## Mission

The [GitHub Well-Architected Framework](https://wellarchitected.github.com) provides **community-driven guidance** to help organizations adopt and deploy GitHub effectively.
Our goal is to foster **opinionated, prescriptive best practices, design principles, and strategic insights** that empower teams to:

- Maximize GitHub’s potential
- Drive measurable business outcomes
- Build a collaborative, efficient, and secure development environment

This framework embraces open-source principles, inviting contributions from customers, partners, and the community to shape the future of software development.

> [!IMPORTANT]
> While this framework is prescriptive, **GitHub Docs remains the primary source of truth for implementation details**.

## Vision

💬 _["Just as GitHub was founded on Git, today we are re-founded on Copilot"](https://www.youtube.com/watch?v=NrQkdDVupQE&t=355s)_

Our vision is a **living, breathing, evolving, AI-driven experience** that equips customers, partners, and the GitHub ecosystem with tools and guidance for successful platform implementation and adoption.

It consists of two core components:

### 📚 Explore, Self-Serve, and Learn

- A **self-service experience** via [https://wellarchitected.github.com](https://wellarchitected.github.com/)
- A **searchable content library** with best practices, assessment findings, and ongoing data insights
- A foundation for **Copilot Service training** and learning milestones

### 🔭 Assessment Checklists

- Guided pathways for working with GitHub experts, partners, and Microsoft
- Tools to **assess environments**, **track progress**, and **share results**

Whether in the context of contributing or leveraging the framework to ship, we practice [First do it, then do it right, then do it better](https://addyo.substack.com/p/first-do-it-then-do-it-right-then).

---

## Objectives

- **Inclusive development**: Foster collaboration between GitHub, partners, and customers
- **Close the feedback loop**: Share lessons learned and trade-offs from the field
- **Build confidence and skills**: Provide reference architectures and best practices
- **Drive adoption success**: Enable personal engagement from GitHub and partners

---

## The five pillars

The framework is built around five key pillars that represent critical aspects of GitHub usage:

| Pillar                   | Description                                                                                                                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Productivity**         | Accelerate development workflows in speed and efficiency. It could include principles such as automation, continuous integration/continuous deployment (CI/CD), and the use of GitHub features like Actions and Packages. |
| **Collaboration**        | Enhance teamwork within and across teams. It could involve principles related to pull requests, code reviews, project boards, and other collaborative features of GitHub.                                                 |
| **Application Security** | Secure applications. It could include principles related to using GitHub's security features like Dependabot, security advisories, and code scanning.                                                                     |
| **Governance**           | Managing compliance and controls. It could involve principles related to permissions, access controls, and audit logs.                                                                                                    |
| **Architecture**         | Design, structure, and deploy GitHub environment to meet organization's needs, and addressing technical concepts such as scalability, reliability, and efficiency.                                                        |

---

## Layers of GitHub Well-Architected

The framework is structured into **three interconnected layers** that work together to provide comprehensive guidance. Understanding these layers ensures consistency and alignment as the framework evolves.

### The Three Layers

#### 1. Pillars

Pillars define the **“what”** — the broad areas of focus critical to a successful GitHub deployment. Each pillar represents a strategic outcome and organizes related principles and practices.
_Example:_ The **Productivity** pillar focuses on accelerating workflows through automation and integration.

**What qualifies as a pillar?**

- Broad, critical area impacting overall success
- Enables consistent application of best practices

**What does not qualify?**

- Too narrow or specific
- Minimal influence on system-wide outcomes

Pillars are **interdependent**. For example, optimizing for **Collaboration** may influence **Governance** requirements.

#### 2. Design Principles

Principles define the **“how”** - the fundamental concepts and strategies that guide decisions within each pillar. They provide actionable direction for deploying GitHub effectively.
_Example:_ Automate repetitive tasks, integrate CI/CD pipelines.

#### 3. Recommendations

Recommendations translate principles into **opinionated and prescriptive actions**. They provide practical guides for implementing GitHub in alignment with the framework’s pillars and principles.

### How The Layers Work Together

- **Pillars** set the strategic focus.
- **Design principles** guide decisions within each pillar.
- **Recommendations** turn strategy into action.

This layered approach ensures guidance is **cohesive, scalable, and adaptable** as GitHub evolves.

---

## How Does GitHub's Well-Architected Compare?

### GitHub Well-Architected Framework vs GitHub Docs

The Well-Architected Framework complements GitHub Docs by providing design thinking around decisions beyond simply turning on products and features.

- **GitHub Docs** covers implementation and configuration instructions for the GitHub platform
- **GitHub Well-Architected** provides design thinking and strategic guidance for decisions beyond simply turning on products and features

GitHub Well-Architected is self-serve opinionated content and checklist of expert insights from GitHub, Partners, and community.

### GitHub Well-Architected vs Azure / AWS Well-Architected Frameworks

- **Azure / AWS** focus on **cloud adoption** with design areas specific to cloud infrastructure platform and services.
- **GitHub** emphasizes **developer experience and platform adoption** with design principles focused on how teams use GitHub effectively

While inspired by established cloud frameworks, GitHub's Well-Architected Framework is uniquely tailored to developer experience and engineering system success.

---

## References and other resources

The GitHub Well-Architected Framework specifically provides an OSS-style, community-driven approach to articulating best practices around deployment of GitHub Enterprise and topics around creating a secure and resilient environment. It supplements additional resources that are available from GitHub and the Partner ecosystem, including (but not limited to):

- [Resources and articles](https://resources.github.com): A collection of public resources and articles from GitHub
  - [GitHub Learning Pathways](https://resources.github.com/learn/pathways): Expert-guided learning pathways, accompanied by insights from industry leaders
  - [GitHub Documentation](https://docs.github.com): Main documentation site for GitHub
  - [GitHub Certifications](https://resources.github.com/learn/certifications): The starting point to become GitHub Certified
- [GitHub Blog](https://github.blog): The latest news from GitHub
  - [Changelog](https://github.blog/changelog): The latest updates to GitHub
- [GitHub Community Discussions](https://github.community): A place for the GitHub community to engage and share ideas
- [GitHub Support](https://support.github.com): The official GitHub Support site
- **Partner pages:**
  - [Partner portal](https://github.com/githubpartners/portal): A resource to direct Partners to key content
  - [Partner community](https://github.com/githubpartners/Partner-Community): A place for partners to share learning and conduct enablement
