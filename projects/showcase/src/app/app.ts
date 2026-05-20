import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
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
    AfDialog,
    AfDialogContentDirective,
    AfDialogFooterDirective,
    AfInput,
} from '@argfit-ui/adaptive';
import {
    AfPlatformService,
    AfThemeService,
    type AfChartIndicator,
    type AfChartSeries,
    type AfIconName,
    type AfPlatformPreference,
} from '@argfit-ui/core';
import { AfIconComponent } from '@argfit-ui/primitives';

@Component({
  selector: 'app-root',
  imports: [
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
    AfIconComponent,
    AfInput,
    AfDialog,
    AfDialogContentDirective,
    AfDialogFooterDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly platform = inject(AfPlatformService);
  protected readonly theme = inject(AfThemeService);
  protected readonly lastAction = signal('Idle');
  protected readonly selectedDevice = signal<string>('jump-01');

  protected readonly athleteName = signal('');
  protected readonly searchQuery = signal('');
  protected readonly athleteWeight = signal('68');
  protected readonly athleteEmail = signal('invalid-email');
  protected readonly heightControl = new FormControl<string>('178', { nonNullable: true });

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

  protected updateAthleteName(value: string): void {
    this.athleteName.set(value);
  }

  protected updateSearchQuery(value: string): void {
    this.searchQuery.set(value);
  }

  protected updateAthleteWeight(value: string): void {
    this.athleteWeight.set(value);
  }

  protected updateAthleteEmail(value: string): void {
    this.athleteEmail.set(value);
  }

  protected emailError(): string | undefined {
    const value = this.athleteEmail();
    if (!value) {
      return undefined;
    }
    return /.+@.+\..+/.test(value) ? undefined : 'Ingresa un email valido';
  }

  protected readonly detailsDialogOpen = signal(false);
  protected readonly removeDialogOpen = signal(false);
  protected readonly athleteDialogOpen = signal(false);
  protected readonly newAthleteName = signal('');
  protected readonly newAthleteEmail = signal('');

  protected openDetailsDialog(): void {
    this.detailsDialogOpen.set(true);
    this.recordAction('Dialog → details abierto');
  }

  protected setDetailsDialog(open: boolean): void {
    this.detailsDialogOpen.set(open);
    if (!open) {
      this.recordAction('Dialog → details cerrado');
    }
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

  protected openAthleteDialog(): void {
    this.newAthleteName.set('');
    this.newAthleteEmail.set('');
    this.athleteDialogOpen.set(true);
    this.recordAction('Dialog → nuevo atleta abierto');
  }

  protected setAthleteDialog(open: boolean): void {
    this.athleteDialogOpen.set(open);
    if (!open) {
      this.recordAction('Dialog → nuevo atleta cerrado');
    }
  }

  protected saveAthleteDialog(): void {
    const name = this.newAthleteName().trim();
    if (!name) {
      this.recordAction('Nombre requerido');
      return;
    }
    this.athleteDialogOpen.set(false);
    this.recordAction(`Atleta creado → ${name}`);
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

  protected toggleChartLoading(): void {
    this.chartLoading.update((current) => !current);
    this.recordAction(`Chart loading → ${this.chartLoading()}`);
  }
}
