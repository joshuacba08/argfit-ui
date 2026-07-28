# Production Release Checklist

Use this checklist before tagging or publishing ArgFit UI `1.3.2` production packages.

## Version And Metadata

- Confirm the root `package.json` version is `1.3.2`.
- Confirm every publishable `projects/argfit-ui-*/package.json` version is `1.3.2`.
- Confirm every internal `@argfit-ui/*` peer dependency is pinned to `1.3.2`.
- Confirm every publishable package has `publishConfig.access = public`.
- Confirm every publishable package has `publishConfig.tag = latest`.
- Confirm no production package version contains a prerelease identifier.

## Documentation

- Confirm `CHANGELOG.md` contains the `1.3.2` production entry.
- Confirm `docs/productive/release-notes-1.3.2.md` describes the shipped release.
- Confirm `docs/productive/release-operations.md` and `docs/productive/support-policy.md` match the current production process.
- Confirm the docs app exposes release notes, release operations, support policy and this checklist.

## Local Gate

Run the full production gate from a clean dependency install when possible:

```bash
pnpm install --frozen-lockfile
pnpm release:production:check
```

The gate must complete the Beta+ regression substrate, rebuild the stable packages, create `dist/production-tarballs/`, measure production budgets and run the production smoke.

## Tagging

Only tag after the local gate and CI are green:

```bash
git tag -a v1.3.2 -m "ArgFit UI 1.3.2"
git push origin v1.3.2
```

Production tags must be stable semver tags without prerelease identifiers.

## Publish Verification

The `publish-production.yml` workflow must publish with npm `latest`:

- workflow trigger is `v1.*.*` or a validated manual dispatch
- workflow runs `pnpm release:production:check`
- workflow rebuilds `pnpm build:libs` after the gate
- workflow rejects package versions that do not match the tag
- workflow rejects `publishConfig.tag` values other than `latest`
- workflow publishes all five dist packages with `npm publish --tag latest --access public`

After publish, verify npm shows `@argfit-ui/core`, `@argfit-ui/primitives`, `@argfit-ui/desktop`, `@argfit-ui/mobile` and `@argfit-ui/adaptive` on version `1.3.2` under the `latest` dist-tag.

## Rollback And Recovery

If the workflow fails after any package publishes, stop and follow [release operations](./release-operations.md). Do not republish the same version. Publish a patch release if consumers could receive a partial or inconsistent package set.
