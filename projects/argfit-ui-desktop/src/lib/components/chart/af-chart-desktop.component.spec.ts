import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfChartDesktopComponent } from './af-chart-desktop.component';

@Component({
  standalone: true,
  imports: [AfChartDesktopComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-chart-desktop
      data-testid="chart"
      [type]="type()"
      [categories]="categories()"
      [series]="series()"
      [loading]="loading()"
      [emptyMessage]="'Nada por aqui'"
      ariaLabel="Saltos por sesion"
    />
  `,
})
class ChartHostComponent {
  readonly type = signal<'line' | 'bar' | 'area' | 'sparkline'>('line');
  readonly categories = signal<readonly string[]>(['Lun', 'Mar', 'Mie']);
  readonly series = signal<readonly { name: string; data: readonly number[] }[]>([
    { name: 'Sesion', data: [12, 18, 15] },
  ]);
  readonly loading = signal(false);
}

describe('AfChartDesktopComponent', () => {
  it('renders the ready state with a canvas and accessible label', async () => {
    const fixture = TestBed.createComponent(ChartHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="chart"]',
    ) as HTMLElement;
    expect(host).not.toBeNull();
    expect(host.getAttribute('data-state')).toBe('ready');
    expect(host.getAttribute('aria-label')).toBe('Saltos por sesion');
    expect(host.querySelector('.af-chart-desktop__canvas')).not.toBeNull();
  });

  it('shows the empty fallback when no series have data', async () => {
    const fixture = TestBed.createComponent(ChartHostComponent);
    fixture.componentInstance.series.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="chart"]',
    ) as HTMLElement;
    expect(host.getAttribute('data-state')).toBe('empty');
    expect(host.querySelector('.af-chart-desktop__empty')?.textContent?.trim()).toBe(
      'Nada por aqui',
    );
  });

  it('shows the loading skeleton while loading is true', async () => {
    const fixture = TestBed.createComponent(ChartHostComponent);
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="chart"]',
    ) as HTMLElement;
    expect(host.getAttribute('data-state')).toBe('loading');
    expect(host.querySelector('.af-chart-desktop__skeleton')).not.toBeNull();
  });
});
