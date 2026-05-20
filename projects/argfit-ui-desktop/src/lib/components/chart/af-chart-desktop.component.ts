import { isPlatformBrowser } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DOCUMENT,
    DestroyRef,
    ElementRef,
    HostListener,
    OnDestroy,
    PLATFORM_ID,
    ViewEncapsulation,
    computed,
    effect,
    inject,
    input,
    output,
    viewChild,
} from '@angular/core';

import type {
    AfChartDensity,
    AfChartPointEvent,
    AfChartSeries,
    AfChartTone,
    AfChartType,
} from '@argfit-ui/core';

import { buildEchartsOption, echarts, ensureEchartsRegistered } from './af-chart-echarts';

interface EchartsClickParams {
  readonly seriesName: string;
  readonly dataIndex: number;
  readonly value: number;
  readonly name: string;
}

interface EchartsInstance {
  setOption(opt: unknown, notMerge?: boolean): void;
  resize(): void;
  dispose(): void;
  on(event: 'click', handler: (params: EchartsClickParams) => void): void;
}

@Component({
  selector: 'af-chart-desktop',
  standalone: true,
  templateUrl: './af-chart-desktop.component.html',
  styleUrl: './af-chart-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'af-chart-desktop',
    '[attr.data-type]': 'type()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-density]': 'density()',
    '[attr.data-state]': 'state()',
    '[attr.role]': 'ariaLabel() ? "img" : null',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class AfChartDesktopComponent implements AfterViewInit, OnDestroy {
  readonly type = input<AfChartType>('line');
  readonly tone = input<AfChartTone>('primary');
  readonly density = input<AfChartDensity>('comfortable');
  readonly categories = input<readonly string[]>([]);
  readonly series = input<readonly AfChartSeries[]>([]);
  readonly title = input<string | undefined>(undefined);
  readonly loading = input<boolean>(false);
  readonly emptyMessage = input<string>('Sin datos disponibles');
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly pointSelect = output<AfChartPointEvent>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly canvasRef = viewChild<ElementRef<HTMLDivElement>>('canvas');

  private chart: EchartsInstance | null = null;

  protected readonly isEmpty = computed<boolean>(() => {
    const series = this.series();
    if (series.length === 0) {
      return true;
    }
    return series.every((s) => s.data.length === 0);
  });

  protected readonly state = computed<'loading' | 'empty' | 'ready'>(() => {
    if (this.loading()) {
      return 'loading';
    }
    return this.isEmpty() ? 'empty' : 'ready';
  });

  constructor() {
    effect(() => {
      // Re-evaluate option whenever any input or state changes.
      this.type();
      this.tone();
      this.density();
      this.categories();
      this.series();
      this.title();
      this.state();
      this.render();
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.render();
    this.destroyRef.onDestroy(() => this.disposeChart());
  }

  ngOnDestroy(): void {
    this.disposeChart();
  }

  @HostListener('window:resize')
  protected onResize(): void {
    this.chart?.resize();
  }

  private render(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) {
      return;
    }
    if (this.state() !== 'ready') {
      this.disposeChart();
      return;
    }

    // Defensive guard: skip rendering when the host environment cannot
    // provide a real 2D canvas context (e.g., jsdom in unit tests).
    const probe = this.document.createElement('canvas');
    if (!probe.getContext || !probe.getContext('2d')) {
      return;
    }

    if (!this.chart) {
      ensureEchartsRegistered();
      this.chart = echarts.init(canvas, undefined, { renderer: 'canvas' }) as unknown as EchartsInstance;
      this.chart.on('click', (params) => {
        this.pointSelect.emit({
          seriesName: params.seriesName,
          dataIndex: params.dataIndex,
          value: typeof params.value === 'number' ? params.value : Number(params.value),
          category: params.name,
        });
      });
    }

    const option = buildEchartsOption(
      {
        type: this.type(),
        tone: this.tone(),
        density: this.density(),
        categories: this.categories(),
        series: this.series(),
        title: this.title(),
        mobile: false,
      },
      this.document,
    );
    this.chart.setOption(option, true);
    queueMicrotask(() => this.chart?.resize());
  }

  private disposeChart(): void {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }
}
