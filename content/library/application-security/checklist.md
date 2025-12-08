---
title: Checklist for Application Security
weight: 3
prev: library/application-security/design-principles
next: library/application-security/recommendations
---

This assessment checklist focuses on evaluating and enhancing the **Application Security** aspect of your software development lifecycle, ensuring robust security measures, compliance with regulations, proactive threat mitigation, and fostering a culture of security awareness.

## Security

- **Dependency Scanning:**
  - Ensure automated scanning of dependencies for vulnerabilities.
  - Regularly update dependency scanning tools.
  - Review and address identified vulnerabilities promptly.

- **Code Scanning:**
  - Implement code scanning tools to identify potential security issues.
  - Integrate code scanning into the CI/CD pipeline.
  - Regularly review and update scanning rules and configurations.

- **Secrets Management:**
  - Assess practices for managing secrets and sensitive information.
  - Use secret management tools to store and manage secrets.
  - Regularly rotate secrets and credentials.

- **Security Policies:**
  - Review the presence and enforcement of security policies and guidelines.
  - Ensure policies are accessible to all team members.
  - Regularly update policies to reflect new threats and best practices.

- **Secure Coding Guidelines:**
  - Establish and enforce secure coding guidelines across all development teams.
  - Provide training on secure coding practices.
  - Conduct code reviews to ensure adherence to guidelines.

- **Access Controls:**
  - Implement strict access controls and regularly review permissions.
  - Use role-based access control (RBAC) to limit access to GitHub and other business systems.
  - Regularly audit access logs for suspicious activity for GitHub and other business systems.

## Compliance

- **Regulatory Compliance:**
  - List regulations and standards your organization must comply with (e.g., GDPR, HIPAA).
  - Ensure compliance with relevant regulations and standards (e.g., GDPR, HIPAA).
  - Conduct regular compliance audits.
  - Maintain documentation of compliance efforts.

- **Audit Logging:**
  - Implement comprehensive audit logging for all critical actions and access.
  - Ensure logs are tamper-proof and securely stored, including RBAC for these artifacts.
  - Regularly review audit logs for anomalies.

- **Data Protection:**
  - Verify and/or request data protection practices from GitHub and other business systems.
  - Use strong encryption algorithms and key management practices.
  - Regularly test encryption mechanisms for effectiveness.

- **Incident Response Plan:**
  - Develop and regularly update an incident response plan.
  - Conduct regular incident response drills.
  - Ensure all team members are aware of their roles in the plan.

- **Compliance Training:**
  - Provide regular compliance training for all team members.
  - Include training on new regulations and standards.
  - Track and document training completion.

## Proactivity

- **Threat Modeling:**
  - Conduct regular threat modeling exercises to identify potential vulnerabilities.
  - Involve cross-functional teams in threat modeling.
  - Update threat models to reflect new threats and changes in the environment.

- **Penetration Testing:**
  - Perform regular penetration testing to identify and mitigate security weaknesses.
  - Use both internal and external testers for comprehensive coverage.
  - Address findings from penetration tests promptly.
  - Document and track remediation efforts.

- **Security Updates:**
  - Ensure timely application of security patches and updates.
  - Automate patch management where possible.
  - Maintain an inventory of all software and hardware to track updates.

- **Vulnerability Management:**
  - Implement a robust vulnerability management program.
  - Regularly scan for vulnerabilities in applications and infrastructure.
  - Prioritize and remediate identified vulnerabilities based on risk.

- **Security Monitoring:**
  - Deploy continuous security monitoring tools to detect and respond to threats in real-time.
  - Set up alerts for suspicious activities.
  - Regularly review and update monitoring configurations.

## Awareness

- **Security Training:**
  - Provide ongoing security training and awareness programs for all employees.
  - Include training on the latest security threats and best practices.
  - Track and document training completion.

- **Phishing Simulations:**
  - Conduct regular phishing simulations to educate employees on recognizing phishing attempts.
  - Analyze results and provide feedback to employees.
  - Adjust training based on simulation outcomes.

- **Security Champions:**
  - Establish a security champions program to promote security best practices within teams.
  - Provide additional training and resources to security champions.
  - Recognize and reward contributions from security champions.

