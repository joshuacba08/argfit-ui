# HU-018 — Alpha Release Gate And CI

## Estado

Ready for implementation

## Fase del Roadmap

Fase 9 — Tooling / Fase 10 — Alpha Distribution

## Dependencias

Esta HU depende de:

- HU-015 — Alpha Public API Scope.
- HU-016 — Alpha Packaging And Versioning.
- HU-017 — Alpha Consumer Docs And Showcase.

## Decision de Producto

La alpha necesita un gate reproducible. Antes de crear un tag o publicar paquetes, debe existir una suite automatizada que valide arquitectura, build, tests, packaging y consumo minimo.

No hace falta automatizar la publicacion en esta primera iteracion. Si el publish queda manual, el proceso debe estar documentado y protegido por checks.

## Historia de Usuario

Como maintainer de ArgFit UI, quiero un release gate automatizado para la version alpha, para saber que los paquetes compilan, se empaquetan y pueden ser consumidos antes de publicar o compartir tarballs.

## Objetivo

Crear el gate de release alpha:

- Workflow CI de pull request/push.
- Comando local `release:alpha:check`.
- Pack dry-run por paquete.
- Smoke test de consumo.
- Changelog/release notes alpha.
- Checklist manual de publish.

## Alcance Incluido

Paths esperados:

- `.github/workflows/ci.yml`
- `.github/workflows/alpha-release-check.yml` si se separa del CI general.
- `package.json`
- `tools/alpha-smoke.mjs`
- `tools/pack-alpha.mjs`
- `docs/alpha/release-checklist.md`
- `docs/alpha/release-notes-alpha.md`
- `CHANGELOG.md`

## Gate Local Sugerido

Agregar script:

```json
{
  "release:alpha:check": "pnpm guard:architecture && pnpm build:all && pnpm test:all && pnpm pack:alpha && node tools/alpha-smoke.mjs"
}
```

Si `pnpm test:all` ya incluye build y guard, evitar duplicacion innecesaria, pero mantener el comando claro.

## Smoke Test Sugerido

`tools/alpha-smoke.mjs` debe validar, con el menor peso posible:

- `dist/argfit-ui-core` existe.
- `dist/argfit-ui-primitives` existe.
- `dist/argfit-ui-desktop` existe.
- `dist/argfit-ui-mobile` existe.
- `dist/argfit-ui-adaptive` existe.
- Cada dist package tiene `package.json`.
- Cada package exporta entrypoint.
- Tarballs se pueden generar.
- Un archivo TypeScript minimo puede importar exports principales, o se documenta por que se difiere.

Si se crea una app temporal de consumo, debe vivir en `.tmp/alpha-smoke` y no commitearse.

## Workflow CI Sugerido

Debe ejecutar:

- Checkout.
- Setup Node compatible con Angular 21.
- Setup pnpm.
- `pnpm install --frozen-lockfile`.
- `pnpm guard:architecture`.
- `pnpm build:all`.
- `pnpm test:all`.
- `pnpm publish:alpha:dry-run` o `pnpm pack:alpha`.
- Upload opcional de tarballs como artifacts si no se publica.

## Fuera de Alcance

Esta HU NO debe:

- Publicar automaticamente a npm.
- Configurar secrets de npm.
- Crear GitHub release final si no hay decision de publicacion.
- Implementar visual regression completa.
- Crear Storybook.

## Requisitos

- CI debe fallar si arquitectura falla.
- CI debe fallar si cualquier paquete no compila.
- CI debe fallar si tests fallan.
- CI debe fallar si `npm pack --dry-run` falla.
- Release checklist debe indicar pasos para tag `v0.1.0-alpha.0`.
- Release checklist debe indicar publish con dist-tag `alpha`.
- Changelog debe tener seccion `0.1.0-alpha.0`.

## Tests Requeridos

- Ejecutar localmente `pnpm release:alpha:check`.
- Validar workflow YAML sintacticamente.
- Validar que `.tmp` y tarballs no queden commiteados.

## Criterios de Aceptacion

1. Existe workflow CI.
2. Existe comando `release:alpha:check`.
3. Existe pack dry-run automatizado.
4. Existe smoke test alpha o decision documentada de diferirlo.
5. Existe `docs/alpha/release-checklist.md`.
6. Existe `CHANGELOG.md` con `0.1.0-alpha.0`.
7. Tarballs no quedan versionados.
8. `pnpm release:alpha:check` pasa localmente.

## Checklist Tecnica

- [ ] Leer HU-015, HU-016 y HU-017.
- [ ] Crear workflow CI.
- [ ] Crear scripts alpha.
- [ ] Crear smoke test.
- [ ] Crear checklist de release.
- [ ] Crear changelog.
- [ ] Ejecutar gate local.
- [ ] Confirmar git status limpio salvo archivos esperados.

## Comandos de Validacion

```bash
pnpm release:alpha:check
git status --short
```

## Prompt Recomendado

```txt
Implementa HU-018 — Alpha Release Gate And CI.

Objetivo:
Crear el gate automatizado para publicar 0.1.0-alpha.0: CI, scripts locales, pack dry-run, smoke test, changelog y checklist de release.

Definition of Done:
Workflow CI existe, release:alpha:check existe y pasa, pack dry-run funciona, smoke test valida dist packages, CHANGELOG y docs/alpha/release-checklist.md existen.
```

## Nota de Producto

Esta HU le pone puerta a la alpha. Despues de esto, publicar no depende de memoria ni suerte: depende de un check reproducible.
