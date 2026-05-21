# HU-038 - Productive Scope And Semver Freeze

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 13 - Productive 1.0

## Dependencias

Esta HU depende de:

- HU-037 - Beta+ Release Gate And Publish Channel.

## Objetivo

Definir el contrato productivo `1.0.0`:

- APIs frozen.
- APIs experimentales removidas, aisladas o documentadas fuera del camino recomendado.
- Semver policy.
- Deprecation policy.
- Migration policy.

## Criterios De Aceptacion

1. Existe `docs/productive/scope.md`.
2. Existe `docs/productive/public-api.md`.
3. Existe `docs/productive/semver-policy.md`.
4. Todas las APIs publicas tienen categoria 1.0.
5. `pnpm guard:architecture` pasa.

## Comandos De Validacion

```bash
pnpm guard:architecture
pnpm build:libs
```