- **Communication Channels:**
  - Create clear communication channels for reporting security incidents and concerns.
  - Ensure anonymity for those reporting security issues.
  - Regularly review and improve communication processes.

- **Security Culture:**
  - Foster a culture of security awareness and responsibility across the organization.
  - Encourage open discussions about security.
  - Integrate security into all aspects of the development lifecycle.

## Additional Checklist Items for GitHub Enterprise Deployments

- **GitHub Enterprise Configuration:**
  - Ensure GitHub Enterprise is configured according to best practices for security and compliance.
  - Name individuals responsible for GitHub Enterprise configuration and establish regular communication with GitHub Support, Services, and Partners.
  - Regularly review and update configuration settings as needed.
  - Document configuration changes and approvals.

- **SSO Integration:**
  - Implement Single Sign-On (SSO) for GitHub Enterprise.
  - Ensure SSO configurations are secure and regularly reviewed.
  - Provide training on SSO usage and benefits.

- **Backup and Recovery for GitHub Enterprise Server:**
  - Establish and regularly test backup and recovery procedures for GitHub Enterprise data.
  - Ensure backups are stored securely.
  - Document backup and recovery processes.
  - Regularly test not only backups, but also restores into a staging environment.

- **Network Security:**
  - Implement network security measures such as VPNs and firewalls to protect GitHub Enterprise instances.
  - Regularly review and update network security configurations.
  - Monitor network traffic for suspicious activities.

- **User Provisioning:**
  - Automate user provisioning and de-provisioning to ensure timely access management, such as using SCIM.
  - Regularly review user access and permissions.
  - Implement two-factor authentication (2FA) for all users.

- **Custom Security Policies:**
  - Develop and enforce custom security policies specific to your GitHub Enterprise environment.
  - Regularly review and update security policies.
  - Ensure policies are communicated to all relevant stakeholders.

- **API Security:**
  - Secure GitHub Enterprise APIs with appropriate authentication and authorization mechanisms.
  - Monitor API usage for anomalies.
  - Establish proper best practice guidelines for API usage, including token usage.

- **Monitoring and Alerts:**
  - Set up monitoring and alerting for unusual activities within GitHub Enterprise.
  - Regularly review and update monitoring rules and audit logs.
  - Ensure alerts are actionable and promptly addressed.

- **Data Residency:**
  - Ensure compliance with any data residency requirements, especially when replicating with GitHub Enterprise Server.
  - Regularly review data residency configurations.
  - Document data residency policies and procedures.

- **Third-Party Integrations:**
  - Review and secure third-party integrations with GitHub Enterprise to prevent potential security risks.
  - Regularly assess the security of third-party integrations.
  - Ensure third-party providers comply with your security standards.

### Scalability

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

### Resiliency

- **Fault Tolerance:**
  - Regularly test disaster recovery procedures to ensure they work as expected.
  - Verify that test results are documented and reviewed.
  - Ensure that any issues identified during testing are addressed.

- **Data Replication:**
  - Implement data replication strategies to ensure data is not lost in the event of a disaster.
  - Verify that replication processes are monitored.
  - Ensure that replicated data is consistent and up-to-date.

### Modularity

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

### Interoperability

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

### Simplicity

- **Code Simplicity:**
  - Ensure that codebases are simple and easy to understand.
  - Verify that code follows best practices and coding standards.
  - Check for the use of code reviews to maintain code quality.
  - Ensure that code is well-documented.

- **System Design:**
  - Design systems to be as simple as possible while meeting requirements.
  - Verify that system architectures are straightforward and easy to understand.
  - Ensure that system configurations are straightforward and easy to manage.
  - Check for the use of design patterns that promote simplicity.

- **Documentation:**
  - Maintain clear and concise documentation for all systems and processes.
  - Verify that documentation is up-to-date and accessible.
  - Ensure that documentation includes examples and use cases.
  - Check for the use of documentation tools to manage and publish documentation.

### Observability

- **Logging:**
  - Implement comprehensive logging to track system behavior and issues.
  - Verify that logs are stored securely and are accessible for analysis.
  - Ensure that log retention policies are in place.
  - Check for the use of log aggregation tools.
