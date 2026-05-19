# HU-001 — Formalizar Tokens del Design System

## Estado

Ready for implementation

## Fase del Roadmap

Fase 1 — Core System

## Fuentes de Diseño

- `C:\Users\Ander\Downloads\ArgFit\colors_and_type.css`
- `C:\Users\Ander\Downloads\ArgFit\README.md`
- `C:\Users\Ander\Downloads\ArgFit\SKILL.md`
- Referencias visuales adjuntas: desktop dashboard, tabla avanzada, kanban, analytics, modal desktop, home mobile, overlays mobile, charts mobile y forms mobile.

## Historia de Usuario

Como desarrollador de ArgFit UI, quiero formalizar los tokens del design system de ArgFit dentro de `@argfit-ui/core`, para que todas las capas futuras (`primitives`, `desktop`, `mobile`, `adaptive` y `showcase`) consuman una identidad visual consistente, versionable y desacoplada de PrimeNG/Ionic.

## Objetivo

Convertir el design system generado en Claude Design en un contrato tecnico estable dentro de `argfit-ui-core`.

La HU debe dejar definidos:

- Escalas base de color.
- Alias semanticos de tema.
- Tipografia.
- Spacing.
- Radius.
- Shadows/elevation.
- Motion.
- Focus states.
- Dark theme como tema principal.
- Light theme como definicion disponible, sin obligar todavia a construir UI de switching.

## Contexto Visual

ArgFit UI debe verse como una plataforma deportiva enterprise, tecnica y data-driven:

- Dark-first.
- Fondo navy profundo.
- Superficies blue-tinted.
- Bordes suaves azulados.
- Primary blue para acciones.
- Accent cyan para highlights, metricas y data viz.
- Success/warning/error claros para estados.
- Headings display en uppercase.
- Body/UI compacto y legible.
- Cards densas, sobrias y ligeramente elevadas.
- Mobile con safe-area, bottom navigation y cards full-width.
- Desktop con sidebar, topbar, tablas densas y paneles de analitica.

## Alcance Incluido

Modificar `@argfit-ui/core` para que el sistema de tokens refleje el design system real.

Paths esperados:

- `projects/argfit-ui-core/src/lib/tokens/theme-token-names.ts`
- `projects/argfit-ui-core/src/lib/themes/argfit-dark.theme.ts`
- `projects/argfit-ui-core/src/lib/themes/theme.types.ts`
- `projects/argfit-ui-core/src/lib/themes/theme.service.ts`
- `projects/argfit-ui-core/src/lib/core-systems.spec.ts`
- `projects/argfit-ui-core/src/public-api.ts`

Si hace falta, se pueden agregar archivos nuevos dentro de:

```txt
projects/argfit-ui-core/src/lib/tokens/
projects/argfit-ui-core/src/lib/themes/
```

## Fuera de Alcance

Esta HU NO debe implementar:

- `AfCard`, `AfInput`, `AfDataTable` ni nuevos componentes visuales.
- Cambios en PrimeNG o Ionic.
- Showcase completo del design system.
- Tema premium.
- Persistencia de preferencia de tema.
- Switcher visual dark/light.
- Carga final de assets de marca.

## Regla de Naming

Los tokens publicos deben mantener namespace `--af-*`.

Los nombres originales de Claude Design como `--primary-400`, `--surface-1` o `--font-body` son fuente de verdad conceptual, pero no deben exponerse sin namespace en ArgFit UI.

Ejemplos esperados:

```txt
--af-color-primary-400
--af-color-accent-400
--af-color-neutral-900
--af-bg-main
--af-surface-1
--af-text-main
--af-font-display
--af-font-body
--af-space-4
--af-radius-md
--af-shadow-glow
--af-duration-normal
--af-ease-out
```

## Tokens Base Requeridos

### Brand Colors

```txt
Primary 400: #2599D5
Accent 400:  #00D4FF
Dark BG:     #0A1628
```

### Color Scales

Implementar escalas completas:

- `--af-color-primary-50` a `--af-color-primary-900`
- `--af-color-accent-50` a `--af-color-accent-900`
- `--af-color-neutral-50` a `--af-color-neutral-900`

### Semantic Colors

Implementar:

- `--af-success`
- `--af-success-light`
- `--af-success-dark`
- `--af-warning`
- `--af-warning-light`
- `--af-warning-dark`
- `--af-danger`
- `--af-danger-light`
- `--af-danger-dark`
- `--af-info`
- `--af-info-light`
- `--af-info-dark`

Nota: el archivo fuente usa `--error`; ArgFit UI debe exponerlo como `--af-danger` para mantener naming consistente con el core actual.

### Dark Theme Aliases

Implementar como minimo:

```txt
--af-bg-main
--af-bg-elevated
--af-surface-1
--af-surface-2
--af-surface-3
--af-surface-4
--af-bg-overlay
--af-border
--af-border-strong
--af-border-focus
--af-text-main
--af-text-muted
--af-text-soft
--af-text-disabled
--af-text-inverse
--af-input-bg
--af-input-border
--af-card-bg
--af-card-border
--af-card-shadow
--af-scrollbar-thumb
```

### Light Theme Aliases

Agregar `ARGFIT_LIGHT_THEME` con equivalentes light desde `colors_and_type.css`.

No hace falta construir todavia un switch visual, pero el theme debe estar exportado y testeado como definicion valida.

## Tipografia Requerida

Tokens minimos:

