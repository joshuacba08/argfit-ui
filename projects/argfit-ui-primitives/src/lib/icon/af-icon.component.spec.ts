import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AF_ICON_NAMES, type AfIconName } from '@argfit-ui/core';

import { AfIconComponent } from './af-icon.component';

@Component({
  standalone: true,
  imports: [AfIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<af-icon [name]="name()" data-testid="icon" />`,
})
class SingleIconHostComponent {
  readonly name = signal<AfIconName>('activity');
}

@Component({
  standalone: true,
  imports: [AfIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <af-icon name="search" [decorative]="false" ariaLabel="Buscar" data-testid="search" />
    <af-icon name="trash" size="lg" tone="danger" data-testid="trash" />
    <af-icon name="check" decorative data-testid="check" />
  `,
})
class IconHostComponent {}

describe('AfIconComponent', () => {
  it('renders a registered Lucide icon and exposes the accessible label', () => {
    const fixture = TestBed.createComponent(IconHostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const search = host.querySelector('[data-testid="search"]') as HTMLElement;
    expect(search).not.toBeNull();
    expect(search.getAttribute('data-size')).toBe('md');
    expect(search.getAttribute('data-tone')).toBe('default');

    const svg = search.querySelector('svg') as SVGElement;
    expect(svg).not.toBeNull();
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-hidden')).toBe('false');
    const title = svg.querySelector('title');
    expect(title?.textContent).toBe('Buscar');
    expect(svg.querySelectorAll('path,circle,line,rect,polyline').length).toBeGreaterThan(0);
  });

  it('marks decorative icons as aria-hidden and applies tone + size', () => {
    const fixture = TestBed.createComponent(IconHostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const trash = host.querySelector('[data-testid="trash"]') as HTMLElement;
    expect(trash.getAttribute('data-size')).toBe('lg');
    expect(trash.getAttribute('data-tone')).toBe('danger');
    expect(trash.style.getPropertyValue('--af-icon-size')).toBe('20px');

    const trashSvg = trash.querySelector('svg') as SVGElement;
    expect(trashSvg.getAttribute('aria-hidden')).toBe('true');
    expect(trashSvg.querySelector('title')).toBeNull();

    const check = host.querySelector('[data-testid="check"]') as HTMLElement;
    const checkSvg = check.querySelector('svg') as SVGElement;
    expect(checkSvg.getAttribute('aria-hidden')).toBe('true');
  });

  /**
   * El registro es la única fuente de verdad del bundle de iconos, y una unión de tipos
   * no detecta un nombre kebab mal escrito: Lucide resuelve por `iconData.name`, y un
   * nombre inexistente no lanza — renderiza un `<svg>` vacío.
   *
   * Este test recorre `AF_ICON_NAMES` y falla si alguno no dibuja nada, de modo que
   * ampliar el set no puede introducir un icono fantasma en silencio.
   */
  describe('registro completo', () => {
    it.each([...AF_ICON_NAMES])('resuelve el icono «%s» a un trazado real', (name) => {
      const fixture = TestBed.createComponent(SingleIconHostComponent);
      fixture.componentInstance.name.set(name);
      fixture.detectChanges();

      const svg = (fixture.nativeElement as HTMLElement).querySelector(
        '[data-testid="icon"] svg',
      ) as SVGElement | null;

      expect(svg).not.toBeNull();
      expect(
        svg!.querySelectorAll('path,circle,line,rect,polyline,polygon,ellipse').length,
      ).toBeGreaterThan(0);
    });

    it('no declara nombres duplicados', () => {
      expect(new Set(AF_ICON_NAMES).size).toBe(AF_ICON_NAMES.length);
    });
  });
});
