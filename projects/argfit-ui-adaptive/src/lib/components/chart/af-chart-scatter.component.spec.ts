import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi, type AfChartSeries, type AfChartType } from '@argfit-ui/core';

import { AfChartComponent } from './af-chart.component';

const LOAD_SERIES: readonly AfChartSeries[] = [
  {
    name: 'Carga vs. RPE',
    data: [
      { x: 60, y: 4, z: 12, value: 4 },
      { x: 90, y: 7, z: 31, value: 7 },
    ],
  },
];

@Component({
  imports: [AfChartComponent],
  template: `
    <af-chart
      [type]="type()"
      [categories]="categories"
      [series]="series"
      [dataTable]="dataTable()"
      dataTableLabel="Carga por día"
      title="Carga semanal"
    />
  `,
})
class HostComponent {
  readonly type = signal<AfChartType>('bar');
  readonly dataTable = signal(false);
  readonly categories = ['Lun', 'Mar'];
  readonly series: readonly AfChartSeries[] = [{ name: 'Planificada', data: [70, 90] }];
}

@Component({
  imports: [AfChartComponent],
  template: `<af-chart [type]="type()" [series]="series" />`,
})
class ScatterHostComponent {
  readonly type = signal<AfChartType>('scatter');
  readonly series = LOAD_SERIES;
}

describe('AfChart — dispersión y alternativa tabular', () => {
  afterEach(() => TestBed.resetTestingModule());

  async function setup<T>(host: new () => T) {
    await TestBed.configureTestingModule({
      imports: [host as never],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(host as never);
    fixture.detectChanges();
    return fixture;
  }

  /**
   * §20 «Accesibilidad»: todo gráfico necesita alternativa textual. Un lienzo no se puede
   * recorrer con teclado ni leer con tecnología asistiva.
   */
  it('no publica la tabla hasta que se pide', async () => {
    const fixture = await setup(HostComponent);
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
  });

  it('publica los mismos datos de la serie como tabla accesible', async () => {
    const fixture = await setup(HostComponent);
    (fixture.componentInstance as HostComponent).dataTable.set(true);
    fixture.detectChanges();

    const table = fixture.nativeElement.querySelector('table') as HTMLTableElement;
    expect(table).not.toBeNull();
    expect(table.querySelector('caption')?.textContent).toContain('Carga por día');

    const headers = [...table.querySelectorAll('thead th')].map((th) => th.textContent?.trim());
    expect(headers).toEqual(['Serie', 'Lun', 'Mar']);

    const row = table.querySelector('tbody tr') as HTMLTableRowElement;
    expect(row.querySelector('th')?.textContent?.trim()).toBe('Planificada');
    expect([...row.querySelectorAll('td')].map((td) => td.textContent?.trim())).toEqual([
      '70',
      '90',
    ]);
  });

  it('acepta scatter y bubble como tipos válidos', async () => {
    const fixture = await setup(ScatterHostComponent);
    const chart = fixture.nativeElement.querySelector('af-chart-desktop') as HTMLElement;

    expect(chart.getAttribute('data-type')).toBe('scatter');

    (fixture.componentInstance as ScatterHostComponent).type.set('bubble');
    fixture.detectChanges();
    expect(chart.getAttribute('data-type')).toBe('bubble');
  });
});
