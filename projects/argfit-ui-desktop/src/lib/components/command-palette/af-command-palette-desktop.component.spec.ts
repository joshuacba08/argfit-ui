import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfCommandPaletteResult } from '@argfit-ui/core';

import {
  AfCommandPaletteDesktopComponent,
  type AfCommandPaletteNavigationIntent,
  type AfCommandPaletteRenderGroup,
} from './af-command-palette-desktop.component';

const ITEMS: readonly AfCommandPaletteResult[] = [
  { id: 'one', label: 'Primero', icon: 'home', score: 2 },
  { id: 'two', label: 'Segundo', disabled: true, disabledReason: 'No disponible', score: 1 },
  {
    id: 'entity:players:martin',
    label: 'Martín Ruiz',
    score: 3,
    collection: {
      id: 'players', label: 'Jugadores', presentation: 'entity-card',
      entities: [], actions: [{ id: 'edit', label: 'Editar', executorId: 'edit' }],
    },
    entity: {
      kind: 'entity', id: 'martin', label: 'Martín Ruiz', description: 'Extremo derecho',
      metadata: ['#11', 'Disponible'], media: { initials: 'MR', shape: 'circle' },
    },
  },
];

@Component({
  imports: [AfCommandPaletteDesktopComponent],
  template: `
    <af-command-palette-desktop
      [open]="open()"
      [groups]="groups"
      activeId="one"
      (openChange)="lastOpen = $event; open.set($event)"
      (navigation)="lastNavigation = $event"
      (resultActivated)="lastActivated = $event"
      (back)="lastOpen = false; open.set(false)"
    />
  `,
})
class HostComponent {
  readonly open = signal(false);
  readonly groups: readonly AfCommandPaletteRenderGroup[] = [
    { id: 'main', label: 'Principal', items: ITEMS },
  ];
  lastOpen: boolean | null = null;
  lastNavigation: AfCommandPaletteNavigationIntent | null = null;
  lastActivated: string | null = null;
}

describe('AfCommandPaletteDesktopComponent', () => {
  afterEach(() => {
    document.body.style.overflow = '';
    TestBed.resetTestingModule();
  });

  async function createHost() {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('renders an accessible combobox/listbox and disabled option metadata', async () => {
    const fixture = await createHost();
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLInputElement;
    const options = fixture.nativeElement.querySelectorAll('[role="option"]');
    expect(input.getAttribute('aria-controls')).toBeTruthy();
    expect(input.getAttribute('aria-activedescendant')).toContain('option-0');
    expect(options.length).toBe(3);
    expect(options[1].getAttribute('aria-disabled')).toBe('true');
    expect(options[1].getAttribute('title')).toBe('No disponible');
  });

  it('renders entity-card media, metadata and accessible option semantics', async () => {
    const fixture = await createHost();
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    const entity = fixture.nativeElement.querySelector('[data-entity]') as HTMLElement;
    expect(entity.getAttribute('role')).toBe('option');
    expect(entity.textContent).toContain('Martín Ruiz');
    expect(entity.textContent).toContain('Disponible');
    const avatar = entity.querySelector('af-avatar-desktop') as HTMLElement;
    expect(avatar.getAttribute('data-size')).toBe('lg');
    expect(avatar.getAttribute('role')).toBeNull();
  });

  it('emits navigation and activation requests from the search input', async () => {
    const fixture = await createHost();
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLInputElement;

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.lastNavigation).toBe('last');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.lastActivated).toBe('one');
  });

  it('locks body scroll and closes from backdrop or Escape', async () => {
    const fixture = await createHost();
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    expect(document.body.style.overflow).toBe('hidden');

    const backdrop = fixture.nativeElement.querySelector(
      '.af-command-palette-desktop__backdrop',
    ) as HTMLElement;
    backdrop.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastOpen).toBe(false);
    expect(document.body.style.overflow).toBe('');

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.lastOpen).toBe(false);
  });
});
