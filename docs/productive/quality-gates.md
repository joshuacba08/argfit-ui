# Productive Quality Gates

ArgFit UI uses `pnpm release:production:check` as the mandatory production-readiness gate.

Until `HU-043` aligns the publishable package versions to `1.0.0`, this gate intentionally reuses the broader Beta+ packaging and consumer-validation flow as the production validation substrate.

## Required Local Gate

```bash
pnpm release:production:check
```

## Mandatory Checks

- architecture guard
- regression guard
- full library and showcase tests
- accessibility audit across the workspace test targets
- Beta+ packaging and API guard
- external consumer compatibility smoke
- focused Beta+ accessibility audit
- focused Beta+ visual smoke
- production package smoke
- production performance budgets

## Performance Budgets

These budgets are enforced by `pnpm measure:production-performance:dist`.

| Artifact | Budget |
| --- | --- |
| Showcase initial asset total | `2.90 MB` raw |
| Showcase main bundle | `2.75 MB` raw |
| Showcase styles bundle | `60 kB` raw |
| Beta+ tarball total | `650 kB` |
| `@argfit-ui/core` tarball | `35 kB` |
| `@argfit-ui/primitives` tarball | `15 kB` |
| `@argfit-ui/adaptive` tarball | `130 kB` |
| `@argfit-ui/desktop` tarball | `250 kB` |
| `@argfit-ui/mobile` tarball | `230 kB` |

## Exceptions

No active budget exceptions.

If a budget ever needs to move, the exception must be documented in this file in the same change that updates the threshold and the rationale must explain why the increase is unavoidable.

## CI Expectation

CI must execute `pnpm release:production:check` on `pull_request` and on pushes to `main`, and it must upload the generated Beta+ tarballs and visual smoke screenshots for debugging.
