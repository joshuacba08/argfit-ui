# HU-026 - Beta Release Gate And Publish Channel

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 11 - Beta Hardening / Fase 10 - Distribution

## Dependencias

Esta HU depende de:

- HU-019 - Beta Scope And Public API Contract.
- HU-020 - Beta Experimental Components Hardening.
- HU-021 - Beta Accessibility And Keyboard Audit.
- HU-022 - Beta Visual Regression And Responsive QA.
- HU-023 - Beta Consumer Compatibility Matrix.
- HU-024 - Beta Performance And Bundle Budget.
- HU-025 - Beta Docs, API Reference And Migration.

## Decision De Producto

La beta necesita su propio gate y canal de publicacion. No debe reutilizar nombres alpha ni publicar accidentalmente con dist-tag `alpha`.

## Historia De Usuario

Como maintainer de ArgFit UI, quiero un release gate beta reproducible y un publish channel separado, para publicar `0.1.0-beta.0` con confianza y sin mezclarlo con alpha.

## Objetivo

Crear release flow beta:

- Version `0.1.0-beta.0`.
- Scripts `pack:beta`, `publish:beta:dry-run`, `release:beta:check`.
- Smoke beta.
- Consumer smoke beta.
- Visual/a11y/performance gates beta.
- Workflow CI beta.
- Workflow publish beta con dist-tag `beta`.
- Release notes y changelog beta.

## Alcance Incluido

Paths esperados:

- `package.json`
- `projects/argfit-ui-*/package.json`
- `tools/pack-beta.mjs`
- `tools/beta-smoke.mjs`
- `tools/beta-consumer-smoke.mjs`
- `.github/workflows/ci.yml`
- `.github/workflows/publish-beta.yml`
- `docs/beta/release-checklist.md`
- `docs/beta/release-notes-beta.md`
- `CHANGELOG.md`

## Gate Local Sugerido

```json
{
  "release:beta:check": "pnpm guard:architecture && pnpm build:all && pnpm test:all && pnpm visual:beta && pnpm beta:consumer-smoke && pnpm publish:beta:dry-run && pnpm smoke:beta"
}
```

El comando final puede variar, pero debe incluir arquitectura, build, tests, packaging, smoke de consumidor, visual QA y performance sin warnings.

## Requisitos

- Publish config usa `tag: beta`.
- Internal peer dependencies usan version exacta `0.1.0-beta.0`.
- Tarballs se escriben en `dist/beta-tarballs/`.
- CI falla si `release:beta:check` falla.
- Publish beta requiere `NPM_TOKEN`.
- Tag esperado: `v0.1.0-beta.0`.
- Changelog tiene seccion beta.

## Fuera De Alcance

Esta HU NO debe:

- Publicar automaticamente sin tag o workflow aprobado.
- Eliminar canal alpha.
- Crear release `1.0`.

## Criterios De Aceptacion

1. Versiones beta alineadas en root y packages.
2. Existen scripts beta.
3. Existe gate `release:beta:check`.
4. Existe workflow `publish-beta.yml`.
5. Tarballs beta se generan en `dist/beta-tarballs/`.
6. Publish usa `--tag beta --access public`.
7. Release checklist beta existe.
8. Release notes beta existen.
9. `pnpm release:beta:check` pasa localmente.
10. `git status --short` solo muestra cambios intencionales.

## Checklist Tecnica

- [ ] Leer todas las HUs beta previas.
- [ ] Cambiar versiones a `0.1.0-beta.0`.
- [ ] Crear scripts beta.
- [ ] Crear smoke beta.
- [ ] Crear workflow publish beta.
- [ ] Crear docs release beta.
- [ ] Actualizar changelog.
- [ ] Ejecutar gate beta.

## Comandos De Validacion

```bash
pnpm release:beta:check
git status --short
```

## Prompt Recomendado

```txt
Implementa HU-026 - Beta Release Gate And Publish Channel.

Objetivo:
Crear el gate y canal de publicacion para `0.1.0-beta.0`, con tarballs beta, smoke beta, consumer smoke, visual QA, docs de release y workflow publish-beta.

Definition of Done:
pnpm release:beta:check pasa, tarballs beta se generan, publish-beta.yml usa dist-tag beta, y CHANGELOG/docs beta quedan actualizados.
```

