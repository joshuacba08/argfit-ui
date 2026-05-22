# Beta+ Release Checklist

Use this checklist before dispatching the Beta+ publish workflow.

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

1. Create or push the intended Beta+ tag, or use `workflow_dispatch` on the Beta+ publish workflow.
2. Ensure the `NPM_TOKEN` secret is present in GitHub Actions.
3. Run `.github/workflows/publish-beta-plus.yml`.
4. Verify packages land on npm under the `beta` dist-tag.

## Post-Publish Checks

- Install the published `0.2.0-beta.0` packages in a fresh consumer app.
- Verify Beta+ docs and release notes match the published artifacts.
- Keep `AfTreeSelect` and the remaining advanced-form backlog explicitly documented as pending.