# HU-025 - Beta Docs, API Reference And Migration

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 11 - Beta Hardening / Fase 6 - Showcase Platform

## Dependencias

Esta HU depende de:

- HU-019 - Beta Scope And Public API Contract.
- HU-020 - Beta Experimental Components Hardening.
- HU-023 - Beta Consumer Compatibility Matrix.

## Decision De Producto

La beta debe poder entenderse sin leer el roadmap ni las HUs. La documentacion debe explicar instalacion, setup, API, ejemplos, compatibilidad, migracion y limites.

## Historia De Usuario

Como desarrollador que evalua ArgFit UI beta, quiero documentacion clara y orientada a consumo, para instalar la libreria, elegir componentes y migrar desde alpha sin depender del contexto interno del repo.

## Objetivo

Crear documentacion beta de consumo:

- Quickstart beta.
- API reference por componente beta.
- Guia de migracion alpha -> beta.
- Compatibilidad.
- Theming.
- Showcase como referencia visual beta.
- Known limitations beta.

## Alcance Incluido

Paths esperados:

- `docs/beta/quickstart.md`
- `docs/beta/components.md`
- `docs/beta/public-api.md`
- `docs/beta/migration-alpha-to-beta.md`
- `docs/beta/compatibility.md`
- `docs/beta/theming.md`
- `docs/beta/known-limitations.md`
- `README.md`
- `projects/argfit-ui-*/README.md`
- `projects/showcase/src/app/*`

## Requisitos De Docs

Cada componente `stable-for-beta` debe tener:

- Import.
- Selector.
- Descripcion corta.
- Inputs principales.
- Outputs principales.
- Ejemplo compacto.
- Estado desktop/mobile.
- Nota de accesibilidad.
- Nota de theming si aplica.

La migracion alpha -> beta debe incluir:

- Cambios de version.
- Cambios de imports.
- Renames o removals.
- APIs que dejaron de ser experimentales.
- APIs que siguen experimentales.
- Comando recomendado de validacion.

## Showcase Beta

El showcase debe tener una seccion beta o actualizar la seccion alpha para:

- Mostrar version beta.
- Enlazar docs beta.
- Mostrar componentes `stable-for-beta`.
- Marcar claramente lo experimental-in-beta.

## Fuera De Alcance

Esta HU NO debe:

- Crear una web publica externa.
- Crear Storybook completo.
- Publicar paquete npm.

## Criterios De Aceptacion

1. Existe `docs/beta/quickstart.md`.
2. Existe `docs/beta/components.md`.
3. Existe `docs/beta/known-limitations.md`.
4. README root enlaza docs beta.
5. Package READMEs indican version beta y docs beta.
6. Guia de migracion alpha -> beta es accionable.
7. Showcase enlaza docs beta.
8. `pnpm build:all` pasa.
9. `ng test showcase --watch=false` pasa.

## Checklist Tecnica

- [ ] Leer HU-019 y HU-020.
- [ ] Inventariar componentes stable-for-beta.
- [ ] Crear docs beta.
- [ ] Actualizar README root.
- [ ] Actualizar package READMEs.
- [ ] Actualizar showcase.
- [ ] Validar links internos.
- [ ] Ejecutar validaciones.

## Comandos De Validacion

```bash
pnpm build:all
ng test showcase --watch=false
```

## Prompt Recomendado

```txt
Implementa HU-025 - Beta Docs, API Reference And Migration.

Objetivo:
Crear la documentacion de consumo beta, API reference y guia de migracion alpha -> beta.

Definition of Done:
docs/beta contiene quickstart, components, public-api, migration, compatibility, theming y known-limitations; README y showcase enlazan beta; build y tests del showcase pasan.
```

