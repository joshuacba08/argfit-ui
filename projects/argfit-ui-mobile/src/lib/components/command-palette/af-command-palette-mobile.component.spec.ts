import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfCommandPaletteResult } from '@argfit-ui/core';

import {
  AfCommandPaletteMobileComponent,
  type AfCommandPaletteMobileRenderGroup,
} from './af-command-palette-mobile.component';

const ITEM: AfCommandPaletteResult = { id: 'profile', label: 'Abrir perfil', icon: 'user', score: 1 };
const ENTITY: AfCommandPaletteResult = {
  id: 'entity:players:martin', label: 'Martín Ruiz', score: 2,
  collection: {
    id: 'players', label: 'Jugadores', presentation: 'entity-card',
    entities: [], actions: [{ id: 'edit', label: 'Editar', executorId: 'edit' }],
  },
  entity: {
    kind: 'entity', id: 'martin', label: 'Martín Ruiz', metadata: ['Extremo'],
    media: { initials: 'MR' },
  },
};

@Component({
  imports: [AfCommandPaletteMobileComponent],
  template: `
    <af-command-palette-mobile
      [open]="open()"
      [groups]="groups"
      activeId="profile"
      (openChange)="open.set($event)"
      (resultActivated)="activated = $event"
    />
  `,
})
class HostComponent {
  readonly open = signal(false);
  readonly groups: readonly AfCommandPaletteMobileRenderGroup[] = [
    { id: 'main', items: [ITEM, ENTITY] },
  ];
  activated: string | null = null;
}

describe('AfCommandPaletteMobileComponent', () => {
  afterEach(() => {
    document.body.style.overflow = '';
    TestBed.resetTestingModule();
  });

  it('renders a fullscreen dialog with a visible accessible close action', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.af-command-palette-mobile__panel')).not.toBeNull();
    const close = fixture.nativeElement.querySelector(
      '.af-command-palette-mobile__close',
    ) as HTMLButtonElement;
    expect(close.getAttribute('aria-label')).toBe('Cerrar paleta');
    expect((fixture.nativeElement.querySelector('.af-command-palette-mobile__results') as HTMLElement).tabIndex).toBe(0);
    expect(document.body.style.overflow).toBe('hidden');
    close.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('activates a command using touch/pointer compatible option markup', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('[role="option"]') as HTMLElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activated).toBe('profile');
  });

  it('uses an xl avatar for touch-friendly entity mini-cards', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    const entity = fixture.nativeElement.querySelector('[data-entity]') as HTMLElement;
    expect(entity.getAttribute('role')).toBe('option');
    expect((entity.querySelector('af-avatar-mobile') as HTMLElement).getAttribute('data-size')).toBe('xl');
  });
});
