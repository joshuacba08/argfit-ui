# HU-043 - Production 1.0 Release Gate

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 13 - Productive 1.0

## Dependencias

Esta HU depende de:

- HU-038 - Productive Scope And Semver Freeze.
- HU-039 - Productive Quality Gates.
- HU-040 - Productive Enterprise Readiness.
- HU-041 - Productive Documentation Site.
- HU-042 - Productive Release Operations And Support Policy.

## Objetivo

Publicar `1.0.0` solo despues de pasar el gate productivo completo.

## Alcance Incluido

Paths esperados:

- `package.json`
- `projects/argfit-ui-*/package.json`
- `.github/workflows/publish-production.yml`
- `docs/productive/release-checklist.md`
- `docs/productive/release-notes-1.0.0.md`
- `CHANGELOG.md`

## Criterios De Aceptacion

1. Versiones alineadas en `1.0.0`.
2. Production release checklist exists.
3. Production release notes exist.
4. Publish workflow uses npm `latest` dist-tag.
5. `pnpm release:production:check` passes locally and in CI.

## Comandos De Validacion

```bash
pnpm release:production:check
git status --short
```
