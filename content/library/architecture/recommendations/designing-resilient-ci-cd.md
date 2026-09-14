---
# SPDX-FileCopyrightText: GitHub and The Project Authors
# SPDX-License-Identifier: MIT
draft: false # Set to false when ready to publish
title: 'Building resilient CI/CD with GitHub Actions'
weight: 6
publishDate: 2026-09-09

pillars:
  - architecture
  - productivity

areas:
  - ci-cd-and-devops
  - continuous-delivery

personas:
  - administrator
  - developer

platform:
  - github-enterprise-cloud

features:
  - github-actions

components:
  - actions-oidc
  - actions-runners
  - caches-and-artifacts
  - deployment-and-environments
---

## Scenario overview

For critical workloads, continuity planning may address source availability, CI/CD execution, or both, depending on the recovery requirements.

- [**Building resilience with repository mirroring**](./building-resilience-with-repository-mirroring) describes an end-to-end recovery pattern centered on an independent repository mirror, including the build and deployment path needed to use it.
- This guidance focuses on the **CI/CD execution layer**: keeping deployment logic portable, providing a controlled alternate invocation path, managing authentication, and safely recovering interrupted automation.

## Key design strategies and checklist

### 1. Keep deployment logic portable

Avoid making a CI/CD workflow definition, such as a YAML file, the **only** executable form of a critical deployment process.

Where possible, consider keeping deployment logic in version-controlled scripts or tooling that the workflow invokes: `GitHub Actions workflow → deployment logic → deployment target`

A controlled alternate path can invoke the same implementation: `Authorized operator or independent automation → deployment logic → deployment target`

That path should have access to the network, identity, artifacts, APIs, approvals, and deployment targets required to meet the workload’s recovery objective.

Using the same deployment implementation across both paths reduces drift without recreating the full CI/CD platform.

### 2. Preserve the inputs needed to deploy

The alternate path must have access to required release inputs, such as:

- Approved artifacts or container images
- Immutable release identifiers
- Versioned deployment tooling and configuration
- Provenance, signatures, and integrity information
- Deployment instructions

Maintain equivalent verification, approval, and audit controls in both paths.

