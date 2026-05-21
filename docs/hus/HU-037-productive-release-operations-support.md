# HU-037 - Productive Release Operations And Support Policy

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 13 - Productive 1.0 / Fase 10 - Distribution

## Dependencias

Esta HU depende de:

- HU-034 - Productive Quality Gates.

## Objetivo

Definir operaciones de release y soporte:

- Branch/tag strategy.
- npm publish process.
- Security and dependency update policy.
- Deprecation process.
- Patch release process.
- Support window.

## Criterios De Aceptacion

1. Existe `docs/productive/release-operations.md`.
2. Existe `docs/productive/support-policy.md`.
3. Publish workflow for production exists.
4. Patch release procedure exists.
5. Changelog policy exists.

## Comandos De Validacion

```bash
pnpm release:production:check
```

