# ArgFit UI - Beta Consumer Compatibility

Fecha de actualizacion: 2026-05-21.

## Objetivo

HU-023 valida que ArgFit UI se pueda consumir fuera del monorepo, instalando tarballs reales y compilando una aplicacion Angular temporal con imports publicos.

## Comando

```bash
pnpm beta:consumer-smoke
```

El comando:

- compila las librerias publishables;
- genera tarballs en `dist/alpha-tarballs/`;
- crea una app Angular temporal en `.tmp/beta-consumer/`;
- instala tarballs y peers externos;
- ejecuta un build production del consumidor.

## Contrato Validado

La app temporal usa solo:

- `@argfit-ui/core`
- `@argfit-ui/primitives`
- `@argfit-ui/adaptive`

El smoke falla si el consumidor intenta importar directamente:

- `primeng`
- `@ionic/angular`
- `echarts`
- `@argfit-ui/desktop`
- `@argfit-ui/mobile`

## Superficies Probadas En La App Temporal

- `provideArgfitUi` con tema ArgFit y platform `auto`.
- `AfButton`.
- `AfCard`.
- `AfInput` con `ReactiveFormsModule`.
- `AfInlineMessage` y `AfToastViewport`.
- `AfDataTable`.
- `AfVisuallyHiddenComponent` desde `@argfit-ui/primitives`.

## Alcance Del Smoke

El objetivo del smoke es compatibilidad de empaquetado y compilacion, no QA visual completa del consumidor.

Queda explicitamente fuera de esta HU:

- SSR.
- Storybook del consumidor.
- probar package managers adicionales.
- promocionar renderers como API recomendada para aplicaciones.

## Resultado Esperado

El consumidor debe:

- instalar los cinco paquetes ArgFit desde tarballs;
- resolver peers externos sin imports directos en codigo de aplicacion;
- compilar con `ng build --configuration production`;
- permanecer descartable bajo `.tmp/beta-consumer/`.

## Uso Recomendado

Para aplicaciones beta, el surface recomendado sigue siendo `@argfit-ui/adaptive`.

`@argfit-ui/core` se usa para providers, temas y tipos compartidos. `@argfit-ui/primitives` queda disponible para casos puntuales de accesibilidad o composicion baja.

Los paquetes `@argfit-ui/desktop` y `@argfit-ui/mobile` siguen siendo renderer-specific y no forman parte del camino recomendado para aplicaciones consumidoras generales.