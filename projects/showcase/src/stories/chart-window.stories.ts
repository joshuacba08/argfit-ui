import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';

import { AfChartCardComponent, AfChartComponent, AfEmptyStateComponent } from '@argfit-ui/adaptive';

import {
  AF_CHART_FORECAST_BANDS,
  AF_CHART_FORECAST_SERIES,
  AF_CHART_FORECAST_WEEKS,
} from '../../../argfit-ui-adaptive/src/lib/components/chart/af-chart-panel.fixtures';

/**
 * Composición, no componente.
 *
 * `AfChartCard` emite `popOut` cuando alguien pide desanclar un gráfico; qué significa
 * eso —una ventana del navegador, una ruta, un diálogo— lo decide la aplicación, que es
 * la única que conoce su enrutado. Esta historia muestra el destino de esa intención:
 * una vista a pantalla completa con un solo gráfico.
 *
 * El registro que traduce la clave de la URL a una serie también es de la aplicación:
 * la librería no sabe qué gráficos existen en el producto.
 */
const CHART_REGISTRY: Record<string, { readonly title: string; readonly note: string }> = {
  forecast: {
    title: 'Proyección de carga a 8 semanas',
    note: 'Serie observada, tendencia proyectada y banda de confianza del 95%.',
  },
};

const meta: Meta = {
  title: 'Patterns/Analytics/Chart Window',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [AfChartCardComponent, AfChartComponent, AfEmptyStateComponent],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Destino de la intención `popOut` de `AfChartCard`: un gráfico solo, ocupando ' +
          'el alto disponible, con la barra de identidad del producto. La aplicación ' +
          'resuelve la clave de la URL contra su propio registro de gráficos; si no la ' +
          'encuentra, la vista lo dice en vez de quedarse en blanco.',
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      weeks: AF_CHART_FORECAST_WEEKS,
      series: AF_CHART_FORECAST_SERIES,
      bands: AF_CHART_FORECAST_BANDS,
      entry: CHART_REGISTRY[(args['chartKey'] as string) ?? ''],
    },
    template: `
      <div
        class="af-story-surface"
        style="display:flex;flex-direction:column;height:640px;gap:0"
      >
        <div
          style="display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--af-border-strong);flex:none"
        >
          <strong
            style="font-size:var(--af-text-base);letter-spacing:-0.01em;color:var(--af-text-main)"
          >{{ entry ? entry.title : 'Gráfico' }}</strong>
          <span style="flex:1"></span>
          <span
            style="font-size:var(--af-text-xs);color:var(--af-text-muted);text-transform:uppercase;letter-spacing:0.06em"
          >{{ chartKey ? 'serie · ' + chartKey : '' }}</span>
        </div>

        @if (entry) {
          <div style="flex:1;min-height:0;padding:16px 18px;display:flex">
            <af-chart-card
              [heading]="entry.title"
              [note]="entry.note"
              [menu]="['download-image', 'download-csv', 'reset']"
              exportName="proyeccion-carga"
              style="flex:1;display:flex;flex-direction:column"
            >
              <af-chart
                type="line"
                [categories]="weeks"
                [series]="series"
                [bands]="bands"
                [yAxis]="{ name: 'UA', min: 2600 }"
                [toolbox]="['zoom', 'restore', 'data-view', 'save-image']"
                [height]="420"
              />
            </af-chart-card>
          </div>
        } @else {
          <div style="flex:1;display:grid;place-items:center;padding:28px">
            <af-empty-state
              icon="bar-chart-3"
              title="No se encontró el gráfico solicitado"
              description="La clave de la dirección no corresponde a ninguna serie publicada."
            />
          </div>
        }
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj;

/** La clave de la URL resuelve contra el registro de la aplicación. */
export const Window: Story = {
  args: { chartKey: 'forecast' },
};

/**
 * Clave desconocida.
 *
 * Una ventana en blanco se lee como un fallo de carga; decirlo explícitamente convierte
 * el error en algo sobre lo que el usuario puede actuar.
 */
export const NoEncontrado: Story = {
  args: { chartKey: 'inexistente' },
};

/**
 * El espía vive en el módulo y no en `args`.
 *
 * Este `Meta` no declara `component`, así que Storybook no puede tipar los args de
 * salida y la función no llega a las props del template. Tomarlo del cierre hace la
 * prueba independiente de ese detalle.
 */
const popOutSpy = fn();

/**
 * El circuito completo: la card emite `popOut` y la aplicación abre la ventana.
 *
 * La librería nunca navega; sólo avisa de la intención.
 */
export const DesdeLaCard: Story = {
  args: { chartKey: 'forecast' },
  render: (args) => ({
    props: {
      ...args,
      popOut: popOutSpy,
      weeks: AF_CHART_FORECAST_WEEKS,
      series: AF_CHART_FORECAST_SERIES,
      bands: AF_CHART_FORECAST_BANDS,
    },
    template: `
      <div class="af-story-surface">
        <af-chart-card
          heading="Proyección de carga a 8 semanas"
          tag="Forecast"
          note="Abre el menú ⋯ y elige «Abrir en ventana aparte» para ver la intención emitida."
          [menu]="['pop-out', 'download-image', 'reset']"
          (popOut)="popOut()"
        >
          <af-chart
            type="line"
            [categories]="weeks"
            [series]="series"
            [bands]="bands"
            [yAxis]="{ name: 'UA', min: 2600 }"
            [height]="300"
          />
        </af-chart-card>
      </div>
    `,
  }),
  play: async ({ canvas }) => {
    // El espía es de módulo y sobrevive entre las cuatro matrices de la prueba visual.
    popOutSpy.mockClear();

    await userEvent.click(canvas.getByRole('button', { name: 'Opciones del gráfico' }));
    await waitFor(() => expect(canvas.getByRole('menu')).toBeVisible());
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Abrir en ventana aparte' }));

    await expect(popOutSpy).toHaveBeenCalledOnce();
  },
};
