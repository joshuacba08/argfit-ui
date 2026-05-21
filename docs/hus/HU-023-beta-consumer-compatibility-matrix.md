# HU-023 - Beta Consumer Compatibility Matrix

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 11 - Beta Hardening / Fase 10 - Distribution

## Dependencias

Esta HU depende de:

- HU-019 - Beta Scope And Public API Contract.
- HU-020 - Beta Experimental Components Hardening.

## Decision De Producto

La alpha tiene smoke test minimo. Para beta, ArgFit UI debe probarse como lo usaria un consumidor: instalando paquetes generados, importando APIs publicas y compilando una app fuera del workspace principal.

## Historia De Usuario

Como consumidor beta, quiero instalar ArgFit UI en una app Angular limpia, para confiar en que los paquetes publicados funcionan fuera del monorepo.

## Objetivo

Crear matriz de compatibilidad beta:

- App temporal de consumo desde tarballs.
- Validacion de imports principales.
- Validacion de peer dependencies.
- Build production de consumidor.
- Casos minimos de theme, forms, table y feedback.
- Documento de compatibilidad beta.

## Alcance Incluido

Paths esperados:

- `tools/beta-consumer-smoke.mjs`
- `docs/beta/compatibility.md`
- `docs/beta/package-matrix.md`
- `package.json`
- `.gitignore` si se agregan carpetas temporales.

La app temporal debe vivir bajo:

```txt
.tmp/beta-consumer/
```

## Casos De Consumo Minimos

El smoke debe validar:

- Import desde `@argfit-ui/core`.
- Import desde `@argfit-ui/primitives`.
- Import desde `@argfit-ui/adaptive`.
- Que el consumidor no necesita importar PrimeNG, Ionic ni ECharts para usar componentes adaptive.
- `provideArgfitUi`.
- `AfButton`, `AfCard`, `AfInput`.
- Un componente promovido desde alpha experimental si HU-020 lo estabiliza.
- Reactive Forms con al menos un control ArgFit.
- Build production del consumidor.

## Matriz Recomendada

Documentar:

- Angular soportado.
- TypeScript soportado.
- Node soportado.
- Pares externos requeridos.
- Uso recomendado de `@argfit-ui/adaptive`.
- Que pasa si se importan renderer packages directamente.
- Politica de engines: PrimeNG-first desktop, Ionic-first mobile, PrimeNG mobile solo como excepcion interna.
- Estado SSR: soportado, parcial o fuera de beta.

## Fuera De Alcance

Esta HU NO debe:

- Publicar a npm.
- Probar todos los package managers.
- Prometer compatibilidad con Angular menor a la version target.

## Criterios De Aceptacion

1. Existe `tools/beta-consumer-smoke.mjs`.
2. Existe `docs/beta/compatibility.md`.
3. Existe `docs/beta/package-matrix.md`.
4. El smoke instala o enlaza tarballs generados.
5. El smoke compila una app consumer temporal.
6. La app consumer usa imports publicos, no paths internos.
7. `.tmp/beta-consumer` no queda versionado.
8. `pnpm beta:consumer-smoke` pasa.

## Checklist Tecnica

- [ ] Leer alpha smoke actual.
- [ ] Crear beta consumer smoke.
- [ ] Generar tarballs antes del smoke.
- [ ] Crear app temporal minima.
- [ ] Instalar paquetes ArgFit desde tarballs.
- [ ] Validar build production.
- [ ] Documentar compatibilidad.

## Comandos De Validacion

```bash
pnpm build:libs
pnpm pack:alpha:dist
pnpm beta:consumer-smoke
```

## Prompt Recomendado

```txt
Implementa HU-023 - Beta Consumer Compatibility Matrix.

Objetivo:
Crear un smoke de consumidor beta con app Angular temporal que instale tarballs ArgFit y compile usando solo imports publicos.

Definition of Done:
tools/beta-consumer-smoke.mjs, docs/beta/compatibility.md y docs/beta/package-matrix.md existen, y pnpm beta:consumer-smoke pasa.
```
