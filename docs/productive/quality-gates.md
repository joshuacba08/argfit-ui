# Productive Quality Gates

ArgFit UI uses `pnpm release:production:check` as the mandatory production-readiness gate.

The gate keeps the broad Beta+ validation substrate for regression coverage, then rebuilds and verifies stable `1.0.0` production packages.

## Required Local Gate

```bash
pnpm release:production:check
```

## Mandatory Checks

- architecture guard
- regression guard
- full library and showcase tests
- accessibility audit across the workspace test targets
- Beta+ packaging, API guard and external consumer compatibility smoke
- focused Beta+ accessibility audit
- focused Beta+ visual smoke
- production package dry-run and tarball packaging
- production package smoke
- production performance budgets

## Performance Budgets

These budgets are enforced by `pnpm measure:production-performance:dist`.

| Artifact | Budget |
| --- | --- |
| Showcase initial asset total | `2.90 MB` raw |
| Showcase main bundle | `2.75 MB` raw |
| Showcase styles bundle | `60 kB` raw |
| Production tarball total | `650 kB` |
| `@argfit-ui/core` tarball | `35 kB` |
| `@argfit-ui/primitives` tarball | `15 kB` |
| `@argfit-ui/adaptive` tarball | `130 kB` |
| `@argfit-ui/desktop` tarball | `250 kB` |
| `@argfit-ui/mobile` tarball | `230 kB` |

## Exceptions

No active budget exceptions.

If a budget ever needs to move, the exception must be documented in this file in the same change that updates the threshold and the rationale must explain why the increase is unavoidable.

## CI Expectation

CI must execute `pnpm release:production:check` on `pull_request` and on pushes to `main`, and it must upload the generated production tarballs and visual smoke screenshots for debugging.
