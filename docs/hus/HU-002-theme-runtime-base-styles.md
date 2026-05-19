# HU-002 — Theme Runtime y Estilos Base

## Estado

Ready for implementation

## Fase del Roadmap

Fase 1 — Core System / Theme System

## Dependencia

Esta HU depende de HU-001.

Antes de implementarla deben existir:

- Tokens completos en `@argfit-ui/core`.
- `ARGFIT_DARK_THEME`.
- `ARGFIT_LIGHT_THEME`.
- `AF_THEME_TOKEN_NAMES`.
- Tests basicos del theme service.

## Historia de Usuario

Como desarrollador de ArgFit UI, quiero que el theme system pueda aplicarse, alternarse y reflejarse en estilos globales reales, para que las proximas HUs construyan componentes sobre una base visual consistente y verificable.

## Objetivo

Convertir los tokens formalizados en HU-001 en una experiencia runtime usable:

- Aplicar dark theme por defecto.
- Permitir alternar entre dark/light desde el `AfThemeService`.
- Exponer estado reactivo del theme actual.
- Preparar estilos globales base del showcase usando tokens.
- Cargar fuentes solo desde la app showcase, no desde la libreria.
- Validar que el cambio de theme actualiza el DOM.

## Contexto

HU-001 define el contrato visual.

HU-002 debe demostrar que ese contrato se usa correctamente en una app Angular real, sin hardcodear colores, spacing, tipografia o focus states.

Esta HU no busca que el showcase final sea una pagina completa de documentacion. Busca que el runtime de theme quede listo para futuras HUs.

## Alcance Incluido

### Core

Paths esperados:

- `projects/argfit-ui-core/src/lib/themes/theme.service.ts`
- `projects/argfit-ui-core/src/lib/themes/theme.types.ts`
- `projects/argfit-ui-core/src/lib/providers/provide-argfit-ui.ts`
- `projects/argfit-ui-core/src/lib/config/argfit-ui.config.ts`
- `projects/argfit-ui-core/src/lib/core-systems.spec.ts`
- `projects/argfit-ui-core/src/public-api.ts`

Se puede agregar archivos nuevos dentro de:

```txt
projects/argfit-ui-core/src/lib/themes/
```

### Showcase

Paths esperados:

- `projects/showcase/src/styles.css`
- `projects/showcase/src/app/app.config.ts`
- `projects/showcase/src/app/app.ts`
- `projects/showcase/src/app/app.html`
- `projects/showcase/src/app/app.scss`
- `projects/showcase/src/app/app.spec.ts`

## Fuera de Alcance

Esta HU NO debe implementar:

- Nuevos componentes de libreria (`AfCard`, `AfInput`, `AfSidebar`, etc.).
- Wrappers nuevos de PrimeNG o Ionic.
- Persistencia en localStorage.
- Theme marketplace.
- Tema premium.
- Sistema avanzado de preferencias del usuario.
- Rediseño completo del showcase.
- Pantallas enterprise completas.

## Requisitos Funcionales

### 1. Theme Service

`AfThemeService` debe permitir:

- Leer el theme actual con signal readonly.
- Aplicar un theme especifico.
- Aplicar dark theme.
- Aplicar light theme.
- Alternar entre dark/light.
- Consultar si el theme actual es dark o light.

API sugerida:

```ts
readonly currentTheme: Signal<AfThemeDefinition>;
readonly currentThemeName: Signal<string>;
readonly isDarkTheme: Signal<boolean>;

applyDefaultTheme(): void;
applyTheme(theme: AfThemeDefinition): void;
applyDarkTheme(): void;
applyLightTheme(): void;
toggleTheme(): void;
```

La API exacta puede ajustarse si mantiene el objetivo y sigue patrones Angular modernos.

### 2. DOM Contract

Al aplicar un theme, el servicio debe:

- Setear `data-af-theme` en `document.documentElement`.
- Setear opcionalmente `data-theme` para compatibilidad visual con herramientas externas.
- Aplicar todos los tokens definidos en `theme.tokens`.

Ejemplo esperado:

```html
<html data-af-theme="argfit-dark" data-theme="dark"></html>
```

Para light:

```html
<html data-af-theme="argfit-light" data-theme="light"></html>
```

### 3. Configuracion

`provideArgFitUi` debe permitir inicializar el theme.

Ejemplo:

```ts
provideArgFitUi({
  theme: ARGFIT_DARK_THEME,
});
```

Si ya existe soporte para theme en config, mantenerlo y agregar tests.

### 4. Estilos Globales del Showcase

`projects/showcase/src/styles.css` debe:

- Cargar fuentes desde Google Fonts o dejar un comentario claro si se decide no cargarlas todavia.
- Aplicar background, color y font family con tokens.
- Definir selection con tokens.
- Definir scrollbar con tokens.
- Definir focus-visible con `--af-focus-ring`.
- Evitar hardcodear colores fuera de fallback muy justificado.

