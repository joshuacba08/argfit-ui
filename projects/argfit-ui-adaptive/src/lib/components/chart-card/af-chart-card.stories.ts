import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';

import { AfChartComponent } from '../../../../chart/src/lib/af-chart.component';
import {
  AF_CHART_HRV_BANDS,
  AF_CHART_HRV_DAYS,
  AF_CHART_HRV_SERIES,
  AF_CHART_LOAD_SERIES,
  AF_CHART_LOAD_WEEKS,
} from '../chart/af-chart.fixtures';
import { AF_CHART_HSR_SERIES } from '../chart/af-chart-volume.fixtures';
import { AfChartCardComponent } from './af-chart-card.component';

/** Envoltura común: la card recibe los args y el gráfico proyectado, datos fijos. */
function renderCard(chartProps: Record<string, unknown>, chartTemplate: string) {
  return (args: Record<string, unknown>) => ({
    props: { ...args, ...chartProps },
    template: `<af-chart-card
      [heading]="heading"
      [tag]="tag"
      [note]="note"
      [menu]="menu"
      [inlineActions]="inlineActions"
      [labels]="labels"
      [exportName]="exportName"
      [disabled]="disabled"
      [(tableVisible)]="tableVisible"
      (action)="action($event)"
      (popOut)="popOut()"
      (fullscreenChange)="fullscreenChange($event)"
    >${chartTemplate}</af-chart-card>`,
  });
}

const LOAD_CHART_PROPS = {
  categories: AF_CHART_LOAD_WEEKS,
  series: AF_CHART_LOAD_SERIES,
  yAxis: { name: 'UA' },
  secondaryAxis: { name: 'ACWR', min: 0.4, max: 1.8 },
  regions: [{ from: 0.8, to: 1.3, role: 'secondary', tone: 'success', label: 'zona óptima' }],
  thresholds: [{ value: 1.3, role: 'secondary', tone: 'warning', label: '1.30' }],
};

const LOAD_CHART_TEMPLATE = `<af-chart
  type="combo"
  [categories]="categories"
  [series]="series"
  [yAxis]="yAxis"
  [secondaryAxis]="secondaryAxis"
  [regions]="regions"
  [thresholds]="thresholds"
  [height]="300"
  [dataTable]="tableVisible"
/>`;

const meta: Meta<AfChartCardComponent> = {
  title: 'Data/Chart Card',
  component: AfChartCardComponent,
  subcomponents: { AfChart: AfChartComponent },
  // El gráfico llega proyectado, así que tiene que estar declarado en el módulo de la
  // historia: sin esto `<af-chart>` no se compila y la card queda vacía.
  decorators: [moduleMetadata({ imports: [AfChartComponent] })],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfChartCard',
      useWhen: [
        'Para presentar un gráfico con título, nota metodológica y acciones sobre el lienzo.',
        'Para exportar el gráfico o su serie sin reescribir la descarga en cada tablero.',
      ],
      avoidWhen: [
        'Para un gráfico incrustado sin encabezado ni acciones; usa AfChart directamente.',
        'Para una tarjeta de contenido genérico; usa AfCard.',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: ['--af-card-bg', '--af-card-border', '--af-border-focus', '--af-bg-elevated'],
      related: ['AfChart', 'AfCard', 'AfAnalyticsCard'],
    },
    docs: {
      description: {
        component:
          'Contenedor de un `<af-chart>` proyectado: encabezado, nota, menú de opciones, exportación a PNG y CSV, restablecer la vista y pantalla completa.',
      },
    },
  },
  argTypes: {
    heading: { control: 'text' },
    tag: { control: 'text' },
    note: { control: 'text' },
    menu: { control: 'object' },
    tableVisible: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  // El template enlaza siempre estas entradas, así que necesitan valor: un arg ausente
  // llega como `undefined` y sustituiría el valor por defecto del componente.
  args: {
    menu: ['fullscreen', 'download-image', 'download-csv', 'reset'],
    inlineActions: [],
    tableVisible: false,
    disabled: false,
  },
  render: renderCard(LOAD_CHART_PROPS, LOAD_CHART_TEMPLATE),
};

export default meta;
type Story = StoryObj<AfChartCardComponent>;

