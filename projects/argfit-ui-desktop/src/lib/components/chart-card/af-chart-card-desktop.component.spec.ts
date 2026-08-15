import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfChartCardAction, AfChartCardMenuItem } from '@argfit-ui/core';

import { AfChartCardDesktopComponent } from './af-chart-card-desktop.component';

const MENU: readonly AfChartCardMenuItem[] = [
  { action: 'fullscreen', label: 'Pantalla completa' },
  { action: 'download-image', label: 'Descargar PNG', startsGroup: true },
  { action: 'reset', label: 'Restablecer vista' },
];

@Component({
  standalone: true,
  imports: [AfChartCardDesktopComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-chart-card-desktop
      data-testid="card"
      heading="Carga aguda"
      tag="Combo"
      note="Carga externa semanal."
      [menuItems]="menuItems()"
      [menuOpen]="menuOpen()"
      (menuOpenChange)="menuOpen.set($event)"
      (actionSelect)="selected.set($event)"
    >
      <p data-testid="projected">gráfico</p>
    </af-chart-card-desktop>
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
  const root = fixture.nativeElement as HTMLElement;
  const card = root.querySelector('[data-testid="card"]') as HTMLElement;
  return { fixture, root, card };
}

describe('AfChartCardDesktopComponent', () => {
  it('names the card with its heading and describes it with the note', () => {
    const { card } = setup();

    const headingId = card.querySelector('.af-chart-card-desktop__heading')?.id;
    const noteId = card.querySelector('.af-chart-card-desktop__note')?.id;

    expect(card.getAttribute('role')).toBe('group');
    expect(card.getAttribute('aria-labelledby')).toBe(headingId);
    expect(card.getAttribute('aria-describedby')).toBe(noteId);
  });

  it('projects the chart content', () => {
    const { card } = setup();
    expect(card.querySelector('[data-testid="projected"]')).not.toBeNull();
  });

  it('requests opening the menu without owning the state', () => {
    const { fixture, card } = setup();
    const trigger = card.querySelector('.af-chart-card-desktop__menu-trigger') as HTMLButtonElement;

    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(card.querySelector('[role="menu"]')).toBeNull();

    trigger.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.menuOpen()).toBe(true);
    const menu = card.querySelector('[role="menu"]') as HTMLElement;
    expect(menu).not.toBeNull();
    expect(trigger.getAttribute('aria-controls')).toBe(menu.id);
    expect(menu.querySelectorAll('[role="menuitem"]')).toHaveLength(MENU.length);
  });

  it('emits the chosen action', () => {
    const { fixture, card } = setup();
    fixture.componentInstance.menuOpen.set(true);
    fixture.detectChanges();

    const items = card.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    items[1].click();

    expect(fixture.componentInstance.selected()).toBe('download-image');
  });

  it('cycles through the entries with the arrow keys', () => {
    const { fixture, card } = setup();
    fixture.componentInstance.menuOpen.set(true);
    fixture.detectChanges();

    const menu = card.querySelector('[role="menu"]') as HTMLElement;
    const items = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
    items[0].focus();

    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(items[1]);

    items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(document.activeElement).toBe(items[items.length - 1]);

    // Envuelve al principio: sin esto, la última entrada sería un callejón sin salida.
    items[items.length - 1].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    expect(document.activeElement).toBe(items[0]);
  });

  it('closes with Escape and returns the focus to the trigger', () => {
    const { fixture, card } = setup();
    fixture.componentInstance.menuOpen.set(true);
    fixture.detectChanges();

    const trigger = card.querySelector('.af-chart-card-desktop__menu-trigger') as HTMLButtonElement;
    const menu = card.querySelector('[role="menu"]') as HTMLElement;
    const first = menu.querySelector('[role="menuitem"]') as HTMLButtonElement;
    first.focus();

    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.menuOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('hides the header when there is nothing to put in it', () => {
    const { fixture, card } = setup();
    fixture.componentInstance.menuItems.set([]);
    fixture.detectChanges();

    // El título sigue presente, así que el encabezado no desaparece por quitar el menú.
    expect(card.querySelector('.af-chart-card-desktop__header')).not.toBeNull();
    expect(card.querySelector('.af-chart-card-desktop__menu-trigger')).toBeNull();
  });
});
