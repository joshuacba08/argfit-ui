# Beta+ Release Checklist

Use this checklist before publishing the Beta+ release.

## Preconditions

- Beta+ scope and readiness docs reflect the current repository state.
- `CHANGELOG.md` includes the Beta+ entry for `0.2.0-beta.0`.
- `docs/beta-plus/release-notes-beta-plus.md` reflects the shipped scope and remaining gaps.

## Local Gate

Run the full Beta+ gate:

```bash
pnpm release:beta-plus:check
```

If Playwright browsers are missing locally, install Chromium first:

```bash
pnpm exec playwright install chromium
```

## Artifact Review

- Confirm `dist/beta-plus-tarballs/` contains all five public packages.
- Confirm every tarball is stamped as `0.2.0-beta.0`.
- Confirm the generated consumer app in `.tmp/beta-plus-consumer/` builds from the tarballs with public imports only.

## Publish Steps

1. Confirm the working tree is in the intended release state and rerun `pnpm release:beta-plus:check` if anything changed after the last green run.
2. Create the annotated release tag locally:

```bash
git tag -a v0.2.0-beta.0 -m "ArgFit UI Beta+ 0.2.0-beta.0"
```

3. Push the tag:

```bash
git push origin v0.2.0-beta.0
```

4. Ensure the `NPM_TOKEN` secret is present in GitHub Actions.
5. Let the tag push trigger `.github/workflows/publish-beta-plus.yml`. If you need a manual retry, dispatch it with `release_tag = v0.2.0-beta.0` and `publish_confirmation = publish-beta-plus-v0.2.0-beta.0`.
6. Verify the workflow checks out and validates the exact tag before publishing.
7. Verify packages land on npm under the `beta` dist-tag.

## Post-Publish Checks

- Install the published `0.2.0-beta.0` packages in a fresh consumer app.
- Verify Beta+ docs and release notes match the published artifacts.
- Keep `AfTreeSelect` and the remaining advanced-form backlog explicitly documented as pending.
