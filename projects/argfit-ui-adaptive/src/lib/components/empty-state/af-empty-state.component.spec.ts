import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  provideArgfitUi,
  type AfEmptyStateAction,
  type AfEmptyStateTone,
} from '@argfit-ui/core';

import { AfEmptyStateComponent } from './af-empty-state.component';

const ACTIONS: readonly AfEmptyStateAction[] = [
  { id: 'create', label: 'Añadir el primero', variant: 'primary' },
  { id: 'import', label: 'Importar' },
];

@Component({
  imports: [AfEmptyStateComponent],
  template: `
    <af-empty-state
      [title]="title()"
      description="Empieza por dar de alta el plantel."
      [tone]="tone()"
      [actions]="actions"
      (actionSelected)="selected = $event"
    />
  `,
})
class HostComponent {
  readonly title = signal('Todavía no hay futbolistas');
  readonly tone = signal<AfEmptyStateTone>('empty');
  readonly actions = ACTIONS;
  selected: string | undefined;
}

describe('AfEmptyStateComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  async function setup(platform: 'desktop' | 'mobile' = 'desktop') {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideArgfitUi({ platform })],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('renderiza título, descripción y acciones', async () => {
    const fixture = await setup();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.textContent).toContain('Todavía no hay futbolistas');
    expect(host.textContent).toContain('Empieza por dar de alta el plantel.');
    expect(host.textContent).toContain('Añadir el primero');
    expect(host.textContent).toContain('Importar');
  });

  it('emite el identificador de la acción elegida', async () => {
    const fixture = await setup();
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');

    (buttons[1] as HTMLButtonElement).click();
    expect(fixture.componentInstance.selected).toBe('import');
  });

  /**
   * Los cuatro tonos existen porque la salida es distinta en cada caso. Un panel en
   * blanco idéntico para «no hay nada», «lo filtraste», «falló» y «no puedes verlo»
   * deja al usuario adivinando en cuál de las cuatro está.
   */
  it('distingue el tono y anuncia el error como alerta', async () => {
    const fixture = await setup();
    const root = fixture.nativeElement.querySelector('af-empty-state-desktop') as HTMLElement;

    expect(root.getAttribute('data-tone')).toBe('empty');
    expect(root.getAttribute('role')).toBe('status');

    fixture.componentInstance.tone.set('error');
    fixture.detectChanges();
    expect(root.getAttribute('data-tone')).toBe('error');
    expect(root.getAttribute('role')).toBe('alert');
  });

  it('elige el icono por defecto según el tono', async () => {
    const fixture = await setup();

    fixture.componentInstance.tone.set('permission');
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('af-icon svg') as SVGElement;
    expect(svg).not.toBeNull();
    expect(svg.querySelectorAll('path,circle,line').length).toBeGreaterThan(0);
  });

  it('usa el renderer móvil cuando corresponde', async () => {
    const fixture = await setup('mobile');

    expect(fixture.nativeElement.querySelector('af-empty-state-mobile')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('af-empty-state-desktop')).toBeNull();
  });
});
