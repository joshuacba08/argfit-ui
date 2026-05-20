# HU-016 — Alpha Packaging And Versioning

## Estado

Ready for implementation

## Fase del Roadmap

Fase 9 — Tooling / Fase 10 — Alpha Distribution

## Dependencias

Esta HU depende de:

- HU-015 — Alpha Public API Scope.

## Decision de Producto

Para publicar una primera version `-alpha`, los paquetes deben tener metadata coherente, versiones prerelease consistentes, peer dependencies correctas y comandos seguros para generar tarballs antes de publicar.

La version objetivo sugerida es:

```txt
0.1.0-alpha.0
```

## Historia de Usuario

Como maintainer de ArgFit UI, quiero preparar metadata, versionado y empaquetado de los paquetes publicables, para poder generar artefactos npm alpha verificables sin romper dependencias internas entre paquetes.

## Objetivo

Preparar los paquetes para distribucion alpha:

- Versionar paquetes a `0.1.0-alpha.0`.
- Alinear peer dependencies internas `@argfit-ui/*`.
- Completar metadata npm.
- Agregar scripts de pack/dry-run.
- Confirmar contenido de tarballs.
- Documentar pasos de publish manual con dist-tag `alpha`.

## Alcance Incluido

Paths esperados:

- `package.json`
- `projects/argfit-ui-core/package.json`
- `projects/argfit-ui-primitives/package.json`
- `projects/argfit-ui-desktop/package.json`
- `projects/argfit-ui-mobile/package.json`
- `projects/argfit-ui-adaptive/package.json`
- `projects/*/ng-package.json`
- `docs/alpha/package-metadata.md`
- `docs/alpha/publish-alpha.md`
- `tools/pack-alpha.mjs` o script equivalente si se decide automatizar.

## Metadata Esperada Por Paquete

Cada paquete publicable debe revisar:

- `name`
- `version`
- `description`
- `keywords`
- `author` si aplica.
- `license` o decision explicita si queda privada.
- `repository`
- `homepage`
- `bugs`
- `peerDependencies`
- `dependencies`
- `sideEffects`
- `publishConfig`

Si la libreria no se publicara aun en npm publico, documentar el modo `private registry` o `local tarball` para la alpha.

## Scripts Sugeridos

Agregar scripts en root si son utiles:

```json
{
  "build:packages": "pnpm build:libs",
  "pack:alpha": "pnpm build:libs && node tools/pack-alpha.mjs",
  "publish:alpha:dry-run": "pnpm build:libs && node tools/pack-alpha.mjs --dry-run"
}
```

El script puede hacer `npm pack --dry-run` dentro de cada `dist/argfit-ui-*`.

## Fuera de Alcance

Esta HU NO debe:

- Publicar realmente a npm.
- Crear GitHub release.
- Crear changelog de release final.
- Cambiar el scope de componentes.
- Implementar componentes faltantes.

## Requisitos

- Todos los paquetes `@argfit-ui/*` deben compartir version alpha.
- Las peer dependencies internas deben apuntar a la version alpha exacta o rango prerelease documentado.
- Root `package.json` puede seguir `private: true`.
- Los paquetes publicables NO deben tener `private: true`.
- `dist` debe contener package metadata correcta tras build.
- Los tarballs no deben incluir fuentes innecesarias, logs, `.tmp`, showcase build ni assets pesados no requeridos.
- La decision sobre `license` debe quedar documentada antes del publish.

## Tests Requeridos

- `pnpm build:libs`.
- `npm pack --dry-run` por cada paquete en `dist`.
- Validar que `@argfit-ui/adaptive` puede resolver peers de core/primitives/desktop/mobile.
- Validar que package names son scoped y correctos.

## Criterios de Aceptacion

1. Todos los paquetes publicables estan en `0.1.0-alpha.0` o version alpha documentada.
2. Peer dependencies internas estan alineadas.
3. Metadata npm minima existe.
4. Existe documentacion `docs/alpha/package-metadata.md`.
5. Existe documentacion `docs/alpha/publish-alpha.md`.
6. Existe comando o procedimiento de `npm pack --dry-run`.
7. Los tarballs alpha se generan sin contenido accidental.
8. `pnpm build:libs` pasa.

## Checklist Tecnica

- [ ] Leer HU-015.
- [ ] Revisar `projects/*/package.json`.
- [ ] Revisar `projects/*/ng-package.json`.
- [ ] Definir version alpha.
- [ ] Alinear peer dependencies.
- [ ] Agregar metadata.
- [ ] Agregar scripts o documentar procedimiento manual.
- [ ] Crear docs alpha de packaging.
- [ ] Ejecutar `npm pack --dry-run`.

## Comandos de Validacion

```bash
pnpm build:libs
pnpm publish:alpha:dry-run
```

Si no existe script:

```bash
pnpm build:libs
cd dist/argfit-ui-core && npm pack --dry-run
cd ../argfit-ui-primitives && npm pack --dry-run
cd ../argfit-ui-desktop && npm pack --dry-run
cd ../argfit-ui-mobile && npm pack --dry-run
cd ../argfit-ui-adaptive && npm pack --dry-run
```

## Prompt Recomendado

```txt
Implementa HU-016 — Alpha Packaging And Versioning.

Objetivo:
Preparar los paquetes @argfit-ui/* para 0.1.0-alpha.0 con metadata npm, peer dependencies internas alineadas y pack dry-run verificable.

Definition of Done:
package metadata lista, docs/alpha/package-metadata.md y docs/alpha/publish-alpha.md creados, comando pack/dry-run disponible o documentado, pnpm build:libs y npm pack --dry-run por paquete pasan.
```

## Nota de Producto

Esta HU convierte la libreria de workspace local en artefactos distribuibles. Sin esto, una alpha no es una alpha: es solo un repo que compila.
