import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideArgfitUi, type AfSkeletonShape } from '@argfit-ui/core';

import { AfSkeletonComponent } from './af-skeleton.component';

@Component({
  imports: [AfSkeletonComponent],
  template: `<af-skeleton [shape]="shape()" [lines]="lines()" ariaLabel="Cargando plantel" />`,
})
class HostComponent {
  readonly shape = signal<AfSkeletonShape>('text');
  readonly lines = signal(3);
}

describe('AfSkeletonComponent', () => {
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

  function bars(fixture: { nativeElement: HTMLElement }): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('.af-skeleton-desktop__bar');
  }

  it('renderiza una barra por línea', async () => {
    const fixture = await setup();
    expect(bars(fixture)).toHaveLength(3);

    fixture.componentInstance.lines.set(5);
    fixture.detectChanges();
    expect(bars(fixture)).toHaveLength(5);
  });

  /** La última línea corta es lo que hace que el bloque se lea como prosa y no como tabla. */
  it('acorta la última línea de un bloque de texto', async () => {
    const fixture = await setup();
    const rendered = bars(fixture);

    expect(rendered[0].style.width).toBe('100%');
    expect(rendered[2].style.width).toBe('62%');
  });

  it('usa una sola forma para rect y circle', async () => {
    const fixture = await setup();

    fixture.componentInstance.shape.set('circle');
    fixture.detectChanges();
    expect(bars(fixture)).toHaveLength(1);

    const root = fixture.nativeElement.querySelector('af-skeleton-desktop') as HTMLElement;
    expect(root.getAttribute('data-shape')).toBe('circle');
  });

  /**
   * El marcador ocupa el sitio del contenido, así que la tecnología asistiva debe oír
   * «cargando», no intentar leer las formas.
   */
  it('se anuncia como región ocupada y oculta las barras', async () => {
    const fixture = await setup();
    const root = fixture.nativeElement.querySelector('af-skeleton-desktop') as HTMLElement;

    expect(root.getAttribute('role')).toBe('status');
    expect(root.getAttribute('aria-busy')).toBe('true');
    expect(root.getAttribute('aria-label')).toBe('Cargando plantel');
    expect(bars(fixture)[0].getAttribute('aria-hidden')).toBe('true');
  });

  it('usa el renderer móvil cuando corresponde', async () => {
    const fixture = await setup('mobile');

    expect(fixture.nativeElement.querySelector('af-skeleton-mobile')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('af-skeleton-desktop')).toBeNull();
  });
});