Ejemplos esperados:

```css
body {
  background: var(--af-bg-main);
  color: var(--af-text-main);
  font-family: var(--af-font-body);
}

::selection {
  background: var(--af-primary);
  color: var(--af-primary-contrast);
}

:focus-visible {
  outline: none;
  box-shadow: var(--af-focus-ring);
}
```

### 5. Showcase Minimo

El showcase debe incluir una forma simple de validar runtime de theme:

- Un boton o toggle visible para alternar dark/light.
- Texto o badge que muestre el theme actual.
- La UI existente debe seguir usando tokens.

No hace falta crear una pagina visual sofisticada.

## Requisitos No Funcionales

- Usar Angular moderno: standalone, signals, `inject()`.
- No usar NgModules.
- No introducir dependencias nuevas.
- No acoplar core a PrimeNG/Ionic.
- No cargar Google Fonts desde `@argfit-ui/core`.
- Mantener compatibilidad con SSR: no tocar DOM si no estamos en browser.
- Mantener el showcase token-driven.

## Criterios de Aceptacion

1. `AfThemeService` puede aplicar dark y light theme explicitamente.
2. `AfThemeService` puede alternar entre dark/light.
3. `currentTheme`, `currentThemeName` e `isDarkTheme` reflejan el estado actual.
4. `document.documentElement.dataset['afTheme']` cambia correctamente.
5. `document.documentElement.dataset['theme']` queda en `dark` o `light`.
6. Todos los tokens del theme se aplican como CSS custom properties.
7. `provideArgFitUi` sigue permitiendo inicializar un theme.
8. El showcase carga los estilos base usando tokens.
9. El showcase permite validar manualmente el cambio de theme.
10. No hay imports de PrimeNG/Ionic dentro de core.
11. Los tests cubren dark, light, toggle y config inicial.
12. `pnpm guard:architecture`, `pnpm build:all` y `pnpm test:all` pasan.

## Checklist Tecnica

- [ ] Leer `docs/hus/HU-001-design-tokens.md`.
- [ ] Leer `docs/agent-rules.md`.
- [ ] Leer `docs/architecture.md`.
- [ ] Leer `docs/design-system.md`.
- [ ] Revisar `AfThemeService` actual.
- [ ] Agregar API de dark/light/toggle.
- [ ] Agregar `data-theme` compatible.
- [ ] Mantener SSR safety con `isPlatformBrowser`.
- [ ] Actualizar tests de core.
- [ ] Actualizar estilos globales del showcase.
- [ ] Agregar toggle minimo en showcase.
- [ ] Actualizar tests de showcase si corresponde.
- [ ] Formatear archivos.
- [ ] Ejecutar validaciones.

## Comandos de Validacion

```bash
pnpm guard:architecture
pnpm build:core
ng test argfit-ui-core --watch=false
ng test showcase --watch=false
pnpm build:all
pnpm test:all
```

## Prompt Recomendado Para Copilot / Opus / GPT-5.5

```txt
Implementa HU-002 — Theme Runtime y Estilos Base.

Contexto obligatorio:
- Lee docs/hus/HU-002-theme-runtime-base-styles.md.
- Lee docs/hus/HU-001-design-tokens.md.
- Lee docs/agent-rules.md.
- Lee docs/architecture.md.
- Lee docs/design-system.md.

Objetivo:
Completar el runtime de theming sobre los tokens de HU-001. AfThemeService debe poder aplicar dark/light, alternar themes, exponer estado con signals y actualizar el DOM con data-af-theme/data-theme. El showcase debe consumir tokens en estilos globales y permitir validar manualmente el cambio de theme.

Alcance:
- projects/argfit-ui-core/src/lib/themes/
- projects/argfit-ui-core/src/lib/config/
- projects/argfit-ui-core/src/lib/providers/
- projects/argfit-ui-core/src/lib/core-systems.spec.ts
- projects/showcase/src/

No implementes componentes nuevos de libreria. No toques PrimeNG/Ionic. No agregues persistencia. No cargues fuentes desde @argfit-ui/core.

Definition of Done:
- AfThemeService soporta dark, light y toggle.
- data-af-theme y data-theme se actualizan.
- Showcase usa estilos globales token-driven.
- Hay test de core para dark/light/toggle/config.
- pnpm guard:architecture, pnpm build:all y pnpm test:all pasan.
```

## Nota de Producto

Esta HU cierra el puente entre design tokens y experiencia real. Despues de esto ya tiene sentido empezar componentes visuales como `AfCard`, `AfInput`, `AfBadge` o `AfPageShell`, porque todos podran apoyarse en un theme runtime estable.
