import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ARGFIT_DARK_THEME, provideArgfitUi } from '@argfit-ui/core';

import {
  AfAuthShellAsideDirective,
  AfAuthShellBackgroundDirective,
  AfAuthShellBrandDirective,
  AfAuthShellFooterDirective,
} from './af-auth-shell-slots.directive';
import { AfAuthShellComponent } from './af-auth-shell.component';

@Component({
  imports: [
    AfAuthShellComponent,
    AfAuthShellAsideDirective,
    AfAuthShellBrandDirective,
    AfAuthShellFooterDirective,
  ],
  template: `
    <af-auth-shell ariaLabel="Acceso de prueba">
      <strong afAuthShellBrand>ArgFit</strong>
      <p afAuthShellAside>Promesa de producto</p>
      <h1>Ingresar</h1>
      <small afAuthShellFooter>Ayuda</small>
    </af-auth-shell>
  `,
})
class AuthShellHostComponent {}

@Component({
  imports: [
    AfAuthShellComponent,
    AfAuthShellBackgroundDirective,
    AfAuthShellBrandDirective,
    AfAuthShellFooterDirective,
  ],
  template: `
    <af-auth-shell variant="centered" ariaLabel="Acceso móvil">
      <div afAuthShellBackground>Fondo</div>
      <strong afAuthShellBrand>ArgFit Mobile</strong>
      <h1>Continuar</h1>
      <small afAuthShellFooter>Privacidad</small>
    </af-auth-shell>
  `,
})
class MobileAuthShellHostComponent {}

describe('AfAuthShellComponent', () => {
  it('renders the desktop shell and projected slots', async () => {
    await TestBed.configureTestingModule({
      imports: [AuthShellHostComponent],
      providers: [provideArgfitUi({ theme: ARGFIT_DARK_THEME, platform: 'desktop' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(AuthShellHostComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('af-auth-shell-desktop')).not.toBeNull();
    expect(root.querySelector('main')?.getAttribute('aria-label')).toBe('Acceso de prueba');
    expect(root.textContent).toContain('Promesa de producto');
    expect(root.textContent).toContain('Ingresar');
    expect(root.textContent).toContain('Ayuda');
  });

  it('renders its centered mobile variant with accessible semantics', async () => {
    await TestBed.configureTestingModule({
      imports: [MobileAuthShellHostComponent],
      providers: [provideArgfitUi({ theme: ARGFIT_DARK_THEME, platform: 'mobile' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(MobileAuthShellHostComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const shell = root.querySelector('af-auth-shell-mobile');
    const main = root.querySelector('main');

    expect(shell).not.toBeNull();
    expect(main?.getAttribute('aria-label')).toBe('Acceso móvil');
    expect(shell?.getAttribute('data-variant')).toBe('centered');
    expect(root.textContent).toContain('ArgFit Mobile');
    expect(root.textContent).toContain('Continuar');
    expect(root.textContent).toContain('Privacidad');
  });
});
