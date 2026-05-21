# ArgFit UI - Productive Version Projection

## Target

Recommended target: `1.0.0`.

The productive version is not a bigger beta. It is the first version where ArgFit UI promises stable public APIs, a support policy, documented migrations and production-grade quality gates.

## Productive Definition

ArgFit UI is ready for `1.0.0` when:

- The public API is frozen for the first semver-major contract.
- Experimental APIs are either promoted, isolated or removed from the recommended path.
- Visual, accessibility, consumer, performance and release gates are mandatory.
- Documentation is complete enough for a team that has never seen the repo.
- Publishing, changelog, migration and support policy are reproducible.

## Backlog HU Productive

1. [HU-033 - Productive Scope And Semver Freeze](../hus/HU-033-productive-scope-semver-freeze.md)
2. [HU-034 - Productive Quality Gates](../hus/HU-034-productive-quality-gates.md)
3. [HU-035 - Productive Enterprise Readiness](../hus/HU-035-productive-enterprise-readiness.md)
4. [HU-036 - Productive Documentation Site](../hus/HU-036-productive-documentation-site.md)
5. [HU-037 - Productive Release Operations And Support Policy](../hus/HU-037-productive-release-operations-support.md)
6. [HU-038 - Production 1.0 Release Gate](../hus/HU-038-production-1-release-gate.md)

## Recommended Sequence

1. Finish base beta.
2. Ship Beta+ with the small component expansion.
3. Freeze the production scope.
4. Harden the production gates.
5. Publish `1.0.0` only after release operations and support policy are documented.

