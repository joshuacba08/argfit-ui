import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfChartMobileComponent } from './af-chart-mobile.component';

@Component({
  standalone: true,
  imports: [AfChartMobileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-chart-mobile
      data-testid="chart"
      [categories]="categories()"
      [series]="series()"
      ariaLabel="Resumen"
    />
  `,
})
class ChartHostComponent {
  readonly categories = signal<readonly string[]>(['L', 'M', 'X']);
  readonly series = signal<readonly { name: string; data: readonly number[] }[]>([
    { name: 'A', data: [1, 2, 3] },
  ]);
}

describe('AfChartMobileComponent', () => {
  it('renders with compact density by default', async () => {
    const fixture = TestBed.createComponent(ChartHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="chart"]',
    ) as HTMLElement;
    expect(host.getAttribute('data-density')).toBe('compact');
    expect(host.getAttribute('data-state')).toBe('ready');
  });

  it('reports empty state when series are absent', async () => {
    const fixture = TestBed.createComponent(ChartHostComponent);
    fixture.componentInstance.series.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="chart"]',
    ) as HTMLElement;
    expect(host.getAttribute('data-state')).toBe('empty');
  });
});
