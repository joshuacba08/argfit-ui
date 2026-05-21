# HU-024 - Beta Performance And Bundle Budget

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 11 - Beta Hardening / Fase 9 - Tooling

## Dependencias

Esta HU depende de:

- HU-019 - Beta Scope And Public API Contract.

## Decision De Producto

El gate alpha pasa con warnings de presupuesto. Para beta, los warnings del showcase deben desaparecer o convertirse en una decision documentada y justificada. Una beta con budgets ignorados ensena al equipo a no creerle al gate.

## Historia De Usuario

Como maintainer de ArgFit UI, quiero que el build beta pase sin warnings de performance, para publicar prereleases con senales de calidad confiables.

## Objetivo

Eliminar o justificar budgets:

- Initial bundle warning actual: `2.25 MB` vs `750 kB`.
- Component style warning actual: `app.scss` `12.95 kB` vs `8 kB`.
- Revisar carga de ECharts y showcase.
- Medir tamanos de tarballs y bundles.
- Crear documentacion de performance beta.

## Alcance Incluido

Paths esperados:

- `angular.json`
- `projects/showcase/src/app/*`
- `projects/showcase/src/app/app.scss`
- `projects/showcase/src/app/app.routes.ts`
- `projects/showcase/src/app/*` si se separan vistas.
- `tools/` si se agrega analisis de bundles.
- `docs/beta/performance.md`
- `package.json`

## Lineas De Trabajo Sugeridas

- Separar secciones grandes del showcase si el bundle inicial carga demasiado.
- Lazy-load vistas pesadas de charts/analytics si aplica.
- Revisar import de ECharts para evitar cargar mas de lo necesario.
- Dividir `app.scss` en estilos por componente/vista o reducir reglas duplicadas.
- Ajustar budgets solo con evidencia y decision documentada.
- Crear un comando de medicion reproducible.

## Requisitos

- `pnpm build:all` no debe producir warnings de presupuesto para beta.
- Los budgets deben ser creibles, no simplemente inflados.
- Si se cambia un budget, `docs/beta/performance.md` debe explicar el motivo.
- Package tarball sizes deben quedar registrados.

## Fuera De Alcance

Esta HU NO debe:

- Sacrificar cobertura visual del showcase para bajar bundle.
- Eliminar componentes beta.
- Optimizar micro-performance sin evidencia.

## Criterios De Aceptacion

1. Existe `docs/beta/performance.md`.
2. `pnpm build:all` pasa sin budget warnings.
3. El initial bundle beta queda bajo budget o el budget queda justificado.
4. Ningun component stylesheet supera el budget beta.
5. Tamanos de tarballs quedan registrados.
6. `pnpm test:all` pasa despues de los cambios.

## Checklist Tecnica

- [ ] Reproducir warnings actuales.
- [ ] Medir bundle y style sizes.
- [ ] Identificar dependencias pesadas.
- [ ] Reducir bundle inicial o ajustar budget con razon.
- [ ] Reducir `app.scss` o separar estilos.
- [ ] Documentar decision.
- [ ] Ejecutar validaciones.

## Comandos De Validacion

```bash
pnpm build:all
pnpm test:all
```

## Prompt Recomendado

```txt
Implementa HU-024 - Beta Performance And Bundle Budget.

Objetivo:
Eliminar los warnings de budget del build beta o documentar ajustes justificados, manteniendo el showcase completo y los tests verdes.

Definition of Done:
pnpm build:all no emite budget warnings, docs/beta/performance.md existe y pnpm test:all pasa.
```

