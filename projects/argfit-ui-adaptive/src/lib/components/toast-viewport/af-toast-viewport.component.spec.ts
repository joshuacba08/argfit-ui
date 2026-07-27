import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfToastService, provideArgfitUi, type AfToastActionEvent } from '@argfit-ui/core';

import { AfToastViewportComponent } from './af-toast-viewport.component';

@Component({
  imports: [AfToastViewportComponent],
  template: `<af-toast-viewport (actionInvoked)="received = $event" />`,
})
class ActionHostComponent {
  received: AfToastActionEvent | undefined;
}

describe('AfToastViewportComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders the desktop viewport by default', async () => {
    @Component({
      imports: [AfToastViewportComponent],
      template: `<af-toast-viewport />`,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideArgfitUi({ platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('af-toast-viewport-desktop')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('af-toast-viewport-mobile')).toBeNull();
  });

  it('renders the mobile viewport when platform is mobile', async () => {
    @Component({
      imports: [AfToastViewportComponent],
      template: `<af-toast-viewport />`,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideArgfitUi({ platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('af-toast-viewport-mobile')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('af-toast-viewport-desktop')).toBeNull();
  });

  /**
   * §15.1 del documento de navegación de ArgFit: un aviso debe poder ofrecer «Deshacer»,
   * «Abrir» o «Ver detalles». Una confirmación sobre la que no se puede actuar obliga al
   * usuario a ir a buscar lo que acaba de ocurrir.
   */
  describe('acción del aviso', () => {
    async function setup(platform: 'desktop' | 'mobile') {
      await TestBed.configureTestingModule({
        imports: [ActionHostComponent],
        providers: [provideArgfitUi({ platform })],
      }).compileComponents();

      const fixture = TestBed.createComponent(ActionHostComponent);
      const toasts = TestBed.inject(AfToastService);
      fixture.detectChanges();
      return { fixture, toasts };
    }

    it('no renderiza botón de acción cuando el aviso no la declara', async () => {
      const { fixture, toasts } = await setup('desktop');
      toasts.success({ title: 'Guardado' });
      fixture.detectChanges();

      const root = fixture.nativeElement as HTMLElement;
      expect(root.querySelector('.af-toast-desktop__action')).toBeNull();
    });

    it('renderiza la acción y emite el evento con el aviso de origen', async () => {
      const { fixture, toasts } = await setup('desktop');
      const id = toasts.success({
        title: 'Futbolista creado',
        action: { label: 'Abrir perfil', id: 'open-athlete' },
      });
      fixture.detectChanges();

      const root = fixture.nativeElement as HTMLElement;
      const button = root.querySelector('.af-toast-desktop__action') as HTMLButtonElement;
      expect(button).not.toBeNull();
      expect(button.textContent?.trim()).toBe('Abrir perfil');

      button.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.received).toEqual({
        toastId: id,
        action: { label: 'Abrir perfil', id: 'open-athlete' },
      });
    });

    it('cierra el aviso al activar la acción', async () => {
      const { fixture, toasts } = await setup('desktop');
      toasts.info({ title: 'Sesión eliminada', action: { label: 'Deshacer' }, persistent: true });
      fixture.detectChanges();

      const root = fixture.nativeElement as HTMLElement;
      (root.querySelector('.af-toast-desktop__action') as HTMLButtonElement).click();
      fixture.detectChanges();

      expect(toasts.toasts()).toHaveLength(0);
      expect(root.querySelector('.af-toast-desktop__action')).toBeNull();
    });

    it('usa ariaLabel cuando la etiqueta visible es demasiado escueta', async () => {
      const { fixture, toasts } = await setup('desktop');
      toasts.info({
        title: 'Importación con errores',
        action: { label: 'Ver', ariaLabel: 'Ver detalles de la importación' },
      });
      fixture.detectChanges();

      const button = (fixture.nativeElement as HTMLElement).querySelector(
        '.af-toast-desktop__action',
      ) as HTMLButtonElement;
      expect(button.getAttribute('aria-label')).toBe('Ver detalles de la importación');
    });

    it('ofrece la misma acción en móvil', async () => {
      const { fixture, toasts } = await setup('mobile');
      toasts.success({ title: 'Cambios sincronizados', action: { label: 'Ver detalles' } });
      fixture.detectChanges();

      const button = (fixture.nativeElement as HTMLElement).querySelector(
        '.af-toast-mobile__action',
      ) as HTMLButtonElement;
      expect(button).not.toBeNull();

      button.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.received?.action.label).toBe('Ver detalles');
    });
  });
});
