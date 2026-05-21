# ArgFit UI - Beta Package Matrix

Fecha de actualizacion: 2026-05-21.

## Runtime Matrix

| Surface | Beta stance | Consumer guidance |
| --- | --- | --- |
| `@argfit-ui/core` | supported | usar para `provideArgfitUi`, temas y tipos |
| `@argfit-ui/primitives` | supported | usar para building blocks vendor-agnostic puntuales |
| `@argfit-ui/adaptive` | recommended | surface principal para aplicaciones consumidoras |
| `@argfit-ui/desktop` | renderer-specific | instalar como dependencia de runtime, evitar imports directos salvo trabajo interno renderer-specific |
| `@argfit-ui/mobile` | renderer-specific | instalar como dependencia de runtime, evitar imports directos salvo trabajo interno renderer-specific |

## Version Matrix

| Concern | Beta target | Estado |
| --- | --- | --- |
| Angular | `21.x` | validado por consumer smoke |
| TypeScript | `5.9.x` | alineado con workspace y consumer smoke |
| Node | `22.x` CI target | validado en CI; smoke local tambien corrio durante hardening en entorno Node 24 |
| Package manager | `pnpm 10.x` | recomendado y usado en CI |

## External Peers

| Dependency | Why it exists | Consumer import policy |
| --- | --- | --- |
| `@angular/cdk` | base infra Angular UI | normal Angular dependency |
| `@ionic/angular` | renderer mobile interno | instalar, no importar desde componentes de app adaptativa |
| `@lucide/angular` | icon runtime | instalar, no acoplar APIs internas si no hace falta |
| `echarts` | charts internos | instalar, no importar desde la app para usar `AfChart` |
| `primeng` | renderer desktop interno | instalar, no importar desde componentes adaptive |

## Renderer Policy

- Desktop beta sigue siendo PrimeNG-first de forma interna.
- Mobile beta sigue siendo Ionic-first de forma interna.
- No hay excepciones PrimeNG aprobadas para mobile en el contrato beta actual.
- Importar renderers directamente salta el contrato adaptativo y queda fuera del camino recomendado para consumidores generales.

## SSR Status

SSR queda fuera del alcance beta actual.

La razon principal es que el catalogo incluye charts browser-oriented y una mezcla de renderers que todavia no tienen una promesa SSR formal en la documentacion beta.

## Package Tarball Reference

`pnpm measure:beta-performance` reporta los tamanos actuales de:

- `@argfit-ui/core`
- `@argfit-ui/primitives`
- `@argfit-ui/desktop`
- `@argfit-ui/mobile`
- `@argfit-ui/adaptive`

Ese comando es la referencia reproducible para release reviews cuando cambian bundles o peers.