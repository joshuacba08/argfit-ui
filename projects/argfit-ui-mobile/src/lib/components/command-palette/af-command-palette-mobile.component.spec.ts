import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { AfCommandPaletteItem } from '@argfit-ui/core';

import {
  AfCommandPaletteMobileComponent,
  type AfCommandPaletteMobileRenderGroup,
} from './af-command-palette-mobile.component';

const ITEM: AfCommandPaletteItem = { id: 'profile', label: 'Abrir perfil', icon: 'user' };

@Component({
  imports: [AfCommandPaletteMobileComponent],
  template: `
    <af-command-palette-mobile
      [open]="open()"
      [groups]="groups"
      activeId="profile"
      (openChange)="open.set($event)"
      (itemActivated)="activated = $event"
    />
  `,
})
class HostComponent {
  readonly open = signal(false);
  readonly groups: readonly AfCommandPaletteMobileRenderGroup[] = [
    { id: 'main', items: [ITEM] },
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
});
