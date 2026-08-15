import { DOCUMENT, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  PLATFORM_ID,
  signal,
  viewChild,
  ViewEncapsulation,
  type OnDestroy,
} from '@angular/core';

import {
  AF_CHART_CARD_DEFAULT_LABELS,
  AfPlatformService,
  type AfChartCardAction,
  type AfChartCardActionEvent,
  type AfChartCardLabels,
  type AfChartCardMenuItem,
  type AfChartPoint,
} from '@argfit-ui/core';
import { AfChartCardDesktopComponent } from '@argfit-ui/desktop';
import { AfChartCardMobileComponent } from '@argfit-ui/mobile';

import { AfChartComponent } from '../chart/af-chart.component';

/** Acciones ofrecidas cuando el consumidor no declara un menú propio. */
const DEFAULT_MENU: readonly AfChartCardAction[] = [
  'fullscreen',
  'download-image',
  'download-csv',
  'reset',
];

/** Acciones que abren un grupo nuevo en el menú, separadas por una línea. */
const GROUP_STARTERS: ReadonlySet<AfChartCardAction> = new Set(['download-image', 'reset']);

/**
 * Contenedor de un gráfico con encabezado y menú de opciones.
 *
 * Envuelve un `<af-chart>` proyectado y resuelve lo que la aplicación no debería tener
 * que reimplementar en cada tablero: exportar el lienzo, descargar la serie, restablecer
 * la vista y ocupar la pantalla completa.
 *
 * Lo que no hace: pedir datos, decidir qué gráfico corresponde ni navegar. `pop-out` se
 * emite como intención justamente por eso —abrir una ventana o una ruta es navegación—.
 */
