# HU-022 - Beta Visual Regression And Responsive QA

## Estado

Implemented

## Fase Del Roadmap

Fase 11 - Beta Hardening / Fase 9 - Tooling

## Dependencias

Esta HU depende de:

- HU-019 - Beta Scope And Public API Contract.

## Decision De Producto

La alpha usa el showcase como referencia visual, pero no tiene visual regression. Para beta, los cambios visuales deben ser detectables antes de publicar.

## Historia De Usuario

Como maintainer de ArgFit UI, quiero un gate visual reproducible para desktop y mobile, para evitar publicar una beta con layouts rotos, cambios no intencionales o regresiones responsive.

## Objetivo

Agregar QA visual beta:

- Browser-driven screenshots del showcase.
- Viewports desktop y mobile.
- Dark/light theme.
- Secciones principales del showcase.
- Comparacion contra baseline o, como minimo, screenshot smoke con validaciones de layout.
- Documentacion del procedimiento.

## Alcance Incluido

Paths esperados:

- `tools/visual-regression.mjs` o config equivalente.
- `docs/beta/visual-qa.md`
- `package.json`
- `.github/workflows/ci.yml`
- `projects/showcase/src/app/*` si se necesitan atributos/selectores estables.

## Escenarios Minimos

Capturar o validar:

- Alpha consumer kit.
- Dashboard.
- Data table desktop.
- Data table mobile.
- Analytics.
- Forms desktop.
- Forms mobile.
- Feedback.
- Dialog abierto.
- Theme light.
- Theme dark.

Viewports minimos:

- Desktop: `1440x900`.
- Tablet/mobile ancho: `768x1024`.
- Mobile: `390x844`.

## Requisitos

- El script debe arrancar o consumir el showcase de forma reproducible.
- Los screenshots no deben depender de timers inestables.
- Los nombres de snapshots deben ser deterministas.
- El gate debe fallar si una vista clave no renderiza contenido.
- El gate mobile debe detectar si una vista clave se ve como desktop comprimido en vez de mobile touch-first.
- Componentes mobile que usen PrimeNG por excepcion deben tener screenshot dedicado.
- Si se usa baseline visual, debe existir flujo de actualizacion documentado.
- CI debe ejecutar al menos el smoke visual beta.

## Fuera De Alcance

Esta HU NO debe:

- Rehacer el design system.
- Crear Storybook completo.
- Exigir pixel perfect para animaciones o canvas ECharts si el baseline no es estable.

## Criterios De Aceptacion

1. Existe comando local de QA visual.
2. Existe `docs/beta/visual-qa.md`.
3. Desktop y mobile quedan cubiertos.
4. Dark y light quedan cubiertos.
5. Dialog, table, forms y feedback quedan cubiertos.
6. El gate detecta vistas en blanco o selectores faltantes.
7. CI ejecuta el smoke visual beta o documenta por que queda manual temporalmente.
8. `pnpm build:all` pasa.

## Checklist Tecnica

- [ ] Elegir herramienta de browser automation.
- [ ] Crear script/config visual.
- [ ] Agregar selectores estables si hacen falta.
- [ ] Capturar viewports minimos.
- [ ] Documentar update de baselines.
- [ ] Integrar comando en package.json.
- [ ] Integrar CI o documentar excepcion.

## Comandos De Validacion

```bash
pnpm build:all
pnpm visual:beta
```

## Prompt Recomendado

```txt
Implementa HU-022 - Beta Visual Regression And Responsive QA.

Objetivo:
Crear un gate visual reproducible del showcase para beta, cubriendo desktop/mobile, dark/light y secciones principales.

Definition of Done:
Existe comando visual:beta, docs/beta/visual-qa.md explica el flujo, y el gate falla si una vista clave no renderiza.
```
