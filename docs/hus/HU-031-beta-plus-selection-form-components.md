# HU-031 - Beta+ Selection And Advanced Form Components

## Estado

Ready for implementation

## Fase Del Roadmap

Fase 12 - Beta+ Component Expansion

## Dependencias

Esta HU depende de:

- HU-027 - Beta+ Scope And Component Strategy.
- HU-030 - Beta+ Form Field And Input Components.
- HU-013 - AfFormControls Expansion Slice.

## Decision De Producto

Las interfaces avanzadas necesitan seleccion multiple, seleccion jerarquica, listas, botones segmentados, rating, sliders y toggles. `AfMultiSelect` es prioridad alta porque desbloquea filtros, formularios de configuracion y pantallas administrativas.

## Historia De Usuario

Como desarrollador de una app enterprise, quiero componentes de seleccion avanzados, para construir filtros, formularios densos y configuraciones complejas sin acoplarme a PrimeNG o Ionic.

## Componentes Incluidos

### Prioridad Alta

- `AfMultiSelect`
- `AfSelect`
- `AfTreeSelect`
- `AfListbox`
- `AfCheckbox`
- `AfRadioGroup`
- `AfSegmentedControl`
- `AfToggle`
- `AfToggleButton`

### Prioridad Media

- `AfCascadeSelect`
- `AfSlider`
- `AfRating`
- `AfColorPicker` si no queda cerrado en HU-030

### Prioridad Experimental

- `AfKnob` si no queda cerrado en HU-030

## Engines Recomendados

| ArgFit API | Desktop | Mobile |
| --- | --- | --- |
| `AfMultiSelect` | PrimeNG `MultiSelect` | Ionic/custom modal checklist with search |
| `AfSelect` | PrimeNG `Select` | Ionic `ion-select` or modal list |
| `AfTreeSelect` | PrimeNG `TreeSelect` | Custom drilldown sheet/tree list |
| `AfCascadeSelect` | PrimeNG `CascadeSelect` | Custom drilldown sheet |
| `AfListbox` | PrimeNG `Listbox` | Ionic/custom list with selection states |
| `AfCheckbox` | PrimeNG `Checkbox` | Ionic `ion-checkbox` |
| `AfRadioGroup` | PrimeNG `RadioButton` | Ionic `ion-radio-group` |
| `AfSegmentedControl` | PrimeNG `SelectButton` | Ionic `ion-segment` |
| `AfToggle` | PrimeNG `ToggleSwitch` | Ionic `ion-toggle` |
| `AfToggleButton` | PrimeNG `ToggleButton` | Ionic `ion-button`/custom pressed button |
| `AfSlider` | PrimeNG `Slider` | Ionic `ion-range` |
| `AfRating` | PrimeNG `Rating` | Custom touch-friendly rating |

## API Requerida Para `AfMultiSelect`

Inputs:

- `options`
- `value`
- `optionLabel`
- `optionValue`
- `label`
- `placeholder`
- `searchable`
- `clearable`
- `disabled`
- `readonly`
- `required`
- `maxSelected`
- `selectionLimitText`
- `helperText`
- `errorText`
- `density`

Outputs:

- `valueChange`
- `searchChange`
- `openedChange`
- `clear`

Requisitos:

- `ControlValueAccessor`.
- Seleccion multiple por teclado.
- Chips/resumen de seleccion.
- Busqueda local minima.
- Mobile con modal/sheet touch-first, no dropdown desktop encogido.

## Requisitos Transversales

- Soportar objetos y primitives como values.
- Exponer eventos ArgFit-owned.
- No filtrar eventos PrimeNG/Ionic.
- Mantener estados selected, active, focused y disabled.
- Documentar diferencias desktop/mobile cuando la interaccion no sea identica.
- Tests de teclado para Select, MultiSelect, Listbox y TreeSelect.

## Paths Esperados

- `projects/argfit-ui-core/src/lib/types/selection.types.ts`
- `projects/argfit-ui-core/src/lib/types/tree-select.types.ts`
- `projects/argfit-ui-desktop/src/lib/components/*`
- `projects/argfit-ui-mobile/src/lib/components/*`
- `projects/argfit-ui-adaptive/src/lib/components/*`
- public APIs de core, desktop, mobile y adaptive
- showcase y docs Beta+

## Showcase Esperado

Crear seccion de Advanced Forms con:

- filtro `AfMultiSelect` de tipos de test;
- `AfTreeSelect` para equipo/grupo/atleta;
- `AfCascadeSelect` para region/club/equipo;
- `AfListbox` con seleccion multiple;
- `AfSlider` para rango de carga;
- `AfRating` para calidad percibida;
- `AfToggleButton` y `AfToggle` para flags de configuracion.

## Criterios De Aceptacion

1. `AfMultiSelect` existe y es usable con reactive forms.
2. `AfTreeSelect`, `AfCascadeSelect`, `AfListbox` y `AfSelect` tienen APIs vendor-independent.
3. Mobile usa patrones touch-first para seleccion compleja.
4. Tests cubren seleccion, limpieza, busqueda, max selected y teclado.
5. Showcase cubre filtros avanzados y formularios densos.
6. `pnpm guard:architecture` pasa.
7. `pnpm test:all` pasa.

## Comandos De Validacion

```bash
pnpm guard:architecture
pnpm test:all
pnpm build:all
```

## Prompt Para Implementacion

Implementa HU-031 - Beta+ Selection And Advanced Form Components.

Prioriza `AfMultiSelect` como primer vertical slice completo. Despues implementa `AfTreeSelect`, `AfCascadeSelect`, `AfListbox` y el resto de selection controls siguiendo los patrones existentes de form controls. Mobile debe usar modal/sheet/list patterns cuando Ionic no tenga equivalente directo.
