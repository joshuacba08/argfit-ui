# HU-017 — Alpha Consumer Docs And Showcase

## Estado

Ready for implementation

## Fase del Roadmap

Fase 6 — Showcase Platform / Fase 10 — Alpha Distribution

## Dependencias

Esta HU depende de:

- HU-015 — Alpha Public API Scope.
- HU-016 — Alpha Packaging And Versioning.

## Decision de Producto

La primera alpha necesita documentacion de consumo, no solo documentacion interna. Un usuario debe poder instalar los paquetes, registrar providers, importar componentes adaptativos y ver ejemplos representativos sin leer todo el roadmap.

El showcase debe funcionar como primera documentacion visual de la alpha.

## Historia de Usuario

Como consumidor temprano de ArgFit UI, quiero una guia alpha clara con instalacion, setup, peer dependencies, imports y ejemplos, para probar la libreria en una app Angular sin depender del contexto interno del repo.

## Objetivo

Crear documentacion y showcase para alpha:

- Quickstart de instalacion.
- Guia de theming.
- Guia de platform/adaptive rendering.
- Tabla de componentes incluidos.
- Ejemplos de uso por componente alpha.
- Showcase con seccion `Alpha`.
- Notas de limitaciones y breaking changes.

## Alcance Incluido

Paths esperados:

- `README.md`
- `docs/alpha/quickstart.md`
- `docs/alpha/theming.md`
- `docs/alpha/components.md`
- `docs/alpha/known-limitations.md`
- `docs/alpha/release-notes-alpha.md`
- `projects/argfit-ui-core/README.md`
- `projects/argfit-ui-primitives/README.md`
- `projects/argfit-ui-desktop/README.md`
- `projects/argfit-ui-mobile/README.md`
- `projects/argfit-ui-adaptive/README.md`
- `projects/showcase/src/app/app.ts`
- `projects/showcase/src/app/app.html`
- `projects/showcase/src/app/app.scss`
- `projects/showcase/src/app/app.spec.ts`

## Documentacion Minima

`docs/alpha/quickstart.md` debe incluir:

- Requisitos de Angular.
- Instalacion con `pnpm add`.
- Peer dependencies relevantes.
- Setup de `provideArgfitUi`.
- Import desde `@argfit-ui/adaptive`.
- Primer ejemplo de template.
- Troubleshooting basico.

`docs/alpha/components.md` debe incluir:

- Componentes incluidos en alpha.
- Componentes experimentales.
- Componentes planned.
- Inputs/outputs principales.
- Ejemplos compactos.

`docs/alpha/known-limitations.md` debe incluir:

- Que APIs pueden romperse antes de beta.
- Que componentes aun no estan listos.
- Que visual regression no es bloqueante si aun no existe.
- Que mobile/desktop internals son vendor-specific pero la API no.

## Showcase Alpha

Agregar una vista o seccion `Alpha` que muestre:

- Setup visual de theme/platform.
- `AfButton`, `AfCard`, `AfInput`, `AfDialog`.
- `AfIcon`, `AfBadge`.
- `AfChart`.
- `AfPageShell`.
- `AfMetricCard`.
- Links internos a docs alpha.

Si `AfDataTable`, `AfAnalyticsCard`, forms o toast no estan terminados, mostrarlos como planned/experimental sin romper build.

## Fuera de Alcance

Esta HU NO debe:

- Publicar npm.
- Crear CI.
- Crear versionado automatico.
- Escribir documentacion exhaustiva tipo Storybook.
- Crear visual regression.

## Requisitos

- README root debe dejar de decir solo "foundation" si la alpha ya esta lista.
- Debe existir una guia para instalar desde npm o tarball local.
- Debe documentarse el orden recomendado de paquetes.
- Debe quedar claro que consumidores normalmente usan `@argfit-ui/adaptive`.
- Deben documentarse peers: Angular, CDK, PrimeNG, Ionic, Lucide, ECharts cuando corresponda.
- Showcase debe compilar en production.

## Tests Requeridos

- `pnpm build:all`.
- `ng test showcase --watch=false`.
- Verificacion manual de docs links.

## Criterios de Aceptacion

1. Existe `docs/alpha/quickstart.md`.
2. Existe `docs/alpha/components.md`.
3. Existe `docs/alpha/theming.md`.
4. Existe `docs/alpha/known-limitations.md`.
5. README enlaza docs alpha.
6. Package READMEs tienen instalacion/uso minimo.
7. Showcase incluye una seccion alpha.
8. `pnpm build:all` pasa.
9. `ng test showcase --watch=false` pasa.

## Checklist Tecnica

- [ ] Leer HU-015 y HU-016.
- [ ] Revisar README root.
- [ ] Revisar README de cada paquete.
- [ ] Crear docs alpha.
- [ ] Agregar ejemplos de consumo.
- [ ] Agregar seccion alpha al showcase.
- [ ] Actualizar tests del showcase.
- [ ] Ejecutar validaciones.

## Comandos de Validacion

```bash
pnpm build:all
ng test showcase --watch=false
```

## Prompt Recomendado

```txt
Implementa HU-017 — Alpha Consumer Docs And Showcase.

Objetivo:
Crear documentacion de consumo para 0.1.0-alpha.0 y una seccion Alpha en el showcase que demuestre los componentes incluidos.

Definition of Done:
docs/alpha/quickstart.md, theming.md, components.md, known-limitations.md y release-notes-alpha.md existen; README y package READMEs enlazan la alpha; showcase compila y muestra la seccion Alpha.
```

## Nota de Producto

Esta HU hace que la alpha sea entendible para alguien que no estuvo en la construccion. Ese es el salto de demo interna a libreria usable.
