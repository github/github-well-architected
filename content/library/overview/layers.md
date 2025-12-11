---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
title: Layers of GitHub Well-Architected
weight: 1
prev: library/overview
next: library/overview/about-the-assessment
---

<!-- markdownlint-disable MD001 -->

GitHub Well-Architected is structured in a fundamental, layered approach:

- [Pillars](#pillars)
- [Design principles](#design-principles)
- [Checklists](#checklists)
- [Recommendations](#recommendations)

### Pillars

The foundation of GitHub Well-Architected is structured around its **pillars**:

1. **Productivity:** Strategies and tools to enhance team efficiency and streamline workflows.
1. **Collaboration:** Best practices for using GitHub to foster collaboration within and across teams.
1. **Application Security:** Guidelines for integrating security into every phase of the development process.
1. **Governance:** Principles for managing access, compliance, and governance within GitHub projects.
1. **Architecture:** Approaches for designing scalable, resilient, and efficient GitHub-based development environments, including **GitHub Enterprise Server (GHES)**.

It is important to have a comprehensive understanding of the pillar and its subsequent layers. This will ensure comprehension of specific recommendations are understood in the context of the overall system. Future releases may encompass additional pillars.

### Design Principles

Move into each pillar's **design principles** to achieve their specific goals.
Each pillar is supported by design principles that provide the "how" to achieve the "what" of each pillar, guiding teams toward achieving their goals effectively.

Within each principle, follow the approaches to craft your design strategy. These approaches must be weighed for your specific needs and business requirements.

Design principles are incredibly valuable and foundational to the framework. They provide:

- **Consistency and Standardization:** Design principles provide a consistent framework for decision-making. This consistency helps in standardizing processes, tools, and practices across different projects, leading to a more unified and predictable system architecture.
- **Guidance for Trade-offs:** In any architecture, trade-offs are inevitable. Design principles help you make informed decisions by providing a clear set of priorities and values, such as performance vs. cost or security vs. usability.
- **Alignment with Business Goals:** Well-defined design principles ensure that the technical architecture aligns with the organization's strategic goals. They help bridge the gap between business objectives and technical implementation, ensuring that the architecture supports the overall mission.
- **Scalability and Flexibility:** Design principles guide the development of systems that can scale and adapt to changing requirements. By adhering to principles like modularity, loose coupling, and separation of concerns, the architecture becomes more adaptable to future needs.
- **Risk Mitigation:** Mitigate risks by promoting best practices around security, reliability, and performance. For example, principles around redundancy and failover can help in building more resilient systems.
- **Facilitation of Innovation:** By establishing a solid foundation, design principles allow teams to innovate more freely within a defined framework. This encourages creativity while still ensuring that innovations are sustainable and maintainable.
- **Documentation and Communication:** Clear design principles make it easier to document and communicate the architecture to stakeholders. This transparency helps in getting buy-in from both technical and non-technical audiences.
- **Long-term Maintainability:** Design principles help in building systems that are easier to maintain over the long term. By focusing on principles like simplicity and clarity, the architecture is less likely to become overly complex or difficult to manage.

In a Well-Architected Framework, design principles are not just abstract concepts but actionable guidelines that shape every aspect of the architecture, from the choice of technologies to the deployment strategies and operational practices. They form the backbone of a resilient, efficient, and future-proof system.

### Checklists

Each pillar's **checklists** provide a set of questions and data points to consider to help you evaluate your current practices and identify areas for improvement.
These should be considered the starting point for an assessment or evaluation. Organizations will organically evolve over time and will initially measure differently based on their current state.
This will help to seed any needed changes and improvements.

Checklists serve as a practical tool to ensure the architecture adheres to guidelines. They accomplish the following:

- **Operationalize the design principles:** They help translate abstract design principles into specific, actionable, measurable tasks that can be systematically evaluated.
- **Consistency across reviews:** Checklists can understand assessment outputs consistently across teams and timeframes. They are also repeatable as the system evolves.
- **Identifying gaps and risks:** They help identify areas where the system may be lacking or deviating from the design principles, which can highlight risks. Regular assessment can help identify these risks early and address them before they become critical.
- **Facilitation of communication:** They provide a clear and concise way to communicate the state of the architecture to stakeholders. By presenting the results of the assessment in a structured format, it is easier to understand the current state, identify areas for improvement, and track progress over time.
- **Guidance for continuous improvement:** Create a feedback loop that helps in continuous improvement of the architecture, encouraging teams to regularly reflect on their work and make adjustments as needed.
- **Support for decision making:** Help in prioritizing remediation efforts and resource allocation for any areas that need improvement with respect to the design principles. They also serve as a guide to ensure trade-offs don't compromise the overall architecture.
- **Alignment with best practices:** Adhere to industry best practices and standards by providing a structured way to evaluate the architecture against well-established guidelines. This can help in ensuring that the architecture is up-to-date and compliant with the latest requirements, and additionally provide a channel for continuous learning.

### Recommendations

The **recommendations** are Content Library articles centered on scenario-based recommendations and tradeoffs.
They provide detailed guidance on how to implement the design principles and checklists in real-world scenarios.
By design they are opinionated, prescriptive, and detailed to help you understand the trade-offs and decisions that need to be made, and can be adapted to meet the unique needs of organizations.

These articles provide the following:

- **Contextual relevance:** Tailored guidance on specific scenarios that bring tangibility between the design principles and technologies. They bridge the gap between theory and practice with practical scenarios.
- **Addressing common pitfalls:** Providing even more detailed scenario descriptions to help avoid common pitfalls, and providing guidance on how to address them.
- **Validation of best practices:** Recommendations based on field observations are not just theoretical; they are validated by actual experiences. This lends credibility to the guidance, and provides a way for GitHub's Partners to demonstrate their expertise and experience.
- **Enhanced understanding and decision making:** A structured way to explore different architectural decisions and their outcomes. By presenting a range of scenarios with corresponding recommendations, the framework can help users make informed choices that align with their specific context.
- **Practical implementation guidance** Detailed, step-by-step guidance on how to implement recommendations. This can include everything from initial setup to long-term maintenance.
- **Improved communication with stakeholders:** By providing a variety of scenarios, the framework can offer customizable solutions that users can adapt to their specific needs. The utility of the framework is enhanced by the ability to tailor the guidance to different audiences, such as technical vs. non-technical stakeholders.
- **Feedback loop for continuous learning:** Observations from the field can provide a feedback loop for continuous learning and improvement of the framework. As new scenarios are encountered, the framework can be updated with fresh insights and recommendations.
