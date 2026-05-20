import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AfPasswordDesktopComponent } from './af-password-desktop.component';

@Component({
  imports: [AfPasswordDesktopComponent],
  template: `
    <af-password-desktop
      label="Contrasena"
      placeholder="Clave segura"
      value="ArgFit#2026"
      hint="Minimo 8 caracteres"
      [required]="true"
      (valueChange)="value = $event"
    />
  `,
})
class AfPasswordDesktopHostComponent {
  value = '';
}

describe('AfPasswordDesktopComponent', () => {
  it('renders label, password input, hint and reveal toggle', async () => {
    await TestBed.configureTestingModule({
      imports: [AfPasswordDesktopHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfPasswordDesktopHostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const label = root.querySelector('label.af-password-desktop__label') as HTMLLabelElement;
    const input = root.querySelector('input.af-password-desktop__input') as HTMLInputElement;
    const toggle = root.querySelector('.af-password-desktop__toggle') as HTMLButtonElement;
    const hint = root.querySelector('.af-password-desktop__message--hint') as HTMLElement;

    expect(label.textContent?.trim().startsWith('Contrasena')).toBe(true);
    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.type).toBe('password');
    expect(input.value).toBe('ArgFit#2026');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
    expect(toggle.getAttribute('aria-label')).toBe('Mostrar contrasena');
  });

  it('toggles password visibility and emits valueChange', async () => {
    await TestBed.configureTestingModule({ imports: [AfPasswordDesktopHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(AfPasswordDesktopHostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const toggle = fixture.nativeElement.querySelector('.af-password-desktop__toggle') as HTMLButtonElement;

    toggle.click();
    fixture.detectChanges();
    expect(input.type).toBe('text');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');

    input.value = 'NuevaClave#1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe('NuevaClave#1');
  });

  it('reflects error tone and disabled state', async () => {
    @Component({
      imports: [AfPasswordDesktopComponent],
      template: `
        <af-password-desktop
          label="Clave"
          error="La contrasena es obligatoria"
          [disabled]="true"
        />
      `,
    })
    class ErrorHost {}

    await TestBed.configureTestingModule({ imports: [ErrorHost] }).compileComponents();
    const fixture = TestBed.createComponent(ErrorHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('af-password-desktop') as HTMLElement;
    const input = host.querySelector('input') as HTMLInputElement;
    const toggle = host.querySelector('.af-password-desktop__toggle') as HTMLButtonElement;
    const error = host.querySelector('.af-password-desktop__message--error') as HTMLElement;

    expect(host.getAttribute('data-tone')).toBe('danger');
    expect(host.getAttribute('data-disabled')).toBe('');
    expect(input.disabled).toBe(true);
    expect(toggle.disabled).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
  });
});