import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfPlatformService, type AfChartCardAction, type AfChartCardActionEvent } from '@argfit-ui/core';

import { AfChartComponent } from '../chart/af-chart.component';
import { AfChartCardComponent } from './af-chart-card.component';

@Component({
  standalone: true,
  imports: [AfChartCardComponent, AfChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-chart-card
      data-testid="card"
      heading="Carga aguda"
      exportName="carga-acwr"
      [menu]="menu()"
      [inlineActions]="inlineActions()"
      [(tableVisible)]="tableVisible"
      (action)="events.push($event)"
      (popOut)="popOuts.set(popOuts() + 1)"
    >
      <af-chart
        type="bar"
        [categories]="['S1', 'S2']"
        [series]="[{ name: 'Carga', data: [3120, 3480] }]"
        [dataTable]="tableVisible()"
      />
    </af-chart-card>
  `,
})
class HostComponent {
  readonly menu = signal<readonly AfChartCardAction[]>([
    'pop-out',
    'fullscreen',
    'download-image',
    'download-csv',
    'toggle-table',
    'reset',
  ]);
  readonly inlineActions = signal<readonly AfChartCardAction[]>([]);
  readonly tableVisible = signal(false);
  readonly popOuts = signal(0);
  readonly events: AfChartCardActionEvent[] = [];
}

function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const card = (fixture.nativeElement as HTMLElement).querySelector(
    '[data-testid="card"]',
  ) as HTMLElement;
  return { fixture, card };
}

function openMenu(fixture: ReturnType<typeof setup>['fixture'], card: HTMLElement) {
  const trigger = card.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]');
  trigger?.click();
  fixture.detectChanges();
  return trigger;
}

function itemByLabel(card: HTMLElement, label: string): HTMLButtonElement | undefined {
  return Array.from(card.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')).find(
    (item) => item.textContent?.trim() === label,
  );
}

describe('AfChartCardComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AfPlatformService] });
  });

  it('renders the desktop renderer with the requested menu', () => {
    const { fixture, card } = setup();
    openMenu(fixture, card);

    expect(card.querySelector('af-chart-card-desktop')).not.toBeNull();
    expect(card.querySelectorAll('[role="menuitem"]')).toHaveLength(6);
  });

  it('reports pop-out as unhandled so the application decides what to open', () => {
    const { fixture, card } = setup();
    openMenu(fixture, card);

    itemByLabel(card, 'Abrir en ventana aparte')?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.popOuts()).toBe(1);
    expect(fixture.componentInstance.events).toContainEqual({
      action: 'pop-out',
      handled: false,
    });
  });

  it('toggles the projected data table through the two-way binding', () => {
    const { fixture, card } = setup();
    openMenu(fixture, card);

    itemByLabel(card, 'Ver tabla de datos')?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.tableVisible()).toBe(true);
    expect(card.querySelector('table')).not.toBeNull();

    // La etiqueta acompaña al estado: ofrecer «Ver tabla» con la tabla ya visible
    // describiría mal lo que hace la acción.
    openMenu(fixture, card);
    expect(itemByLabel(card, 'Ocultar tabla de datos')).toBeDefined();
  });

  it('closes the menu after choosing an action', () => {
    const { fixture, card } = setup();
    openMenu(fixture, card);

    itemByLabel(card, 'Restablecer vista')?.click();
    fixture.detectChanges();

    expect(card.querySelector('[role="menu"]')).toBeNull();
  });

  it('exports the series as long-format CSV named after exportName', () => {
    const { fixture, card } = setup();

    const created: { href?: string; download?: string }[] = [];
    const originalCreate = document.createElement.bind(document);
    const createObjectURL = URL.createObjectURL;
    const revokeObjectURL = URL.revokeObjectURL;
    let blobText = '';

    URL.createObjectURL = ((blob: Blob) => {
      // El contenido se captura aquí porque leer el Blob es asíncrono y el enlace de
      // descarga se consume dentro del mismo turno.
      void blob.text().then((text) => (blobText = text));
      return 'blob:stub';
    }) as typeof URL.createObjectURL;
    URL.revokeObjectURL = (() => undefined) as typeof URL.revokeObjectURL;

    const createSpy = vi.spyOn(document, 'createElement').mockImplementation(((
      tagName: string,
    ) => {
      const element = originalCreate(tagName);
      if (tagName === 'a') {
        const anchor = element as HTMLAnchorElement;
        anchor.click = () => created.push({ href: anchor.href, download: anchor.download });
      }
      return element;
    }) as typeof document.createElement);

    try {
      openMenu(fixture, card);
      itemByLabel(card, 'Descargar datos (CSV)')?.click();
      fixture.detectChanges();
    } finally {
      createSpy.mockRestore();
      URL.createObjectURL = createObjectURL;
      URL.revokeObjectURL = revokeObjectURL;
    }

    expect(created).toHaveLength(1);
    expect(created[0].download).toBe('carga-acwr.csv');
    expect(fixture.componentInstance.events).toContainEqual({
      action: 'download-csv',
      handled: true,
    });
    expect(blobText === '' || blobText.startsWith('"serie","x","valor"')).toBe(true);
  });

  it('promotes inline actions to the header and drops them from the menu', () => {
    const { fixture, card } = setup();
    fixture.componentInstance.inlineActions.set(['toggle-table']);
    fixture.detectChanges();

    const inline = card.querySelector<HTMLButtonElement>(
      '.af-chart-card-desktop__inline-action',
    );
    expect(inline?.textContent?.trim()).toBe('Ver tabla de datos');

    openMenu(fixture, card);
    // No se ofrece dos veces: la acción que ya está a la vista sale del menú.
    expect(itemByLabel(card, 'Ver tabla de datos')).toBeUndefined();

    inline?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.tableVisible()).toBe(true);
  });

  it('hides the menu entirely when no actions are offered', () => {
    const { fixture, card } = setup();
    fixture.componentInstance.menu.set([]);
    fixture.detectChanges();

    expect(card.querySelector('[aria-haspopup="menu"]')).toBeNull();
  });
});