const CARD_ARGS = {
  heading: 'Carga aguda y ratio A:C',
  tag: 'Combo · barras + línea',
  note: 'Carga externa semanal en unidades arbitrarias contra el ratio agudo:crónico. La banda marca el rango 0.80–1.30.',
  action: fn(),
  popOut: fn(),
  fullscreenChange: fn(),
};

export const Default: Story = {
  args: { ...CARD_ARGS, exportName: 'carga-acwr' },
};

/**
 * El menú se abre con teclado y devuelve el foco al disparador al cerrarse: si el foco
 * quedara en un elemento ya eliminado, el recorrido con Tab volvería al inicio del
 * documento.
 */
export const MenuDeOpciones: Story = {
  args: {
    ...CARD_ARGS,
    menu: ['pop-out', 'fullscreen', 'download-image', 'download-csv', 'toggle-table', 'reset'],
  },
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Opciones del gráfico' });

    await userEvent.click(trigger);
    await waitFor(() => expect(canvas.getByRole('menu')).toBeVisible());

    await userEvent.click(canvas.getByRole('menuitem', { name: 'Abrir en ventana aparte' }));

    await expect(args.popOut).toHaveBeenCalledOnce();
    await expect(args.action).toHaveBeenCalledWith({ action: 'pop-out', handled: false });
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/**
 * La tabla accesible es estado compartido: la card la conmuta y el `<af-chart>`
 * proyectado la dibuja, porque un componente no puede escribir en los inputs de otro
 * que no le pertenece.
 */
export const TablaDeDatos: Story = {
  args: { ...CARD_ARGS, menu: ['toggle-table', 'reset'], tableVisible: true },
};

/** Sin menú, la card se reduce al marco, el encabezado y la nota. */
export const SinMenu: Story = {
  args: { ...CARD_ARGS, menu: [] },
};

/** Serie temporal con banda de dispersión dentro de la card. */
export const BandaDeDispersion: Story = {
  args: {
    ...CARD_ARGS,
    heading: 'Variabilidad de la frecuencia cardíaca',
    tag: 'Serie temporal · banda',
    note: 'rMSSD matinal con banda de ±1 DE sobre la media móvil, superpuesta a la frecuencia cardíaca de reposo.',
  },
  render: renderCard(
    {
      categories: AF_CHART_HRV_DAYS,
      series: AF_CHART_HRV_SERIES,
      bands: AF_CHART_HRV_BANDS,
      yAxis: { name: 'ms', min: 40 },
      secondaryAxis: { name: 'lpm', min: 40, max: 65 },
    },
    `<af-chart
      type="line"
      [categories]="categories"
      [series]="series"
      [bands]="bands"
      [yAxis]="yAxis"
      [secondaryAxis]="secondaryAxis"
      [height]="280"
      [dataTable]="tableVisible"
    />`,
  ),
};

/**
 * Ver los datos con los que se construyó el gráfico.
 *
 * Dos decisiones se juntan aquí. La tabla se dispone **por observación** —una fila por
 * jugador, una columna por magnitud— porque cada punto lleva tres números y la
 * disposición por series sólo podría mostrar uno. Y el conmutador vive en el
 * encabezado, no en el menú: es lo que se usa en cada lectura.
 */
export const TablaPorObservacion: Story = {
  args: {
    ...CARD_ARGS,
    heading: 'Dispersión distancia–HSR',
    tag: 'Burbujas',
    note: '14 jugadores; el diámetro representa el sprint acumulado.',
    inlineActions: ['toggle-table', 'download-image'],
    menu: ['toggle-table', 'download-image', 'download-csv', 'reset'],
    tableVisible: true,
  },
  render: renderCard(
    {
      series: AF_CHART_HSR_SERIES,
      headers: {
        label: 'Jugador',
        x: 'Distancia',
        y: 'HSR',
        z: 'Sprint',
      },
    },
    `<af-chart
      type="bubble"
      [series]="series"
      [xAxis]="{ name: 'Distancia total (m)' }"
      [yAxis]="{ name: 'HSR +20 km/h (m)' }"
      [dataTableHeaders]="headers"
      [dataTable]="tableVisible"
      [height]="300"
    />`,
  ),
};
