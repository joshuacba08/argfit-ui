# Beta Known Limitations

ArgFit UI `0.1.0-beta.0` is a stricter early-adopter contract than alpha, but it is still not a `1.0.0` stability promise.

## Breaking-Change Policy

- `stable-for-beta` APIs should change only for serious correctness, accessibility or architecture reasons.
- Any breaking change to `stable-for-beta` should ship with migration notes.
- `experimental-in-beta` APIs can still change shape, naming or behavior between beta prereleases.
- `renderer-specific` packages remain public, but they are not the preferred application path.
- Keep every `@argfit-ui/*` package on the exact same prerelease version.

## Distribution Status

- The beta docs describe the intended `0.1.0-beta.0` contract.
- The final `beta` dist-tag flow is still completed by HU-026.
- Until then, local beta validation uses `pnpm beta:consumer-smoke` and `pnpm release:beta:check`.
- Local artifacts are still generated under `dist/alpha-tarballs/` during the current hardening flow.

## Experimental Surfaces Still In Beta

The following areas remain public but intentionally stay `experimental-in-beta`:

- analytics composition;
- data-table APIs;
- expanded form controls;
- feedback orchestration.

If you adopt them early, keep them behind app-level wrappers and re-test them on every beta prerelease.

## Component Coverage Still Out Of Scope

The following surfaces are not promised for the current beta milestone:

- popover, drawer, tooltip and command-palette style overlays;
- avatar, chip, progress and accordion surfaces planned for Beta+;
- date picker, file upload, autocomplete, slider and schema-driven forms;
- data-table virtualization, server-side sources, column resizing, column reorder and inline editing;
- chart export, drilldown, synchronized charts and 3D presets;
- notification center and persistent notification history.

## Rendering And SSR

- Desktop rendering remains PrimeNG-first internally.
- Mobile rendering remains Ionic-first internally.
- There are zero approved PrimeNG exceptions inside the current mobile beta contract.
- The adaptive public API remains vendor-independent, but renderer internals can still evolve.
- Charts remain browser-oriented and SSR is outside the current beta scope.
- Mobile rendering expects the host runtime to support Ionic custom elements.

## Validation Scope Limits

- Visual beta QA is currently a screenshot smoke, not a pixel-baseline diff workflow.
- Consumer smoke validates external installation and production build, not complete product QA.
- Accessibility gating exists, but there is no automated screen-reader matrix or formal certification flow yet.
- Performance budgets are now documented, but bundle reviews should still be repeated when the catalog grows.

## Recommended Consumer Posture

- Prefer `@argfit-ui/adaptive` in application code.
- Avoid styling PrimeNG, Ionic or ECharts internals.
- Pin exact prerelease versions during beta.
- Review [Migration alpha to beta](./migration-alpha-to-beta.md) before upgrading.
- Review [Beta consumer compatibility](./compatibility.md) and [Beta package matrix](./package-matrix.md) before integrating the full package set.