@Component({
  selector: 'af-chart-card',
  imports: [AfChartCardDesktopComponent, AfChartCardMobileComponent, NgTemplateOutlet],
  templateUrl: './af-chart-card.component.html',
  styleUrl: './af-chart-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-chart-card',
  },
})
export class AfChartCardComponent implements OnDestroy {
  private readonly platform = inject(AfPlatformService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly heading = input<string | undefined>(undefined);
  /** Etiqueta breve del tipo de visualización, p. ej. «Combo · barras + línea». */
  readonly tag = input<string | undefined>(undefined);
  /**
   * Nota metodológica: qué se está midiendo y cómo se lee.
   *
   * Un gráfico sin unidades ni criterio de lectura se interpreta mal con confianza, que
   * es peor que no interpretarlo.
   */
  readonly note = input<string | undefined>(undefined);
  /** Acciones ofrecidas en el menú, en orden. Lista vacía oculta el menú. */
  readonly menu = input<readonly AfChartCardAction[]>(DEFAULT_MENU);
  /** Sobrescribe los textos visibles; útil para traducir la card. */
  readonly labels = input<Partial<AfChartCardLabels>>({});
  /** Nombre base de los archivos exportados, sin extensión. */
  readonly exportName = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });

  /**
   * Visibilidad de la tabla accesible del gráfico.
   *
   * Es bidireccional porque la tabla la dibuja el `<af-chart>` proyectado: la card no
   * puede escribir en los inputs de un componente que no le pertenece, así que el
   * consumidor enlaza este estado con `[dataTable]`.
   */
  readonly tableVisible = model(false);

  readonly action = output<AfChartCardActionEvent>();
  /** Intención de abrir el gráfico en una ventana o vista propia. */
  readonly popOut = output<void>();
  readonly fullscreenChange = output<boolean>();

  protected readonly isMobile = this.platform.isMobile;
  protected readonly menuOpen = signal(false);
  protected readonly fullscreen = signal(false);

  private readonly chart = contentChild(AfChartComponent);
  private readonly desktopCard = viewChild<AfChartCardDesktopComponent>('desktopCard');
  private readonly mobileCard = viewChild<AfChartCardMobileComponent>('mobileCard');

  protected readonly resolvedLabels = computed<AfChartCardLabels>(() => ({
    ...AF_CHART_CARD_DEFAULT_LABELS,
    ...this.labels(),
  }));

  protected readonly menuItems = computed<readonly AfChartCardMenuItem[]>(() => {
    if (this.disabled()) {
      return [];
    }
    return this.menu().map((action) => ({
      action,
      label: this.labelFor(action),
      startsGroup: GROUP_STARTERS.has(action),
    }));
  });

  private readonly onDocumentClick = (event: MouseEvent): void => {
    if (!this.hostRef.nativeElement.contains(event.target as Node)) {
      this.menuOpen.set(false);
    }
  };

  private readonly onFullscreenChange = (): void => {
    // El usuario puede salir con Escape sin pasar por el menú; el estado del componente
    // tiene que seguir al navegador, no al revés.
    const active = this.document.fullscreenElement === this.hostRef.nativeElement;
    if (active !== this.fullscreen()) {
      this.fullscreen.set(active);
      this.fullscreenChange.emit(active);
      this.chart()?.refreshSize();
    }
  };

  private readonly onFauxFullscreenKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.fullscreen() && !this.document.fullscreenElement) {
      this.exitFullscreen();
    }
  };

  constructor() {
    effect(() => {
      if (!this.isBrowser) {
        return;
      }
      if (this.menuOpen()) {
        // `capture` deja cerrar el menú aunque el clic no burbujee desde otro overlay.
        this.document.addEventListener('click', this.onDocumentClick, true);
      } else {
        this.document.removeEventListener('click', this.onDocumentClick, true);
      }
    });

    effect(() => {
      const active = this.fullscreen();
      if (!this.isBrowser) {
        return;
      }
      if (active) {
        this.document.addEventListener('keydown', this.onFauxFullscreenKeydown);
      } else {
        this.document.removeEventListener('keydown', this.onFauxFullscreenKeydown);
      }
    });

    if (this.isBrowser) {
      this.document.addEventListener('fullscreenchange', this.onFullscreenChange);
    }
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) {
      return;
    }
    this.document.removeEventListener('click', this.onDocumentClick, true);
    this.document.removeEventListener('keydown', this.onFauxFullscreenKeydown);
    this.document.removeEventListener('fullscreenchange', this.onFullscreenChange);
  }

  protected onMenuOpenChange(open: boolean): void {
    this.menuOpen.set(open);
    if (open) {
      // Se enfoca la primera entrada después de que el renderer la haya creado.
      queueMicrotask(() => this.renderer()?.focusFirstItem());
    }
  }

  protected onActionSelect(action: AfChartCardAction): void {
    this.menuOpen.set(false);
    this.renderer()?.focusTrigger();
    this.action.emit({ action, handled: this.run(action) });
  }

  /** Ejecuta la acción y devuelve si la card la resolvió por sí misma. */
  private run(action: AfChartCardAction): boolean {
    switch (action) {
      case 'pop-out':
        this.popOut.emit();
        return false;
      case 'fullscreen':
        this.toggleFullscreen();
        return true;
      case 'download-image':
        return this.downloadImage();
      case 'download-csv':
        return this.downloadCsv();
      case 'toggle-table':
        this.tableVisible.set(!this.tableVisible());
        return true;
      case 'reset':
        this.chart()?.resetView();
        return true;
    }
  }

  private labelFor(action: AfChartCardAction): string {
    const labels = this.resolvedLabels();
    switch (action) {
      case 'pop-out':
        return labels.popOut;
      case 'fullscreen':
        return this.fullscreen() ? labels.fullscreenExit : labels.fullscreen;
      case 'download-image':
        return labels.downloadImage;
      case 'download-csv':
        return labels.downloadCsv;
      case 'toggle-table':
        return this.tableVisible() ? labels.hideTable : labels.showTable;
      case 'reset':
        return labels.reset;
    }
  }

  private renderer(): AfChartCardDesktopComponent | AfChartCardMobileComponent | undefined {
    return this.desktopCard() ?? this.mobileCard();
  }

  private toggleFullscreen(): void {
    if (this.fullscreen()) {
      this.exitFullscreen();
      return;
    }
    const host = this.hostRef.nativeElement;
    const request = host.requestFullscreen?.();
    if (!request) {
      this.enterFauxFullscreen();
      return;
    }
    // Un documento embebido sin permiso de pantalla completa rechaza la promesa; el
    // respaldo posiciona la card sobre el propio documento, que es lo máximo alcanzable.
    request.catch(() => this.enterFauxFullscreen());
  }

  private enterFauxFullscreen(): void {
    this.fullscreen.set(true);
    this.fullscreenChange.emit(true);
    queueMicrotask(() => this.chart()?.refreshSize());
  }

  private exitFullscreen(): void {
    if (this.document.fullscreenElement === this.hostRef.nativeElement) {
      void this.document.exitFullscreen();
      return;
    }
    this.fullscreen.set(false);
    this.fullscreenChange.emit(false);
    queueMicrotask(() => this.chart()?.refreshSize());
  }

  private downloadImage(): boolean {
    const dataUrl = this.chart()?.toDataUrl();
    if (!dataUrl) {
      return false;
    }
    this.triggerDownload(dataUrl, `${this.fileName()}.png`);
    return true;
  }

  private downloadCsv(): boolean {
    const chart = this.chart();
    if (!chart || !this.isBrowser) {
      return false;
    }
    const csv = this.buildCsv(chart);
    if (!csv) {
      return false;
    }
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    this.triggerDownload(url, `${this.fileName()}.csv`);
    URL.revokeObjectURL(url);
    return true;
  }

  /**
   * Serializa las series en formato largo: una fila por observación.
   *
   * Es el formato que aceptan las herramientas de análisis sin transformaciones previas,
   * a diferencia de una tabla ancha, que obliga a despivotar antes de graficar nada.
   */
  private buildCsv(chart: AfChartComponent): string | null {
    const series = chart.series();
    if (series.length === 0) {
      return null;
    }
    const categories = chart.categories();
    const rows = series.flatMap((serie) =>
      serie.data.map((point, index) => [
        serie.name,
        String(categories[index] ?? this.pointX(point) ?? index + 1),
        this.pointValue(point),
      ]),
    );
    const header = ['serie', 'x', 'valor'];
    return [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }

  private pointX(point: number | null | AfChartPoint): string | number | undefined {
    return point === null || typeof point === 'number' ? undefined : point.x;
  }

  /** Un hueco se exporta como celda vacía, no como cero: no se midió. */
  private pointValue(point: number | null | AfChartPoint): string {
    if (point === null) {
      return '';
    }
    if (typeof point === 'number') {
      return String(point);
    }
    const value = point.value;
    return Array.isArray(value) ? value.join(';') : String(value);
  }

  private fileName(): string {
    const base = this.exportName() ?? this.heading() ?? 'argfit-chart';
    return (
      base
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'argfit-chart'
    );
  }

  private triggerDownload(href: string, fileName: string): void {
    if (!this.isBrowser) {
      return;
    }
    const anchor = this.document.createElement('a');
    anchor.href = href;
    anchor.download = fileName;
    anchor.click();
  }
}
