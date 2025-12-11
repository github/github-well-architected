---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
title: Checklist for Architecture
weight: 3
prev: library/architecture/design-principles
next: library/architecture/recommendations
---

<!-- markdownlint-disable MD013 -->

This assessment checklist focuses on evaluating and enhancing the **Architecture** aspect of your systems, ensuring they are designed for scalability, resiliency, efficiency, disaster recovery, modularity, interoperability, simplicity, and observability. By adhering to core design principles, this checklist aims to help you build robust, agile, and scalable infrastructure that aligns with long-term vision and growth.

{{< callout type="info" >}}
There will be clear differences between GitHub Enterprise Cloud and Server to consider, primarily due to Server being an on-premises self-hosted product.
{{< /callout >}}

## Scalability

- **Repository Structure:**
  - Assess the organization and structure of repositories for clarity and scalability.
  - Determine whether repositories follow a naming convention, and ensure all repositories have a description.
  - Check for the use of [custom properties](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/managing-custom-properties-for-repositories-in-your-organization) to dynamically manage and enforce.
  - Verify that repositories are appropriately segmented as to avoid monolithic structures unnecessarily, or determine the necessity of such an architecture.
  - Check for the use of branch protection rules to maintain code quality.

- **Code Modularity:**
  - Evaluate the modularity of the codebase for maintainability and scalability.
  - Ensure that code modules are reusable and loosely coupled.
  - Promote usage of design patterns that promote modularity.
  - Verify that dependencies between modules are well-documented.

- **Tech Stack Consistency:**
  - Review the consistency of the technology stack across projects for efficiency and interoperability.
  - Ensure that the tech stack is standardized to reduce complexity.
  - Verify that the chosen technologies are well-supported and have a strong community.
  - Check for the use of version control to manage tech stack dependencies.

- **Resource Management:**
  - Ensure ephemeral resources can be recreated on-demand.
  - Ensure non-ephemeral compute resources contains sufficient headroom from growth and scale.
  - Implement a load balancer to direct traffic to the appropriate resources.
  - Verify that the system can handle increased load without performance degradation.
  - Check for the use of scalable storage solutions.

## Resiliency

- **Fault Tolerance:**
  - Ensure systems can continue to operate in the event of a failure.
  - Verify that backup and restore procedures are in place and tested regularly.
  - Minimize/eliminate configuration drift between environments.

- **Backup and Restore:**
  - Ensure that backup and restore procedures are in place and tested regularly.
  - Verify that backups are stored securely and can be restored quickly.
  - Check for the use of automated backup solutions.
  - Regularly test restore procedures to staging environments to ensure they work as expected and to be able to test new product features.

- **High Availability:**
  - Implement high availability configurations to minimize downtime.
  - Verify that failover mechanisms are in place and tested.
  - Ensure that critical components have redundancy.

## Efficiency

- **Performance Monitoring:**
  - Continuously monitor system performance and optimize as needed.
  - Ensure efficient use of resources to avoid waste.
  - Automate repetitive tasks to improve efficiency and reduce human error.
  - Check for the use of performance profiling tools to identify bottlenecks.

- **Resource Utilization:**
  - Ensure efficient use of resources to avoid waste.
  - Verify that resource allocation is optimized.
  - Check for the use of resource management tools.

- **Automation:**
  - Automate repetitive tasks to improve efficiency and reduce human error.
  - Verify that automation scripts are well-documented.
  - Ensure that automation tools are regularly updated.

- **Simplicity**
  - Design systems to be as simple as possible while meeting requirements.
  - Verify that system architectures are straightforward and easy to understand.
  - Ensure that system configurations are straightforward and easy to manage.
  - Check for the use of design patterns that promote simplicity.

- **Documentation**
  - Maintain clear and concise documentation for all systems and processes.
  - Verify that documentation is up-to-date and accessible.
  - Ensure that documentation includes examples and use cases.
  - Check for the use of documentation tools to manage and publish documentation.

## Disaster Recovery

- **Disaster Recovery Plan:**
  - Develop and maintain a disaster recovery plan.
  - Regularly test disaster recovery procedures to ensure they work as expected.
  - Implement data replication strategies to ensure data is not lost in the event of a disaster.
  - Verify that disaster recovery plans include clear roles and responsibilities.
  - Be able to recover git repositories in the event users erroneously force push.

- **Regular Testing:**
  - Regularly test disaster recovery procedures to ensure they work as expected.
  - Verify that test results are documented and reviewed.
  - Ensure that any issues identified during testing are addressed.

- **Data Replication:**
  - Implement data replication strategies to ensure data is not lost in the event of a disaster.
  - Verify that replication processes are monitored.
  - Ensure that replicated data is consistent and up-to-date.

