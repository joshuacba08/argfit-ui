import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfPlatformService, provideArgfitUi } from '@argfit-ui/core';

import { AfChartComponent } from '../../../../chart/src/lib/af-chart.component';

@Component({
  standalone: true,
  imports: [AfChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-chart
      data-testid="chart"
      [categories]="categories()"
      [series]="series()"
      ariaLabel="Resumen"
    />
  `,
})
class ChartHostComponent {
  readonly categories = signal<readonly string[]>(['L', 'M']);
  readonly series = signal<readonly { name: string; data: readonly number[] }[]>([
    { name: 'A', data: [1, 2] },
  ]);
}

describe('AfChartComponent (adaptive)', () => {
  it('renders the desktop chart by default', async () => {
    TestBed.configureTestingModule({
      providers: [provideArgfitUi({ platform: 'desktop' })],
    });
    const fixture = TestBed.createComponent(ChartHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('af-chart-desktop')).not.toBeNull();
    expect(host.querySelector('af-chart-mobile')).toBeNull();
  });

  it('switches to the mobile chart when the platform changes', async () => {
    TestBed.configureTestingModule({
      providers: [provideArgfitUi({ platform: 'desktop' })],
    });
    const platform = TestBed.inject(AfPlatformService);

    const fixture = TestBed.createComponent(ChartHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('af-chart-desktop')).not.toBeNull();

    platform.setPreference('mobile');
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('af-chart-mobile')).not.toBeNull();
    expect(host.querySelector('af-chart-desktop')).toBeNull();
  });
});
