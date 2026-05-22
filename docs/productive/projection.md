# ArgFit UI - Productive Version Projection

## Target

Recommended target: `1.0.0`.

The productive version is not a bigger beta. It is the first version where ArgFit UI promises stable public APIs, a support policy, documented migrations and production-grade quality gates.

The frozen `1.0.0` contract baseline lives in:

- `docs/productive/scope.md`
- `docs/productive/public-api.md`
- `docs/productive/semver-policy.md`
- `docs/productive/quality-gates.md`
- `docs/productive/enterprise-readiness.md`

## Productive Definition

ArgFit UI is ready for `1.0.0` when:

- The public API is frozen for the first semver-major contract.
- Experimental APIs are either promoted, isolated or removed from the recommended path.
- Visual, accessibility, consumer, performance and release gates are mandatory.
- Enterprise usage guidance is explicit for data, forms, overlays, feedback and chart-heavy apps.
- Documentation is complete enough for a team that has never seen the repo.
- Publishing, changelog, migration and support policy are reproducible.

## Backlog HU Productive

1. [HU-038 - Productive Scope And Semver Freeze](../hus/HU-038-productive-scope-semver-freeze.md)
2. [HU-039 - Productive Quality Gates](../hus/HU-039-productive-quality-gates.md)
3. [HU-040 - Productive Enterprise Readiness](../hus/HU-040-productive-enterprise-readiness.md)
4. [HU-041 - Productive Documentation Site](../hus/HU-041-productive-documentation-site.md)
5. [HU-042 - Productive Release Operations And Support Policy](../hus/HU-042-productive-release-operations-support.md)
6. [HU-043 - Production 1.0 Release Gate](../hus/HU-043-production-1-release-gate.md)

## Recommended Sequence

1. Finish base beta.
2. Ship Beta+ with the small component expansion.
3. Freeze the production scope.
4. Harden the production gates.
5. Publish `1.0.0` only after release operations and support policy are documented.
