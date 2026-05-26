# Productive Support Policy

This document defines support expectations for the ArgFit UI productive line.

## Support Window

The `1.x` line is supported from the first `1.0.0` production publish until 90 days after the next major version is published, unless a later policy explicitly extends that window.

Within a supported major line:

- the latest minor receives routine compatible bug fixes, documentation fixes, accessibility fixes and dependency updates
- older minors receive security and critical correctness fixes when an immediate upgrade to the latest minor is not reasonable
- patch releases stay compatible with the public API contract documented for that major line
- alpha, beta and Beta+ prereleases are not supported after the corresponding production line is available

## Security And Dependency Update Policy

Security fixes and dependency updates are handled as production maintenance work.

- Security reports should be triaged privately when they describe an exploitable issue.
- Security fixes ship as patch releases when the fix can preserve the public API contract.
- If a security fix requires a breaking change, document the risk, the mitigation and the required migration before release.
- Dependency updates that preserve public behavior ship in patch releases.
- Dependency updates that add compatible public capability may ship in minor releases.
- Dependency updates that force consumer rewrites wait for a major release unless there is a security emergency.
- Review production dependencies at least once per release cycle and immediately for high-confidence security advisories.

Production releases must keep Angular, PrimeNG, Ionic, ECharts and shared runtime dependencies inside documented peer ranges. Renderer dependencies remain implementation details unless their peer range affects consumers.

## Deprecation Process

Deprecations follow [semver policy](./semver-policy.md).

Every public API deprecation must:

1. Be documented in the relevant productive docs.
2. Be recorded in `CHANGELOG.md`.
3. Name the replacement API or state that there is no direct replacement.
4. Stay available for the rest of the current major line unless a security or correctness issue makes that impossible.
5. Be removed only in the next major release.

Renderer-specific public APIs use the same deprecation process as adaptive APIs. PrimeNG, Ionic and other vendor implementation details are not public contracts unless they are explicitly documented as public ArgFit UI behavior.

## Patch Support

Patch support follows the [release operations](./release-operations.md) procedure.

Patch releases may include:

- bug fixes
- accessibility fixes
- visual fixes
- documentation corrections
- dependency updates that preserve the public API contract
- internal performance improvements that preserve public behavior

Patch releases must not introduce mandatory migrations. If a fix cannot be delivered compatibly, move it to the next minor or major according to the semver policy.

## Consumer Responsibilities

Consumers should:

- keep all installed `@argfit-ui/*` packages on the same version
- prefer `@argfit-ui/adaptive` for application surfaces
- avoid depending on renderer internals, generated CSS class names or vendor component APIs
- run their own application tests before upgrading across patch or minor versions
- report production issues with a minimal reproduction, package versions and browser/platform details

## Out Of Scope

The support policy does not cover:

- private forks or unpublished local modifications
- direct usage of PrimeNG or Ionic APIs through ArgFit UI internals
- prerelease channels after a stable production line exists
- undocumented showcase-only composition details