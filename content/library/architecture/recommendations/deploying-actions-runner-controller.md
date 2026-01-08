---
draft: false
title: 'Deploying Actions Runner Controller'
publishDate: 2025-12-19
params:
  # Add and remove authors as needed. Please reserve authorship for significant contributions, not edits and feedback.
  authors: [
    {name: "Ken Muse", handle: "kenmuse"},
  ]

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - architecture

# The areas of the GitHub adoption journey. Inspiration taken from docs.github.com
areas:
  - ci-cd-and-devops
  - security

# Classifications of industries who may be at different stages of the customer journey.
verticals:
  - automotive
  - manufacturing
  - finance
  - gaming
  - media
  - government
  - information-technology
  - smb-corporate

# Individuals in key roles on the customer journey, typically consisting of one or more administrators and the end-user community.
personas:
  - administrator
  - developer

# Deployment options for GitHub Enterprise, including Cloud (GHEC), Server (GHES), and Hybrid.
platform:
  - github-enterprise-cloud
  - github-enterprise-cloud-plus-emu
  - github-enterprise-server

# GitHub product functions designed to support every stage of development.
features:
  - github-actions

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - best-practice
  - governance-and-policy
  - insights-and-metrics
  - performance-engineering
  - workflow

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - customer-success-architect
  - engineering-and-product
  - enterprise-support
  - expert-services
  - fast-track
---

<!-- This disables the linting rule for multiple top-level headers -->
<!-- markdownlint-disable MD025 -->

<!--
See our CONTRIBUTING doc for submission details and additional writing style guidelines: https://github.com/github/github-well-architected-internal/blob/main/.github/CONTRIBUTING.md
-->

## Scenario overview