```txt
--af-font-display
--af-font-body
--af-font-mono
--af-text-xs
--af-text-sm
--af-text-base
--af-text-lg
--af-text-xl
--af-text-2xl
--af-text-3xl
--af-text-4xl
--af-text-5xl
--af-text-6xl
--af-leading-tight
--af-leading-snug
--af-leading-normal
--af-leading-relaxed
--af-tracking-normal
--af-tracking-wide
--af-tracking-wider
--af-tracking-widest
```

Importante:

- No cargar Google Fonts desde una libreria Angular.
- Definir los font-family tokens en core.
- La carga real de fuentes queda para la app consumidora/showcase.
- `Zalando Sans Expanded` es la fuente display ideal; `Exo 2` es fallback web.
- `Outfit` es la fuente body.
- `JetBrains Mono` es la fuente mono/data.

## Spacing, Radius, Shadows y Motion

Implementar el set completo de `colors_and_type.css` con namespace `--af-*`.

Spacing:

```txt
0, px, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24
```

Radius:

```txt
none, xs, sm, md, lg, xl, 2xl, pill
```

Shadows:

```txt
xs, sm, md, lg, xl, glow, glow-accent
```

Motion:

```txt
ease-out, ease-in-out, ease-spring
duration-fast, duration-normal, duration-slow, duration-slower
```

## Compatibilidad

Mantener compatibilidad con tokens ya usados por el vertical slice de `AfButton`.

Si un token existente cambia de nombre, debe mantenerse un alias compatible o actualizarse todo uso interno del repo en la misma HU.

Tokens existentes que no deben romperse sin migracion:

```txt
--af-primary
--af-primary-hover
--af-primary-active
--af-primary-soft
--af-primary-contrast
--af-bg-main
--af-bg-surface
--af-bg-elevated
--af-bg-interactive
--af-text-main
--af-text-muted
--af-border
--af-border-focus
--af-focus-ring
--af-button-height-sm
--af-button-height-md
--af-button-height-lg
```

## Criterios de Aceptacion

1. `@argfit-ui/core` expone tokens namespaced `--af-*` basados en el design system adjunto.
2. `ARGFIT_DARK_THEME` usa `#0A1628` como background principal y `#2599D5` como primary brand.
3. `ARGFIT_LIGHT_THEME` existe, se exporta desde el public API y contiene los alias equivalentes light.
4. `AF_THEME_TOKEN_NAMES` contiene todos los tokens obligatorios y sigue tipado como contrato estricto.
5. `AfThemeTokenMap` sigue previniendo themes incompletos.
6. Los tests verifican al menos:
   - aplicacion del dark theme;
   - aplicacion del light theme;
   - valor de `--af-bg-main`;
   - valor de `--af-primary`;
   - valor de algun token tipografico;
   - valor de algun token de motion.
7. Ningun archivo de `core` importa PrimeNG, Ionic, desktop, mobile, adaptive o primitives.
8. `AfButton` y el showcase siguen compilando despues de la migracion.

## Checklist Tecnica

- [ ] Leer `docs/agent-rules.md`.
- [ ] Leer `docs/architecture.md`.
- [ ] Leer `docs/design-system.md`.
- [ ] Leer `C:\Users\Ander\Downloads\ArgFit\colors_and_type.css`.
- [ ] Expandir `AF_THEME_TOKEN_NAMES`.
- [ ] Actualizar `ARGFIT_DARK_THEME`.
- [ ] Crear/exportar `ARGFIT_LIGHT_THEME`.
- [ ] Ajustar tipos si el mapa queda demasiado grande para mantener manualmente.
- [ ] Actualizar tests de core.
- [ ] Formatear archivos.
- [ ] Ejecutar validaciones.

## Comandos de Validacion

```bash
pnpm guard:architecture
pnpm build:core
ng test argfit-ui-core --watch=false
pnpm build:all
pnpm test:all
```

## Prompt Recomendado Para Copilot / Opus / GPT-5.5

```txt
Implementa HU-001 — Formalizar Tokens del Design System.

Contexto obligatorio:
- Lee docs/hus/HU-001-design-tokens.md.
- Lee docs/agent-rules.md.
- Lee docs/architecture.md.
- Lee docs/design-system.md.
- Usa C:\Users\Ander\Downloads\ArgFit\colors_and_type.css como fuente de verdad visual.

Objetivo:
Formalizar los tokens del design system dentro de @argfit-ui/core. Mantener namespace --af-* y compatibilidad con el vertical slice actual de AfButton.

Alcance:
- projects/argfit-ui-core/src/lib/tokens/
- projects/argfit-ui-core/src/lib/themes/
- projects/argfit-ui-core/src/lib/core-systems.spec.ts
- projects/argfit-ui-core/src/public-api.ts

No implementes componentes nuevos. No toques PrimeNG/Ionic. No agregues wrappers. No cargues Google Fonts desde la libreria.

Definition of Done:
- ARGFIT_DARK_THEME refleja el design system real.
- Existe ARGFIT_LIGHT_THEME exportado.
- AF_THEME_TOKEN_NAMES cubre todos los tokens obligatorios.
- Tests de core actualizados.
- pnpm guard:architecture, pnpm build:all y pnpm test:all pasan.
```

## Nota de Producto

Esta HU no busca que la UI final ya se vea igual a los screenshots. Busca que todas las proximas HUs tengan el idioma visual correcto para construir `AfCard`, `AfInput`, `AfPageShell`, tablas, analytics y mobile shells sin hardcodear colores ni spacing.
