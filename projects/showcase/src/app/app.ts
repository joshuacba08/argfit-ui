import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
    AfAnalyticsCard,
    AfAnalyticsCardActionsDirective,
    AfAnalyticsCardFooterDirective,
    AfAnalyticsCardLegendDirective,
    AfAnalyticsCardMetricsDirective,
    AfAvatar,
    AfBadge,
    AfButton,
    AfCard,
    AfCardContentDirective,
    AfCardEyebrowDirective,
    AfCardFooterDirective,
    AfCardHeaderDirective,
    AfCardSubtitleDirective,
    AfCardTitleDirective,
    AfChart,
    AfCheckbox,
    AfChip,
    AfDataTable,
    AfDataTableCellDirective,
    AfDataTableEmptyDirective,
    AfDataTableExpandedRowDirective,
    AfDataTableToolbarDirective,
    AfDataView,
    AfDataViewActionsDirective,
    AfDatePicker,
    AfDialog,
    AfDialogContentDirective,
    AfDialogFooterDirective,
    AfDrawer,
    AfField,
    AfIconField,
    AfIconFieldControlDirective,
    AfIconFieldPrefixDirective,
    AfIconFieldSuffixDirective,
    AfInlineMessage,
    AfInput,
    AfInputCount,
    AfInputGroup,
    AfInputGroupControlDirective,
    AfInputGroupPrefixDirective,
    AfInputGroupSuffixDirective,
    AfListbox,
    AfMetricCard,
    AfMultiSelect,
    AfOrderList,
    AfOrderListActionsDirective,
    AfPageShell,
    AfPageShellActionsDirective,
    AfPageShellBrandDirective,
    AfPageShellFooterDirective,
    AfPageShellUserDirective,
    AfPaginator,
    AfPassword,
    AfPickList,
    AfPickListActionsDirective,
    AfPopover,
    AfPopoverContentDirective,
    AfPopoverTriggerDirective,
    AfProgress,
    AfRadioGroup,
    AfSegmentedControl,
    AfSelect,
    AfTextarea,
    AfTimeline,
    AfTimelineActionsDirective,
    AfToastViewport,
    AfToggle,
    AfTooltip,
    AfTree,
    AfTreeActionsDirective,
} from '@argfit-ui/adaptive';
import {
    AfPlatformService,
    AfThemeService,
    AfToastService,
    type AfAnalyticsCardState,
    type AfBadgeTone,
    type AfBreadcrumbItem,
    type AfChartIndicator,
    type AfChartSeries,
    type AfDataTableColumn,
    type AfDataTablePageChange,
    type AfDataTablePagination,
    type AfDataTableSort,
    type AfDataViewItem,
    type AfDataViewLayout,
    type AfFeedbackSeverity,
    type AfFormOption,
    type AfIconName,
    type AfNavigationItem,
    type AfOrderListItem,
    type AfOrderListReorderChange,
    type AfOrderListSelectedIds,
    type AfPaginatorPageChange,
    type AfPaginatorState,
    type AfPickListChange,
    type AfPickListItem,
    type AfPickListSelectedIds,
    type AfPlatformPreference,
    type AfTimelineItem,
    type AfTreeExpandedIds,
    type AfTreeNode,
    type AfTreeSelectedIds,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

interface ShowcaseAthlete {
  readonly id: string;
  readonly name: string;
  readonly sport: string;
  readonly team: string;
  readonly sessions: number;
  readonly bestJump: number;
  readonly force: number;
  readonly rsi: number;
  readonly asymmetry: number;
  readonly status: 'active' | 'inactive';
  readonly lastSession: string;
}

interface ShowcaseAdvancedSelectOption {
  readonly id: string;
  readonly title: string;
  readonly hint: string;
}

type ShowcaseAnalyticsPeriod = '1M' | '3M' | '6M' | '1A';
type ShowcaseFormsTab = 'athlete' | 'test' | 'export';

@Component({
  selector: 'app-root',
  imports: [
    AfAnalyticsCard,
    AfAnalyticsCardActionsDirective,
    AfAnalyticsCardMetricsDirective,
    AfAnalyticsCardLegendDirective,
    AfAnalyticsCardFooterDirective,
    AfAvatar,
    AfBadge,
    AfButton,
    AfCard,
    AfCardHeaderDirective,
    AfCardTitleDirective,
    AfCardSubtitleDirective,
    AfCardEyebrowDirective,
    AfCardContentDirective,
    AfCardFooterDirective,
    AfChart,
    AfChip,
    AfCheckbox,
    AfDataView,
    AfDataViewActionsDirective,
    AfDataTable,
    AfDataTableCellDirective,
    AfDataTableEmptyDirective,
    AfDataTableExpandedRowDirective,
    AfDataTableToolbarDirective,
    AfDatePicker,
    AfIconComponent,
    AfField,
    AfIconField,
    AfIconFieldControlDirective,
    AfIconFieldPrefixDirective,
    AfIconFieldSuffixDirective,
    AfInput,
    AfInputCount,
    AfInputGroup,
    AfInputGroupControlDirective,
    AfInputGroupPrefixDirective,
    AfInputGroupSuffixDirective,
    AfInlineMessage,
    AfListbox,
    AfMetricCard,
    AfMultiSelect,
    AfOrderList,
    AfOrderListActionsDirective,
    AfPaginator,
    AfPageShell,
    AfPageShellBrandDirective,
    AfPageShellActionsDirective,
    AfPageShellUserDirective,
    AfPageShellFooterDirective,
    AfPassword,
    AfPickList,
    AfPickListActionsDirective,
    AfDialog,
    AfDialogContentDirective,
    AfDialogFooterDirective,
    AfDrawer,
    AfPopover,
    AfPopoverContentDirective,
    AfPopoverTriggerDirective,
    AfProgress,
    AfRadioGroup,
    AfSegmentedControl,
    AfSelect,
    AfTextarea,
    AfTimeline,
    AfTimelineActionsDirective,
    AfTooltip,
    AfToggle,
    AfTree,
    AfTreeActionsDirective,
    AfToastViewport,
    ReactiveFormsModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly platform = inject(AfPlatformService);
  protected readonly theme = inject(AfThemeService);
  private readonly toastService = inject(AfToastService);
  protected readonly lastAction = signal('Idle');
  protected readonly selectedDevice = signal<string>('jump-01');
  protected readonly activeShellSection = signal('dashboard');
  protected readonly activeShellTab = signal('home');
  protected readonly shellCollapsed = signal(false);
  protected readonly shellSearchQuery = signal('');

  protected readonly shellNavItems: readonly AfNavigationItem[] = [
    { id: 'alpha', label: 'Beta+', icon: 'info' },
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', badge: 3 },
    { id: 'athletes', label: 'Atletas', icon: 'users' },
    { id: 'data-table', label: 'Tabla avanzada', icon: 'table' },
    { id: 'devices', label: 'Dispositivos', icon: 'cpu', badge: 2 },
    { id: 'analytics', label: 'Analytics', icon: 'bar-chart-3' },
    { id: 'forms', label: 'Formularios', icon: 'check-square' },
    { id: 'feedback', label: 'Feedback', icon: 'bell' },
    { id: 'reports', label: 'Reportes', icon: 'file-text' },
    { id: 'settings', label: 'Configuracion', icon: 'settings', kind: 'action' },
  ];

  protected readonly shellMobileTabs: readonly AfNavigationItem[] = [
    { id: 'alpha', label: 'Beta+', icon: 'info' },
    { id: 'home', label: 'Inicio', icon: 'home' },
    { id: 'train', label: 'Entrenar', icon: 'play' },
    { id: 'analytics', label: 'Analytics', icon: 'bar-chart-3' },
    { id: 'forms', label: 'Formularios', icon: 'check-square' },
    { id: 'devices', label: 'Equipos', icon: 'cpu', badge: 2 },
  ];

  private readonly sectionTitles: Readonly<Record<string, string>> = {
    alpha: 'Beta+',
    dashboard: 'Dashboard',
    athletes: 'Atletas',
    'data-table': 'Tabla avanzada',
    devices: 'Dispositivos',
    analytics: 'Analytics',
    forms: 'Formularios',
    feedback: 'Feedback',
    reports: 'Reportes',
    settings: 'Configuracion',
  };

  private readonly sectionSubtitles: Readonly<Record<string, string>> = {
    alpha: 'Guia visual de la wave 1 activa y la siguiente ola Beta+ ya abierta',
    dashboard: 'Centro operativo de rendimiento',
    athletes: 'Roster, altas y mediciones base',
    'data-table': 'Dataset operativo de atletas',
    devices: 'Sensores vinculados y estado de bateria',
    analytics: 'Lecturas, tendencias y comparativas',
    forms: 'Altas, configuracion de tests y exportacion',
    feedback: 'Toasts, avisos persistentes y mensajes inline',
    reports: 'Exportaciones y entregables del staff',
    settings: 'Preferencias visuales y primitives',
  };

  private readonly mobileTabSections: Readonly<Record<string, string>> = {
    alpha: 'alpha',
    home: 'dashboard',
    train: 'athletes',
    analytics: 'analytics',
    forms: 'forms',
    devices: 'devices',
  };

  protected readonly activeShellTitle = computed(
    () => this.sectionTitles[this.activeShellSection()] ?? 'Dashboard',
  );

  protected readonly activeShellSubtitle = computed(
    () => this.sectionSubtitles[this.activeShellSection()] ?? 'Centro operativo de rendimiento',
  );

  protected readonly shellBreadcrumbs = computed<readonly AfBreadcrumbItem[]>(() => [
    { id: 'dashboard', label: 'ArgFit' },
    { id: this.activeShellSection(), label: this.activeShellTitle() },
  ]);

  protected readonly athleteName = signal('');
  protected readonly searchQuery = signal('');
  protected readonly athleteWeight = signal('68');
  protected readonly athleteEmail = signal('invalid-email');
  protected readonly feedbackInlineVisible = signal(true);
  protected readonly lastToastId = signal<string | undefined>(undefined);
  protected readonly heightControl = new FormControl<string>('178', { nonNullable: true });
  protected readonly activeFormsTab = signal<ShowcaseFormsTab>('athlete');
  protected readonly formTabOptions: readonly AfFormOption[] = [
    { value: 'athlete', label: 'Nuevo atleta' },
    { value: 'test', label: 'Configuracion de test' },
    { value: 'export', label: 'Exportacion' },
  ];
  protected readonly sportOptions: readonly AfFormOption[] = [
    { value: 'voleibol', label: 'Voleibol' },
    { value: 'futbol', label: 'Futbol' },
    { value: 'rugby', label: 'Rugby' },
    { value: 'basquet', label: 'Basquet' },
    { value: 'atletismo', label: 'Atletismo' },
  ];
  protected readonly genderOptions: readonly AfFormOption[] = [
    { value: 'female', label: 'Femenino' },
    { value: 'male', label: 'Masculino' },
    { value: 'other', label: 'Otro' },
  ];
  protected readonly testTypeOptions: readonly AfFormOption[] = [
    { value: 'cmj', label: 'CMJ', hint: 'Countermovement Jump' },
    { value: 'sj', label: 'SJ', hint: 'Squat Jump' },
    { value: 'dj', label: 'DJ', hint: 'Drop Jump' },
    { value: 'abalakov', label: 'Abalakov' },
  ];
  protected readonly lateralityOptions: readonly AfFormOption[] = [
    { value: 'bilateral', label: 'Bilateral' },
    { value: 'left', label: 'Unilateral izquierdo' },
    { value: 'right', label: 'Unilateral derecho' },
  ];
  protected readonly quickTestAthleteOptions: readonly AfFormOption[] = [
    { value: 'maria', label: 'Maria Garcia' },
    { value: 'santiago', label: 'Santiago Perez' },
    { value: 'lucas', label: 'Lucas Rodriguez' },
  ];
  protected readonly dateRangeOptions: readonly AfFormOption[] = [
    { value: 'session', label: 'Ultima sesion' },
    { value: 'week', label: 'Ultima semana' },
    { value: 'month', label: 'Ultimo mes' },
    { value: 'quarter', label: 'Ultimo trimestre' },
  ];
  protected readonly exportAthleteOptions: readonly AfFormOption[] = [
    { value: 'all', label: 'Todos los atletas' },
    { value: 'maria', label: 'Maria Garcia' },
    { value: 'santiago', label: 'Santiago Perez' },
    { value: 'lucas', label: 'Lucas Rodriguez' },
  ];
  protected readonly alphaAdvancedTestOptions: readonly ShowcaseAdvancedSelectOption[] = [
    { id: 'cmj', title: 'CMJ', hint: 'Countermovement Jump' },
    { id: 'sj', title: 'SJ', hint: 'Squat Jump' },
    { id: 'dj', title: 'DJ', hint: 'Drop Jump' },
    { id: 'abalakov', title: 'Abalakov', hint: 'Brazo libre' },
  ];
  protected readonly alphaDataViewItems: readonly AfDataViewItem[] = [
    {
      id: 'session-target-power',
      title: 'Sesion objetivo de potencia',
      eyebrow: 'CMJ + RSI',
      description: 'Bloque de 8 intentos con feedback operativo y control de carga por atleta.',
      meta: 'Hoy 10:30',
      supportingText: 'Grupo principal · San Lorenzo',
      badge: { label: 'Activa', tone: 'success' },
    },
    {
      id: 'drop-jump-screening',
      title: 'Screening de Drop Jump',
      eyebrow: 'Evaluacion',
      description: 'Filtro rapido para asimetria y fatiga residual antes del entrenamiento.',
      meta: 'Hoy 12:15',
      supportingText: 'Staff medico · 6 atletas',
      badge: { label: 'Revision', tone: 'warning' },
    },
    {
      id: 'force-block-u21',
      title: 'Bloque de fuerza U21',
      eyebrow: 'Sentadilla',
      description: 'Sesiones con seguimiento de fuerza maxima, saltos previos y recuperacion.',
      meta: 'Manana 08:00',
      supportingText: 'Plantel U21 · 14 atletas',
      badge: { label: 'Planificada', tone: 'primary' },
    },
    {
      id: 'travel-readiness',
      title: 'Readiness pre-viaje',
      eyebrow: 'Quick check',
      description: 'Control de readiness para delegacion con carga baja y sesion tactica.',
      meta: 'Viernes 07:45',
      supportingText: 'Seleccion regional · 10 atletas',
      badge: { label: 'Compacta', tone: 'accent' },
    },
    {
      id: 'injury-return-board',
      title: 'Seguimiento de retorno',
      eyebrow: 'Rehab',
      description: 'Vista resumida de salto, fuerza y dolor percibido para altas progresivas.',
      meta: 'Lunes 17:00',
      supportingText: 'Fisioterapia · 4 casos',
      badge: { label: 'Sensibles', tone: 'danger' },
    },
    {
      id: 'weekly-load-review',
      title: 'Revision de carga semanal',
      eyebrow: 'Analytics',
      description: 'Resumen de volumen, fuerza y mejor salto para comparativa de microciclos.',
      meta: 'Domingo 18:20',
      supportingText: 'Coaching staff · 3 equipos',
      badge: { label: 'Resumen', tone: 'neutral' },
    },
  ];
  protected readonly alphaTimelineItems: readonly AfTimelineItem[] = [
    {
      id: 'timeline-session-created',
      title: 'Sesion operativa creada',
      timestamp: 'Hoy 07:15',
      eyebrow: 'Setup',
      description: 'El staff preparo el bloque de potencia con atletas, sensores y umbrales listos.',
      meta: 'Grupo principal · Cancha 2',
      badge: { label: 'Activa', tone: 'success' },
      icon: 'calendar',
    },
    {
      id: 'timeline-screening-alert',
      title: 'Screening de fatiga marcado',
      timestamp: 'Hoy 08:40',
      eyebrow: 'Readiness',
      description: 'Dos atletas quedaron con alerta amarilla antes del bloque principal.',
      meta: 'Requiere ajuste del warm-up',
      badge: { label: 'Atencion', tone: 'warning' },
      icon: 'activity',
    },
    {
      id: 'timeline-export-ready',
      title: 'Reporte de microciclo generado',
      timestamp: 'Hoy 11:10',
      eyebrow: 'Analytics',
      description: 'Resumen de salto, RSI y carga disponible para compartir con el cuerpo tecnico.',
      meta: 'PDF y CSV listos',
      badge: { label: 'Listo', tone: 'accent' },
      icon: 'bar-chart-3',
    },
    {
      id: 'timeline-review-complete',
      title: 'Revision medica completada',
      timestamp: 'Hoy 13:25',
      eyebrow: 'Staff',
      description: 'Se valido la progresion de retorno y se actualizaron restricciones operativas.',
      meta: 'Fisioterapia · 4 casos',
      badge: { label: 'Cerrada', tone: 'neutral' },
      icon: 'check-square',
    },
  ];
  protected readonly alphaTreeNodes: readonly AfTreeNode[] = [
    {
      id: 'club-argfit',
      label: 'Club ArgFit',
      description: 'Estructura principal de trabajo',
      meta: '3 unidades',
      icon: 'users',
      badge: { label: 'Online', tone: 'success' },
      children: [
        {
          id: 'programs',
          label: 'Programas de rendimiento',
          description: 'Bloques activos del microciclo',
          meta: '2 flujos',
          icon: 'activity',
          children: [
            {
              id: 'program-power',
              label: 'Bloque de potencia',
              description: 'CMJ, DJ y readiness',
              meta: 'Hoy 10:30',
              icon: 'bar-chart-3',
            },
            {
              id: 'program-rehab',
              label: 'Retorno progresivo',
              description: 'Control medico y cargas sensibles',
              meta: '4 atletas',
              icon: 'check-square',
              badge: { label: 'Sensibles', tone: 'warning' },
            },
          ],
        },
        {
          id: 'squads',
          label: 'Planteles',
          description: 'Estructura deportiva activa',
          meta: '2 equipos',
          icon: 'users',
          children: [
            {
              id: 'squad-first-team',
              label: 'Primer equipo',
              description: 'Seguimiento diario',
              meta: '14 atletas',
              icon: 'users',
              children: [
                {
                  id: 'athlete-maria',
                  label: 'Maria Garcia',
                  description: 'Voleibol · CMJ prioritario',
                  meta: 'Lista',
                  icon: 'activity',
                  badge: { label: 'Alta', tone: 'accent' },
                },
              ],
            },
            {
              id: 'squad-u21',
              label: 'U21',
              description: 'Control de fuerza y salto',
              meta: '12 atletas',
              icon: 'users',
            },
          ],
        },
      ],
    },
  ];
  private readonly alphaTreeInitialExpandedIds: AfTreeExpandedIds = ['club-argfit', 'squads'];
  private readonly alphaTreeAllExpandableIds: AfTreeExpandedIds = this.collectAlphaTreeExpandableIds(this.alphaTreeNodes);
  private readonly alphaOrderListInitialItems: readonly AfOrderListItem[] = [
    {
      id: 'alpha-order-warmup',
      label: 'Warm-up neural',
      description: 'Activacion y aterrizajes para el bloque principal.',
      meta: '4 min',
      icon: 'activity',
      badge: { label: 'Start', tone: 'neutral' },
    },
    {
      id: 'alpha-order-cmj',
      label: 'CMJ principal',
      description: 'Serie de potencia con captura completa.',
      meta: '8 intentos',
      icon: 'bar-chart-3',
      badge: { label: 'Core', tone: 'accent' },
    },
    {
      id: 'alpha-order-dj',
      label: 'Drop Jump',
      description: 'Chequeo de RSI y stiffness reactivo.',
      meta: '4 intentos',
      icon: 'check-square',
      badge: { label: 'Reactive', tone: 'warning' },
    },
    {
      id: 'alpha-order-export',
      label: 'Export y cierre',
      description: 'Resumen para staff y guardado de la sesion.',
      meta: '2 min',
      icon: 'file-text',
      badge: { label: 'End', tone: 'success' },
    },
  ];
  private readonly alphaPickListInitialSourceItems: readonly AfPickListItem[] = [
    {
      id: 'alpha-pick-lucia',
      label: 'Lucia Perez',
      description: 'Basquet · readiness alto',
      meta: 'Disponible',
      icon: 'users',
    },
    {
      id: 'alpha-pick-bruno',
      label: 'Bruno Silva',
      description: 'Rugby · bloque de fuerza',
      meta: 'Disponible',
      icon: 'users',
    },
    {
      id: 'alpha-pick-ines',
      label: 'Ines Duarte',
      description: 'Voleibol · monitoring CMJ',
      meta: 'Disponible',
      icon: 'users',
    },
  ];
  private readonly alphaPickListInitialTargetItems: readonly AfPickListItem[] = [
    {
      id: 'alpha-pick-maria',
      label: 'Maria Garcia',
      description: 'Voleibol · prioridad de potencia',
      meta: 'Asignada',
      icon: 'users',
      badge: { label: 'Core', tone: 'accent' },
    },
    {
      id: 'alpha-pick-santiago',
      label: 'Santiago Ruiz',
      description: 'Rugby · seguimiento de fuerza',
      meta: 'Asignado',
      icon: 'users',
      badge: { label: 'Ready', tone: 'success' },
    },
  ];
  protected readonly alphaInputCountControl = new FormControl<number>(6, { nonNullable: true });
  protected readonly alphaDatePickerControl = new FormControl<string>('2026-05-22', { nonNullable: true });
  protected readonly alphaListboxControl = new FormControl<readonly unknown[]>(['cmj', 'dj'], { nonNullable: true });
  protected readonly alphaMultiSelectControl = new FormControl<readonly unknown[]>(['cmj'], { nonNullable: true });
  protected readonly alphaDataViewLayout = signal<AfDataViewLayout>('grid');
  protected readonly alphaDataViewPage = signal<AfPaginatorState>({
    pageIndex: 0,
    pageSize: 4,
    totalItems: this.alphaDataViewItems.length,
  });
  protected readonly alphaVisibleDataViewItems = computed(() => {
    const page = this.alphaDataViewPage();
    const start = page.pageIndex * page.pageSize;
    return this.alphaDataViewItems.slice(start, start + page.pageSize);
  });
  protected readonly alphaTreeExpandedIds = signal<AfTreeExpandedIds>(this.alphaTreeInitialExpandedIds);
  protected readonly alphaTreeSelectedIds = signal<AfTreeSelectedIds>(['athlete-maria']);
  protected readonly alphaOrderListItems = signal<readonly AfOrderListItem[]>(this.alphaOrderListInitialItems);
  protected readonly alphaOrderListSelectedIds = signal<AfOrderListSelectedIds>(['alpha-order-cmj']);
  protected readonly alphaOrderListSummary = computed(() => this.alphaOrderListItems().map((item) => item.label).join(' · '));
  protected readonly alphaPickListSourceItems = signal<readonly AfPickListItem[]>(this.alphaPickListInitialSourceItems);
  protected readonly alphaPickListTargetItems = signal<readonly AfPickListItem[]>(this.alphaPickListInitialTargetItems);
  protected readonly alphaPickListSourceSelectedIds = signal<AfPickListSelectedIds>(['alpha-pick-lucia']);
  protected readonly alphaPickListTargetSelectedIds = signal<AfPickListSelectedIds>([]);
  protected readonly alphaPickListAssignedSummary = computed(() => {
    const targetItems = this.alphaPickListTargetItems();
    if (targetItems.length === 0) {
      return 'Sin atletas asignados';
    }

    return targetItems.map((item) => item.label).join(' · ');
  });
  protected readonly alphaTreeSelectionSummary = computed(() => {
    const selectedIds = this.alphaTreeSelectedIds();
    if (selectedIds.length === 0) {
      return 'Sin nodo seleccionado';
    }

    return selectedIds
      .map((selectedId) => this.findAlphaTreeNodeLabel(selectedId) ?? selectedId)
      .join(' · ');
  });
  protected readonly alphaTreeExpandedSummary = computed(
    () => `${this.alphaTreeExpandedIds().length} nodos abiertos`,
  );
  protected readonly newAthleteForm = new FormGroup({
    name: new FormControl<string>('Maria Garcia', { nonNullable: true }),
    email: new FormControl<string>('maria@club.com.ar', { nonNullable: true }),
    sport: new FormControl<string>('voleibol', { nonNullable: true }),
    team: new FormControl<string>('Club San Lorenzo', { nonNullable: true }),
    weight: new FormControl<string>('68', { nonNullable: true }),
    height: new FormControl<string>('172', { nonNullable: true }),
    gender: new FormControl<string>('female', { nonNullable: true }),
    portalPassword: new FormControl<string>('ArgFit#2026', { nonNullable: true }),
    temporaryPassword: new FormControl<string>('', { nonNullable: true }),
    notes: new FormControl<string>('Seguimiento de potencia semanal y asimetria leve.', { nonNullable: true }),
    notifications: new FormControl<boolean>(true, { nonNullable: true }),
  });
  protected readonly testConfigForm = new FormGroup({
    testType: new FormControl<string>('cmj', { nonNullable: true }),
    laterality: new FormControl<string>('bilateral', { nonNullable: true }),
    jumps: new FormControl<string>('8', { nonNullable: true }),
    rest: new FormControl<string>('3', { nonNullable: true }),
    threshold: new FormControl<string>('50', { nonNullable: true }),
    bleAuto: new FormControl<boolean>(true, { nonNullable: true }),
    audioFeedback: new FormControl<boolean>(true, { nonNullable: true }),
    vibration: new FormControl<boolean>(false, { nonNullable: true }),
  });
  protected readonly exportForm = new FormGroup({
    range: new FormControl<string>('month', { nonNullable: true }),
    athlete: new FormControl<string>('all', { nonNullable: true }),
    csv: new FormControl<boolean>(true, { nonNullable: true }),
    pdf: new FormControl<boolean>(true, { nonNullable: true }),
    xlsx: new FormControl<boolean>(false, { nonNullable: true }),
    shareCoach: new FormControl<boolean>(true, { nonNullable: true }),
    email: new FormControl<string>('staff@club.com.ar', { nonNullable: true }),
  });

  protected readonly athleteTableColumns: readonly AfDataTableColumn[] = [
    { key: 'name', header: 'Atleta', sortable: true, minWidth: '190px', mobilePriority: 'primary' },
    { key: 'sport', header: 'Deporte', sortable: true, minWidth: '110px', mobilePriority: 'secondary' },
    { key: 'sessions', header: 'Sesiones', sortable: true, align: 'end', minWidth: '120px', mobilePriority: 'secondary' },
    { key: 'bestJump', header: 'Mejor salto', sortable: true, align: 'end', minWidth: '120px', mobilePriority: 'secondary' },
    { key: 'force', header: 'Fuerza', sortable: true, align: 'end', minWidth: '110px', mobilePriority: 'tertiary' },
    { key: 'rsi', header: 'RSI', sortable: true, align: 'end', minWidth: '80px', mobilePriority: 'tertiary' },
    { key: 'asymmetry', header: 'Asimetria', sortable: true, align: 'end', minWidth: '105px', mobilePriority: 'tertiary' },
    { key: 'status', header: 'Estado', minWidth: '110px', mobilePriority: 'secondary' },
  ];

  protected readonly athleteTableRows: readonly ShowcaseAthlete[] = [
    { id: '1', name: 'Maria Garcia', sport: 'Voleibol', team: 'Club San Lorenzo', sessions: 42, bestJump: 45.2, force: 2847, rsi: 1.32, asymmetry: 4.2, status: 'active', lastSession: 'Hoy 10:30' },
    { id: '2', name: 'Lucas Rodriguez', sport: 'Futbol', team: 'Racing Club', sessions: 38, bestJump: 52.1, force: 3120, rsi: 1.45, asymmetry: 6.1, status: 'active', lastSession: 'Hoy 09:15' },
    { id: '3', name: 'Valentina Lopez', sport: 'Handball', team: 'Seleccion ARG', sessions: 56, bestJump: 38.7, force: 2340, rsi: 1.18, asymmetry: 3.8, status: 'active', lastSession: 'Ayer 17:00' },
    { id: '4', name: 'Matias Fernandez', sport: 'Rugby', team: 'CASI', sessions: 29, bestJump: 48.9, force: 2890, rsi: 1.38, asymmetry: 8.4, status: 'inactive', lastSession: '12 May' },
    { id: '5', name: 'Camila Torres', sport: 'Basquet', team: 'Obras Sanitarias', sessions: 34, bestJump: 41.3, force: 2580, rsi: 1.25, asymmetry: 5.0, status: 'active', lastSession: 'Ayer 11:30' },
    { id: '6', name: 'Santiago Perez', sport: 'Atletismo', team: 'GEBA', sessions: 67, bestJump: 55.4, force: 3340, rsi: 1.52, asymmetry: 2.9, status: 'active', lastSession: 'Hoy 08:00' },
    { id: '7', name: 'Florencia Diaz', sport: 'Hockey', team: 'Club Ciudad', sessions: 23, bestJump: 36.8, force: 2180, rsi: 1.1, asymmetry: 7.2, status: 'inactive', lastSession: '8 May' },
    { id: '8', name: 'Nicolas Morales', sport: 'Futbol', team: 'Independiente', sessions: 45, bestJump: 49.7, force: 2960, rsi: 1.4, asymmetry: 5.5, status: 'active', lastSession: 'Ayer 16:00' },
    { id: '9', name: 'Ana Gutierrez', sport: 'Voleibol', team: 'River Plate', sessions: 31, bestJump: 40.2, force: 2450, rsi: 1.22, asymmetry: 4.8, status: 'active', lastSession: '15 May' },
    { id: '10', name: 'Diego Romero', sport: 'Rugby', team: 'Alumni', sessions: 19, bestJump: 46.5, force: 2780, rsi: 1.35, asymmetry: 9.1, status: 'inactive', lastSession: '5 May' },
    { id: '11', name: 'Paula Martinez', sport: 'Atletismo', team: 'CeNARD', sessions: 72, bestJump: 44.8, force: 2720, rsi: 1.3, asymmetry: 3.2, status: 'active', lastSession: 'Hoy 07:30' },
    { id: '12', name: 'Tomas Herrera', sport: 'Basquet', team: 'San Lorenzo', sessions: 28, bestJump: 50.3, force: 3050, rsi: 1.42, asymmetry: 6.8, status: 'active', lastSession: '14 May' },
  ];

  protected readonly athleteTableSearch = signal('');
  protected readonly athleteTableSort = signal<AfDataTableSort>({ key: 'bestJump', direction: 'desc' });
  protected readonly athleteTablePage = signal<AfDataTablePagination>({ pageIndex: 0, pageSize: 8, totalItems: this.athleteTableRows.length });
  protected readonly athleteTableSelectedRowIds = signal<readonly string[]>(['6', '2']);
  protected readonly athleteTableExpandedRowIds = signal<readonly string[]>(['6']);
  protected readonly filteredAthleteTableRows = computed(() => {
    const query = this.athleteTableSearch().trim().toLowerCase();
    if (!query) {
      return this.athleteTableRows;
    }

    return this.athleteTableRows.filter((athlete) =>
      [athlete.name, athlete.sport, athlete.team, athlete.status].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  });
  protected readonly athleteTablePagination = computed<AfDataTablePagination>(() => ({
    ...this.athleteTablePage(),
    totalItems: this.filteredAthleteTableRows().length,
  }));

  protected setPlatform(preference: AfPlatformPreference): void {
    this.platform.setPreference(preference);
  }

  protected toggleTheme(): void {
    this.theme.toggleTheme();
    this.recordAction(`Theme → ${this.theme.currentThemeName()}`);
  }

  protected recordAction(action: string): void {
    this.lastAction.set(action);
  }

  protected selectDevice(id: string): void {
    this.selectedDevice.set(id);
    this.recordAction(`Device selected → ${id}`);
  }

  protected onShellNavSelected(item: AfNavigationItem): void {
    this.activeShellSection.set(item.id);
    this.recordAction(`Navegacion → ${item.label}`);
  }

  protected onShellTabSelected(item: AfNavigationItem): void {
    this.activeShellTab.set(item.id);
    this.activeShellSection.set(this.mobileTabSections[item.id] ?? item.id);
    this.recordAction(`Tab movil → ${item.label}`);
  }

  protected onShellBreadcrumbSelected(item: AfBreadcrumbItem): void {
    if (item.id && this.sectionTitles[item.id]) {
      this.activeShellSection.set(item.id);
    }
    this.recordAction(`Breadcrumb → ${item.label}`);
  }

  protected onShellCollapsedChange(collapsed: boolean): void {
    this.shellCollapsed.set(collapsed);
    this.recordAction(`Sidebar → ${collapsed ? 'colapsado' : 'expandido'}`);
  }

  protected onShellSearchChanged(value: string): void {
    this.shellSearchQuery.set(value);
    this.searchQuery.set(value);
  }

  protected updateAthleteName(value: string): void {
    this.athleteName.set(value);
  }

  protected updateSearchQuery(value: string): void {
    this.searchQuery.set(value);
  }

  protected updateAthleteTableSearch(value: string): void {
    this.athleteTableSearch.set(value);
    this.athleteTablePage.update((current) => ({ ...current, pageIndex: 0 }));
  }

  protected setAthleteTableSort(sort: AfDataTableSort): void {
    this.athleteTableSort.set(sort);
    this.athleteTablePage.update((current) => ({ ...current, pageIndex: 0 }));
    this.recordAction(`Tabla sort → ${sort.key} ${sort.direction}`);
  }

  protected setAthleteTablePage(page: AfDataTablePageChange): void {
    this.athleteTablePage.update((current) => ({
      ...current,
      pageIndex: page.pageIndex,
      pageSize: page.pageSize,
    }));
    this.recordAction(`Tabla page → ${page.pageIndex + 1}`);
  }

  protected setAthleteTableSelection(rowIds: readonly string[]): void {
    this.athleteTableSelectedRowIds.set(rowIds);
    this.recordAction(`Tabla seleccion → ${rowIds.length}`);
  }

  protected setAthleteTableExpanded(rowIds: readonly string[]): void {
    this.athleteTableExpandedRowIds.set(rowIds);
  }

  protected recordAthleteRow(row: unknown): void {
    const athlete = this.asShowcaseAthlete(row);
    if (athlete) {
      this.recordAction(`Tabla atleta → ${athlete.name}`);
    }
  }

  protected updateAthleteWeight(value: string): void {
    this.athleteWeight.set(value);
  }

  protected updateAthleteEmail(value: string): void {
    this.athleteEmail.set(value);
  }

  protected setFormsTab(value: string): void {
    if (value === 'athlete' || value === 'test' || value === 'export') {
      this.activeFormsTab.set(value);
      this.recordAction(`Formularios → ${value}`);
    }
  }

  protected saveNewAthleteForm(): void {
    this.recordAction(`Formulario atleta → ${this.newAthleteForm.controls.name.value}`);
    this.toastService.success({
      title: 'Atleta registrado',
      description: `${this.newAthleteForm.controls.name.value} quedo listo para la proxima sesion.`,
    });
  }

  protected saveTestConfigForm(): void {
    this.recordAction(`Formulario test → ${this.testConfigForm.controls.testType.value}`);
    this.toastService.info({
      title: 'Configuracion guardada',
      description: `Test ${this.testConfigForm.controls.testType.value.toUpperCase()} actualizado.`,
    });
  }

  protected generateExportForm(): void {
    this.recordAction(`Formulario exportacion → ${this.exportForm.controls.range.value}`);
    this.toastService.success({
      title: 'Reporte generado',
      description: 'El archivo quedo disponible para el staff.',
    });
  }

  protected showFeedbackToast(severity: AfFeedbackSeverity): void {
    const toast = this.feedbackToastCopy(severity);
    const id = this.toastService.show({
      ...toast,
      severity,
      duration: severity === 'danger' ? 0 : 5000,
      persistent: severity === 'danger',
    });

    this.lastToastId.set(id);
    this.recordAction(`Toast → ${severity}`);
  }

  protected clearFeedbackToasts(): void {
    this.toastService.clear();
    this.lastToastId.set(undefined);
    this.recordAction('Toasts limpiados');
  }

  protected dismissFeedbackInline(): void {
    this.feedbackInlineVisible.set(false);
    this.recordAction('Inline feedback cerrado');
  }

  protected resetFeedbackInline(): void {
    this.feedbackInlineVisible.set(true);
    this.recordAction('Inline feedback restaurado');
  }

  protected emailError(): string | undefined {
    const value = this.athleteEmail();
    if (!value) {
      return undefined;
    }
    return /.+@.+\..+/.test(value) ? undefined : 'Ingresa un email valido';
  }

  protected athleteInitials(row: unknown): string {
    const athlete = this.asShowcaseAthlete(row);
    if (!athlete) {
      return 'AF';
    }
    return athlete.name
      .split(' ')
      .map((part) => part[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  protected athleteText(row: unknown, key: keyof ShowcaseAthlete): string {
    const athlete = this.asShowcaseAthlete(row);
    const value = athlete?.[key];
    return value === undefined ? '-' : String(value);
  }

  protected athleteNumber(row: unknown, key: keyof ShowcaseAthlete, fractionDigits = 0): string {
    const athlete = this.asShowcaseAthlete(row);
    const value = athlete?.[key];
    return typeof value === 'number' ? value.toFixed(fractionDigits) : '-';
  }

  protected athleteSessionsPercent(row: unknown): number {
    const athlete = this.asShowcaseAthlete(row);
    return athlete ? Math.min(Math.round((athlete.sessions / 80) * 100), 100) : 0;
  }

  protected athleteStatusLabel(row: unknown): string {
    return this.asShowcaseAthlete(row)?.status === 'active' ? 'Activo' : 'Inactivo';
  }

  protected athleteStatusTone(row: unknown): AfBadgeTone {
    return this.asShowcaseAthlete(row)?.status === 'active' ? 'success' : 'neutral';
  }

  protected athleteAsymmetryToneClass(row: unknown): string {
    const asymmetry = this.asShowcaseAthlete(row)?.asymmetry ?? 0;
    if (asymmetry > 7) {
      return 'asymmetry-value--danger';
    }
    if (asymmetry > 5) {
      return 'asymmetry-value--warning';
    }
    return 'asymmetry-value--success';
  }

  protected athleteRecentSessions(row: unknown): readonly string[] {
    const athlete = this.asShowcaseAthlete(row);
    if (!athlete) {
      return [];
    }

    const jumps = Math.max(6, Math.round(athlete.sessions / 6));
    return [
      `${athlete.sport} bilateral - ${athlete.lastSession} - ${jumps} saltos`,
      `Drop Jump - Ayer 16:45 - ${Math.max(5, jumps - 4)} saltos`,
      `SJ unilateral - 15 May - ${Math.max(4, jumps - 6)} saltos`,
    ];
  }

  protected athleteSparklinePoints(row: unknown): string {
    const athlete = this.asShowcaseAthlete(row);
    if (!athlete) {
      return '';
    }

    const values = [
      athlete.bestJump - 5.4,
      athlete.bestJump - 4.1,
      athlete.bestJump - 2.2,
      athlete.bestJump - 1.1,
      athlete.bestJump + 0.6,
      athlete.bestJump + 1.4,
    ];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(max - min, 1);

    return values
      .map((value, index) => {
        const x = Math.round((index / (values.length - 1)) * 160);
        const y = Math.round(44 - ((value - min) / range) * 36);
        return `${x},${y}`;
      })
      .join(' ');
  }

  private asShowcaseAthlete(value: unknown): ShowcaseAthlete | undefined {
    if (typeof value !== 'object' || value === null) {
      return undefined;
    }

    const candidate = value as Partial<ShowcaseAthlete>;
    return typeof candidate.id === 'string' && typeof candidate.name === 'string' ? candidate as ShowcaseAthlete : undefined;
  }

  private feedbackToastCopy(severity: AfFeedbackSeverity): { readonly title: string; readonly description: string } {
    switch (severity) {
      case 'success':
        return {
          title: 'Sesion guardada',
          description: 'Los datos de salto se sincronizaron correctamente.',
        };
      case 'info':
        return {
          title: 'Sensor conectado',
          description: 'ArgFit Jump 01 esta transmitiendo con baja latencia.',
        };
      case 'warning':
        return {
          title: 'Bateria baja',
          description: 'Carga el dispositivo antes de iniciar el siguiente bloque.',
        };
      case 'danger':
        return {
          title: 'Conexion interrumpida',
          description: 'Revisa BLE y vuelve a vincular el sensor.',
        };
    }
  }

  protected readonly detailsDialogOpen = signal(false);
  protected readonly removeDialogOpen = signal(false);
  protected readonly quickTestDialogOpen = signal(false);
  protected readonly sessionDialogOpen = signal(false);
  protected readonly alphaTooltipOpen = signal(false);
  protected readonly alphaDrawerOpen = signal(false);
  protected readonly alphaPopoverOpen = signal(false);

  protected toggleAlphaTooltip(): void {
    const next = !this.alphaTooltipOpen();
    this.alphaTooltipOpen.set(next);
    this.recordAction(`Beta+ → tooltip ${next ? 'abierto' : 'cerrado'}`);
  }

  protected setAlphaDrawer(open: boolean): void {
    this.alphaDrawerOpen.set(open);
    this.recordAction(`Beta+ → drawer ${open ? 'abierto' : 'cerrado'}`);
  }

  protected setAlphaPopover(open: boolean): void {
    this.alphaPopoverOpen.set(open);
    this.recordAction(`Beta+ → popover ${open ? 'abierto' : 'cerrado'}`);
  }

  protected alphaSelectedTestsSummary(): string {
    return this.formatAlphaSelection(this.alphaMultiSelectControl.value, 'Sin filtros activos');
  }

  protected alphaListboxSummary(): string {
    return this.formatAlphaSelection(this.alphaListboxControl.value, 'Sin tests fijados');
  }

  protected setAlphaDataViewLayout(layout: AfDataViewLayout): void {
    this.alphaDataViewLayout.set(layout);
    this.recordAction(`Beta+ data view → ${layout}`);
  }

  protected setAlphaDataViewPage(page: AfPaginatorPageChange): void {
    this.alphaDataViewPage.update((current) => ({
      ...current,
      pageIndex: page.pageIndex,
      pageSize: page.pageSize,
      totalItems: this.alphaDataViewItems.length,
    }));
    this.recordAction(`Beta+ paginator → ${page.pageIndex + 1}`);
  }

  protected recordAlphaDataViewItem(item: AfDataViewItem): void {
    this.recordAction(`Beta+ data view item → ${item.title}`);
  }

  protected recordAlphaTimelineItem(item: AfTimelineItem): void {
    this.recordAction(`Beta+ timeline item → ${item.title}`);
  }

  protected setAlphaOrderListSelection(selectedIds: AfOrderListSelectedIds): void {
    this.alphaOrderListSelectedIds.set(selectedIds);
    this.recordAction(`Beta+ order list selection → ${selectedIds.length}`);
  }

  protected applyAlphaOrderListReorder(change: AfOrderListReorderChange): void {
    this.alphaOrderListItems.set(change.items);
    this.alphaOrderListSelectedIds.set(change.selectedIds);
    this.recordAction(`Beta+ order list → ${change.direction}`);
  }

  protected resetAlphaOrderList(): void {
    this.alphaOrderListItems.set(this.alphaOrderListInitialItems);
    this.alphaOrderListSelectedIds.set(['alpha-order-cmj']);
    this.recordAction('Beta+ order list → reset');
  }

  protected setAlphaPickListSourceSelection(selectedIds: AfPickListSelectedIds): void {
    this.alphaPickListSourceSelectedIds.set(selectedIds);
    this.recordAction(`Beta+ pick list source → ${selectedIds.length}`);
  }

  protected setAlphaPickListTargetSelection(selectedIds: AfPickListSelectedIds): void {
    this.alphaPickListTargetSelectedIds.set(selectedIds);
    this.recordAction(`Beta+ pick list target → ${selectedIds.length}`);
  }

  protected applyAlphaPickListChange(change: AfPickListChange): void {
    this.alphaPickListSourceItems.set(change.sourceItems);
    this.alphaPickListTargetItems.set(change.targetItems);
    this.alphaPickListSourceSelectedIds.set(change.sourceSelectedIds);
    this.alphaPickListTargetSelectedIds.set(change.targetSelectedIds);
    this.recordAction(`Beta+ pick list → ${change.direction}`);
  }

  protected resetAlphaPickList(): void {
    this.alphaPickListSourceItems.set(this.alphaPickListInitialSourceItems);
    this.alphaPickListTargetItems.set(this.alphaPickListInitialTargetItems);
    this.alphaPickListSourceSelectedIds.set(['alpha-pick-lucia']);
    this.alphaPickListTargetSelectedIds.set([]);
    this.recordAction('Beta+ pick list → reset');
  }

  protected setAlphaTreeExpanded(expandedIds: AfTreeExpandedIds): void {
    this.alphaTreeExpandedIds.set(expandedIds);
    this.recordAction(`Beta+ tree expanded → ${expandedIds.length}`);
  }

  protected setAlphaTreeSelection(selectedIds: AfTreeSelectedIds): void {
    this.alphaTreeSelectedIds.set(selectedIds);
    this.recordAction(`Beta+ tree selection → ${this.alphaTreeSelectionSummary()}`);
  }

  protected expandAlphaTree(): void {
    this.alphaTreeExpandedIds.set(this.alphaTreeAllExpandableIds);
    this.recordAction('Beta+ tree → expandir todo');
  }

  protected resetAlphaTree(): void {
    this.alphaTreeExpandedIds.set(this.alphaTreeInitialExpandedIds);
    this.alphaTreeSelectedIds.set(['athlete-maria']);
    this.recordAction('Beta+ tree → reset');
  }

  protected recordAlphaTreeNode(node: AfTreeNode): void {
    this.recordAction(`Beta+ tree node → ${node.label}`);
  }

  private formatAlphaSelection(value: unknown, emptyText: string): string {
    if (!Array.isArray(value) || value.length === 0) {
      return emptyText;
    }

    const labels = value
      .filter((entry): entry is string => typeof entry === 'string')
      .map((entry) => this.alphaAdvancedTestOptions.find((option) => option.id === entry)?.title ?? entry.toUpperCase());

    if (labels.length === 0) {
      return emptyText;
    }

    return labels.join(' · ');
  }

  private collectAlphaTreeExpandableIds(nodes: readonly AfTreeNode[]): AfTreeExpandedIds {
    return nodes.flatMap((node) => {
      if (!node.children || node.children.length === 0) {
        return [];
      }

      return [node.id, ...this.collectAlphaTreeExpandableIds(node.children)];
    });
  }

  private findAlphaTreeNodeLabel(nodeId: string, nodes: readonly AfTreeNode[] = this.alphaTreeNodes): string | undefined {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node.label;
      }

      if (!node.children || node.children.length === 0) {
        continue;
      }

      const nestedLabel = this.findAlphaTreeNodeLabel(nodeId, node.children);
      if (nestedLabel) {
        return nestedLabel;
      }
    }

    return undefined;
  }

  protected openDetailsDialog(): void {
    this.detailsDialogOpen.set(true);
    this.recordAction('Dialog → dispositivo abierto');
  }

  protected setDetailsDialog(open: boolean): void {
    this.detailsDialogOpen.set(open);
    if (!open) {
      this.recordAction('Dialog → dispositivo cerrado');
    }
  }

  protected openSessionDialog(): void {
    this.sessionDialogOpen.set(true);
    this.recordAction('Dialog → sesion completada abierto');
  }

  protected setSessionDialog(open: boolean): void {
    this.sessionDialogOpen.set(open);
    if (!open) {
      this.recordAction('Dialog → sesion completada cerrado');
    }
  }

  protected downloadSessionCsv(): void {
    this.sessionDialogOpen.set(false);
    this.recordAction('Sesion → CSV descargado');
  }

  protected openRemoveDialog(): void {
    this.removeDialogOpen.set(true);
    this.recordAction('Dialog → confirmar baja abierto');
  }

  protected setRemoveDialog(open: boolean): void {
    this.removeDialogOpen.set(open);
    if (!open) {
      this.recordAction('Dialog → confirmar baja cerrado');
    }
  }

  protected confirmRemove(): void {
    this.removeDialogOpen.set(false);
    this.recordAction('Atleta dado de baja');
  }

  protected openQuickTestDialog(): void {
    this.quickTestDialogOpen.set(true);
    this.recordAction('Dialog → nuevo test abierto');
  }

  protected setQuickTestDialog(open: boolean): void {
    this.quickTestDialogOpen.set(open);
    if (!open) {
      this.recordAction('Dialog → nuevo test cerrado');
    }
  }

  protected createQuickTest(): void {
    this.quickTestDialogOpen.set(false);
    this.recordAction(`Test creado → ${this.testConfigForm.controls.testType.value.toUpperCase()}`);
  }

  // ────────────────────────────────────────────────────────────────
  // Icon gallery + chart vertical slice (HU-007)
  // ────────────────────────────────────────────────────────────────
  protected readonly iconGallery: ReadonlyArray<{ name: AfIconName; label: string }> = [
    { name: 'search', label: 'Buscar' },
    { name: 'activity', label: 'Actividad' },
    { name: 'calendar', label: 'Calendario' },
    { name: 'settings', label: 'Ajustes' },
    { name: 'trash', label: 'Eliminar' },
    { name: 'download', label: 'Descargar' },
    { name: 'layout-dashboard', label: 'Dashboard' },
    { name: 'users', label: 'Atletas' },
    { name: 'table', label: 'Tabla' },
    { name: 'kanban', label: 'Kanban' },
    { name: 'bar-chart-3', label: 'Charts' },
    { name: 'cpu', label: 'Dispositivo' },
    { name: 'monitor', label: 'Overlays' },
    { name: 'check-square', label: 'Forms' },
  ];

  protected readonly weekCategories = signal<readonly string[]>([
    'Lun',
    'Mar',
    'Mie',
    'Jue',
    'Vie',
    'Sab',
    'Dom',
  ]);

  protected readonly performanceIndicators = signal<readonly AfChartIndicator[]>([
    { name: 'Performance Score', min: 0, max: 100 },
  ]);

  protected readonly performanceGaugeSeries = signal<readonly AfChartSeries[]>([
    { name: 'Performance Score', data: [78], tone: 'primary' },
  ]);

  protected readonly sessionDistributionSeries = signal<readonly AfChartSeries[]>([
    {
      name: 'Sesiones',
      data: [
        { label: 'CMJ', value: 42 },
        { label: 'SJ', value: 18 },
        { label: 'DJ', value: 15 },
        { label: 'Sprint', value: 8 },
        { label: 'Abalakov', value: 12 },
      ],
    },
  ]);

  protected readonly jumpProgressCategories = signal<readonly string[]>([
    'D1',
    'D2',
    'D3',
    'D4',
    'D5',
    'D6',
    'D7',
    'D8',
    'D9',
    'D10',
    'D11',
    'D12',
    'D13',
    'D14',
  ]);

  protected readonly jumpProgressSeries = signal<readonly AfChartSeries[]>([
    {
      name: 'Salto',
      data: [38.2, 40, 39.4, 42.1, 41.8, 43.0, 44.1, 42.9, 45.2, 43.8, 44.4, 45, 44.8, 46],
      tone: 'primary',
    },
  ]);

  protected readonly monthlyCategories = signal<readonly string[]>([
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ]);

  protected readonly monthlySessionSeries = signal<readonly AfChartSeries[]>([
    { name: 'CMJ', data: [30, 48, 38, 44, 42, 52, 40, 39, 35, 49, 31, 51] },
    { name: 'SJ', data: [20, 22, 24, 24, 25, 28, 22, 32, 31, 28, 25, 31] },
    { name: 'DJ', data: [13, 10, 16, 20, 21, 18, 21, 15, 14, 24, 13, 20] },
    { name: 'Sprint', data: [8, 9, 7, 5, 10, 6, 9, 12, 8, 10, 9, 8] },
  ]);

  protected readonly rankingCategories = signal<readonly string[]>([
    'S. Perez',
    'L. Rodriguez',
    'N. Morales',
    'D. Romero',
    'M. Garcia',
  ]);

  protected readonly rankingSeries = signal<readonly AfChartSeries[]>([
    { name: 'Mejor salto', data: [42.1, 46.5, 49.7, 52.1, 55.4], tone: 'primary' },
  ]);

  protected readonly radarCategories = signal<readonly string[]>([
    'Salto',
    'T. Contacto',
    'Simetria',
    'Potencia',
    'RSI',
    'Fuerza',
  ]);

  protected readonly radarIndicators = signal<readonly AfChartIndicator[]>([
    { name: 'Salto', max: 100 },
    { name: 'T.Contacto', max: 100 },
    { name: 'Simetria', max: 100 },
    { name: 'Potencia', max: 100 },
    { name: 'RSI', max: 100 },
    { name: 'Fuerza', max: 100 },
  ]);

  protected readonly radarSeries = signal<readonly AfChartSeries[]>([
    { name: 'Maria Garcia', data: [82, 70, 64, 78, 68, 88] },
    { name: 'Santiago Perez', data: [92, 76, 70, 91, 74, 94] },
  ]);

  protected readonly latencySparkline = signal<readonly AfChartSeries[]>([
    { name: 'Latencia (ms)', data: [42, 39, 44, 41, 38, 36, 35, 37, 34, 33], tone: 'warning' },
  ]);

  protected readonly latencyCategories = signal<readonly string[]>([
    't-9',
    't-8',
    't-7',
    't-6',
    't-5',
    't-4',
    't-3',
    't-2',
    't-1',
    't-0',
  ]);

  protected readonly emptySeries = signal<readonly AfChartSeries[]>([]);
  protected readonly chartLoading = signal(false);
  protected readonly analyticsPeriods: readonly ShowcaseAnalyticsPeriod[] = ['1M', '3M', '6M', '1A'];
  protected readonly analyticsPeriod = signal<ShowcaseAnalyticsPeriod>('3M');
  protected readonly analyticsLoadingState = computed<AfAnalyticsCardState>(() =>
    this.chartLoading() ? 'loading' : 'ready',
  );
  protected readonly weeklyIntensityCategories = signal<readonly string[]>([
    'Lun',
    'Mar',
    'Mie',
    'Jue',
    'Vie',
    'Sab',
    'Dom',
  ]);
  protected readonly weeklyIntensitySeries = signal<readonly AfChartSeries[]>([
    { name: 'S1', data: [4, 7, 8, 5, 9, 3, 6] },
    { name: 'S2', data: [5, 3, 7, 8, 6, 4, 7] },
    { name: 'S3', data: [8, 6, 5, 7, 9, 6, 3] },
    { name: 'S4', data: [7, 8, 9, 5, 8, 7, 6] },
    { name: 'S5', data: [4, 6, 7, 8, 5, 6, 4] },
    { name: 'S6', data: [6, 8, 5, 9, 7, 5, 8] },
    { name: 'S7', data: [9, 7, 8, 6, 4, 9, 7] },
    { name: 'S8', data: [8, 5, 6, 8, 7, 6, 5] },
    { name: 'S9', data: [6, 7, 9, 5, 8, 7, 6] },
    { name: 'S10', data: [7, 6, 8, 9, 5, 8, 7] },
    { name: 'S11', data: [5, 9, 7, 6, 8, 9, 5] },
    { name: 'S12', data: [8, 6, 5, 7, 9, 6, 8] },
  ]);
  protected readonly jumpDistributionSeries = signal<readonly AfChartSeries[]>([
    { name: 'CMJ', data: [36, 38, 41, 43, 45, 48, 50] },
    { name: 'SJ', data: [29, 31, 33, 35, 38, 41, 45] },
    { name: 'DJ', data: [32, 35, 37, 39, 41, 43, 47] },
    { name: 'Abalakov', data: [38, 40, 42, 45, 47, 49, 52] },
  ]);
  protected readonly parallelIndicators = signal<readonly AfChartIndicator[]>([
    { name: 'Salto', min: 30, max: 60 },
    { name: 'Fuerza', min: 2000, max: 3600 },
    { name: 'T.Contacto', min: 0.25, max: 0.42 },
    { name: 'RSI', min: 0.9, max: 1.8 },
    { name: 'Potencia', min: 1200, max: 2600 },
    { name: 'Asimetria', min: 0, max: 10 },
  ]);
  protected readonly parallelSeries = signal<readonly AfChartSeries[]>([
    {
      name: 'Atletas',
      data: [
        { label: 'Maria Garcia', value: [45.2, 2847, 0.34, 1.32, 1842, 4.2] },
        { label: 'Lucas Rodriguez', value: [52.1, 3120, 0.31, 1.45, 2180, 6.1] },
        { label: 'Santiago Perez', value: [55.4, 3340, 0.3, 1.52, 2420, 2.9] },
        { label: 'Nicolas Morales', value: [49.7, 2960, 0.32, 1.4, 2050, 5.5] },
        { label: 'Paula Martinez', value: [44.8, 2720, 0.33, 1.3, 1790, 3.2] },
      ],
    },
  ]);

  protected setAnalyticsPeriod(period: ShowcaseAnalyticsPeriod): void {
    this.analyticsPeriod.set(period);
    this.recordAction(`Analytics periodo → ${period}`);
  }

  protected toggleChartLoading(): void {
    this.chartLoading.update((current) => !current);
    this.recordAction(`Chart loading → ${this.chartLoading()}`);
  }
}