When making the decision to deploy self-hosted runners for GitHub Actions, organizations must consider how to best manage and scale those runners. The [Actions Runner Controller (ARC)](https://docs.github.com/en/enterprise-cloud@latest/actions/concepts/runners/actions-runner-controller) is an open-source project that provides a Kubernetes-based solution for deploying and managing self-hosted runners. This article outlines recommendations for deploying ARC in a scalable and maintainable manner.

{{< callout type="warning" >}}
Users are responsible for the security of their clusters and the workloads running on them. Securing a Kubernetes cluster, the underlying nodes, and the network resources is a complex task that requires expert-level knowledge. Ensure appropriate network segmentation and monitoring are in place, and follow zero-trust principles when granting access to resources. ARC does not provide any additional built-in security features beyond those provided by Kubernetes and the underlying infrastructure.

Users are also responsible for any network ingress or egress costs associated with their self-hosted runners.
{{< /callout >}}

## Assumptions and preconditions

ARC follows Linux best practices, so it is optimized for a primary task: providing scaling decisions. All of the other functionality relies on Kubernetes. This includes orchestration/queuing, scheduling, scaling, and reliability. As a result, most issues users encounter with ARC are actually Kubernetes configuration or management issues.

When considering ARC, it is essential to have someone on the team who has expert-level experience with administrating, tuning, scaling, and troubleshooting Kubernetes clusters. Preferably, this individual should be a [Certified Kubernetes Administrator (CKA)](https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/) and have hands-on experience optimizing and scaling stateful, job-based workloads.

ARC does not support preemption or spot instances, and it assumes that once a runner is assigned a job, that job will complete without interruption. Running out of resources or having a node terminated can lead to failed jobs or "stuck" jobs which must wait for a timeout to recover.

## Key implementation strategies

### Maintainability

- **Use Infrastructure as Code (IaC).**
  Deploy ARC and your Kubernetes cluster using IaC tools. This has multiple benefits and is the easiest way to test/apply/and manage configuration changes, ensure consistency across environments, and maintain multiple instances. It also eliminates the need for backup solutions, as the entire configuration is stored in code and can be easily reapplied or recreated. Using tools like `helmfile`, Terraform, ARM/Bicep, and CloudFormation (along with some helper scripts) can make it easy to manage complex deployments.

- **Consider multiple clusters.**
  If you're hosting with a cloud provider, a single virtual machine (node) generally costs more than than starting a new cluster. Clusters have limits on the number of supported resources and service requests, and they are often constrained by how many requests the Kubernetes API server can coordinate. As a result, multiple smaller clusters optimized for specific workloads may be more efficient and cost effective than a single large cluster, especially when dealing with larger numbers of scale sets and runners with different resource requirements. Clusters also define a separate security boundary, isolating jobs that have a different security requirement. Multiple clusters are required to achieve high availability.

- **Use a local container registry.**
  To reduce egress costs and improve performance, consider deploying a local container registry to cache frequently used images. This reduces the amount of data transferred over the network and improves the speed of image pulls. Be aware that GitHub-hosted runners have unlimited access to pull images from Docker Hub, while self-hosted runners are subject to Docker Hub's rate limits (unless you have a paid plan).

- **Avoid spot instances.**
  While spot instances can be a cost-effective way to run workloads, they are not a reliable option for ARC and are strongly discouraged. They can be terminated at any time, which can lead to job failure, partial job execution (leading to inconsistent deployments or builds), and "stuck" runners, and scaling issues. ARC is not designed to handle interruptions or preemption, does not support suspending or resuming jobs, and cannot monitor for a pending shutdown to gracefully drain runners. Prefer using on-demand or reserved instances to ensure that runners are always available when needed.

- **ARC should be the only cluster workload.**
  To ensure optimal performance and security, ARC is intended to be used on clusters that are dedicated for that purpose. Including other workloads can lead to resource contention, performance degradation, and security vulnerabilities.

- **Automate updates.**
  Regularly update ARC, the underlying Kubernetes cluster, and the operating system for each node to ensure that you have the latest fixes and security patches. Use automated tools to manage updates and ensure that they are applied consistently across all clusters.

- **Use a single label.**
  Having a single label (such as the scaleset name) on your scale set makes it easier to reason about where jobs will be assigned. It also makes it easier to analyze performance or troubleshoot issues when all targeted runners share the same definition and image.

### Create a custom image for runners

While the default runner image provided by GitHub is suitable for many use cases, creating a custom image is essential for production workloads. It minimizes job startup and execution times, reduces the potential for rate limiting, and ensures that required tools and dependencies are available.

- **Review the core requirements.**
  All self-hosted runner solutions must meet the [documented requirements](https://docs.github.com/en/enterprise-cloud@latest/actions/reference/runners/self-hosted-runners).

- **Create an Actions archive cache.**
  Review how GitHub-hosted runners [create an archive cache](https://www.kenmuse.com/blog/building-github-actions-runner-images-with-an-action-archive-cache/) with the most frequently used Actions to speed up job execution and avoid repeated downloads.

- **Create a tool cache.**
  Review the steps for implementing a [tool cache](https://www.kenmuse.com/blog/building-github-actions-runner-images-with-a-tool-cache/) to make platform tools and binaries available locally on the runner. This eliminates the need to download the tools during the job, reducing execution time and network traffic.

- **Keep the runner version up-to-date.**
  The runner image should be regularly updated to take advantage of the latest features and security fixes. If you're using GitHub Enterprise Cloud, self-hosted runners cannot be more than [30 days](https://docs.github.com/en/enterprise-cloud@latest/actions/reference/runners/self-hosted-runners#runner-software-updates-on-self-hosted-runners) behind the latest version. If you're using GitHub Enterprise Server, you must use *at least* the version provided with your instance. Runners are generally backwards compatible with older versions of the server platform.

### Configure Kubernetes for ARC

- **Start with a vanilla cluster.**
  Begin with a basic Kubernetes cluster with only the vendor-provided logging. Avoid starting with any additional security tools or third-party logging. Tune Kubernetes to handle your build processes before adding any additional customizations, admissions controllers, or security scanning tools. Once that is done, iteratively add and configure any additional components. This avoids having to troubleshoot multiple components at once and makes it easier to identify performance issues.

- **Avoid ingress to the cluster.**
  Runners should not be exposed to incoming traffic from the internet or other networks.

- **Prefer an isolated cluster.**
  Whenever possible, prefer network isolation over one that is directly connected to internal or production resources. Use just-in-time (JIT) or zero-trust approaches to access resources.

- **Avoid automatic credentials.**
  Avoid using pod or cluster-managed identities when accessing production or development resources. These can create security risks and increase the severity of supply chain attacks. Instead, prefer OpenID Connect (OIDC) for secure and temporary access to resources.

- **Plan for availability.**
  Create at least two clusters in different availability zones or regions to ensure high availability and disaster recovery. This also enables other clusters to continue supporting jobs when upgrading ARC or Kubernetes. **Note:** the Actions control plane does not provide load balancing, so clusters may experience uneven loading.

- **Allocate sufficient IP addresses.**
  Ensure that your cluster has enough IP addresses to handle peak workloads. Running out of IP addresses will cause runners to fail or become unresponsive.

- **Size the NAT gateway appropriately.**
  Runners need to communicate with GitHub's servers and other external resources. Kubernetes clusters generally rely on a NAT gateway for egress. Organizations may require multiple instances for larger workloads.

- **Prefer larger nodes.**
  Generally speaking, prefer larger nodes over smaller. This often reduces the frequency of scaling events and Kubernetes API server traffic.

- **Consider pre-scaling with CronJobs.**
  Workloads with predictable peaks (such as during business hours) can use CronJobs to pre-scale clusters. This ensures nodes are available for runners and can make additional scaling more efficient.

### Enable logging and monitoring

- **Prefer vendor logging and metrics.**
  To tune clusters for performance and scalability, it is critical to monitor logs and metrics. For cloud-based systems, prefer vendor-provided solutions which are already optimized for their respective environments, such as:
  - AWS: Cloud Watch and Container Insights.
  - Azure: Azure Monitor/Log Analytics, Container Insights, and Managed Prometheus.
  - GCP: Cloud Logging and Cloud Monitoring.

  ARC's performance can be severely impacted by tools that are not properly configured for working with high volumes of short-lived pods.

- **Avoid high-cardinality metrics.**
  ARC's metrics are configurable and can provide valuable insights into the performance of your runners and cluster, but metrics that incorporate job names or unique identifiers often lead to performance issues with monitoring tools.

- **Establish baselines.**
  Identify baselines (healthy state) in logs and metrics. Use these baselines to identify performance issues and bottlenecks and to create appropriate alerts, notifications, and automation.

- **Configure retention policies.**
  Once the system is running properly, consider using a shorter log retention policy to manage costs.

- **Monitor Kubernetes events and components.**
  Scaling in ARC is managed entirely by Kubernetes, so monitoring events related to scheduling, resource allocation, and node health can identify issues that may impact runner availability and performance. Make sure that strategies include plans for monitoring the Kubernetes API server and its audit logs.

### Configure Actions Runner Controller

- **Prefer Helm for installation.**
  Tools like Flex and ArgoCD are not supported or recommended.

- **Use the latest version of ARC.**
  Regularly update ARC to the latest version (carefully following the [published instructions](https://docs.github.com/en/enterprise-cloud@latest/actions/tutorials/use-actions-runner-controller/deploy-runner-scale-sets#upgrading-arc)) to benefit from new features and security patches. This is also required to ensure organizations are on a supported release. Avoid using `helm upgrade`, Flex, ArgoCD, or other approaches that do not follow the documented upgrade process.

- **Avoid non-Linux runners.**
  ARC is optimized for Linux-based runners. GitHub does not support using ARC with Windows or macOS based runners, and Windows containers have [additional limitations and considerations](https://kubernetes.io/docs/concepts/windows/intro/).

- **Tune scale sets.**
  Optimize the settings for `runnerMaxConcurrentReconciles`, `k8sClientRateLimiterQPS`, and `k8sClientRateLimiterBurst` to optimize the performance of clusters. These settings will depend on the specific workload and cluster size, so organizations may need to rely on cluster metrics to find the optimal values.

- **Consider T-Shirt sizing the scale sets.**
  Most companies have jobs that require different amounts of CPU and memory. Kubernetes does not allow dynamic resizing of a container, so consider multiple scale sets with different resource limits that match workloads. This can improve resource utilization and reduce costs.

- **Configure appropriate resource requests and limits.**
  Configure requests and limits for all containers in scale sets, ensuring that the `request` and `limit` values are equal. This enables the Kubernetes scheduler to manage resources appropriately. ARC does not support preemption, so attempts to overcommit memory resources can cause runners to fail or stop responding.

- **Configure replicas.**
  Consider using three replicas for the controller deployment to ensure that ARC can more rapidly respond to node failures.

- **Use taints and tolerations.**
  Apply taints to critical nodes (such as those running the ARC controller) to prevent runner pods or other workloads from being scheduled on them. This ensures that critical components have the necessary resources to operate optimally and without contention.

- **Prefer running ARC without additional containers.**
  This reduces the attack surface and improves performance. If Docker-in-Docker (DinD) or Kubernetes support is needed for jobs, consider running those in a separate cluster.

- **Group scale sets by trust level.**
  The unit of trust in Kubernetes is the cluster, not nodes, namespaces, pods, or containers. Runners on the same cluster should support jobs that all have equivalent levels of trust. Consider creating separate clusters when running jobs with different trust levels.

- **Apply security incrementally.**
  Gatekeeper, OPA, Azure Policy, and other security tools can introduce restrictions that may impact ARC's ability to schedule and manage runners. It is recommended to first get ARC running and scaling properly, then incrementally apply security policies and configurations. This avoids troubleshooting multiple components at once and makes it easier to identify performance issues.

### Container mode considerations

By default, ARC does not specify a container mode for runners. This means that the configuration of the runner pods is based on the user-provided `template.spec`, and ARC will create pods according to that specification.

When a container mode is selected, ARC configures the runner pods using a pre-defined template (with a copy of the current templates included as comments in the scale set [values.yml](https://github.com/actions/actions-runner-controller/blob/master/charts/gha-runner-scale-set/values.yaml) file). Most of the template's settings are not configurable or customizable, even if a `template.spec` is provided. As a result, using the `containerMode` setting is only recommended for testing or proof-of-concept deployments.

{{< callout type="warning" >}}
ARC scales by requesting pods in Kubernetes according to the provided `template.spec` or `containerMode` template. Kubernetes is then responsible for scheduling and running the pods based on that specification. Misconfigured `template.spec` settings are a common sources of performance, reliability, and scaling issues with ARC.
{{</ callout >}}

- **Provide a `template.spec` for production use.**
  For production deployments, it is recommended to comment out the `containerMode` setting and define your runner specifications. If you need the features provided by the `dind`, `kubernetes`, or `kubernetes-novolume` container mode, use the included templates as a starting point. This gives you control over the container settings, allowing you to set requests/limits, security contexts, and a custom runner image.

- **Review template updates.**
  Each new release of ARC may include updates to the container mode templates. If you have defined a specification based on a container mode, always review the latest templates and incorporate any necessary changes into your custom template to ensure compatibility and take advantage of new features or fixes.

### Docker-in-Docker (DinD) considerations

[Docker-in-Docker](https://docs.github.com/en/actions/tutorials/use-actions-runner-controller/deploy-runner-scale-sets#using-docker-in-docker-mode) uses a `privileged` native sidecar container running as `root` to host the Docker daemon and manage the containers. This configuration supports containerized Actions and building/runner images using the Docker command line.

{{< callout type="info" >}}
Docker-in-Docker must be run as a `privileged` container to have permission to create and manage the containers; the runner container should remain unprivileged. This is required even when using the `docker:dind-rootless` image to run Docker as a non-root user.
{{< /callout >}}

- **Prefer DinD over Kubernetes mode.**
  If you need containers, DinD is generally simpler to configure and manage and avoids some of the complexities and limitations of Kubernetes mode.

- **Avoid a shared DinD environment.**
  Sharing a Docker daemon across multiple runners can allow jobs to interfere with each other or gain access to sensitive data. Always use separate DinD environments for each runner; avoid using a shared Docker daemon.

- **Review the security requirements.**
  DinD mode requires running a Docker daemon in a container with elevated privileges. This allows it to create and manage containers within the pod, which can introduce security risks. Review the security implications and ensure that appropriate measures are in place to mitigate risks.

- **Customize the configuration.**
  Container modes provide a simple way to deploy a predefined template. For production use, comment out the `containerMode` and define your runner specifications in `template.spec` based on the included template for the container mode `dind`.

### Kubernetes mode considerations

[Kubernetes mode](https://docs.github.com/en/enterprise-cloud@latest/actions/tutorials/use-actions-runner-controller/deploy-runner-scale-sets#using-kubernetes-mode) uses [container hooks](https://github.com/actions/runner-container-hooks) to enable the runner to create a worker pod using the Kubernetes API to host the job and service containers. This requires the runner pod to have elevated privileges. Using the `containerMode` `kubernetes` requires a persistent volume claim (PVC) for file storage. Alternatively, [`kubernetes-novolume`](https://docs.github.com/en/enterprise-cloud@latest/actions/tutorials/use-actions-runner-controller/deploy-runner-scale-sets#configuring-kubernetes-mode-with-container-lifecycle-hooks) can be used. Kubernetes APIs are used to manage files rather than PVCs, requiring the runner container to run as `root` and trading performance for easier configuration.

{{< callout type="info" >}}
This configuration requires the runner pod to run with elevated privileges to create and manage pods within the cluster, giving it access to pods and secrets using the Kubernetes APIs. When the `containerMode` is specified, ARC will create a [role](https://github.com/actions/actions-runner-controller/blob/master/charts/gha-runner-scale-set/templates/kube_mode_role.yaml), [service account](https://github.com/actions/actions-runner-controller/blob/master/charts/gha-runner-scale-set/templates/kube_mode_serviceaccount.yaml), and [binding](https://github.com/actions/actions-runner-controller/blob/master/charts/gha-runner-scale-set/templates/kube_mode_role_binding.yaml) for this purpose. When a custom `template.spec` is provided, these resources are not created automatically and must be created and managed separately.

Configuring the worker pod (including requests and limits) requires customizing the container hooks. These settings cannot be configured in the `template.spec`.

Kubernetes does not contain a Docker runtime, so this mode does not support Actions that use Dockerfiles or Open Container Initiative (OCI) images. It is also not possible to use the Docker command line to build or run containers. If that is required, use Docker-in-Docker (DinD). Images can also be built using other tools, such as [Kaniko](https://github.com/chainguard-forks/kaniko).
{{< /callout >}}

- **Always require a job container.**
  Avoid setting `ACTIONS_RUNNER_REQUIRE_JOB_CONTAINER` to `false`, which allows jobs to run directly on the elevated runner pod rather than in a separate, lower-privilege job container. Disabling this setting can lead to security vulnerabilities and privilege escalation on the runner, including the ability to directly create and access privileged resources and secrets.

- **Review the security requirements.**
  Kubernetes mode requires the runner container to have permissions to create and manage pods, secrets, and jobs within the cluster, which can introduce security risks. Review the security implications and ensure that appropriate measures are in place to mitigate risks.

- **Customize the configuration.**
  Container modes provide a simple way to deploy a predefined template. For production use, comment out the `containerMode` and define your runner specifications in `template.spec` based on the included template for the container mode `kubernetes` or `kubernetes-novolume`.

## Seeking further assistance

<!-- The Hugo shortcode below will fully populate this section -->

{{% seeking-further-assistance-details %}}

## Related links

<!-- The Hugo shortcode below will include a subsection that links to GitHub's documentation. -->

{{% related-links-github-docs %}}

Specifically, you may find the following links helpful:

- [Actions Runner Controller](https://docs.github.com/en/actions/concepts/runners/actions-runner-controller)
- [Deploying runner scale sets with Actions Runner Controller](https://docs.github.com/en/actions/tutorials/use-actions-runner-controller/deploy-runner-scale-sets)

### External Resources

- [Building GitHub Actions Runner Images With A Tool Cache](https://www.kenmuse.com/blog/building-github-actions-runner-images-with-a-tool-cache/)
- [The Top 5 Things To Know About ARC](https://www.kenmuse.com/blog/top-five-things-to-know-about-arc/)
- [Building Base Images for ARC](https://www.kenmuse.com/blog/building-base-images-for-arc/)
- [What Is ARC Doing & How Does It Interact With Kubernetes?](https://www.kenmuse.com/blog/what-is-arc-doing)
