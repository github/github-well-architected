---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false # Set to false when ready to publish
title: "Accessing private networks from GitHub Actions Runners"
publishDate: 2024-09-09
params:
  authors: [
    {name: "Paul Wideman", handle: "pwideman"},
  ]

# Classifications of the framework to drive key concepts, design principles, and architectural best practices
pillars:
  - architecture

# The areas of the GitHub adoption journey. Inspiration taken from docs.github.com
areas:
  - ci-cd-and-devops
  - security
  - enterprise-and-teams

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

# GitHub product functions designed to support every stage of development.
features:
  - github-actions

# Deeper-level topics of the GitHub Platform and its features. They are most often interacted with by end-users.
components:
  - best-practice
  - governance-and-policy
  - workflow

# Associated teams and other GitHub and Partner resources that can provide additional support.
github:
  - customer-success-architect
  - engineering-and-product
  - enterprise-support
  - expert-services
---

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD025 -->

## Scenario overview

[GitHub-hosted runners](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners/about-github-hosted-runners) are a cost-effective, secure, and low maintenance option for running your [GitHub Actions](https://docs.github.com/en/actions) workflows. Hosted runners are managed by GitHub, run on GitHub-owned infrastructure, and have access to the public internet by default.

Many customers need to access private resources from their GitHub Actions workflows to perform actions such as deploying software to private infrastructure or using private package managers. Accessing these resources is
not possible with the default GitHub-hosted runner configurations without enabling access to the internet. This article presents a few options for enabling GitHub-hosted runners to access private resources, and focuses on the [Azure Private Networking](https://docs.github.com/en/enterprise-cloud@latest/admin/configuring-settings/configuring-private-networking-for-hosted-compute-products/about-azure-private-networking-for-github-hosted-runners-in-your-enterprise) feature which is the most
comprehensive solution for private network access.

## Potential Solutions

GitHub offers a few potential solutions to enable access to private resources:

1. Using static IP addresses with larger runners
1. Using an API Gateway with OpenID Connect (OIDC)
1. Using Azure Private Networking

{{< callout type="info" >}}
Some of these features require the use of GitHub-hosted larger runners. GitHub offers both [standard](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners/about-github-hosted-runners) and
[larger](https://docs.github.com/en/enterprise-cloud@latest/actions/using-github-hosted-runners/about-larger-runners/about-larger-runners) hosted runners.
[GitHub-hosted larger runners](https://docs.github.com/en/enterprise-cloud@latest/actions/using-github-hosted-runners/about-larger-runners/about-larger-runners) are provisioned specifically for your enterprise or organization,
as opposed to standard runners which are common pools of runners used across all of GitHub. Larger runners offer a few capabilities that aren't available on standard runners for an added cost.
{{< /callout >}}

### Using Static IP Addresses

[Static IP addresses on larger runners](https://docs.github.com/en/enterprise-cloud@latest/actions/using-github-hosted-runners/about-larger-runners/managing-larger-runners#creating-static-ip-addresses-for-larger-runners) establish public IP CIDR blocks that will contain the IP addresses of your larger runners. This allows you to configure your private networking and firewalls to enable inbound connectivity from only your larger runners without enabling access from any arbitrary sources.

Static IP addresses are a quick and relatively easy way to enable Actions workflows on GitHub-hosted runners to access your private resources, with the obvious disadvantage of requiring inbound access from a set of known, static, public IP addresses. You may also need to configure mechanisms such as port forwarding or network address translation to reach private resources from outside your network. While static IP addresses may work for some organizations, these tradeoffs may not be acceptable for others.

### Using an API Gateway with OIDC

[Using an API Gateway with OIDC](https://docs.github.com/en/enterprise-cloud@latest/actions/using-github-hosted-runners/connecting-to-a-private-network/using-an-api-gateway-with-oidc) involves standing up an API Gateway on the edge of your network (or using an existing API Gateway) and using OIDC tokens to authenticate requests from GitHub Actions to your API Gateway. This solution provides a secure connection between the hosted runner and your private services and can be used with standard GitHub-hosted runners, or combined with static IP addresses on larger runners to further restrict traffic to the API Gateway.

This pattern is most useful when the private resources you need to access from your Actions workflows are services with their own APIs, as opposed to direct access to network endpoints. The major disadvantage is that you must have an API Gateway and it must be reachable from the public internet, at least from the CIDR blocks of your larger runner static IPs if you choose to use larger runners. As with static IP addresses, this solution may work for some organizations but may not fit the security needs of all.

### Using Azure Private Networking

[Azure private networking](https://docs.github.com/en/enterprise-cloud@latest/admin/configuring-settings/configuring-private-networking-for-hosted-compute-products/about-azure-private-networking-for-github-hosted-runners-in-your-enterprise) allows you to maintain
complete control over the networking configuration of your GitHub-hosted larger runners. Azure private networking enables larger runners to privately connect to your network and resources through an Azure Virtual Network, without opening ports or enabling access to those resources from the public internet. This not only enables private access to Azure resources; when combined with Azure [ExpressRoute](https://azure.microsoft.com/en-us/products/expressroute) or [VPN Gateway](https://azure.microsoft.com/en-us/products/vpn-gateway) it can also enable access to resources in your private on-premise networks as well.

The disadvantages of this approach are that an Azure presence is required and the configuration requires some access permissions in your Azure subscription. These requirements are covered in detail below.

## Azure Private Networking

### Overview

Azure private networking leverages an Azure pattern known as VNET injection to deploy the GitHub-hosted runner's network interface card (NIC) into your private Azure VNET, while the runner VM resides in GitHub-owned infrastructure. The result is that you are in complete control of the runner's network access controls.

This diagram and the other content from the [About Azure private networking](https://docs.github.com/en/enterprise-cloud@latest/admin/configuring-settings/configuring-private-networking-for-hosted-compute-products/about-azure-private-networking-for-github-hosted-runners-in-your-enterprise) documentation
describes the general architecture and how this feature is implemented in GitHub and Azure. There is no need to repeat that documentation here, however below we touch on a few aspects that may be of particular interest to those using this feature.

![Architecture](actions-vnet-injected-larger-runners-architecture.webp)

The main points from the diagram are:

1. (Step 3): The runner VM NICs are deployed into the customer's Virtual Network, while the VMs themselves remain in GitHub owned infrastructure.
1. (Steps 4 and 5): The runner VMs still need outbound connectivity to GitHub resources and public APIs in order to do their work. These requirements are discussed in detail below.
1. (Step 6): Connectivity to Azure or on-premise private resources can be facilitated in a few ways: Azure ExpressRoute or VPN Gateway to access on-premise private networks, and peered VNETs to access other Azure resources (or an ExpressRoute/VPN Gateway that is already configured in another VNET).

{{< callout type="warning" >}}
The customer will be responsible for all of the typical Azure costs associated with network traffic and resources in the customer-owned Virtual Network, with the exception of the NIC which is owned by GitHub. This includes network ingress and egress, VNET peering, ExpressRoute, VPN Gateway, and Azure Firewall.
{{< /callout >}}

### Deployment

Deploying the Azure private networking feature involves creating or updating a handful of Azure resources, adding a hosted compute networking configuration in your GitHub enterprise or organization, and associating that networking configuration with a new or existing runner group. The [configuration documentation](https://docs.github.com/en/enterprise-cloud@latest/admin/configuring-settings/configuring-private-networking-for-hosted-compute-products/configuring-private-networking-for-github-hosted-runners-in-your-enterprise) provides instructions and sample resources to facilitate this deployment. The process to create and configure the required Azure and GitHub resources can be summarized as follows:

1. Register the `GitHub.Network` Azure resource provider in your Azure subscription
1. Create a suitable Azure VNET subnet and delegate it to the `GitHub.Network/networkSettings` resource type. This delegation is what enables the `GitHub.Network` resource provider to deploy the runner NICs into your VNET. There are some required network connectivity rules to enable the runner to operate properly, e.g. connectivity to some GitHub and Azure services that are used at runtime. We will cover these connectivity requirements and the options for facilitating those later.
1. Retrieve the GitHub database ID of your enterprise or organization. This can be retrieved through a GitHub GraphQL API request. The documentation and sample configuration scripts refer to this as the _business ID_.
1. Create a `GitHub.Network/networkSettings` resource, whose contents establish an association between the subnet that will contain the runner NICs (from step 2) and the business ID. This resource is purely informational and is used by the GitHub backend to establish the link between the enterprise/organization and the desired subnet for a hosted compute networking configuration.
1. Create the hosted compute networking configuration, associate the networking configuration to a new or existing runner group, and add runners to the group (if necessary).

Once these steps are completed, new runners that are created in the runner group will have their NICs deployed into the designated customer-owned Azure subnet and the runner will honor the subnet/VNET network access rules. The sample configuration in the documentation uses an Azure Network Security Group (NSG) to define the network access rules, but as you will see below you can also use Azure Firewall to secure the VNET as well.

The documentation provides the following sample resources:

1. A [bicep](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview?tabs=bicep) [file that defines the Azure Network Security Group (NSG)](https://docs.github.com/en/enterprise-cloud@latest/admin/configuring-settings/configuring-private-networking-for-hosted-compute-products/configuring-private-networking-for-github-hosted-runners-in-your-enterprise#prerequisites) and its network security rules. The rules defined here are only an example and are considered to be the
   minimum for basic functionality of the runner and its ability to access GitHub services. Your workflows may require additional security rules to enable connectivity to your desired resources, be they private or public.
1. A [bash script](https://docs.github.com/en/enterprise-cloud@latest/admin/configuring-settings/configuring-private-networking-for-hosted-compute-products/configuring-private-networking-for-github-hosted-runners-in-your-enterprise#2-use-a-script-to-configure-your-azure-resources)
   that uses the [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/) to perform the required Azure resource operations.

{{< callout type="info" >}}
The number of available IP addresses in your subnet should meet or exceed the `Maximum concurrency` setting of the larger runner configuration that will be deployed into the subnet. The [Maximum concurrency setting](https://docs.github.com/en/enterprise-cloud@latest/actions/using-github-hosted-runners/using-larger-runners/about-larger-runners#autoscaling-larger-runners) is available in GitHub on the larger runner configuration, and its value is an upper bound on the number of concurrent runner VMs that will be deployed for this larger runner. If the available IP addresses in the Azure subnet do not meet or exceed the maximum concurrency setting then GitHub will not be able to scale the larger runner up to the desired maximum concurrency. In some cases GitHub will scale the runner over the `Maximum concurrency` value by 20%, for example if some runners are slow or unable to come online, so to be safe we recommend the available IP addresses be 20% more than the `Maximum concurrency` value. The number of available IP addresses in your Azure subnet is defined by the CIDR blocks used for the VNET address space and subnet address prefix.
{{< /callout >}}

### Customizing the Deployment

The instructions and resources in the documentation are an example of how to deploy Azure private networking, they are not the only way to do so nor is it required to use bicep, bash, or any other particular technology. You may choose to customize your Azure private networking configuration and deployment in a number of ways:

1. Defining all, or at least more, of the required Azure resources in `bicep` instead of `az` CLI commands.
1. Using [terraform](https://www.terraform.io/) instead of `bicep`/`az` CLI. Below we will discuss using an open source GitHub terraform module, created by GitHub engineers, to deploy the resources.
1. Using [Azure Firewall](https://learn.microsoft.com/en-us/azure/firewall/overview) instead of NSGs to implement the VNET network security rules. Azure Firewall is a more comprehensive firewall product that, among other advanced functionality, allows you to
   specify network security rules in terms of host names instead of IP addresses. Many of the CIDR blocks in the sample bicep file are associated with the same GitHub service, so the equivalent security rules expressed in terms of host names can be considerably
   simpler and easier to maintain. Using Azure Firewwall incurs added costs in your Azure subscription, but if your organization already has an Azure networking presence then you are most likely already securing your virtual networks with Azure Firewall or another
   similar service instead of NSGs. The terraform modules discussed below provide an example of the Azure Firewall equivalent of the documented NSG security rules.
1. Customizing the network security rules. In addition to adding new security rules to enable connectivity to your private or third-party resources required by your Actions workflows, you may also want to remove security rules that enable access to GitHub features that your organization is not using. Use the [GitHub meta API endpoint](https://api.github.com/meta) to retrieve information about the CIDR blocks and host names that are currently being used for various GitHub services.

### Runtime

At runtime you will see the GitHub-owned NICs deployed into your subnet. You may notice that there are multiple NICs deployed into your subnet even if you only run a single Actions workflow, and these NICs are not destroyed as soon as your workflow has finished. GitHub Actions attempts to intelligently predict the upcoming workload of your Actions workflows and ensure that runners are available when your jobs need them. When your Actions workflow runs and runners are deployed, the Actions service may deploy more than one runner in anticipation of multiple jobs needing those runners. Similarly, the runners remain in service for a period of time after your workflow completes so that any forthcoming workflows can use them instead of requiring new runners to be deployed.

The GitHub hosted runners will be deployed into the same Azure region as your Virtual Network, spread a cross all Availability Zones in the region. In the event of an AZ outage any runners already running jobs in the affected AZ will be impacted, however new jobs should use runners in the available AZs. An AZ outage would significantly impact the Azure capacity in the region, so you may see longer queue times for scheduled jobs.

### Limitations and Requirements

Azure Private Networking has a few limitations and security requirements that are worth mentioning:

1. The feature is only available in a subset of Azure regions. See the [About supported regions](https://docs.github.com/en/enterprise-cloud@latest/admin/configuring-settings/configuring-private-networking-for-hosted-compute-products/about-azure-private-networking-for-github-hosted-runners-in-your-enterprise#about-supported-regions) documentation for the complete list. If you are using [GitHub Enterprise Cloud with Data Residency (GHE)](https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency) then pay special attention to the note about [supported regions for GHE](https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/network-details-for-ghecom#supported-regions-for-azure-private-networking). The documentation also provides a link to the GitHub forum where you can request support for a new region.
1. MacOS runners are not supported.
1. Registering the `GitHub.Network` resource provider in your Azure subscription will create two enterprise applications: `GitHub CPS Network Service` and `GitHub Actions API`. These are required for the GitHub services to perform the necessary operations in your Azure VNET.
1. The above enterprise applications are granted certain permissions which are documented in [About the GitHub Actions service permissions](https://docs.github.com/en/enterprise-cloud@latest/admin/configuring-settings/configuring-private-networking-for-hosted-compute-products/about-azure-private-networking-for-github-hosted-runners-in-your-enterprise#about-the-github-actions-service-permissions). These are the permissions required for the two enterprise applications to manage the delegated subnet and deploy the runner NICs.

{{< callout type="info" >}}
GitHub can only access subnets that have been delegated to the `GitHub.Network/networkSettings` resource type. Even though the permissions to the `GitHub.Network` resource provider are granted at the Subscription level, the Azure services that facilitate the VNET injection pattern ensure that the GitHub resource type can only access subnets delegated to it. GitHub resources and services cannot access any other parts of your Azure infrastructure.
{{< /callout >}}

## Terraform Library

In addition to the bicep file and shell script mentioned earlier, there is also the [terraform-github-runner-vnet](https://github.com/github/terraform-github-runner-vnet) open source terraform module which can be used to create the required Azure resources and configuration for using the Azure Private Networking feature. It is an alternative to the bicep and shell script, but like those it exists to provide an example for how to faciliate deployment of the required resources through terraform and would most likely need modification to fit the deployment strategy of each customer.

`terraform-github-runner-vnet` provides two terraform modules:

- `nsg`: This module uses NSGs to secure the VNET with the same access rules as defined in the bicep file from the documentation. This module results in the same configuration as following the deployment instructions in the documentation.
- `firewall`: This module uses Azure Firewall to secure the VNET. Since Azure Firewall allows network access rules to be defined in terms of host names, this results in a simpler definition of those access rules.

The `firewall` module grants outbound access to the following fully qualified domain names (FQDNs):

```text
# These FQDNs have been taken from the GitHub documentation for self-hosted runner networking
# and the https://api.github.com/meta API response. Both sources list more specific FQDNs so
# organizations wishing to minimize use of wildcards can consult those sources to build a more
# explicit list of required FQDNs.

# For essential operation
"github.com",
"*.github.com",
"*.githubusercontent.com",
"*.blob.core.windows.net",

# For packages
"ghcr.io",
"*.ghcr.io",
"*.githubassets.com",

# For LFS
"github-cloud.s3.amazonaws.com"
```

As with the NSG access rules, it is likely that customers will need to modify these rules to suit their own needs. The set of FQDNs listed here are only an example that should allow most basic Actions workflows to run successfully, but they aren't intended to be final.

The `terraform-github-runner-vnet` project is maintained by a few GitHub engineers and the community, we welcome any feedback or contributions.

## Seeking further assistance

<!-- The Hugo shortcode below will fully populate this section -->

{{% seeking-further-assistance-details %}}

## Related links

<!-- The Hugo shortcode below will include a subsection that links to GitHub's documentation. -->

{{% related-links-github-docs %}}