If you use GitHub artifact attestations, preserve the attestation bundle, trusted-root material, and verification tooling alongside the artifact for [offline verification](https://docs.github.com/en/enterprise-cloud@latest/actions/how-tos/secure-your-work/use-artifact-attestations/verify-attestations-offline). Refresh trust material when importing new releases; offline verification cannot detect later key revocations. Verifying provenance does not replace release approval.

A known-good artifact may support rollback, redeployment, or promotion. Producing a new artifact during a disruption also requires an independent build capability.

### 3. Maintain a separate authentication path

CI/CD workflows often obtain short-lived credentials through workload identities. GitHub Actions supports this through [OpenID Connect (OIDC)](https://docs.github.com/en/enterprise-cloud@latest/actions/concepts/security/openid-connect).

For critical workloads, avoid making the workflow identity the only way to obtain deployment authorization:

- **Normal:** The CI/CD workflow uses a narrowly scoped workload identity to obtain short-lived credentials.
- **Alternate:** An authorized operator or separate workload uses a distinct identity with short-lived credentials.

The alternate identity must obtain credentials without relying on GitHub Actions.

Protect alternate access with strong authentication, least privilege, approvals, time limits, and audit logging. Avoid permanent break-glass credentials.

### 4. Detect what has failed

Before activating the alternate path, determine whether the failure is in the orchestration layer or elsewhere in the delivery stack.

A failed deployment may originate with the CI/CD service, execution infrastructure, identity, artifact registry, cloud provider, deployment target, or another dependency.

For GitHub Actions, GitHub Status can feed existing observability and incident-management systems:

| Endpoint | Use |
| --- | --- |
| [/api/v2/components.json](https://www.githubstatus.com/api/v2/components.json) | Per-component status |
| [/api/v2/incidents/unresolved.json](https://www.githubstatus.com/api/v2/incidents/unresolved.json) | Active incidents |
| [/api/v2/summary.json](https://www.githubstatus.com/api/v2/summary.json) | Combined status |
| [/history.rss](https://www.githubstatus.com/history.rss) / [.atom](https://www.githubstatus.com/history.atom) | Feed subscription |

Use these signals alongside your own workflow and deployment telemetry. Define who can activate the alternate path and under what conditions. Do not switch paths if the same downstream failure affects both.

### 5. Reconcile automation before replaying work

When the normal CI/CD path recovers, do not immediately replay queued or interrupted work.

Determine:

- Which workflows completed, failed, or never started
- Which deployments reached their target
- Which scheduled work was missed
- Which actions were completed through the alternate path
- Which jobs are safe to rerun

Treat uncertain work as unverified. Prioritize critical work, reconcile changes made through the alternate path, verify the normal path is functioning as expected, and revoke any temporary credentials or access granted for the alternate path before resuming normal automation.

### 6. Rehearse the execution path

Periodically verify that an authorized responder can:

1. Identify the correct release or artifact.
2. Retrieve the required tooling, inputs, and verification material.
3. Authenticate through the alternate path.
4. Complete required verification and approvals.
5. Deploy and verify the result.
6. Reconcile back into the normal CI/CD path.

If new artifacts must be produced during a disruption, test the independent build capability as well.

Where practical, test with the modeled orchestration dependency unavailable.

### Checklist

- [ ] Identify critical workloads that require deployment continuity.
- [ ] Keep deployment logic portable outside the workflow definition.
- [ ] Use the same deployment implementation in normal and alternate paths where possible.
- [ ] Preserve required release inputs, verification tooling, and trust material.
- [ ] Configure an invocation path independent of normal CI/CD orchestration.
- [ ] Identify required network, identity, artifact, and deployment dependencies.
- [ ] Configure an independent authentication path with a distinct identity and short-lived credentials.
- [ ] Define activation authority and conditions.
- [ ] Document how interrupted and alternate-path work will be reconciled.
- [ ] Rehearse the path and remediate gaps.

## Assumptions and preconditions

This recommendation assumes that:

- Critical workloads and recovery objectives are defined.
- Required deployment inputs and verification material remain accessible during the modeled disruption.
- Deployment tooling can be invoked independently of the normal CI/CD workflow.
- A separate authentication path can issue short-lived credentials during the disruption.
- Required deployment targets and control planes remain reachable.
- Existing security, approval, and audit requirements continue to apply.
- Workloads that require new artifacts have an approved independent build capability.

This pattern focuses on CI/CD execution continuity. It does not replace source continuity, application disaster recovery, data recovery, or cloud-provider continuity planning.

## Recommended deployment

For critical workloads, use one deployment implementation through two controlled invocation paths.

### Example: deploy an approved release bundle

Make the approved artifact, matching deployment tooling and configuration, and verification material accessible independently of GitHub Actions. Associate each artifact's immutable digest with the tooling and configuration versions required to deploy it.

| Responsibility | Normal GitHub Actions path | Alternate operator path |
| --- | --- | --- |
| Run and authenticate | A GitHub-hosted runner obtains short-lived cloud credentials through Actions OIDC. | An authorized responder uses an approved environment and independent cloud login, with a distinct identity and short-lived credentials. |
| Select the release | Retrieve the approved artifact by immutable digest, with matching tooling and configuration. | Retrieve the same inputs through the independently available path. |
| Verify and approve | Verify the digest and provenance; satisfy deployment approvals. | Apply the same verification policy using saved verification material, with equivalent independent approvals. |
| Deploy | Invoke the versioned deployment tooling with the selected artifact and target. | Invoke the same tooling with the same inputs. |
| Record the outcome | Record the release digest, target, approval, deployment result, and service health. | Record the same information plus the incident reference and operator identity for reconciliation. |

This example deploys an existing approved release. Producing a new artifact still requires an independent build capability.

Maintain a runbook for activation, deployment, reconciliation, and return to normal operation. Ask:

> If the normal CI/CD orchestration path were unavailable, could we still retrieve the required release inputs, authenticate, deploy, verify the result, and reconcile safely afterward?

Treat the path as viable only after it has been successfully exercised.

## Additional solution detail and trade-offs to consider

A selective alternate invocation path is usually simpler than duplicating the CI/CD platform, but it introduces trade-offs:

- **Configuration drift:** Use the same deployment implementation in both paths.
- **Reduced automation coverage:** Maintain equivalent safeguards.
- **Alternate-access risk:** Use distinct, least-privileged identities with short-lived credentials, strong authentication, and logging.
- **Build limitations:** New artifacts require an independent build capability.
- **Operational cost:** Independent tooling, artifacts, verification material, and exercises require maintenance.
- **Shared dependencies:** Test for hidden reliance on the same identity provider, network, registry, or control plane.
- **Recovery complexity:** Define how interrupted work will be reconciled before replay.

A fully duplicated CI/CD platform may be appropriate when a workload must continue producing and deploying new artifacts through a prolonged disruption and the business impact justifies the complexity.

For many critical workloads, portable deployment logic, approved release inputs, an independent authentication path, and a rehearsed invocation path provide sufficient continuity without recreating the CI/CD platform.

## Seeking further assistance

{{% seeking-further-assistance-details %}}

## Related links

{{% related-links-github-docs %}}
