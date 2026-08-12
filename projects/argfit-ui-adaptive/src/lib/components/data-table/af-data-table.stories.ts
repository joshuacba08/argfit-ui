import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent } from 'storybook/test';

import type { AfDataTableColumn } from '@argfit-ui/core';

import { AfBadgeComponent } from '../badge/af-badge.component';
import { AfButtonComponent } from '../button/af-button.component';
import {
  AfDataTableCellDirective,
  AfDataTableExpandedRowDirective,
} from './af-data-table-cell.directive';
import { AfDataTableComponent } from './af-data-table.component';
import {
  AfDataTableEmptyDirective,
  AfDataTableToolbarDirective,
} from './af-data-table-slots.directive';

interface AthleteRow {
  readonly id: string;
  readonly name: string;
  readonly position: string;
  readonly availability: 'Disponible' | 'Carga limitada' | 'No disponible';
  readonly minutes: number;
  readonly load: string;
  readonly note: string;
}

const COLUMNS: readonly AfDataTableColumn[] = [
  { key: 'name', header: 'Atleta', sortable: true, mobilePriority: 'primary', minWidth: '14rem' },
  { key: 'position', header: 'Posición', sortable: true, mobilePriority: 'secondary' },
  {
    key: 'availability',
    header: 'Disponibilidad',
    mobilePriority: 'secondary',
    minWidth: '10rem',
  },
  {
    key: 'minutes',
    header: 'Minutos',
    sortable: true,
    align: 'end',
    mobilePriority: 'tertiary',
    valueLabel: (row) => `${(row as AthleteRow).minutes} min`,
  },
  {
    key: 'load',
    header: 'Carga',
    align: 'end',
    mobilePriority: 'tertiary',
  },
];

const ROWS: readonly AthleteRow[] = [
  {
    id: '1',
    name: 'Sofía Martínez',
    position: 'Portera',
    availability: 'Disponible',
    minutes: 270,
    load: 'Óptima',
    note: 'Sin restricciones para la próxima sesión.',
  },
  {
    id: '2',
    name: 'Lucía Gómez',
    position: 'Defensa',
    availability: 'Carga limitada',
    minutes: 195,
    load: 'Alta',
    note: 'Reducir el volumen de carrera de alta intensidad.',
  },
  {
    id: '3',
    name: 'Valentina Ruiz',
    position: 'Delantera',
    availability: 'Disponible',
    minutes: 228,
    load: 'Óptima',
    note: 'Disponible para carga completa.',
  },
  {
    id: '4',
    name: 'Emma Fernández',
    position: 'Mediocentro',
    availability: 'No disponible',
    minutes: 84,
    load: 'Baja',
    note: 'Continúa con trabajo individual de recuperación.',
  },
  {
    id: '5',
    name: 'Martina López',
    position: 'Extremo',
    availability: 'Disponible',
    minutes: 242,
    load: 'Óptima',
    note: 'Sin restricciones para competir.',
  },
  {
    id: '6',
    name: 'Camila Torres',
    position: 'Defensa',
    availability: 'Disponible',
    minutes: 180,
    load: 'Media',
    note: 'Seguimiento preventivo tras la sesión.',
  },
  {
    id: '7',
    name: 'Daniela Pérez',
    position: 'Mediocentro',
    availability: 'Carga limitada',
    minutes: 155,
    load: 'Alta',
    note: 'Limitar impactos y revisar antes de competir.',
  },
];

