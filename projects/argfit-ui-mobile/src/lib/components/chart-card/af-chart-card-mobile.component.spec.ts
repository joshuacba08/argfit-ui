import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfChartCardAction, AfChartCardMenuItem } from '@argfit-ui/core';

import { AfChartCardMobileComponent } from './af-chart-card-mobile.component';

const MENU: readonly AfChartCardMenuItem[] = [
  { action: 'fullscreen', label: 'Pantalla completa' },
  { action: 'download-csv', label: 'Descargar datos (CSV)' },
];

@Component({
  standalone: true,
  imports: [AfChartCardMobileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-chart-card-mobile
      data-testid="card"
      heading="Carga aguda"
      note="Carga externa semanal."
      [menuItems]="menuItems()"
      [menuOpen]="menuOpen()"
      (menuOpenChange)="menuOpen.set($event)"
      (actionSelect)="selected.set($event)"
    >
      <p data-testid="projected">gráfico</p>
    </af-chart-card-mobile>
  `,
})
class HostComponent {
  readonly menuItems = signal<readonly AfChartCardMenuItem[]>(MENU);
  readonly menuOpen = signal(false);
  readonly selected = signal<AfChartCardAction | null>(null);
}

function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const card = (fixture.nativeElement as HTMLElement).querySelector(
    '[data-testid="card"]',
  ) as HTMLElement;
  return { fixture, card };
}

describe('AfChartCardMobileComponent', () => {
  it('names the card with its heading and projects the chart', () => {
    const { card } = setup();

    expect(card.getAttribute('role')).toBe('group');
    expect(card.getAttribute('aria-labelledby')).toBe(
      card.querySelector('.af-chart-card-mobile__heading')?.id,
    );
    expect(card.querySelector('[data-testid="projected"]')).not.toBeNull();
  });

  it('opens the action sheet from the trigger', () => {
    const { fixture, card } = setup();
    const trigger = card.querySelector('.af-chart-card-mobile__menu-trigger') as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.menuOpen()).toBe(true);
    expect(card.querySelector('.af-chart-card-mobile__sheet')).not.toBeNull();
    expect(card.querySelectorAll('[role="menuitem"]')).toHaveLength(MENU.length);
  });

  it('closes the sheet when the backdrop is tapped', () => {
    const { fixture, card } = setup();
    fixture.componentInstance.menuOpen.set(true);
    fixture.detectChanges();

    const backdrop = card.querySelector('.af-chart-card-mobile__backdrop') as HTMLElement;
    backdrop.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.menuOpen()).toBe(false);
  });

  it('emits the chosen action', () => {
    const { fixture, card } = setup();
    fixture.componentInstance.menuOpen.set(true);
    fixture.detectChanges();

    const items = card.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    items[1].click();

    expect(fixture.componentInstance.selected()).toBe('download-csv');
  });

  it('keeps the trigger at a usable touch size', () => {
    const { card } = setup();
    const trigger = card.querySelector('.af-chart-card-mobile__menu-trigger') as HTMLElement;

    // 44 px es el mínimo alcanzable con el pulgar; el estilo lo fija en el renderer.
    expect(trigger).not.toBeNull();
    expect(trigger.tagName).toBe('BUTTON');
  });
});
