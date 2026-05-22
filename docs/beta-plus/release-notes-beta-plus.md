# Beta+ Release Notes

## Version

`0.2.0-beta.0`

## Highlights

- Dedicated Beta+ tarball flow generated in parallel to the historical beta baseline.
- External consumer smoke app built from Beta+ tarballs through public ArgFit imports only.
- Focused Beta+ accessibility and visual smoke coverage for overlays, status/identity, advanced forms, data, panel/layout and workflow surfaces.
- Dedicated Beta+ release gate and optional publish workflow using the npm `beta` dist-tag.

## Representative Beta+ Surface In This Release

- overlays: `AfTooltip`, `AfPopover`, `AfDrawer`
- status and identity: `AfAvatar`, `AfChip`, `AfProgress`
- advanced forms: `AfInputCount`, `AfMultiSelect`, `AfDatePicker`, `AfListbox`
- data: `AfDataView`, `AfTimeline`, `AfTree`
- panel and layout: `AfTabs`, `AfStepper`, `AfSplitter`
- workflow: `AfKanban`

## Validation Added

- `pnpm beta-plus:consumer-smoke`
- `pnpm audit:accessibility:beta-plus`
- `pnpm visual:beta-plus`
- `pnpm guard:beta-plus:api`
- `pnpm release:beta-plus:check`

## Known Gaps

- `AfTreeSelect` remains pending and is not part of this release gate.
- The curated showcase still intentionally focuses on waves 1, 2 and 5; wave 3 and wave 4 are validated through the generated consumer app.
- Visual QA remains a smoke workflow rather than a full pixel baseline program.