const meta: Meta<AfDataTableComponent> = {
  title: 'Data/DataTable',
  component: AfDataTableComponent,
  decorators: [
    moduleMetadata({
      imports: [
        AfBadgeComponent,
        AfButtonComponent,
        AfDataTableCellDirective,
        AfDataTableExpandedRowDirective,
        AfDataTableToolbarDirective,
        AfDataTableEmptyDirective,
      ],
    }),
  ],
  parameters: {
    argfit: {
      category: 'Data',
      importName: 'AfDataTable',
      useWhen: [
        'comparar registros con las mismas columnas',
        'ordenar, paginar, seleccionar o expandir filas en desktop y mobile',
      ],
      avoidWhen: [
        'mostrar un resumen pequeño de clave y valor',
        'representar contenido libre que funciona mejor como colección de tarjetas',
        'delegar fetching o reglas de negocio a la capa de UI',
      ],
      platforms: ['desktop', 'mobile'],
      tokens: [
        '--af-bg-surface',
        '--af-bg-elevated',
        '--af-border',
        '--af-text-main',
        '--af-text-muted',
        '--af-primary',
      ],
      related: ['AfDataView', 'AfPaginator', 'AfEmptyState', 'AfBadge'],
    },
    docs: {
      description: {
        component:
          'Tabla adaptativa para comparar registros: tabla densa en desktop y lista jerarquizada en mobile, con una sola API pública.',
      },
    },
  },
  argTypes: {
    columns: {
      control: 'object',
      description: 'Definición y prioridad responsive de cada columna.',
    },
    rows: { control: 'object', description: 'Dataset local que renderiza la tabla.' },
    rowIdKey: {
      control: 'text',
      description: 'Propiedad estable usada como identificador de fila.',
    },
    density: { control: 'select', options: ['compact', 'normal', 'comfortable'] },
    selectionMode: { control: 'select', options: ['none', 'single', 'multiple'] },
    selectedRowIds: { control: 'object', description: 'Selección controlada por el consumidor.' },
    expandedRowIds: {
      control: 'object',
      description: 'Filas expandidas controladas por el consumidor.',
    },
    sort: { control: 'object', description: 'Orden activo. Actualízalo al recibir sortChange.' },
    pagination: {
      control: 'object',
      description: 'Página local activa, tamaño y total de registros.',
    },
    loading: { control: 'boolean' },
    error: { control: 'text' },
    emptyTitle: { control: 'text' },
    emptyDescription: { control: 'text' },
    ariaLabel: {
      control: 'text',
      description: 'Nombre accesible que identifica el conjunto de datos.',
    },
    sortChange: { action: 'sortChange', description: 'Solicita un nuevo orden.' },
    pageChange: { action: 'pageChange', description: 'Solicita una nueva página.' },
    rowPressed: {
      action: 'rowPressed',
      description: 'Emite el registro activado con puntero o teclado.',
    },
    selectionChange: {
      action: 'selectionChange',
      description: 'Emite la nueva colección de ids seleccionados.',
    },
    rowExpandedChange: {
      action: 'rowExpandedChange',
      description: 'Emite la nueva colección de ids expandidos.',
    },
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface">
      <af-data-table
        [columns]="columns"
        [rows]="rows"
        [rowIdKey]="rowIdKey"
        [density]="density"
        [selectionMode]="selectionMode"
        [selectedRowIds]="selectedRowIds"
        [expandedRowIds]="expandedRowIds"
        [sort]="sort"
        [pagination]="pagination"
        [loading]="loading"
        [error]="error"
        [emptyTitle]="emptyTitle"
        [emptyDescription]="emptyDescription"
        [ariaLabel]="ariaLabel"
        (sortChange)="sortChange($event)"
        (pageChange)="pageChange($event)"
        (rowPressed)="rowPressed($event)"
        (selectionChange)="selectionChange($event)"
        (rowExpandedChange)="rowExpandedChange($event)"
      />
    </div>`,
  }),
};

export default meta;
type Story = StoryObj<AfDataTableComponent>;

const DEFAULT_ARGS = {
  columns: COLUMNS,
  rows: ROWS,
  rowIdKey: 'id',
  density: 'normal' as const,
  selectionMode: 'multiple' as const,
  selectedRowIds: ['1'],
  expandedRowIds: [],
  ariaLabel: 'Disponibilidad del plantel',
  sortChange: fn(),
  pageChange: fn(),
  rowPressed: fn(),
  selectionChange: fn(),
  rowExpandedChange: fn(),
};

export const Default: Story = {
  args: DEFAULT_ARGS,
  play: async ({ args, canvas }) => {
    const rowCheckboxes = canvas.getAllByRole('button', { name: 'Seleccionar fila' });
    await userEvent.click(rowCheckboxes[0]);
    await expect(args.selectionChange).toHaveBeenCalledWith(['1', '2']);
  },
};

export const SortingAndPagination: Story = {
  name: 'Orden y paginación',
  args: {
    ...DEFAULT_ARGS,
    selectionMode: 'none',
    selectedRowIds: [],
    sort: { key: 'name', direction: 'asc' },
    pagination: { pageIndex: 0, pageSize: 4, totalItems: ROWS.length },
  },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Atleta/ }));
    await expect(args.sortChange).toHaveBeenCalledWith({ key: 'name', direction: 'desc' });
  },
};

export const CustomContent: Story = {
  name: 'Celdas, toolbar y detalle',
  args: {
    ...DEFAULT_ARGS,
    selectionMode: 'single',
    selectedRowIds: [],
    expandedRowIds: ['2'],
  },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface">
      <af-data-table
        [columns]="columns"
        [rows]="rows"
        [selectionMode]="selectionMode"
        [selectedRowIds]="selectedRowIds"
        [expandedRowIds]="expandedRowIds"
        [ariaLabel]="ariaLabel"
        (selectionChange)="selectionChange($event)"
        (rowExpandedChange)="rowExpandedChange($event)"
        (rowPressed)="rowPressed($event)"
      >
        <div afDataTableToolbar class="af-story-row">
          <strong>Plantel profesional</strong>
          <af-button size="sm" variant="secondary">Exportar</af-button>
        </div>

        <ng-template afDataTableCell="availability" let-value="value">
          <af-badge
            [tone]="value === 'Disponible' ? 'success' : value === 'Carga limitada' ? 'warning' : 'danger'"
            [dot]="true"
          >{{ value }}</af-badge>
        </ng-template>

        <ng-template afDataTableExpandedRow let-row="row">
          <div class="af-story-stack">
            <strong>Nota del cuerpo técnico</strong>
            <span>{{ row.note }}</span>
          </div>
        </ng-template>
      </af-data-table>
    </div>`,
  }),
};

export const Loading: Story = {
  args: { ...DEFAULT_ARGS, rows: [], selectedRowIds: [], selectionMode: 'none', loading: true },
};

export const Empty: Story = {
  args: {
    ...DEFAULT_ARGS,
    rows: [],
    selectedRowIds: [],
    selectionMode: 'none',
    emptyTitle: 'Sin atletas',
    emptyDescription: 'Añade el primer atleta para comenzar.',
  },
};

export const CustomEmpty: Story = {
  name: 'Empty personalizado',
  args: { ...Empty.args },
  render: (args) => ({
    props: args,
    template: `<div class="af-story-surface">
      <af-data-table [columns]="columns" [rows]="rows" [ariaLabel]="ariaLabel">
        <div afDataTableEmpty class="af-story-stack">
          <strong>Todavía no hay convocadas</strong>
          <span>Importa el plantel o crea el primer registro.</span>
          <af-button size="sm">Añadir atleta</af-button>
        </div>
      </af-data-table>
    </div>`,
  }),
};

export const Error: Story = {
  args: {
    ...DEFAULT_ARGS,
    rows: [],
    selectedRowIds: [],
    selectionMode: 'none',
    error: 'No pudimos cargar la disponibilidad. Inténtalo de nuevo.',
  },
};