## Modularity

- **Service Separation:**
  - Ensure that application services are modular and can be developed, deployed, and scaled independently.
  - Verify that modules have clear and well-defined interfaces.

- **Codebase Modularity:**
  - Assess the modularity of codebases to facilitate easier updates and maintenance.
  - Ensure that code modules are reusable and loosely coupled.
  - Check for the use of design patterns that promote modularity.
  - Verify that dependencies between modules are well-documented.

- **Microservices Architecture:**
  - Consider using a microservices architecture where appropriate.
  - Verify that microservices are independently deployable.
  - Ensure that microservices communicate effectively with each other.
  - Check for the use of service discovery mechanisms.

## Interoperability

- **API Integration:**
  - Ensure that APIs are well-documented and can be easily integrated with other systems.
  - Verify that APIs follow industry standards.
  - Ensure that APIs are versioned and backward compatible.
  - Check for the use of API gateways to manage and secure APIs.

- **Standards Compliance:**
  - Ensure compliance with industry standards to facilitate interoperability.
  - Ensure compliance with license obligations for open sourced and vendor-managed software packages.
  - Verify that systems are compatible across different platforms and environments.
  - Check for the use of middleware to facilitate communication between different systems.
  - Ensure that data formats are standardized.

- **Cross-Platform Compatibility:**
  - Verify that systems are compatible across different platforms and environments.
  - Ensure that cross-platform testing is performed regularly.
  - Check for the use of platform-agnostic technologies.
  - Verify that system dependencies are well-documented.

## Observability

- **Logging:**
  - Implement comprehensive logging to track system behavior and issues.
  - Verify that logs are stored securely and are accessible for analysis.
  - Ensure that log retention policies are in place.
  - Check for the use of log aggregation tools.

- **Monitoring:**
  - Use monitoring tools to gain insights into system performance and health.
  - Verify that monitoring dashboards are set up and regularly reviewed.
  - Ensure that monitoring alerts are configured and actionable.
  - Check for the use of monitoring tools that support anomaly detection.

- **Alerting:**
  - Set up alerting mechanisms to notify relevant teams of issues in real-time.
  - Verify that alert thresholds are appropriately configured.
  - Ensure that alerts are actionable and include relevant context.
  - Check for the use of alert management tools to handle alert fatigue.

## Additional Checklist Items for GitHub Enterprise Deployments

### GitHub Enterprise Cloud

- **User Management:**
  - Ensure that user management practices are in place, including role-based access control and regular audits.
  - Verify that user permissions are regularly reviewed and updated.
  - Check for the use of single sign-on (SSO) for user authentication.

- **Security Compliance:**
  - Verify that security measures comply with organizational and regulatory requirements.
  - Ensure that security policies are documented and enforced.

- **Custom Integrations:**
  - Assess the need for custom integrations and ensure they are implemented securely and efficiently.
  - Verify that custom integrations are documented and maintained.
  - Ensure that custom integrations do not introduce security vulnerabilities.

- **Data Residency:**
  - Ensure that data residency requirements are met.
  - Verify that data storage locations comply with regional regulations.
  - Check for the use of data localization strategies where necessary.

### GitHub Enterprise Server

- **User Management:**
  - Ensure that user management practices are in place, including role-based access control and regular audits.
  - Verify that user permissions are regularly reviewed and updated.
  - Check for the use of single sign-on (SSO) for user authentication.

- **Security Compliance:**
  - Verify that security measures comply with organizational and regulatory requirements.
  - Ensure that security policies are documented and enforced.

- **Custom Integrations:**
  - Assess the need for custom integrations and ensure they are implemented securely and efficiently.
  - Verify that custom integrations are documented and maintained.
  - Ensure that custom integrations do not introduce security vulnerabilities.

- **Network Configuration:**
  - Ensure that network configurations are optimized for performance and security.
  - Verify that firewalls and security groups are properly configured.
  - Ensure that network traffic is monitored and analyzed for potential threats.

- **Maintenance and Updates:**
  - Regularly apply updates and patches to maintain security and performance.
  - Ensure that maintenance windows are scheduled and communicated to stakeholders.
  - Verify that update procedures are documented and tested.

- **Scalability Planning:**
  - Plan for hardware scalability to accommodate future growth.
  - Ensure that capacity planning is regularly reviewed and updated.
  - Check for the use of scalable infrastructure components.

- **Backup Solutions:**
  - Implement robust backup solutions tailored to the on-premises nature.
  - Verify that backup procedures are documented and tested.
  - Ensure that backups are stored securely and can be restored quickly.
