---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
title: Checklist for Governance
weight: 3
prev: library/governance/design-principles
next: library/governance/recommendations
---

This assessment checklist focuses on evaluating and enhancing the **Governance** aspect of your GitHub environment. It ensures robust access controls, detailed audit logs, clear accountability, and adaptable governance processes, all while keeping policies and procedures simple and effective.

## Auditability

- **Branch Rules:**
  - Ensure teams are well-versed in the intent of branch rules and verify rules are in place.
  - Leverage pull requests and enforce branch rules to maintain code quality.
  - Verify that required status checks are enabled.
  - Ensure code review requirements are set.
  
- **Compliance Checks:**
  - Review compliance checks for code and dependencies.
  - Ensure automated tools are integrated for continuous compliance.

- **Audit Logs:**
  - Check the usage and monitoring of GitHub audit logs for governance.
  - Ensure audit logs are retained for an appropriate period, depending on usage of GitHub Enterprise Cloud/Server or another business application.
  - Regularly review audit logs for unusual activities.

- **Version Control:**
  - Ensure all modifications to documents and code are tracked using version control.
  - Verify that version control policies are enforced.

- **Logging:**
  - Implement continuous logging for all critical resources within the environment.
  - Ensure logs are securely stored and accessible for audits.

- **Custom Properties:**
  - Utilize [custom properties](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/managing-custom-properties-for-repositories-in-your-organization) to manage and categorize repositories.
  - Ensure custom properties are consistently applied across repositories.
  - Regularly review and update custom properties to reflect organizational needs.

## Accountability

- **Role-Based Access Control:**
  - Assess the implementation of role-based access control for repository and organization access.
  - Ensure roles are clearly defined and documented.
  - Create a process for requesting and granting access, and have the timestamps of access requests available.

- **Access Rights Documentation:**
  - Clearly define and document each role's access rights and responsibilities.
  - Regularly review and update access rights documentation.

- **Activity Monitoring:**
  - Regularly monitor user activities to ensure compliance with access policies.
  - Implement alerts for suspicious activities at both the administrative and repository level.

- **Incident Response:**
  - Establish and test incident response procedures for unauthorized access or policy violations.
  - Ensure incident response plans are documented and accessible.

## Adaptability

- **Policy Updates:**
  - Ensure governance policies are regularly reviewed and updated to adapt to new requirements.
  - Involve stakeholders in the policy update process, such as application owners and change managers.

- **Training Programs:**
  - Implement training programs to keep team members updated on governance policies and best practices.
  - Ensure training materials are accessible and up-to-date.

- **Scalability:**
  - Ensure governance processes can scale with the growth of the organization and its projects.
  - Regularly assess and adjust processes to accommodate scaling needs.

- **Feedback Mechanism:**
  - Establish a feedback mechanism to continuously improve governance practices based on user input.
  - Regularly review and act on feedback received.

## Control

- **Access Reviews:**
  - Conduct periodic access reviews to ensure only authorized individuals have access to critical resources.
  - Document and address any discrepancies found during reviews.

- **Configuration Management:**
  - Implement configuration management practices to maintain consistency and control over the environment.
  - Regularly review and update configuration management policies.

- **Backup and Recovery:**
  - Ensure robust backup and recovery processes are in place for critical data and configurations.
  - Regularly test backup and recovery procedures.

- **Compliance Audits:**
  - Regularly perform compliance audits to ensure adherence to governance policies and regulatory requirements.
  - Document and address any findings from compliance audits.

## Additional Checklist Items for GitHub Enterprise Deployments

- **Enterprise Configuration:**
  - Review and configure GitHub Enterprise settings to align with organizational governance policies.
  - Ensure settings are documented and regularly reviewed.

- **High Availability:**
  - Ensure high availability and disaster recovery plans are in place for GitHub Enterprise Server.
  - Regularly test high availability and disaster recovery plans.

- **Security Integrations:**
  - Integrate GitHub Enterprise with existing security tools and frameworks (e.g., SSO, SCIM).
  - Regularly review and update security integrations.

- **Performance Monitoring:**
  - Implement performance monitoring to ensure the GitHub Enterprise environment is running efficiently.
  - Regularly review performance metrics and address any issues.

- **Data Residency:**
  - Ensure data residency requirements are met for GitHub Enterprise deployments.
  - Document and regularly review data residency policies.

- **Custom Policies:**
  - Develop and enforce custom policies specific to the organization's use of GitHub Enterprise.
  - Regularly review and update custom policies.

- **User Provisioning:**
  - Automate user provisioning and de-provisioning to maintain control over access.
  - Regularly review and update user provisioning processes.

- **Support and Maintenance:**
  - Establish a support and maintenance plan for GitHub Enterprise, including regular updates and patches for Server, or communication of features for both Cloud and Server.
  - Ensure support and maintenance plans are documented and accessible.
